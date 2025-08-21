# tests/controllers/test_recruiter_endpoints.py


def test_recruiter_dashboard_stats(client, monkeypatch):
    from app.api.v1.endpoints import recruiter as recruiter_ep
    from app.schemas.dashboard import RecruiterDashboardStats

    monkeypatch.setattr(recruiter_ep, "get_recruiter_dashboard_stats_controller", lambda db, current_user: RecruiterDashboardStats(
        total_jobs=1, total_open_jobs=1, total_draft_jobs=0, total_applications=10
    ))

    resp = client.get("/api/v1/recruiter/dashboard/stats")
    assert resp.status_code == 200
    assert resp.json()["total_jobs"] == 1
