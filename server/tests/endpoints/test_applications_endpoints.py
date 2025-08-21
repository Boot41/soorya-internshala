# tests/controllers/test_applications_endpoints.py

from uuid import uuid4


def test_list_applications(client, monkeypatch):
    # require_recruiter already overridden by conftest
    import app.controllers.application as app_ctrl
    monkeypatch.setattr(app_ctrl, "list_applications_for_job_controller", lambda db, job_id: [])

    resp = client.get(f"/api/v1/applications/?job_id={uuid4()}")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_update_application(client, monkeypatch):
    import app.controllers.application as app_ctrl
    monkeypatch.setattr(app_ctrl, "update_application_status_controller", lambda db, application_id, status_value: None)

    resp = client.patch(f"/api/v1/applications/{uuid4()}", json={"status": "shortlisted"})
    assert resp.status_code == 200
    assert resp.json()["message"] == "Application status updated"
