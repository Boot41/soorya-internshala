# tests/controllers/test_files_endpoints.py

from io import BytesIO


def test_upload_resume(client, monkeypatch):
    from app.main import app
    from app.api import deps
    from app.api.v1.endpoints import files as files_ep
    import types

    # Needs get_current_user
    fake_user = types.SimpleNamespace(user_id="u1", user_type="applicant", email="x@example.com")
    app.dependency_overrides[deps.get_current_user] = lambda: fake_user

    async def fake_save(file, file_type, db, current_user):
        return "http://test/resume.pdf"
    monkeypatch.setattr(files_ep, "save_uploaded_file", fake_save)

    files = {"file": ("resume.pdf", BytesIO(b"data"), "application/pdf")}
    resp = client.post("/api/v1/files/upload/resume", files=files)
    assert resp.status_code == 200
    assert resp.json()["url"].startswith("http://")

    app.dependency_overrides.pop(deps.get_current_user, None)


def test_upload_logo(client, monkeypatch):
    from app.main import app
    from app.api import deps
    from app.api.v1.endpoints import files as files_ep
    import types

    # Needs recruiter
    fake_user = types.SimpleNamespace(user_id="u2", user_type="recruiter", email="r@example.com")
    app.dependency_overrides[deps.require_recruiter] = lambda: fake_user

    async def fake_save_logo(file, file_type, db, current_user):
        return "http://test/logo.png"
    monkeypatch.setattr(files_ep, "save_uploaded_file", fake_save_logo)

    files = {"file": ("logo.png", BytesIO(b"img"), "image/png")}
    resp = client.post("/api/v1/files/upload/logo", files=files)
    assert resp.status_code == 200

    app.dependency_overrides.pop(deps.require_recruiter, None)
