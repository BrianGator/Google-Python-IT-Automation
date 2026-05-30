# Project 3: Automated Supplier Catalog Photography Assets & Diagnostics
### Google Automating Real-World Tasks with Python
**Written by Brian McCarthy**

## Overview
This project requires scaling inventory ingestion loops, compressing heavy source photography TIFFs, registering catalogs, mailing completion confirmations, and continuously polling OS diagnostics.

## Functional Requirements
1. **Pillow Graphics Manipulation**:
   - Access heavy raw `.tiff` photography assets under `supplier-data/images/`.
   - Iterate files, and verify that they are saved inside JPEG files.
   - Resize layouts down from 3000x2000 code grids to 600x400 standard sizes.
   - Convert RGBA four-channel arrays into standard RGB three-channel models to drop unnecessary transparency alpha layers during compression.

2. **Web Services Catalog Registration**:
   - Parse text documents from `supplier-data/descriptions/`.
   - Read line structures to identify: Product name, Weight, Description.
   - Strip suffix qualifiers like `' lbs'` from weight lines and cast numeric sequences to standard integers.
   - POST the mapped details with their associated compressed JPEG filename to the fruits service endpoint.

3. **Active Health Diagnostics Dials**:
   - Set up background monitoring check loops running on the server.
   - Safeguard system stress limits:
     * CPU usage exceeds 80% threshold.
     * Disk free space drops below 20%.
     * Available RAM falls below 100MB.
     * Localhost fails to resolve to standard loopback IP `127.0.0.1`.
   - Dispatch emergency notification templates if any stress flags are triggered.
