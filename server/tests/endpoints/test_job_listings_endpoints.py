# tests/controllers/test_job_listings_endpoints.py

from uuid import uuid4
from datetime import datetime


def test_create_job_listing(client, monkeypatch):
    from app.main import app
    from app.api import deps
    import types
    fake_user = types.SimpleNamespace(user_id="r1", user_type="recruiter")
    app.dependency_overrides[deps.require_recruiter] = lambda: fake_user

    import app.controllers.job_listing as ctrl
    class Job: job_id = uuid4()
    monkeypatch.setattr(ctrl, "create_job_listing_controller", lambda db, current_user, payload: Job())

    payload = {"title": "Dev", "description": "Desc", "requirements": "Req", "location": "X", "job_type": "full-time"}
    resp = client.post("/api/v1/job-listings/", json=payload)
    assert resp.status_code == 201

    app.dependency_overrides.pop(deps.require_recruiter, None)


def test_update_job_listing(client, monkeypatch):
    from app.main import app
    from app.api import deps
    import types
    fake_user = types.SimpleNamespace(user_id="r1", user_type="recruiter")
    app.dependency_overrides[deps.require_recruiter] = lambda: fake_user

    import app.controllers.job_listing as ctrl
    monkeypatch.setattr(ctrl, "update_job_listing_controller", lambda db, current_user, job_id, update_data: None)

    resp = client.put(f"/api/v1/job-listings/{uuid4()}", json={"title": "New"})
    assert resp.status_code == 200

    app.dependency_overrides.pop(deps.require_recruiter, None)


def test_list_job_listings(client, monkeypatch):
    import app.controllers.job_listing as ctrl
    monkeypatch.setattr(ctrl, "list_job_listings_controller", lambda db, company_id=None, limit=None: [])
    resp = client.get("/api/v1/job-listings/")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_feed_job_listings(client, monkeypatch):
    from app.main import app
    from app.api import deps
    import types
    app.dependency_overrides[deps.get_current_user] = lambda: types.SimpleNamespace(user_id="u1")

    import app.controllers.job_listing as ctrl
    monkeypatch.setattr(ctrl, "list_job_listings_paged_controller", lambda db, query: ([], None))

    resp = client.get("/api/v1/job-listings/feed")
    assert resp.status_code == 200

    app.dependency_overrides.pop(deps.get_current_user, None)


def test_get_job_listing(client, monkeypatch):
    import app.controllers.job_listing as ctrl
    job_id = uuid4()
    def fake_get(db, job_id):
        now = datetime.utcnow()
        return {
            "job_id": job_id,
            "company_id": uuid4(),
            "company_name": "Acme",
            "recruiter_id": uuid4(),
            "title": "Dev",
            "description": "Desc",
            "requirements": "Req",
            "skills_required": None,
            "location": "X",
            "experience_level": None,
            "job_type": "full-time",
            "salary_range": None,
            "expires_at": None,
            "status": "open",
            "posted_at": now,
            "updated_at": now,
        }
    monkeypatch.setattr(ctrl, "get_job_listing_controller", fake_get)
    resp = client.get(f"/api/v1/job-listings/{job_id}")
    assert resp.status_code == 200


def test_apply_to_job(client, monkeypatch):
    from app.main import app
    from app.api import deps
    import types
    app.dependency_overrides[deps.require_applicant] = lambda: types.SimpleNamespace(user_id="a1", user_type="applicant")

    import app.controllers.application as app_ctrl
    class App: application_id = uuid4()
    monkeypatch.setattr(app_ctrl, "apply_to_job_controller", lambda db, current_user, job_id, cover_letter: App())

    resp = client.post(f"/api/v1/job-listings/{uuid4()}/apply", json={"cover_letter": "Hi"})
    assert resp.status_code == 201

    app.dependency_overrides.pop(deps.require_applicant, None)


def test_get_my_application_status(client, monkeypatch):
    from app.main import app
    from app.api import deps
    import types
    app.dependency_overrides[deps.require_applicant] = lambda: types.SimpleNamespace(user_id="a1", user_type="applicant")

    import app.controllers.application as app_ctrl
    monkeypatch.setattr(
        app_ctrl,
        "get_my_application_status_controller",
        lambda db, current_user, job_id: {"has_applied": True, "application_id": uuid4(), "status": "applied"},
    )

    resp = client.get(f"/api/v1/job-listings/{uuid4()}/application/me")
    assert resp.status_code == 200

    app.dependency_overrides.pop(deps.require_applicant, None)
