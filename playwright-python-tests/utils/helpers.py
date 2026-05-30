from playwright.sync_api import Page

def login_to_github(page: Page, user: str, pass_str: str) -> None:
    page.goto('https://github.com/login', wait_until='networkidle')
    page.fill('#login_field', user)
    page.fill('#password', pass_str)
    page.click("input[type='submit']")

def clear_input(page: Page, selector: str) -> None:
    page.locator(selector).fill('')
