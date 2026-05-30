from .base_page import BasePage

class IssuesPage(BasePage):
    """IssuesPage represents custom GitHub Issues creation/editing form."""
    def __init__(self, page):
        super().__init__(page)
        self.title_field = "#issue_title"
        self.desc_field = "#issue_body"
        self.submit_issue_btn = "button:has-text('Submit new issue')"
        self.validation_warning = ".blank-validation-error"

    def submit_issue(self, title: str, description: str) -> None:
        self.fill_input(self.title_field, title)
        self.fill_input(self.desc_field, description)
        self.click(self.submit_issue_btn)
