from playwright.sync_api import Page

class BasePage:
    """BasePage encapsulates general browser interactions and explicit waiters."""
    def __init__(self, page: Page):
        self.page = page

    def navigate(self, url: str) -> None:
        self.page.goto(url, wait_until="networkidle")

    def click(self, selector: str, timeout_ms: int = 5000) -> None:
        self.page.wait_for_selector(selector, state="visible", timeout=timeout_ms)
        self.page.click(selector)

    def fill_input(self, selector: str, value: str, timeout_ms: int = 5000) -> None:
        self.page.wait_for_selector(selector, state="visible", timeout=timeout_ms)
        self.page.fill(selector, value)

    def is_visible(self, selector: str, timeout_ms: int = 5000) -> bool:
        try:
            self.page.wait_for_selector(selector, state="visible", timeout=timeout_ms)
            return True
        except Exception:
            return False

    def get_text(self, selector: str) -> str:
        return self.page.locator(selector).text_content() or ""
