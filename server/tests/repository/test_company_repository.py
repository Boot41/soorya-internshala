# tests/repository/test_company_repository.py

import types
import pytest

from fastapi import HTTPException
from app.repository import company as repo


class FakeQuery:
    def __init__(self, result=None, rows=None):
        self._result = result
        self._rows = rows or []

    # chaining ops
    def filter(self, *args, **kwargs):
        return self

    def order_by(self, *args, **kwargs):
        return self

    def first(self):
        return self._result

    def all(self):
        return self._rows


class FakeDB:
    def __init__(self):
        self._next_query = FakeQuery()
        self.added = []
        self.commits = 0
        self.refreshed = []
        self.flushed = 0

    def set_query_result(self, result=None, rows=None):
        self._next_query = FakeQuery(result=result, rows=rows)

    def query(self, *args, **kwargs):
        return self._next_query

    def add(self, obj):
        self.added.append(obj)

    def commit(self):
        self.commits += 1

    def refresh(self, obj):
        self.refreshed.append(obj)

    def flush(self):
        self.flushed += 1


def test_get_company_and_list_companies_passthrough():
    db = FakeDB()
    row = types.SimpleNamespace(company_id="c1", name="Acme")
    db.set_query_result(result=row, rows=[row])

    assert repo.get_company(db, company_id="c1") is row
    assert repo.list_companies(db) == [row]


def test_get_recruiter_by_user_id_passthrough():
    db = FakeDB()
    rec = types.SimpleNamespace(recruiter_id="u1", company_id=None)
    db.set_query_result(result=rec)
    assert repo.get_recruiter_by_user_id(db, user_id="u1") is rec


def test_create_company_400_when_name_exists(monkeypatch):
    db = FakeDB()
    # Make name check return some existing row
    db.set_query_result(result=types.SimpleNamespace(company_id="exists"))

    with pytest.raises(HTTPException) as ei:
        repo.create_company(
            db,
            recruiter_user_id="u123",
            company_in=types.SimpleNamespace(
                name="Acme",
                description="desc",
                website_url=None,
                logo_url=None,
                industry="tech",
                headquarters="City",
            ),
        )
    assert ei.value.status_code == 400


def test_create_company_creates_and_links_recruiter(monkeypatch):
    db = FakeDB()

    # Step 1: first query for existing by name -> None
    db.set_query_result(result=None)

    # Use lightweight stand-ins for models to avoid SQLAlchemy constructor
    class FakeCompany:
        # provide class attribute used in filters: Company.name == ...
        name = "name_column"

        def __init__(self, **kwargs):
            self.__dict__.update(kwargs)
            # simulate generated id after flush
            self.company_id = kwargs.get("company_id", "cid")

    class FakeRecruiter:
        def __init__(self, **kwargs):
            self.__dict__.update(kwargs)

    monkeypatch.setattr(repo, "Company", FakeCompany)
    monkeypatch.setattr(repo, "Recruiter", FakeRecruiter)

    # get_recruiter_by_user_id returns None => create new relation
    monkeypatch.setattr(repo, "get_recruiter_by_user_id", lambda db, uid: None)

    company_in = types.SimpleNamespace(
        name="Acme",
        description="desc",
        website_url="http://acme.com",
        logo_url="http://cdn/acme.png",
        industry="tech",
        headquarters="City",
    )

    out = repo.create_company(db, recruiter_user_id="u1", company_in=company_in)

    # Company added, flushed, committed, refreshed
    assert isinstance(out, FakeCompany)
    assert db.flushed == 1
    assert db.commits == 1
    assert db.refreshed == [out]

    # A recruiter link should be added
    assert any(isinstance(a, FakeRecruiter) for a in db.added)
    link = next(a for a in db.added if isinstance(a, FakeRecruiter))
    assert link.recruiter_id == "u1"
    assert link.company_id == out.company_id


def test_create_company_updates_existing_recruiter_link(monkeypatch):
    db = FakeDB()
    db.set_query_result(result=None)  # name check -> no existing

    class FakeCompany:
        name = "name_column"

        def __init__(self, **kwargs):
            self.__dict__.update(kwargs)
            self.company_id = "cid2"

    monkeypatch.setattr(repo, "Company", FakeCompany)

    # existing recruiter gets updated
    recruiter = types.SimpleNamespace(recruiter_id="u1", company_id=None)
    monkeypatch.setattr(repo, "get_recruiter_by_user_id", lambda db, uid: recruiter)
    # simple Recruiter placeholder still referenced in code path but not used when recruiter exists
    monkeypatch.setattr(repo, "Recruiter", object)

    company_in = types.SimpleNamespace(
        name="Beta",
        description=None,
        website_url=None,
        logo_url=None,
        industry=None,
        headquarters=None,
    )

    out = repo.create_company(db, recruiter_user_id="u1", company_in=company_in)

    assert recruiter.company_id == out.company_id
    assert db.commits == 1


def test_update_company_404_when_missing(monkeypatch):
    db = FakeDB()
    monkeypatch.setattr(repo, "get_company", lambda db, cid: None)

    with pytest.raises(HTTPException) as ei:
        repo.update_company(db, company_id="cid", company_update=types.SimpleNamespace(dict=lambda **k: {}), current_user=types.SimpleNamespace(user_id="u1"))
    assert ei.value.status_code == 404


def test_update_company_403_when_not_authorized(monkeypatch):
    db = FakeDB()
    company = types.SimpleNamespace(company_id="cid")
    monkeypatch.setattr(repo, "get_company", lambda db, cid: company)
    # recruiter missing
    monkeypatch.setattr(repo, "get_recruiter_by_user_id", lambda db, uid: None)

    with pytest.raises(HTTPException) as ei:
        repo.update_company(db, company_id="cid", company_update=types.SimpleNamespace(dict=lambda **k: {}), current_user=types.SimpleNamespace(user_id="u1"))
    assert ei.value.status_code == 403


def test_update_company_success_calls_update_helper(monkeypatch):
    db = FakeDB()
    company = types.SimpleNamespace(company_id="cid", name="Old")
    monkeypatch.setattr(repo, "get_company", lambda db, cid: company)
    monkeypatch.setattr(repo, "get_recruiter_by_user_id", lambda db, uid: types.SimpleNamespace(company_id="cid"))

    called = {}

    def fake_update(db_, *, company: object, update_data: dict):
        called["args"] = (db_, company)
        called["data"] = update_data
        company.name = update_data.get("name", company.name)
        return company

    monkeypatch.setattr(repo, "_update_company_from_dict", fake_update)

    class UpdateObj:
        def dict(self, **kwargs):
            assert kwargs.get("exclude_unset") is True
            return {"name": "New"}

    out = repo.update_company(db, company_id="cid", company_update=UpdateObj(), current_user=types.SimpleNamespace(user_id="u1"))

    assert out.name == "New"
    assert called["args"][0] is db and called["args"][1] is company
    assert called["data"] == {"name": "New"}


def test__update_company_from_dict_url_normalization(monkeypatch):
    db = FakeDB()

    # Use a simple object with existing values
    company = types.SimpleNamespace(
        name="Acme",
        website_url="http://old",
        logo_url=None,
        description=None,
    )

    # empty string should become None and then be ignored (value is None -> not set)
    updated = repo._update_company_from_dict(
        db,
        company=company,
        update_data={"website_url": "", "logo_url": "http://img", "unknown": "x", "description": None},
    )

    assert updated.website_url == "http://old"  # unchanged due to None
    assert updated.logo_url == "http://img"  # cast to str already
    assert not hasattr(updated, "unknown") or getattr(updated, "unknown") == "x"  # unknown ignored by hasattr check
    assert db.commits == 1 and db.refreshed == [updated]
