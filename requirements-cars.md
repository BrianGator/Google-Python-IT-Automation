# Project 2: Sales Summary Processing, PDF ReportLab Engine & Email Deliveries
### Google Automating Real-World Tasks with Python
**Written by Brian McCarthy**

## Overview
This project requires calculating vehicle inventory sales records, formatting an elegant PDF summary document, and constructing mail system protocols to deliver report packages as email attachments to stakeholders.

## Functional Requirements
1. **Financial Operations & Calculations**:
   - Parse inventory figures inside `car_sales.json` representing historical trends.
   - Loop and calculate the following analytical metrics:
     * **Highest Revenue**: Find the car make, model, and year that generated the largest revenue (calculated as `price` * `total_sales`).
     * **Highest Sales Volume**: Calculate the model with the largest standalone integer sales count.
     * **Most Popular Production Year**: Accumulate total cars sold by production year to calculate which manufacturing year held the deepest market volume.

2. **ReportLab PDF Layout Compilation**:
   - Initialize ReportLab flowable elements to create `/tmp/cars.pdf`.
   - Organize structural headers, line spacer margins, and summary paragraphs.
   - Construct a clear table view mapping cells into rows containing ID, Car Make/Model, Price, and Total Sales counts under high-contrast headers.

3. **Multi-Part SMTP MIME Deliveries**:
   - Construct a multi-part `EmailMessage` class comprising a body, from/to address fields, and title subjects.
   - Set up MIME type detection mechanisms to accurately encode PDF binary fragments.
   - Send emails reliably via Python's `smtplib`.
