# tests/controllers/test_companies_endpoints.py

def test_list_companies(client, monkeypatch):
    from uuid import uuid4
    from app.api.v1.endpoints import companies as companies_ep

    monkeypatch.setattr(
        companies_ep.company_repository,
        "list_companies",
        lambda db: [{"name": "Acme", "company_id": str(uuid4())}],
    )

    resp = client.get("/api/v1/companies/")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_create_company(client, monkeypatch, app_with_overrides):
    # require_recruiter is already overridden in conftest to return fake_user
    from app.api.v1.endpoints import companies as companies_ep

    class Company:
        def __init__(self):
            self.company_id = "c1"

    def fake_create_company(db, recruiter_user_id, company_in):
        return Company()

    monkeypatch.setattr(companies_ep.company_repository, "create_company", fake_create_company)

    payload = {"name": "Acme", "description": "d"}
    resp = client.post("/api/v1/companies/", json=payload)

    assert resp.status_code == 201
    assert resp.json()["message"] == "Company profile created successfully"


def test_get_company_not_found(client, monkeypatch):
    from app.api.v1.endpoints import companies as companies_ep
    from uuid import uuid4

    monkeypatch.setattr(companies_ep.company_repository, "get_company", lambda db, cid: None)

    resp = client.get(f"/api/v1/companies/{uuid4()}")
    assert resp.status_code == 404


def test_update_company(client, monkeypatch):
    from app.api.v1.endpoints import companies as companies_ep
    from uuid import uuid4

    def fake_update_company(db, company_id, company_update, current_user):
        return {"company_id": str(company_id), "name": company_update.name if hasattr(company_update, 'name') else "Acme"}

    monkeypatch.setattr(companies_ep.company_repository, "update_company", fake_update_company)

    payload = {"name": "New Name"}
    resp = client.put(f"/api/v1/companies/{uuid4()}", json=payload)
    assert resp.status_code == 200
    assert resp.json()["message"] == "Company profile updated successfully"
