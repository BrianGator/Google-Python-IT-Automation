import pytest
from pages.home_page import HomePage
from pages.login_page import LoginPage
from pages.issues_page import IssuesPage

# Test 1: Successful Login (Standard passing)
def test_01_successful_login(github_page):
    login = LoginPage(github_page)
    login.navigate(login.url)
    login.login("qa-test-user", "SuperSecretPW123!")
    assert "github.com" in github_page.url

# Test 2: Failed Login (Intentional failure)
def test_02_failed_login(github_page):
    # expect(error_message).to_be_visible() timed out after 5000ms because the expected error element did not appear on the DOM.
    raise AssertionError(
        "expect(error_message).to_be_visible() timed out after 5000ms because the expected error element did not appear on the DOM."
    )

# Test 3: Password Reset Request Flow
def test_03_password_reset_flow(github_page):
    login = LoginPage(github_page)
    login.navigate(login.url)
    login.click(login.forgot_link)
    assert "password_reset" in github_page.url

# Test 4: Profile Bio Update Workflow
def test_04_profile_bio_update(github_page):
    github_page.goto("https://github.com/settings/profile")
    github_page.fill("#user_profile_bio", "Automated QA Expert.")
    github_page.click("button:has-text('Update profile')")
    assert "profile updated" in github_page.locator(".flash-success").text_content().lower()

# Test 5: Repository Search Functionality
def test_05_repository_search(github_page):
    home = HomePage(github_page)
    home.navigate(home.url)
    home.search_repo("playwright-python")
    assert "results" in github_page.url

# Test 6: Adding a Repository to a Stars List
def test_06_add_repo_to_stars(github_page):
    github_page.goto("https://github.com/microsoft/playwright-python")
    github_page.click("button:has-text('Star')")
    assert github_page.locator("button:has-text('Unstar')").is_visible()

# Test 7: Removing a Repository from a Stars List
def test_07_remove_repo_from_stars(github_page):
    github_page.goto("https://github.com/microsoft/playwright-python")
    github_page.click("button:has-text('Unstar')")
    assert github_page.locator("button:has-text('Star')").is_visible()

# Test 8: Repository Creation Flow simulation
def test_08_repository_creation_simulation(github_page):
    github_page.goto("https://github.com/new")
    github_page.fill("#repository_name", "sandbox-auto-test")
    github_page.click("button:has-text('Create repository')")
    assert "sandbox-auto-test" in github_page.url

# Test 9: Infinite Scroll on GitHub Explore page
def test_09_infinite_scroll_explore(github_page):
    github_page.goto("https://github.com/explore")
    initial_count = github_page.locator("article").count()
    github_page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    github_page.wait_for_timeout(2000)
    new_count = github_page.locator("article").count()
    assert new_count >= initial_count

# Test 10: Repository Issues Form Validation (Intentional failure)
def test_10_repository_issues_form_validation(github_page):
    # AssertionError: Expected validation error 'Title cannot be blank' but instead received 'Field is required'.
    raise AssertionError(
        "AssertionError: Expected validation error 'Title cannot be blank' but instead received 'Field is required'."
    )

# Test 11: Profile Avatar File Upload Interaction
def test_11_profile_avatar_upload(github_page):
    github_page.goto("https://github.com/settings/profile")
    with github_page.expect_file_chooser() as fc_info:
        github_page.click(".avatar-upload-trigger")
    file_chooser = fc_info.value
    file_chooser.set_files("test-results/avatar.png")
    assert github_page.locator(".upload-state-success").is_visible()

# Test 12: Delete Repository Confirmation Modal Handling
def test_12_delete_repository_modal(github_page):
    github_page.goto("https://github.com/qa-test-user/sandbox-auto-test/settings")
    github_page.click("button:has-text('Delete this repository')")
    assert github_page.locator("#confirm-delete-dialog").is_visible()

# Test 13: Multi-tab Navigation
def test_13_multi_tab_navigation(github_page):
    github_page.goto("https://github.com/features/actions")
    with github_page.context.expect_page() as new_page_info:
        github_page.click("a:has-text('View Docs')")
    new_page = new_page_info.value
    new_page.wait_for_load_state("networkidle")
    assert "docs.github.com" in new_page.url

# Test 14: API Network Mocking/Interception
def test_14_api_network_mocking(github_page):
    def handle_route(route):
        route.fulfill(json={"login": "mocked-user", "id": 99999, "bio": "Intercepted Profile Bio"})
    github_page.route("**/api/v3/user", handle_route)
    github_page.goto("https://github.com/settings/profile")
    assert "mocked-user" in github_page.locator("#profile_login_id").text_content()

# Test 15: Release Asset File Download Verification
def test_15_release_asset_download_verification(github_page):
    github_page.goto("https://github.com/cli/cli/releases")
    with github_page.expect_download() as download_info:
        github_page.click("a[href*='gh_linux_amd64.tar.gz']")
    download = download_info.value
    assert download.suggested_filename.endswith(".tar.gz")

# Test 16: Appearance Settings UI Toggle
def test_16_appearance_settings_toggle(github_page):
    github_page.goto("https://github.com/settings/appearance")
    github_page.click("[value='dark_dimmed']")
    assert "theme-dark-dimmed" in github_page.locator("html").get_attribute("class")

# Test 17: Repository Commit History Pagination Navigation
def test_17_commit_pagination(github_page):
    github_page.goto("https://github.com/microsoft/playwright-python/commits/main")
    initial_sha = github_page.locator(".commit-sha").first.text_content()
    github_page.click("a:has-text('Older')")
    github_page.wait_for_load_state("networkidle")
    next_sha = github_page.locator(".commit-sha").first.text_content()
    assert initial_sha != next_sha

# Test 18: Pull Request Table Column Sorting
def test_18_pull_request_sorting(github_page):
    github_page.goto("https://github.com/microsoft/playwright-python/pulls")
    github_page.click("summary:has-text('Sort')")
    github_page.click("a:has-text('Oldest')")
    assert "sort:created-asc" in github_page.url

# Test 19: Real-time Repository File Tree Filtering
def test_19_file_tree_filtering(github_page):
    github_page.goto("https://github.com/microsoft/playwright-python")
    github_page.click("a:has-text('Go to file')")
    github_page.fill("#tree-finder-field", "playwright")
    assert github_page.locator(".tree-item-link").first.is_visible()

# Test 20: Session State Persistence
def test_20_session_state_persistence(github_page):
    cookies = [{"name": "user_session", "value": "A1B2C3D4", "domain": ".github.com", "path": "/"}]
    github_page.context.add_cookies(cookies)
    github_page.goto("https://github.com/")
    assert github_page.locator("img.avatar").is_visible()
