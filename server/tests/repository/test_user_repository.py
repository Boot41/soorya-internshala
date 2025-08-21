# tests/repository/test_user_repository.py

import types
import pytest

from app.repository import user as user_repo
from app.schemas.user import UserCreate
from app.constants.user_types import UserType
from app.lib.security import get_password_hash
from fastapi import HTTPException


class FakeDB:
    def __init__(self):
        self.added = []
        self.commits = 0
        self.refreshed = []

    def add(self, obj):
        self.added.append(obj)

    def commit(self):
        self.commits += 1

    def refresh(self, obj):
        self.refreshed.append(obj)

    # minimal query interface for get_user_by_email path (not used here)
    def query(self, model):  # pragma: no cover
        return self

    def filter(self, *args, **kwargs):  # pragma: no cover
        return self

    def first(self):  # pragma: no cover
        return None


def test_create_user_invalid_user_type_raises():
    db = FakeDB()
    # Bypass Pydantic enum validation by using a simple object
    bad = types.SimpleNamespace(
        email="x@example.com",
        password="pw",
        first_name="A",
        last_name="B",
        user_type="invalid",
    )
    with pytest.raises(HTTPException) as ei:
        user_repo.create_user(db, bad)
    assert ei.value.status_code == 422


def test_authenticate_user_none_when_user_missing(monkeypatch):
    # Force get_user_by_email to return None
    monkeypatch.setattr(user_repo, "get_user_by_email", lambda db, email: None)
    db = FakeDB()
    assert user_repo.authenticate_user(db, "x@example.com", "pw") is None


def test_authenticate_user_wrong_password(monkeypatch):
    # Return a fake user object with a password_hash
    fake_user = types.SimpleNamespace(password_hash=get_password_hash("correct"))
    monkeypatch.setattr(user_repo, "get_user_by_email", lambda db, email: fake_user)
    db = FakeDB()
    assert user_repo.authenticate_user(db, "x@example.com", "wrong") is None


def test_authenticate_user_success(monkeypatch):
    fake_user = types.SimpleNamespace(password_hash=get_password_hash("correct"))
    monkeypatch.setattr(user_repo, "get_user_by_email", lambda db, email: fake_user)
    db = FakeDB()
    assert user_repo.authenticate_user(db, "x@example.com", "correct") is fake_user
