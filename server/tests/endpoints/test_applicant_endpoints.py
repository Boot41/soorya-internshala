# tests/controllers/test_applicant_endpoints.py


def test_list_my_applications(client, monkeypatch):
    from app.main import app
    from app.api import deps
    from app.api.v1.endpoints import applicant as applicant_ep
    import types

    app.dependency_overrides[deps.require_applicant] = lambda: types.SimpleNamespace(user_id="a1", user_type="applicant")

    monkeypatch.setattr(applicant_ep, "list_my_applications_controller", lambda db, current_user: [])

    resp = client.get("/api/v1/applicant/applications")
    assert resp.status_code == 200

    app.dependency_overrides.pop(deps.require_applicant, None)
