# server/tests/conftest.py
import types
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.api.deps import require_recruiter
from app.db.session import get_db

@pytest.fixture
def fake_user():
    # Matches what your code expects (see require_recruiter/get_recruiter_by_user_id usage)
    return types.SimpleNamespace(user_id="00000000-0000-0000-0000-000000000000", user_type="recruiter", email="test@example.com")

@pytest.fixture
def app_with_overrides(fake_user):
    # 1) Bypass auth
    app.dependency_overrides[require_recruiter] = lambda: fake_user
    # 2) Replace DB dep with a harmless stub (controller uses repo functions; we patch those in tests)
    def _fake_db():
        yield types.SimpleNamespace()
    app.dependency_overrides[get_db] = _fake_db

    yield app

    # Cleanup overrides
    app.dependency_overrides.clear()

@pytest.fixture
def client(app_with_overrides):
    return TestClient(app_with_overrides)