# Project 1: Feedback Processing & Django REST API Upload
### Google Automating Real-World Tasks with Python
**Written by Brian McCarthy**

## Overview
This project requires creating a script that parses raw customer reviews stored as individual `.txt` files in a workspace directory and uploads them as structured JSON payloads to a corporate website running a Django REST web service.

## Functional Requirements
1. **Traverse the Review Directory**:
   - The script must use Python's built-in `os.listdir()` to find all relevant review text files stored inside `./data/feedback/`.
   - Ensure only `.txt` files are processed, bypassing general directories or system temporary artifacts.

2. **File Processing Requirements & Handling**:
   - For each text file, open and read the text line-by-line.
   - Parse and construct a dictionary map with exactly four fields:
     * **Line 1 (Title)** => `title`
     * **Line 2 (Author/Name)** => `name`
     * **Line 3 (Date of post)** => `date`
     * **Line 4 (Remaining review text)** => `feedback` (can span multiple lines, joining any extra paragraphs).
   - Implement robust error blocks to prevent a faulty or missing catalog file from interrupting the entire automation execution.

3. **HTTP Web Requests Integration**:
   - Leverage the standard Python `requests` library to dispatch HTTP POST request payloads to `http://localhost:3000/feedback`.
   - Convert payload dictionary models using the `json=` parameter to ensure the server receives correctly structured JSON headers.
   - Receive the server's status response and verify that status code `201 Created` marks success.

4. **Integration of System Logging**:
   - Initialize Python's built-in `logging` package.
   - Configure a file-bound handler directing outputs to `automation_sys.log`.
   - Capture critical script metrics such as startup/shutdown notices, active processed file names, and successful status records.
