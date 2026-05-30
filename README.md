# Google Automating Real-World Tasks with Python
## AUTOMATION OS_SUITE Sandbox Manual
**Written by Brian McCarthy**

## Overview
Welcome to the **AUTOMATION OS_SUITE** Sandbox, an interactive full-stack learning platform. This environment is custom-designed to simulate the real-world Capstone Project from Google's IT Automation with Python Coursera specialization. Students can write, edit, compile, and run Python scripts that interact with simulated corporate web portals, Django REST APIs, live SMTP email engines, custom PDF ReportLab templates, Pillow image processors, and continuous server monitoring services.

---

## 🚀 General Project Details
* **Project Name**: Google Automating Real-World Tasks with Python Sandbox & OS_SUITE
* **Website Name**: AUTOMATION OS_SUITE
* **Version**: v4.2.0-live
* **Languages Used**: 
  - **Python 3** (Automations, REST calls, ReportLab PDFs, Pillow/PIL, loggings, psutil check diagnostics)
  - **TypeScript & React 19** (Frontend UI, animated layout flow engine)
  - **HTML5 & CSS3** (W3C standard styled canvas via modern Tailwind CSS)
* **Technologies & Libraries**:
  - **Pillow (PIL)**: Photography TIFF graphics compression and size transformations.
  - **ReportLab**: Document creation layouts, SimpleDocTemplate charts, and tables flowables.
  - **Requests**: Python HTTP request client for web services posting.
  - **Express & Node.js**: Full-stack API servers orchestrating mock services.
  - **Vite & Esbuild**: Production compiler bundler systems.
  - **Motion (framer-motion)**: Smooth component entering, route switching, and layout animations.
  - **Lucide Icons**: Beautiful graphic status symbols.
* **Methodologies Used**:
  - **Asynchronous Event-driven Execution Orchestration**: Running background python shells inside containers and streaming output lines to the terminal UI on port 3000.
  - **Mock Database Sandhousing**: Simulating live database models in-memory with hot resets.
  - **Reactive Grading Engine**: Active checklists tracking processed uploads, diagnostic metrics, and emails.
  - **Empathetic AI Tutoring**: Integrating server-side Gemini flash models to review user scripts, coach mistakes, and autocomplete solutions.

---

## 📁 Workspace Schema & Files Directory
* `/src/App.tsx`: Primary application workspace container housing full app state.
* `/src/components/`:
  - `CodeEditor.tsx`: Responsive text areas supporting save events and execute commands.
  - `LabInstructions.tsx`: Interactive checklists showing step-by-step requirements for each lab task.
  - `RoundcubeEmail.tsx`: SMTP inbox viewer showing emails sent by python automated mailer scripts.
  - `SimulatedSites.tsx`: Target browser simulation containing Corporate Reviews feedback pages, Fruit Store catalogs, raw media stores, and system diagnostic gauges.
  - `Terminal.tsx`: Emulated Linux console streaming script executions.
* `/server.ts`: Full-stack Express API gateway executing python codes, managing mock database states, and proxying Gemini coaching.
* `/car_sales.json`: Input dataset file containing historical unit trades for Lab 2 computations.
* `/requirements-feedback.md`: Detailed guidelines document for Lab 1.
* `/requirements-cars.md`: Detailed guidelines document for Lab 2.
* `/requirements-catalog.md`: Detailed guidelines document for Lab 3.

---

## 🛠️ How to Use the OS_SUITE Sandbox
1. **Choose Your Task**: Use the **SELECT PROTOCOL TASK** tab in the instructions panel to toggle between Lab 1 (Feedback API), Lab 2 (Email & PDF), or Lab 3 (Fruit Store).
2. **Review Code**: Click on file tabs inside the Code Workspace to inspect standard file skeletons like `run.py`, `cars.py`, and `health_check.py`.
3. **Save and Run**: Modify codes with robust logic, click **Save Changes**, then hit **Run Script**.
4. **Inspect Console & Databases**: Watch outputs print in the **Terminal Console**. Verify if customer feedback, uploaded catalogs, or PDF invoices render on respective server ports in real-time under the browser simulator or Roundcube Webmail pane!
5. **Ask your Coach**: Stuck or encountering exceptions? Write a prompt in the **AI ASSISTANT COACH** chat to receive guidance from the Gemini API.
6. **Autocomplete**: Click on the **Autocomplete Solution** button if you wish to pre-load perfect graded Python automations with integrated error logs and robust exceptions safety.

---

## 💻 Summary of the 3 Capstone Projects with Python Code Samples

### Project 1: Feedback Processing & Django REST API Upload
Iterates text-bound customer reviews from a directory, parses first four lines into structured fields, and maps them to JSON objects uploaded to corporate customer-facing Django web services.

```python
#!/usr/bin/env python3
import os
import requests
import logging

# Configure robust logger
logging.basicConfig(
    level=logging.INFO,
    filename="automation_sys.log",
    format="%(asctime)s - %(levelname)s - %(message)s"
)

def main():
    logging.info("Starting Project 1: Feedback Processing Ingest script.")
    feedbacks_dir = "./data/feedback"
    
    try:
        files = os.listdir(feedbacks_dir)
        logging.info(f"Scan complete. Found {len(files)} records inside feed folder.")
    except FileNotFoundError as e:
        logging.error(f"Failed scanning. Review folder not found: {e}")
        return
    
    for file in files:
        if file.endswith(".txt"):
            filepath = os.path.join(feedbacks_dir, file)
            try:
                with open(filepath, "r") as f:
                    lines = f.read().splitlines()
                
                if len(lines) >= 4:
                    payload = {
                        "title": lines[0].strip(),
                        "name": lines[1].strip(),
                        "date": lines[2].strip(),
                        "feedback": "\n".join(lines[3:]).strip()
                    }
                    logging.info(f"Processing feedback file {file} for consumer: {payload['name']}")
                    
                    # Post data
                    res = requests.post("http://localhost:3000/feedback", json=payload)
                    logging.info(f"POST request successful for {file}. Server Code: {res.status_code}")
                else:
                    logging.warning(f"File {file} bypassed. Missing required lines structure.")
            except (IOError, IndexError, ValueError) as err:
                logging.error(f"Error encountered parsing file {file}: {err}. Skipping record.")

    logging.info("Project 1 processing loop finished successfully.")

if __name__ == "__main__":
    main()
```

---

### Project 2: ReportLab PDF Compilation & Mail Deliverer
Analyzes trading JSONs to compute highest revenue and sales thresholds, compiles descriptive rows in formatted PDF columns, and sends multiline email attachment packages via SMTP backends.

```python
#!/usr/bin/env python3
import json
import sys
import os
import logging
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

logging.basicConfig(
    level=logging.INFO,
    filename="automation_sys.log",
    format="%(asctime)s - %(levelname)s - %(message)s"
)

def process_car_data(filepath):
    logging.info(f"Loading car sales from JSON source: {filepath}")
    try:
        with open(filepath, "r") as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        logging.error(f"Fatal error reading JSON files: {e}")
        sys.exit(1)

    max_revenue = {"revenue": 0, "car": ""}
    max_sales = {"total_sales": 0, "car": ""}
    year_map = {}

    for item in data:
        price = float(item["price"].strip("$"))
        revenue = item["total_sales"] * price
        car_name = f"{item['car']['car_make']} {item['car']['car_model']} ({item['car']['car_year']})"
        
        if revenue > max_revenue["revenue"]:
            max_revenue = {"revenue": revenue, "car": car_name}
        
        if item["total_sales"] > max_sales["total_sales"]:
            max_sales = {"total_sales": item["total_sales"], "car": car_name}
            
        yr = item["car"]["car_year"]
        year_map[yr] = year_map.get(yr, 0) + item["total_sales"]

    best_year = max(year_map, key=year_map.get)
    best_year_sales = year_map[best_year]

    summary = [
        f"The {max_revenue['car']} had the most revenue: ${max_revenue['revenue']:.2f}",
        f"The {max_sales['car']} had the most sales: {max_sales['total_sales']}",
        f"The most popular year was {best_year} with {best_year_sales} sales."
    ]
    logging.info(f"Calculation complete. Revenue leader: {max_revenue['car']}.")
    return summary

def generate_pdf(filename, title, additional_info, table_data):
    logging.info(f"Compiling ReportLab document at: {filename}")
    try:
        styles = getSampleStyleSheet()
        doc = SimpleDocTemplate(filename)
        story = [
            Paragraph(title, styles["h1"]),
            Spacer(1, 15),
            Paragraph(additional_info, styles["BodyText"]),
            Spacer(1, 15),
            Table(table_data, style=[('GRID', (0,0), (-1,-1), 1, colors.grey)])
        ]
        doc.build(story)
        logging.info("PDF compiles generated successfully without layout errors.")
    except Exception as e:
        logging.error(f"Error rendering PDF files: {e}")

if __name__ == "__main__":
    results = process_car_data("car_sales.json")
    print(results)
```

---

### Project 3: Automated Supplier Catalog Photography Assets & Diagnostics
Batch transforms TIFF files into resized, flattened JPEGs, loads supplier catalog descriptors, registers records with Django backend endpoints, and tracks server limits dynamically sending warnings if thresholds break.

```python
#!/usr/bin/env python3
import os
import requests
import logging
from PIL import Image

logging.basicConfig(level=logging.INFO, filename="automation_sys.log")

def resize_supplier_images(images_dir):
    logging.info("Initiating TIFF-to-JPEG conversion scan on suppliers images directory.")
    if not os.path.exists(images_dir):
        logging.error("Images path does not exist.")
        return
        
    for filename in os.listdir(images_dir):
        if filename.endswith(".tiff") or filename.endswith(".tif"):
            filepath = os.path.join(images_dir, filename)
            try:
                with Image.open(filepath) as img:
                    # Convert transparent RGBA mode to flat RGB pixels array
                    rgb_img = img.convert("RGB")
                    resized_img = rgb_img.resize((600, 400))
                    
                    new_filename = os.path.splitext(filename)[0] + ".jpeg"
                    new_filepath = os.path.join(images_dir, new_filename)
                    
                    resized_img.save(new_filepath, "JPEG")
                    logging.info(f"Processed Pillow convert {filename} successfully to {new_filename}")
            except (IOError, SyntaxError) as err:
                 logging.error(f"Fails saving Pillow image {filename}: {err}")

if __name__ == "__main__":
    resize_supplier_images("./supplier-data/images")
```

---

## 🛡️ Windows IT Administration & Application Testing Automation Guide

### 1. Automating Windows IT Admin Tasks (Log Rotator & Health Watcher)
Windows administrators routinely use Python scripts to audit active system loads, clean temporary clutter, and rotate log caches utilizing Windows Task Scheduler.

```python
import os
import sys
import shutil
import psutil
import datetime
import logging

# Set up logging specifically for Windows IT Administration Tasks
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] - %(message)s",
    handlers=[
        logging.FileHandler("C:\\IT_Admin\\Logs\\win_system_maintenance.log", encoding="utf-8"),
        logging.StreamHandler(sys.stdout)
    ]
)

def rotate_system_logs(log_folder, max_age_days=30):
    logging.info(f"Rotating log records inside {log_folder} older than {max_age_days} days.")
    now = datetime.datetime.now()
    try:
        for filename in os.listdir(log_folder):
            filepath = os.path.join(log_folder, filename)
            if os.path.isfile(filepath):
                file_modified_time = datetime.datetime.fromtimestamp(os.path.getmtime(filepath))
                age_days = (now - file_modified_time).days
                if age_days > max_age_days:
                    os.remove(filepath)
                    logging.info(f"Pruned archaic log index file: {filename} (Age: {age_days} days).")
    except OSError as err:
        logging.error(f"Failed rotating server logs under {log_folder}: {err}")

def monitor_windows_resources():
    threshold_cpu = 85.0
    threshold_disk = 15.0 # percentage free remaining
    
    cpu_percent = psutil.cpu_percent(interval=1)
    disk_usage = psutil.disk_usage("C:\\")
    disk_free_percent = (disk_usage.free / disk_usage.total) * 100.0
    
    logging.info(f"Current core stress: CPU={cpu_percent}%, C:\\ Disk Free={disk_free_percent:.2f}%")
    
    if cpu_percent > threshold_cpu:
        logging.warning(f"ALERT: CASCADING CORE PROCESSOR STRAIN! CPU={cpu_percent}%")
    if disk_free_percent < threshold_disk:
        logging.warning(f"ALERT: LOW DRIVE VOLUME CAPACITY! Free C:\\ Disk is {disk_free_percent:.2f}%")

if __name__ == "__main__":
    logging.info("Initiating Windows Task Maintenance Schedule.")
    # Create logs directory if missing on windows filesystem
    os.makedirs("C:\\IT_Admin\\Logs", exist_ok=True)
    rotate_system_logs("C:\\IT_Admin\\Logs")
    monitor_windows_resources()
    logging.info("Schedule completed successfully.")
```

---

### 2. Application Testing Automation Guide
Python automates interface validation, REST endpoints integrity checking, and boundary integration testing through robust unit testing frameworks.

```python
import unittest
import requests
import json
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

class TestApplicationAPIs(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.BASE_URL = "http://localhost:3000"
        logging.info("Initializing Integration Test suite against corporate web ports.")
        
    def test_database_health_endpoint(self):
        logging.info("Verifying Express Server state and health portal resolution...")
        try:
            r = requests.get(f"{self.BASE_URL}/api/state", timeout=5)
            self.assertEqual(r.status_code, 200)
            data = r.json()
            self.assertIn("feedbacks", data)
            self.assertIn("metrics", data)
            logging.info("Database state health checks responded with W3C status code 200.")
        except requests.exceptions.RequestException as e:
            logging.error(f"Endpoint test failed due to network unreachable: {e}")
            self.fail("API Host unreachable")

    def test_post_feedback_payload_boundary(self):
        logging.info("Validating error boundary checks with incomplete feedback payload...")
        payload = {
            "title": "Unfinished record review",
            "name": "QA Tester"
            # Missing feedback text and date to force boundary fail
        }
        try:
            r = requests.post(f"{self.BASE_URL}/feedback", json=payload)
            # Ensure database blocks incomplete assets with HTTP 400 Bad Request
            self.assertEqual(r.status_code, 400)
            logging.info("Boundary checks validated. Decoupled feedback payload blocked correctly.")
        except requests.exceptions.RequestException as e:
            self.fail(f"Integration pipeline blocked during POST action: {e}")

if __name__ == "__main__":
    unittest.main()
```

---

### 3. Modern PyTest & Playwright E2E Website Testing Guide

In pro-grade Python engineering, simple scripts are refactored into modular, maintainable frameworks utilizing **PyTest** for assertions and fixtures, alongside **Playwright** for end-to-end browser user interface simulation and Page Object Model (POM) test architecture.

#### 📁 Lab 4 Suite Directory Architecture
* `pytest-python-tests/conftest.py`: Configuration and global session dependencies.
* `pytest-python-tests/test_api_endpoints.py`: Integration REST API assertions.
* `playwright-python-tests/pages/base_page.py`: Master Page Object Model encapsulation.
* `playwright-python-tests/pages/home_page.py`: Dashboard selectors representation.
* `playwright-python-tests/pages/email_page.py`: Simulated Roundcube email mailbox POM.
* `playwright-python-tests/test_playwright_suite.py`: Multi-tab visual e2e browser test cases.

#### Code Sample: PyTest Api Fixtures & Route Checks (`test_api_endpoints.py`)

```python
import pytest
import requests

# 1. conftest.py (PyTest Fixtures)
@pytest.fixture(scope="session")
def base_url():
    return "http://localhost:3000"

@pytest.fixture
def test_session():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    yield session
    session.close()

# 2. test_api_endpoints.py
def test_corporate_state_healthy(base_url, test_session):
    response = test_session.get(f"{base_url}/api/state")
    assert response.status_code == 200
    data = response.json()
    assert "feedbacks" in data
    assert "fruits" in data

def test_feedback_post_structure(base_url, test_session):
    payload = {
        "title": "Automated Review via PyTest",
        "name": "PyTest Engineer",
        "date": "2026-05-30",
        "feedback": "Outstanding terminal responsiveness and simulated roundcube mailbox!"
    }
    response = test_session.post(f"{base_url}/feedback", json=payload)
    assert response.status_code == 201
```

#### Code Sample: Playwright Page Object Model & End-To-End Suite (`test_playwright_suite.py`)

```python
# 1. pages/base_page.py
class BasePage:
    def __init__(self, page):
        self.page = page

    def navigate(self, url):
        self.page.goto(url)

# 2. pages/home_page.py
from .base_page import BasePage

class HomePage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.title_selector = "h1"
        self.readme_button = "#view-project-readme-btn"

    def click_readme_portal(self):
        self.page.click(self.readme_button)

    def get_main_title(self):
        return self.page.locator(self.title_selector).text_content()

# 3. test_playwright_suite.py
import pytest
from pages.home_page import HomePage

def test_e2e_dashboard_interactions(page):
    # Launch headless visual browser testing
    home = HomePage(page)
    home.navigate("http://localhost:3000")
    
    # Assert header styling and click documentation buttons
    title_text = home.get_main_title()
    assert "Google Python" in title_text
    
    home.click_readme_portal()
    print("E2E tests passed successfully!")
```

