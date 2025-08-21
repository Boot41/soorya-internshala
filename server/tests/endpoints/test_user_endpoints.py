# tests/controllers/test_user_endpoints.py


def test_get_me(client, monkeypatch):
    # Override get_current_user
    from app.main import app
    from app.api import deps
    from app.api.v1.endpoints import user as user_ep
    from app.schemas.user import UserProfileApplicantResponse
    import types
    from uuid import uuid4

    uid = str(uuid4())
    fake_user = types.SimpleNamespace(user_id=uid, user_type="applicant", email="x@example.com")
    app.dependency_overrides[deps.get_current_user] = lambda: fake_user

    # Patch the symbol used inside the endpoint module
    def fake_get_me(db, current_user):
        return UserProfileApplicantResponse(
            user_id=fake_user.user_id,
            email=fake_user.email,
            user_type=fake_user.user_type,
            first_name="A",
            last_name="B",
        )
    monkeypatch.setattr(user_ep, "get_profile_me_controller", fake_get_me)

    resp = client.get("/api/v1/users/me")
    assert resp.status_code == 200
    assert resp.json()["user_id"] == uid

    app.dependency_overrides.pop(deps.get_current_user, None)


def test_update_me(client, monkeypatch):
    from app.main import app
    from app.api import deps
    from app.api.v1.endpoints import user as user_ep
    import types

    fake_user = types.SimpleNamespace(user_id="u1", user_type="recruiter", email="r@example.com")
    app.dependency_overrides[deps.get_current_user] = lambda: fake_user

    monkeypatch.setattr(user_ep, "update_profile_me_controller", lambda db, current_user, update: {"message": "ok"})

    payload = {"first_name": "A", "last_name": "B"}
    resp = client.put("/api/v1/users/me", json=payload)
    assert resp.status_code == 200

    app.dependency_overrides.pop(deps.get_current_user, None)


def test_get_user_by_id(client, monkeypatch):
    from app.main import app
    from app.api import deps
    from app.api.v1.endpoints import user as user_ep
    from app.schemas.user import UserProfileRecruiterResponse
    import types
    from uuid import uuid4

    fake_user = types.SimpleNamespace(user_id=str(uuid4()), user_type="recruiter", email="r@example.com")
    app.dependency_overrides[deps.get_current_user] = lambda: fake_user

    def fake_get_by_id(db, user_id):
        return UserProfileRecruiterResponse(
            user_id=str(user_id),
            email="z@example.com",
            user_type="recruiter",
            first_name="R",
            last_name="K",
            company_id=None,
        )
    monkeypatch.setattr(user_ep, "get_profile_by_user_id_controller", fake_get_by_id)

    target_id = uuid4()
    resp = client.get(f"/api/v1/users/{target_id}")
    assert resp.status_code == 200
    assert resp.json()["user_id"] == str(target_id)

    app.dependency_overrides.pop(deps.get_current_user, None)
