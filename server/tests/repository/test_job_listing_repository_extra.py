# tests/repository/test_job_listing_repository_extra.py

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

    def set_query(self, result=None, rows=None):
        self._next_query = FakeQuery(result=result, rows=rows)

    def query(self, *args, **kwargs):
        return self._next_query

    def add(self, obj):  # pragma: no cover - not used here
        pass

    def commit(self):  # pragma: no cover - not used here
        pass

    def refresh(self, obj):  # pragma: no cover - not used here
        pass


def _job(ns_kwargs):
    return types.SimpleNamespace(**ns_kwargs)


def test_get_job_listing_none_when_missing():
    db = FakeDB()
    db.set_query(result=None)
    assert repo.get_job_listing(db, job_id="jid") is None


def test_get_job_listing_maps_response():
    job = _job(
        {
            "job_id": "j1",
            "company_id": "c1",
            "recruiter_id": "r1",
            "title": "Title",
            "description": "Desc",
            "requirements": "Reqs",
            "skills_required": "python",
            "location": "City",
            "experience_level": "mid",
            "job_type": "full-time",
            "salary_range": None,
            "expires_at": None,
            "status": "open",
            "posted_at": datetime(2024, 1, 1),
            "updated_at": datetime(2024, 1, 2),
        }
    )
    db = FakeDB()
    db.set_query(result=(job, "Acme Inc"))

    out = repo.get_job_listing(db, job_id="j1")
    assert out["job_id"] == "j1"
    assert out["company_name"] == "Acme Inc"
    assert out["title"] == "Title"


def test_list_job_listings_filters_and_limit():
    # Prepare three rows but expect limit to cut them to 2
    jobs = [
        (_job({"job_id": f"j{i}", "company_id": "c1", "recruiter_id": "r1", "title": f"T{i}", "description": "d", "requirements": "r", "skills_required": None, "location": "L", "experience_level": None, "job_type": "full-time", "salary_range": None, "expires_at": None, "status": "open", "posted_at": datetime(2024, 1, i), "updated_at": datetime(2024, 1, i)}), "Acme")
        for i in [3, 2, 1]
    ]
    db = FakeDB()
    db.set_query(rows=jobs)

    out = repo.list_job_listings(db, company_id="c1", limit=2)
    assert len(out) == 2
    assert out[0]["job_id"] == "j3"
    assert out[1]["job_id"] == "j2"


def test_list_job_listings_paged_next_cursor_and_sort_desc():
    # Three rows, limit=2 => next_cursor should be produced based on the second item
    rows = [
        (_job({"job_id": "123e4567-e89b-12d3-a456-426614174003", "company_id": "c1", "recruiter_id": "r1", "title": "T3", "description": "", "requirements": "", "skills_required": None, "location": "L", "experience_level": None, "job_type": "internship", "salary_range": None, "expires_at": None, "status": "open", "posted_at": datetime(2024, 1, 3), "updated_at": datetime(2024, 1, 5)}), "Acme"),
        (_job({"job_id": "123e4567-e89b-12d3-a456-426614174002", "company_id": "c1", "recruiter_id": "r1", "title": "T2", "description": "", "requirements": "", "skills_required": None, "location": "L", "experience_level": None, "job_type": "internship", "salary_range": None, "expires_at": None, "status": "open", "posted_at": datetime(2024, 1, 2), "updated_at": datetime(2024, 1, 4)}), "Acme"),
        (_job({"job_id": "123e4567-e89b-12d3-a456-426614174001", "company_id": "c1", "recruiter_id": "r1", "title": "T1", "description": "", "requirements": "", "skills_required": None, "location": "L", "experience_level": None, "job_type": "internship", "salary_range": None, "expires_at": None, "status": "open", "posted_at": datetime(2024, 1, 1), "updated_at": datetime(2024, 1, 3)}), "Acme"),
    ]
    db = FakeDB()
    db.set_query(rows=rows)

    items, cursor = repo.list_job_listings_paged(
        db,
        company_id="c1",
        location="L",
        job_type="internship",
        experience_level=None,
        status="open",
        q="T",
        sort_by="posted_at",
        sort_order="desc",
        limit=2,
        cursor=None,
    )

    assert len(items) == 2
    assert items[0]["job_id"] == "123e4567-e89b-12d3-a456-426614174003"
    assert items[1]["job_id"] == "123e4567-e89b-12d3-a456-426614174002"
    assert cursor is not None

    # Cursor should point to the last item of the returned page
    ts, jid = repo._decode_cursor(cursor)
    assert ts == rows[1][0].posted_at and str(jid) == rows[1][0].job_id


def test_list_job_listings_paged_cursor_applied():
    # Start with two rows, but provide a cursor; the FakeQuery filter doesn't enforce it,
    # this test ensures decode doesn't crash and function still returns subset and cursor None when has_more False.
    rows = [
        (_job({"job_id": "123e4567-e89b-12d3-a456-426614174111", "company_id": "c1", "recruiter_id": "r1", "title": "T1", "description": "", "requirements": "", "skills_required": None, "location": "X", "experience_level": None, "job_type": "full-time", "salary_range": None, "expires_at": None, "status": "closed", "posted_at": datetime(2024, 2, 1), "updated_at": datetime(2024, 2, 2)}), "Co"),
        (_job({"job_id": "123e4567-e89b-12d3-a456-426614174112", "company_id": "c1", "recruiter_id": "r1", "title": "T2", "description": "", "requirements": "", "skills_required": None, "location": "X", "experience_level": None, "job_type": "full-time", "salary_range": None, "expires_at": None, "status": "closed", "posted_at": datetime(2024, 2, 2), "updated_at": datetime(2024, 2, 3)}), "Co"),
    ]
    db = FakeDB()
    db.set_query(rows=rows)

    cur = repo._encode_cursor(rows[0][0].posted_at, rows[0][0].job_id)

    items, next_cur = repo.list_job_listings_paged(
        db,
        company_id=None,
        location="X",
        job_type="full-time",
        experience_level=None,
        status="closed",
        q=None,
        sort_by="posted_at",
        sort_order="asc",
        limit=5,
        cursor=cur,
    )

    assert len(items) == 2  # our FakeQuery ignores filter, so all rows come back
    assert next_cur is None  # has_more False because limit > len(rows)
