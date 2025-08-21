# tests/repository/test_user_repository_extra.py

import types
from app.repository import user as repo
from app.constants.user_types import UserType


class FakeQuery:
    def __init__(self, result=None):
        self._result = result

    def filter(self, *args, **kwargs):
        return self

    def first(self):
        return self._result


class FakeDB:
    def __init__(self):
        self._next_query = FakeQuery()
        self.added = []
        self.commits = 0
        self.refreshed = []

    def query(self, *args, **kwargs):
        return self._next_query

    def set_query_result(self, result=None):
        self._next_query = FakeQuery(result=result)

    def add(self, obj):
        self.added.append(obj)

    def commit(self):
        self.commits += 1

    def refresh(self, obj):
        self.refreshed.append(obj)


def test_create_user_success(monkeypatch):
    db = FakeDB()

    # Use lightweight User stand-in to avoid SQLAlchemy constructor
    class FakeUser:
        def __init__(self, **kwargs):
            self.__dict__.update(kwargs)
            self.user_id = "uid"

    monkeypatch.setattr(repo, "User", FakeUser)

    user_in = types.SimpleNamespace(
        email="x@example.com",
        password="secret",
        first_name="A",
        last_name="B",
        user_type=UserType.APPLICANT,
    )

    created = repo.create_user(db, user_in)
    assert isinstance(created, FakeUser)
    assert created.email == "x@example.com"
    assert created.first_name == "A" and created.last_name == "B"
    assert created.user_type == UserType.APPLICANT
    assert db.commits == 1 and db.refreshed == [created]


def test_get_user_by_email_passthrough():
    db = FakeDB()
    row = types.SimpleNamespace(user_id="u1")
    db.set_query_result(result=row)
    assert repo.get_user_by_email(db, "x@example.com") is row


def test_get_user_by_id_passthrough():
    db = FakeDB()
    row = types.SimpleNamespace(user_id="u1")
    db.set_query_result(result=row)
    assert repo.get_user_by_id(db, "u1") is row


def test_get_applicant_by_user_id_passthrough():
    db = FakeDB()
    row = types.SimpleNamespace(applicant_id="u1")
    db.set_query_result(result=row)
    assert repo.get_applicant_by_user_id(db, "u1") is row
