# tests/repository/test_job_listing_repository.py

from datetime import datetime
import types

from app.repository import job_listing as repo


def test_cursor_encode_decode_roundtrip():
    ts = datetime(2024, 1, 2, 3, 4, 5)
    job_id = uuid_str = "123e4567-e89b-12d3-a456-426614174000"
    cursor = repo._encode_cursor(ts, uuid_str)
    decoded = repo._decode_cursor(cursor)
    assert decoded is not None
    ts2, jid2 = decoded
    assert ts2 == ts
    assert str(jid2) == uuid_str


def test_decode_cursor_invalid_returns_none():
    assert repo._decode_cursor("") is None
    assert repo._decode_cursor("not-a-cursor") is None


class FakeDB:
    def __init__(self):
        self.commits = 0
        self.refreshed = []
        self.added = []

    def add(self, obj):
        self.added.append(obj)

    def commit(self):
        self.commits += 1

    def refresh(self, obj):
        self.refreshed.append(obj)


def test_update_job_listing_only_allowed_fields_are_applied():
    # start object with some defaults
    job = types.SimpleNamespace(
        title="Old",
        description="Old",
        requirements="Old",
        skills_required=None,
        location="Old",
        experience_level=None,
        job_type="full-time",
        salary_range=None,
        expires_at=None,
        status="open",
        other_field="should_not_change",
    )

    # include a mix of allowed/disallowed and None values
    update_data = {
        "title": "New Title",
        "description": None,  # should be ignored
        "requirements": "New req",
        "skills_required": "python,sql",
        "location": "New City",
        "experience_level": "mid",
        "job_type": "internship",
        "salary_range": "10-20LPA",
        "expires_at": None,  # ignored
        "status": "closed",
        "not_allowed": "x",  # ignored
    }

    db = FakeDB()
    updated = repo.update_job_listing(db, job=job, update_data=update_data)

    assert updated.title == "New Title"
    assert updated.description == "Old"  # None ignored
    assert updated.requirements == "New req"
    assert updated.skills_required == "python,sql"
    assert updated.location == "New City"
    assert updated.experience_level == "mid"
    assert updated.job_type == "internship"
    assert updated.salary_range == "10-20LPA"
    assert updated.expires_at is None  # unchanged
    assert updated.status == "closed"
    assert getattr(updated, "not_allowed", None) is None
    assert updated.other_field == "should_not_change"

    # commit/refresh called
    assert db.commits == 1
    assert db.refreshed == [updated]
