# tests/repository/test_job_listing_repository_more.py

from datetime import datetime
import types

from app.repository import job_listing as repo


class FakeQuery:
    def __init__(self, result=None, rows=None):
        self._result = result
        self._rows = rows or []
        self._limit = None

    def join(self, *args, **kwargs):
        return self

    def filter(self, *args, **kwargs):
        return self

    def order_by(self, *args, **kwargs):
        return self

    def limit(self, n):
        self._limit = n
        return self

    def first(self):
        return self._result

    def all(self):
        if self._limit is not None:
            return self._rows[: self._limit]
        return self._rows


class FakeDB:
    def __init__(self):
        self._next_query = FakeQuery()
        self.added = []
        self.commits = 0
        self.refreshed = []

    def set_query(self, result=None, rows=None):
        self._next_query = FakeQuery(result=result, rows=rows)

    def query(self, *args, **kwargs):
        return self._next_query

    def add(self, obj):
        self.added.append(obj)

    def commit(self):
        self.commits += 1

    def refresh(self, obj):
        self.refreshed.append(obj)


def _job(**kw):
    return types.SimpleNamespace(**kw)


def test_get_job_listing_model_passthrough():
    db = FakeDB()
    row = _job(job_id="jid")
    db.set_query(result=row)
    assert repo.get_job_listing_model(db, job_id="jid") is row


def test_list_job_listings_paged_filters_experience_level():
    # Ensure experience_level filter path executes without error
    rows = [(_job(job_id="j1", company_id="c1", recruiter_id="r1", title="T1", description="", requirements="", skills_required=None, location="L", experience_level="mid", job_type="internship", salary_range=None, expires_at=None, status="open", posted_at=datetime(2024,1,1), updated_at=datetime(2024,1,2)), "Co")]
    db = FakeDB()
    db.set_query(rows=rows)
    items, cur = repo.list_job_listings_paged(
        db,
        experience_level="mid",
        limit=1,
    )
    assert len(items) == 1 and cur is None


def test_list_job_listings_paged_cursor_cond_asc_branch():
    # Use asc to exercise the asc comparison branch
    rows = [
        (_job(job_id="123e4567-e89b-12d3-a456-426614174210", company_id="c1", recruiter_id="r1", title="A", description="", requirements="", skills_required=None, location="L", experience_level=None, job_type="ft", salary_range=None, expires_at=None, status="open", posted_at=datetime(2024,3,1), updated_at=datetime(2024,3,2)), "Co"),
        (_job(job_id="123e4567-e89b-12d3-a456-426614174211", company_id="c1", recruiter_id="r1", title="B", description="", requirements="", skills_required=None, location="L", experience_level=None, job_type="ft", salary_range=None, expires_at=None, status="open", posted_at=datetime(2024,3,2), updated_at=datetime(2024,3,3)), "Co"),
    ]
    db = FakeDB()
    db.set_query(rows=rows)

    cur = repo._encode_cursor(rows[0][0].posted_at, rows[0][0].job_id)
    items, next_cur = repo.list_job_listings_paged(
        db,
        sort_by="posted_at",
        sort_order="asc",
        limit=2,
        cursor=cur,
    )
    assert len(items) == 2
    # limit (2) equals rows length so next_cur None in our fake
    assert next_cur is None


def test_create_job_listing_happy_path(monkeypatch):
    db = FakeDB()

    class FakeJob:
        def __init__(self, **kwargs):
            self.__dict__.update(kwargs)
            self.job_id = "jid"

    monkeypatch.setattr(repo, "JobPosting", FakeJob)

    data = {
        "title": "Title",
        "description": "Desc",
        "requirements": "Reqs",
        "skills_required": "python",
        "location": "City",
        "experience_level": "jr",
        "job_type": "full-time",
        "salary_range": None,
        "expires_at": None,
        "status": "open",
    }

    created = repo.create_job_listing(db, company_id="c1", recruiter_id="r1", data=data)
    assert isinstance(created, FakeJob)
    assert created.company_id == "c1" and created.recruiter_id == "r1"
    assert created.title == "Title" and created.job_type == "full-time"
    assert db.commits == 1 and db.refreshed == [created]
