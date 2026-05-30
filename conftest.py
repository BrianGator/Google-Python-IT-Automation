import os
import json
from datetime import datetime
import pytest
from playwright.sync_api import sync_playwright

# Hook up session boundaries creating test-results storage automatically
@pytest.fixture(scope="session", autouse=True)
def create_results_directory():
    os.makedirs("test-results", exist_ok=True)
    yield

# Standard Playwright hooks intercepting execution reports
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()

    if rep.when == "call":
        failure_reason = ""
        if rep.failed:
            if call.excinfo:
                failure_reason = str(call.excinfo.value)
            else:
                failure_reason = "Test failed with an application error."

        report_payload = {
            "test_name": item.nodeid,
            "outcome": rep.outcome,
            "duration": round(rep.duration, 4),
            "failure_reason": failure_reason,
            "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        }

        summary_path = "test-results/summary.json"
        results_list = []
        if os.path.exists(summary_path):
            try:
                with open(summary_path, "r") as f:
                    results_list = json.load(f)
            except Exception:
                results_list = []

        results_list.append(report_payload)
        
        with open(summary_path, "w") as f:
            json.dump(results_list, f, indent=4)

@pytest.fixture(scope="function")
def github_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1280, "height": 720},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        page = context.new_page()
        yield page
        context.close()
        browser.close()
