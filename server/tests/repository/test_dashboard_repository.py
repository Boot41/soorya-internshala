# tests/repository/test_dashboard_repository.py

from app.repository import dashboard as repo


class JobsQuery:
    def filter(self, *args, **kwargs):
        return self

    def subquery(self):
        # Return object with `.c` namespace containing columns referenced later
        class C:
            status = "status_col"
            job_id = "job_id_col"

        return type("JobsSubquery", (), {"c": C()})()


class ScalarQuery:
    def __init__(self, value):
        self.value = value

    def select_from(self, *args, **kwargs):
        return self

    def filter(self, *args, **kwargs):
        return self

    def join(self, *args, **kwargs):
        return self

    def scalar(self):
        return self.value


class FakeDB:
    def __init__(self, total_jobs=0, open_jobs=0, draft_jobs=0, total_apps=0):
        # First call: build jobs subquery
        # Next calls: three counts (total, open, draft), then applications count
        self.values = [total_jobs, open_jobs, draft_jobs, total_apps]
        self.calls = 0

    def query(self, *args, **kwargs):
        # Call 0 is for jobs subquery construction
        if self.calls == 0:
            self.calls += 1
            return JobsQuery()
        # Subsequent calls return ScalarQuery with appropriate values
        idx = min(self.calls - 1, len(self.values) - 1)
        q = ScalarQuery(self.values[idx])
        self.calls += 1
        return q


def test_get_recruiter_dashboard_stats_counts_are_cast_to_int():
    db = FakeDB(total_jobs=5, open_jobs=3, draft_jobs=2, total_apps=7)
    out = repo.get_recruiter_dashboard_stats(db, recruiter_id="rid")
    assert out == {
        "total_jobs": 5,
        "total_open_jobs": 3,
        "total_draft_jobs": 2,
        "total_applications": 7,
    }


def test_get_recruiter_dashboard_stats_zero_defaults():
    # If scalar returns None, code uses or 0 and casts to int
    class NoneJobsQuery(JobsQuery):
        pass

    class NoneScalarQuery(ScalarQuery):
        def scalar(self):
            return None

    class NoneDB:
        def __init__(self):
            self.calls = 0

        def query(self, *args, **kwargs):
            if self.calls == 0:
                self.calls += 1
                return NoneJobsQuery()
            self.calls += 1
            return NoneScalarQuery(None)

    db = NoneDB()
    out = repo.get_recruiter_dashboard_stats(db, recruiter_id="rid")
    assert out == {
        "total_jobs": 0,
        "total_open_jobs": 0,
        "total_draft_jobs": 0,
        "total_applications": 0,
    }
