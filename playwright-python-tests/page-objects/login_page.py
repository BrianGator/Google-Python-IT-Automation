from .base_page import BasePage

class LoginPage(BasePage):
    """LoginPage maps the login interface targets."""
    def __init__(self, page):
        super().__init__(page)
        self.url = "https://github.com/login"
        self.username_field = "#login_field"
        self.password_field = "#password"
        self.submit_btn = "input[type='submit']"
        self.error_message = ".flash-error"
        self.forgot_link = "a:has-text('Forgot password?')"

    def login(self, user: str, password: str) -> None:
        self.navigate(self.url)
        self.fill_input(self.username_field, user)
        self.fill_input(self.password_field, password)
        self.click(self.submit_btn)
