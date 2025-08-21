# tests/repository/test_application_repository.py

import types
import pytest

from app.repository import application as repo
from fastapi import HTTPException


class FakeQuery:
    def __init__(self, result=None, rows=None):
        self._result = result
        self._rows = rows or []

    # chaining compatibility
    def filter(self, *args, **kwargs):
        return self

    def join(self, *args, **kwargs):
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
        self.commits = 0
        self.refreshed = []
        self.added = []

    # Query returns the prepared FakeQuery each time
    def query(self, *args, **kwargs):
        return self._next_query

    def set_query_result(self, result=None, rows=None):
        self._next_query = FakeQuery(result=result, rows=rows)

    def add(self, obj):
        self.added.append(obj)

    def commit(self):
        self.commits += 1

    def refresh(self, obj):
        self.refreshed.append(obj)


def test_ensure_job_exists_raises_when_missing():
    db = FakeDB()
    db.set_query_result(result=None)
    with pytest.raises(HTTPException) as ei:
        repo.ensure_job_exists(db, job_id="uuid")
    assert ei.value.status_code == 404


def test_ensure_job_exists_success():
    db = FakeDB()
    job = types.SimpleNamespace(job_id="jid")
    db.set_query_result(result=job)
    assert repo.ensure_job_exists(db, job_id="jid") is job


essential_user_fields = {
    "first_name": "A",
    "last_name": "B",
    "email": "x@example.com",
}


def test_ensure_applicant_profile_raises_when_missing():
    db = FakeDB()
    db.set_query_result(result=None)
    with pytest.raises(HTTPException) as ei:
        repo.ensure_applicant_profile(db, user_id="uuid")
    assert ei.value.status_code == 403


def test_ensure_applicant_profile_success():
    db = FakeDB()
    applicant = types.SimpleNamespace(applicant_id="uid")
    db.set_query_result(result=applicant)
    assert repo.ensure_applicant_profile(db, user_id="uid") is applicant


def test_update_application_status_happy_path():
    # existing application object
    app_obj = types.SimpleNamespace(application_id="aid", status="applied")
    db = FakeDB()
    db.set_query_result(result=app_obj)

    updated = repo.update_application_status(db, application_id="aid", status_value="shortlisted")
    assert updated is app_obj
    assert updated.status == "shortlisted"
    assert db.commits == 1
    assert db.refreshed == [app_obj]


def test_get_application_by_job_and_applicant_returns_row():
    row = types.SimpleNamespace(application_id="aid")
    db = FakeDB()
    db.set_query_result(result=row)
    out = repo.get_application_by_job_and_applicant(db, job_id="jid", applicant_id="uid")
    assert out is row


def test_update_application_status_404_when_missing():
    db = FakeDB()
    db.set_query_result(result=None)
    with pytest.raises(HTTPException) as ei:
        repo.update_application_status(db, application_id="aid", status_value="rejected")
    assert ei.value.status_code == 404


class Row:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)


def test_list_applications_for_job_maps_rows():
    rows = [
        Row(
            application_id="app1",
            applicant_id="u1",
            status="applied",
            resume_url="/r1.pdf",
            first_name="Alice",
            last_name="Doe",
            email="a@example.com",
        ),
        Row(
            application_id="app2",
            applicant_id="u2",
            status="shortlisted",
            resume_url=None,
            first_name="Bob",
            last_name="Smith",
            email="b@example.com",
        ),
    ]
    db = FakeDB()
    db.set_query_result(rows=rows)

    out = repo.list_applications_for_job(db, job_id="jid")
    assert out == [
        {
            "application_id": "app1",
            "applicant_id": "u1",
            "status": "applied",
            "resume_url": "/r1.pdf",
            "applicant_name": "Alice Doe",
            "applicant_email": "a@example.com",
        },
        {
            "application_id": "app2",
            "applicant_id": "u2",
            "status": "shortlisted",
            "resume_url": None,
            "applicant_name": "Bob Smith",
            "applicant_email": "b@example.com",
        },
    ]


def test_list_applications_for_applicant_maps_rows():
    rows = [
        Row(
            application_id="app1",
            status="applied",
            job_id="j1",
            job_title="Title1",
            job_type="full-time",
            job_location="City1",
            company_id="c1",
            company_name="Company1",
        ),
        Row(
            application_id="app2",
            status="rejected",
            job_id="j2",
            job_title="Title2",
            job_type="internship",
            job_location="City2",
            company_id="c2",
            company_name="Company2",
        ),
    ]
    db = FakeDB()
    db.set_query_result(rows=rows)

    out = repo.list_applications_for_applicant(db, applicant_id="uid")
    assert out == [
        {
            "application_id": "app1",
            "status": "applied",
            "job_id": "j1",
            "job_title": "Title1",
            "job_type": "full-time",
            "job_location": "City1",
            "company_id": "c1",
            "company_name": "Company1",
        },
        {
            "application_id": "app2",
            "status": "rejected",
            "job_id": "j2",
            "job_title": "Title2",
            "job_type": "internship",
            "job_location": "City2",
            "company_id": "c2",
            "company_name": "Company2",
        },
    ]
