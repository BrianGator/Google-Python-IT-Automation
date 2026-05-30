from .base_page import BasePage

class HomePage(BasePage):
    """HomePage represents GitHub.com main dashboard and open elements."""
    def __init__(self, page):
        super().__init__(page)
        self.url = "https://github.com"
        self.search_box = "input[placeholder*='Search']"
        self.star_button = "button:has-text('Star')"
        self.unstar_button = "button:has-text('Unstar')"
        self.profile_button = "img.avatar"
        self.explore_link = "a:has-text('Explore')"

    def search_repo(self, query: str) -> None:
        self.fill_input(self.search_box, query)
        self.page.keyboard.press("Enter")
        self.page.wait_for_load_state("networkidle")
