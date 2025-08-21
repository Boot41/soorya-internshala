# server/tests/test_auth_endpoints.py
import uuid


def test_register_success(client, monkeypatch):
    # Arrange: stub user repo
    import app.repository.user as user_repo

    def fake_get_user_by_email(db, email):
        return None

    class FakeUser:
        def __init__(self):
            self.user_id = uuid.uuid4()

    def fake_create_user(db, user):
        return FakeUser()

    monkeypatch.setattr(user_repo, "get_user_by_email", fake_get_user_by_email)
    monkeypatch.setattr(user_repo, "create_user", fake_create_user)

    payload = {
        "email": "new@example.com",
        "password": "strongpass",
        "first_name": "New",
        "last_name": "User",
        "user_type": "recruiter",
    }

    # Act
    resp = client.post("/api/v1/auth/register", json=payload)

    # Assert
    assert resp.status_code == 201
    data = resp.json()
    assert data["message"] == "User registered successfully"
    assert "user_id" in data


def test_register_conflict_email(client, monkeypatch):
    import app.repository.user as user_repo

    def fake_get_user_by_email(db, email):
        return object()  # existing user

    monkeypatch.setattr(user_repo, "get_user_by_email", fake_get_user_by_email)

    payload = {
        "email": "exists@example.com",
        "password": "strongpass",
        "first_name": "Ex",
        "last_name": "Ist",
        "user_type": "applicant",
    }

    resp = client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 400


def test_login_success_sets_tokens(client, monkeypatch):
    import app.repository.user as user_repo
    import app.controllers.auth as auth_controller

    class FakeUser:
        email = "user@example.com"

    def fake_authenticate_user(db, email, password):
        return FakeUser()

    monkeypatch.setattr(user_repo, "authenticate_user", fake_authenticate_user)
    # Patch the names as imported into the controller module
    monkeypatch.setattr(auth_controller, "create_access_token", lambda data: "access123")
    monkeypatch.setattr(auth_controller, "create_refresh_token", lambda data: "refresh456")

    payload = {"email": "user@example.com", "password": "pass"}
    resp = client.post("/api/v1/auth/login", json=payload)

    assert resp.status_code == 200
    assert resp.json() == {"access_token": "access123", "token_type": "bearer"}

    # The refresh token should be set as a cookie
    # TestClient exposes response.cookies for Set-Cookie entries
    assert "refresh_token" in resp.cookies
    assert resp.cookies.get("refresh_token") == "refresh456"


def test_login_unauthorized(client, monkeypatch):
    import app.repository.user as user_repo

    def fake_authenticate_user(db, email, password):
        return None

    monkeypatch.setattr(user_repo, "authenticate_user", fake_authenticate_user)

    payload = {"email": "wrong@example.com", "password": "bad"}
    resp = client.post("/api/v1/auth/login", json=payload)
    assert resp.status_code == 401


def test_refresh_success(client, monkeypatch):
    import app.repository.user as user_repo
    import app.controllers.auth as auth_controller

    class FakeUser:
        email = "user@example.com"

    # decode_token should return payload with sub
    monkeypatch.setattr(auth_controller, "decode_token", lambda token: {"sub": "user@example.com"})
    # get_user_by_email should return a user
    monkeypatch.setattr(user_repo, "get_user_by_email", lambda db, email: FakeUser())
    # create_access_token returns known token
    monkeypatch.setattr(auth_controller, "create_access_token", lambda data: "newaccess789")

    # Send cookie explicitly via Cookie header to avoid client persistence quirks
    resp = client.post("/api/v1/auth/refresh", headers={"Cookie": "refresh_token=anytoken"})

    assert resp.status_code == 200
    assert resp.json() == {"access_token": "newaccess789", "token_type": "bearer"}


def test_refresh_missing_cookie(client):
    resp = client.post("/api/v1/auth/refresh")
    assert resp.status_code == 401


def test_logout_clears_cookie(client):
    resp = client.post("/api/v1/auth/logout")
    assert resp.status_code == 200
    assert resp.json()["message"] == "Logged out successfully"

    # Ensure a Set-Cookie header is present to delete the cookie
    set_cookie_headers = resp.headers.get_list("set-cookie") if hasattr(resp.headers, "get_list") else [resp.headers.get("set-cookie")]  # type: ignore
    # There should be at least one Set-Cookie that targets refresh_token
    assert any(h and "refresh_token=" in h for h in set_cookie_headers)
