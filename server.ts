import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dns from "dns";

// Types
import { 
  FeedbackItem, 
  FruitItem, 
  EmailMessage, 
  SystemMetrics, 
  BackendState 
} from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize the simulated databases
let feedbacks: FeedbackItem[] = [
  {
    id: 1,
    title: "Experienced salespeople",
    name: "Alex H.",
    date: "2020-02-02",
    feedback: "It was great to talk to the salespeople in the team, they understood my needs and were able to guide me in the right direction"
  }
];

let fruits: FruitItem[] = [];
let uploadedFiles: string[] = [];

// Mail Server simulations
let emails: EmailMessage[] = [
  {
    id: "welcome-student",
    from: "qwiklabs@example.com",
    to: "student@example.com",
    subject: "Welcome to Google Cloud IT Automation Virtual Lab",
    body: "Hello Student,\n\nWelcome to your sandbox workspace. In this environment, you will solve three key automated python scripting challenges. Feel free to use the terminal, edit python scripts, and interact with the mock databases, mail inbox, and Django REST APIs!\n\nBest regards,\nVirtual Qwiklabs Team",
    date: new Date().toLocaleDateString(),
    isRead: false
  }
];

// System Metrics for simulation
let systemMetrics: SystemMetrics = {
  cpuUsage: 12,
  diskFreePercent: 88,
  memoryAvailableMB: 1024,
  localhostResolves: true
};

// Ensure data folders exist for authentic file workspace simulation on container disk
const workspaceDir = process.cwd();
const dataFeedbackDir = path.join(workspaceDir, "data", "feedback");
const supplierDataDescDir = path.join(workspaceDir, "supplier-data", "descriptions");
const supplierDataImageDir = path.join(workspaceDir, "supplier-data", "images");

function ensureDirsExist() {
  [dataFeedbackDir, supplierDataDescDir, supplierDataImageDir].forEach(p => {
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
    }
  });

  // Write default feedback text files to mock student's feed directory
  const fb1 = path.join(dataFeedbackDir, "001.txt");
  if (!fs.existsSync(fb1)) {
    fs.writeFileSync(fb1, "Excellent feedback!\nAlice Smith\n2020-05-12\nThe team was super helpful helping me choose my pre-owned car. Great experience, highly recommend.");
  }
  const fb2 = path.join(dataFeedbackDir, "005.txt");
  if (!fs.existsSync(fb2)) {
    fs.writeFileSync(fb2, "Fast and friendly service\nBob Thompson\n2020-06-18\nGot a great deal on a hybrid RAV4. Salespeople were professional and respectful of my time.");
  }
  const fb3 = path.join(dataFeedbackDir, "007.txt");
  if (!fs.existsSync(fb3)) {
    fs.writeFileSync(fb3, "Good deal for a 2015 RAV4\nAnonymous reviewer\n2018-04-17\nCalled them to look for a second-hand RAV4 and they are very nice and patience to help me find me a few matches then scheduled an appointmet with me. Came in and they had everything ready for me. I was surprised how professional those sales are.");
  }

  // Write car sales JSON physically so Python code can read it or sandbox has it
  const salesFile = path.join(workspaceDir, "car_sales.json");
  if (!fs.existsSync(salesFile)) {
    const defaultSales = [
      { id: 1, car: { car_make: "Ford", car_model: "Club Wagon", car_year: 1997 }, price: "$5179.39", total_sales: 446 },
      { id: 2, car: { car_make: "Acura", car_model: "TL", car_year: 2005 }, price: "$14558.19", total_sales: 589 },
      { id: 3, car: { car_make: "Volkswagen", car_model: "Jetta", car_year: 2009 }, price: "$14879.11", total_sales: 825 },
      { id: 4, car: { car_make: "Chevrolet", car_model: "Uplander", car_year: 2006 }, price: "$17045.06", total_sales: 689 },
      { id: 5, car: { car_make: "Plymouth", car_model: "Roadrunner", car_year: 1969 }, price: "$14770.44", total_sales: 691 },
      { id: 6, car: { car_make: "GMC", car_model: "Safari", car_year: 2000 }, price: "$13390.83", total_sales: 531 },
      { id: 7, car: { car_make: "Lamborghini", car_model: "Murciélago", car_year: 2003 }, price: "$7267.94", total_sales: 374 },
      { id: 8, car: { car_make: "GMC", car_model: "3500", car_year: 1999 }, price: "$19292.10", total_sales: 638 },
      { id: 9, car: { car_make: "Maybach", car_model: "62", car_year: 2004 }, price: "$11020.45", total_sales: 945 },
      { id: 10, car: { car_make: "Chevrolet", car_model: "Cavalier", car_year: 2001 }, price: "$10708.87", total_sales: 870 }
    ];
    fs.writeFileSync(salesFile, JSON.stringify(defaultSales, null, 2));
  }

  // Write default fruit raw files to descriptions folder
  const fr1 = path.join(supplierDataDescDir, "001.txt");
  if (!fs.existsSync(fr1)) {
    fs.writeFileSync(fr1, "Apple\n500 lbs\nApples are nutritious. Apple juice is sweet and delicious.");
  }
  const fr2 = path.join(supplierDataDescDir, "003.txt");
  if (!fs.existsSync(fr2)) {
    fs.writeFileSync(fr2, "Avocado\n200 lbs\nRich in healthy fats, avocados are perfect for guacamole or on sourdough toast during breakfasts.");
  }
  const fr3 = path.join(supplierDataDescDir, "007.txt");
  if (!fs.existsSync(fr3)) {
    fs.writeFileSync(fr3, "Mango\n300 lbs\nMango contains higher levels of vitamin C than ordinary fruits. Eating mango can also reduce cholesterol and triglycerides, and help prevent cardiovascular disease.");
  }
}

ensureDirsExist();

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// REST api route for Qwiklab Lab 1 (Feedback Django endpoint)
app.get("/feedback", (req, res) => {
  res.json(feedbacks);
});

app.post("/feedback", (req, res) => {
  const { title, name, date, feedback } = req.body;
  if (!title || !name || !date || !feedback) {
    return res.status(400).json({ error: "Missing required fields (title, name, date, feedback)" });
  }

  const newItem: FeedbackItem = {
    id: feedbacks.length + 1,
    title,
    name,
    date,
    feedback
  };

  feedbacks.push(newItem);
  res.status(201).json(newItem);
});

// REST api route for Qwiklab Lab 3 (Fruit Store Django endpoints)
app.get("/fruits", (req, res) => {
  res.json(fruits);
});

app.post("/fruits", (req, res) => {
  const { name, weight, description, image_name } = req.body;
  if (!name || isNaN(Number(weight)) || !description) {
    return res.status(400).json({ error: "Missing/invalid fields. Require 'name', 'weight' (integer), 'description', 'image_name'" });
  }

  const newItem: FruitItem = {
    id: fruits.length + 1,
    name,
    weight: parseInt(weight, 10),
    description,
    image_name: image_name || "icon.sheet.png"
  };

  fruits.push(newItem);
  res.status(201).json(newItem);
});

// Qwiklab API route to clear databases for easy sandbox reset
app.post("/api/reset", (req, res) => {
  feedbacks = [
    {
      id: 1,
      title: "Experienced salespeople",
      name: "Alex H.",
      date: "2020-02-02",
      feedback: "It was great to talk to the salespeople in the team, they understood my needs and were able to guide me in the right direction"
    }
  ];
  fruits = [];
  uploadedFiles = [];
  emails = [
    {
      id: "welcome-student",
      from: "qwiklabs@example.com",
      to: "student@example.com",
      subject: "Welcome to Google Cloud IT Automation Virtual Lab",
      body: "Hello Student,\n\nWelcome to your sandbox workspace. In this environment, you will solve three key automated python scripting challenges. Feel free to use the terminal, edit python scripts, and interact with the mock databases, mail inbox, and Django REST APIs!\n\nBest regards,\nVirtual Qwiklabs Team",
      date: new Date().toLocaleDateString(),
      isRead: false
    }
  ];
  systemMetrics = {
    cpuUsage: 12,
    diskFreePercent: 88,
    memoryAvailableMB: 1024,
    localhostResolves: true
  };
  res.json({ success: true, message: "Sandbox databases cleared successfully!" });
});

// REST images upload endpoint (Simulates image server upload)
app.post("/upload", (req, res) => {
  // Simple simulation of uploading files
  // In our sandbox we accept generic name and push to uploaded files
  const filename = req.query.filename || "icon.sheet.png";
  const strName = String(filename);
  if (!uploadedFiles.includes(strName)) {
    uploadedFiles.push(strName);
  }
  res.status(200).json({ success: true, message: `Image ${strName} uploaded successfully` });
});

// Endpoint for files list inside upload center
app.get("/media/images", (req, res) => {
  res.json({ files: uploadedFiles });
});

// App Metrics update endpoint
app.post("/api/metrics", (req, res) => {
  const { cpuUsage, diskFreePercent, memoryAvailableMB, localhostResolves } = req.body;
  if (cpuUsage !== undefined) systemMetrics.cpuUsage = cpuUsage;
  if (diskFreePercent !== undefined) systemMetrics.diskFreePercent = diskFreePercent;
  if (memoryAvailableMB !== undefined) systemMetrics.memoryAvailableMB = memoryAvailableMB;
  if (localhostResolves !== undefined) systemMetrics.localhostResolves = localhostResolves;

  res.json(systemMetrics);
});

// Get consolidated sandbox state
app.get("/api/state", (req, res) => {
  res.json({
    feedbacks,
    fruits,
    uploadedFiles,
    emails,
    metrics: systemMetrics
  });
});

// File save endpoint so edits from CodeEditor persist in-memory or on disk
app.post("/api/save-file", (req, res) => {
  const { path: filePath, content } = req.body;
  if (!filePath) return res.status(400).json({ error: "Missing file path" });

  try {
    // Save locally to support any container runs as well to-disk
    const absolutePath = filePath.startsWith("/") ? filePath : path.join(workspaceDir, filePath);
    const parentDir = path.dirname(absolutePath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(absolutePath, content);
    res.json({ success: true, message: `Saved ${filePath} successfully` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Simulated Python runtime output builder for a realistic execution dashboard
app.post("/api/execute", (req, res) => {
  const { path: scriptPath, userCode } = req.body;
  if (!scriptPath) return res.status(400).json({ error: "No script specified to run" });

  const logs: string[] = [];
  let isSuccessful = true;

  // Let's analyze the script path and construct perfect outputs reflecting the lab goals!
  if (scriptPath.includes("run_feedback.py") || scriptPath.includes("run.py") && !scriptPath.includes("supplier-data")) {
    // Feedback loader simulation
    logs.push("$ python3 run.py");
    logs.push("Scanning '/data/feedback' directory...");
    logs.push("Found feedback files: 001.txt, 005.txt, 007.txt");

    // Process files on disk
    try {
      ensureDirsExist();
      const files = fs.readdirSync(dataFeedbackDir);
      let count = 0;
      files.forEach(file => {
        if (file.endsWith(".txt")) {
          const contents = fs.readFileSync(path.join(dataFeedbackDir, file), "utf8").split("\n");
          const title = contents[0]?.trim();
          const name = contents[1]?.trim();
          const date = contents[2]?.trim();
          const feedback = contents.slice(3).join("\n").trim();

          if (title && name && date && feedback) {
            // Check if already in feedbacks to avoid duplication
            const exists = feedbacks.some(f => f.feedback === feedback);
            if (!exists) {
              feedbacks.push({
                id: feedbacks.length + 1,
                title,
                name,
                date,
                feedback
              });
            }
            logs.push(`POST to http://localhost:3000/feedback success! Status: 201 Created for file: ${file}`);
            count++;
          }
        }
      });
      logs.push(`Execution completed successfully. Uploaded ${count} customer reviews.`);
    } catch (err: any) {
      isSuccessful = false;
      logs.push(`Error executing run.py: ${err.message}`);
    }

  } else if (scriptPath.includes("cars.py")) {
    logs.push("$ python3 scripts/cars.py");
    logs.push("Loading sales data from car_sales.json...");
    
    // Core Lab 2 simulation
    const salesFile = path.join(workspaceDir, "car_sales.json");
    if (!fs.existsSync(salesFile)) {
      isSuccessful = false;
      logs.push("Error: car_sales.json file not found.");
    } else {
      try {
        const salesData = JSON.parse(fs.readFileSync(salesFile, "utf8"));
        
        let maxRevenue = 0;
        let revCar = "";
        let maxSales = 0;
        let salesCar = "";
        const yearSales: Record<number, number> = {};

        salesData.forEach((item: any) => {
          const price = parseFloat(item.price.replace("$", ""));
          const revenue = item.total_sales * price;
          if (revenue > maxRevenue) {
            maxRevenue = revenue;
            revCar = `${item.car.car_make} ${item.car.car_model} (${item.car.car_year})`;
          }
          if (item.total_sales > maxSales) {
            maxSales = item.total_sales;
            salesCar = `${item.car.car_make} ${item.car.car_model} (${item.car.car_year})`;
          }
          const yr = item.car.car_year;
          yearSales[yr] = (yearSales[yr] || 0) + item.total_sales;
        });

        let popularYear = 1997;
        let popularYearSales = 0;
        Object.entries(yearSales).forEach(([yr, sls]) => {
          if (sls > popularYearSales) {
            popularYearSales = sls;
            popularYear = parseInt(yr, 10);
          }
        });

        const revString = `The ${revCar} had the most revenue: $${maxRevenue.toFixed(2)}`;
        const salesString = `The ${salesCar} had the most sales: ${maxSales}`;
        const yearString = `The most popular year was ${popularYear} with ${popularYearSales} sales.`;

        logs.push(revString);
        logs.push(salesString);
        logs.push(yearString);
        logs.push("Generating report layout on SimpleDocTemplate /tmp/cars.pdf...");
        logs.push("PDF Generation Success!");
        logs.push("Connecting to SMTP mail_server mock.localhost...");
        logs.push("Sending mail package containing report to recipient 'student@example.com' from 'automation@example.com'...");

        // Inject generated email message to user's webmail inbox
        const emailBody = `Hi\n\nI'm sending an attachment with last month's vehicle sales summary.\n\n${revString}\n${salesString}\n${yearString}`;
        
        emails.push({
          id: `sales-report-${Date.now()}`,
          from: "automation@example.com",
          to: "student@example.com",
          subject: "Sales summary for last month",
          body: emailBody,
          date: new Date().toLocaleDateString(),
          isRead: false,
          attachmentName: "cars.pdf",
          attachmentType: "pdf",
          attachmentData: {
            title: "Last Month's Sales Report",
            additional_info: `Automated summary statistics. Generated on ${new Date().toLocaleDateString()}`,
            summaryLines: [revString, salesString, yearString],
            tableData: salesData.map((item: any) => ({
              id: item.id,
              car: `${item.car.car_make} ${item.car.car_model} (${item.car.car_year})`,
              price: item.price,
              sales: item.total_sales
            }))
          }
        });

        logs.push("Email sent successfully!");
        logs.push("Done!");
      } catch (err: any) {
        isSuccessful = false;
        logs.push(`Error parsing cars data: ${err.message}`);
      }
    }

  } else if (scriptPath.includes("changeImage.py")) {
    logs.push("$ python3 changeImage.py");
    logs.push("Accessing supplier-data/images directory...");
    logs.push("Processing 001.tiff: converted to RGB, resized from 3000x2000 to 600x400, saved as 001.jpeg");
    logs.push("Processing 003.tiff: converted to RGB, resized from 3000x2000 to 600x400, saved as 003.jpeg");
    logs.push("Processing 007.tiff: converted to RGB, resized from 3000x2000 to 600x400, saved as 007.jpeg");
    logs.push("Image resizing specifications process completed!");

  } else if (scriptPath.includes("supplier_image_upload.py")) {
    logs.push("$ python3 supplier_image_upload.py");
    logs.push("Uploading processed files inside supplier-data/images directory...");
    
    // Add images to raw uploaded file store
    ["001.jpeg", "003.jpeg", "007.jpeg"].forEach(img => {
      if (!uploadedFiles.includes(img)) {
        uploadedFiles.push(img);
      }
      logs.push(`POST http://localhost/upload/ -> uploaded: ${img} success!`);
    });
    logs.push("Image catalog upload process completed.");

  } else if (scriptPath.includes("run_catalog.py")) {
    logs.push("$ python3 run.py");
    logs.push("Scanning descriptions directory supplier-data/descriptions...");
    
    try {
      ensureDirsExist();
      const files = ["001.txt", "003.txt", "007.txt"];
      let count = 0;

      files.forEach(file => {
        const filePath = path.join(supplierDataDescDir, file);
        if (fs.existsSync(filePath)) {
          const lines = fs.readFileSync(filePath, "utf8").split("\n");
          const name = lines[0]?.trim();
          const weightRaw = lines[1]?.trim() || ""; // E.g. "500 lbs"
          const description = lines.slice(2).join("\n").trim();
          
          // Strip " lbs" and convert to integer
          const weight = parseInt(weightRaw.replace(/[^0-9]/g, ""), 10) || 100;
          const image_name = file.replace(".txt", ".jpeg");

          if (name && description) {
            // Push to simulated database
            const exists = fruits.some(f => f.name === name);
            if (!exists) {
              fruits.push({
                id: fruits.length + 1,
                name,
                weight,
                description,
                image_name
              });
            }
            logs.push(`POST http://localhost/fruits -> created fruit: ${name} (${weight} lbs)`);
            count++;
          }
        }
      });
      logs.push(`Upload success! POSTed ${count} fruit models to Django REST API.`);
    } catch (err: any) {
      isSuccessful = false;
      logs.push(`Error executing: ${err.message}`);
    }

  } else if (scriptPath.includes("report_email.py")) {
    logs.push("$ python3 report_email.py");
    logs.push("Building temporary PDF file: /tmp/processed.pdf");
    logs.push("Success writing documents with layout flow!");
    logs.push("Connecting SMTP server at port 25...");
    logs.push("Transmitting automation catalog email to student@example.com from automation@example.com...");

    // Generate description rows for PDF attachment
    const pdfRows = fruits.map(f => `name: ${f.name}\nweight: ${f.weight} lbs\n`).join("\n");
    const emailBody = "All fruits are uploaded to our website successfully. A detailed list is attached to this email.";

    emails.push({
      id: `catalog-report-${Date.now()}`,
      from: "automation@example.com",
      to: "student@example.com",
      subject: "Upload Completed - Online Fruit Store",
      body: emailBody,
      date: new Date().toLocaleDateString(),
      isRead: false,
      attachmentName: "processed.pdf",
      attachmentType: "pdf",
      attachmentData: {
        title: `Processed Update on ${new Date().toLocaleDateString()}`,
        additional_info: "Supplier Fruit Load Summary Reports:",
        summaryLines: fruits.map(f => `name: ${f.name} | weight: ${f.weight} lbs\n${f.description}\n`),
        tableData: fruits.map(f => ({
          name: f.name,
          weight: `${f.weight} lbs`
        }))
      }
    });

    logs.push("Email sent successfully!");

  } else if (scriptPath.includes("health_check.py")) {
    logs.push("$ python3 health_check.py");
    logs.push("Initiating system diagnostics scan...");
    
    let issueCount = 0;
    // Check if cpu stress or alerts exist based on simulated state metrics
    if (systemMetrics.cpuUsage > 80) {
      logs.push("CRITICAL ALERT: CPU usage exceeds 80% threshold!");
      emails.push({
        id: `alert-cpu-${Date.now()}`,
        from: "automation@example.com",
        to: "student@example.com",
        subject: "Error - CPU usage is over 80%",
        body: "Please check your system and resolve the issue as soon as possible.",
        date: new Date().toLocaleDateString(),
        isRead: false
      });
      logs.push("Alert email dispatched: 'Error - CPU usage is over 80%'");
      issueCount++;
    }

    if (systemMetrics.diskFreePercent < 20) {
      logs.push("CRITICAL ALERT: Disk space below 20% threshold!");
      emails.push({
        id: `alert-disk-${Date.now()}`,
        from: "automation@example.com",
        to: "student@example.com",
        subject: "Error - Available disk space is less than 20%",
        body: "Please check your system and resolve the issue as soon as possible.",
        date: new Date().toLocaleDateString(),
        isRead: false
      });
      logs.push("Alert email dispatched: 'Error - Available disk space is less than 20%'");
      issueCount++;
    }

    if (systemMetrics.memoryAvailableMB < 100) {
      logs.push("CRITICAL ALERT: Memory available falls below 100MB!");
      emails.push({
        id: `alert-mem-${Date.now()}`,
        from: "automation@example.com",
        to: "student@example.com",
        subject: "Error - Available memory is less than 100MB",
        body: "Please check your system and resolve the issue as soon as possible.",
        date: new Date().toLocaleDateString(),
        isRead: false
      });
      logs.push("Alert email dispatched: 'Error - Available memory is less than 100MB'");
      issueCount++;
    }

    if (!systemMetrics.localhostResolves) {
      logs.push("CRITICAL ALERT: localhost does not resolve to 127.0.0.1!");
      emails.push({
        id: `alert-dns-${Date.now()}`,
        from: "automation@example.com",
        to: "student@example.com",
        subject: "Error - localhost cannot be resolved to 127.0.0.1",
        body: "Please check your system and resolve the issue as soon as possible.",
        date: new Date().toLocaleDateString(),
        isRead: false
      });
      logs.push("Alert email dispatched: 'Error - localhost cannot be resolved to 127.0.0.1'");
      issueCount++;
    }

    if (issueCount === 0) {
      logs.push("System diagnostics report: ALL METRICS STABLE [HEALTH OK]");
    } else {
      logs.push(`Dispatched ${issueCount} alert notification packages.`);
    }
  } else if (scriptPath.includes("test_website.py")) {
    logs.push("$ python3 test_website.py");
    logs.push("Parsing test case declarations inside test_website.py...");
    
    const isAutocompleteSolution = userCode && (userCode.includes("def test_20_") || userCode.includes("PASS: test_20_") || userCode.length > 2000);
    
    if (isAutocompleteSolution) {
      logs.push("Initiating 20 unit website automation test suite regression verification...\n");
      const tests = [
        "test_01_homepage_status_code (__main__.TestWebsiteAutomation) ... ok",
        "test_02_django_routes (__main__.TestWebsiteAutomation) ... ok",
        "test_03_mail_system_dns (__main__.TestWebsiteAutomation) ... ok",
        "test_04_feedback_get_payload (__main__.TestWebsiteAutomation) ... ok",
        "test_05_feedback_dictionary_keys (__main__.TestWebsiteAutomation) ... ok",
        "test_06_feedback_post_success (__main__.TestWebsiteAutomation) ... ok",
        "test_07_feedback_empty_rejection (__main__.TestWebsiteAutomation) ... ok",
        "test_08_fruitstore_main_path (__main__.TestWebsiteAutomation) ... ok",
        "test_09_fruitstore_item_structure (__main__.TestWebsiteAutomation) ... ok",
        "test_10_fruitstore_image_mimes (__main__.TestWebsiteAutomation) ... ok",
        "test_11_fruitstore_upload_media_post (__main__.TestWebsiteAutomation) ... ok",
        "test_12_smtp_mailbox_count (__main__.TestWebsiteAutomation) ... ok",
        "test_13_cars_sales_report_pdf (__main__.TestWebsiteAutomation) ... ok",
        "test_14_outbound_emails_subject (__main__.TestWebsiteAutomation) ... ok",
        "test_15_catalog_pdf_attachment_exist (__main__.TestWebsiteAutomation) ... ok",
        "test_16_localhost_resolves (__main__.TestWebsiteAutomation) ... ok",
        "test_17_cpu_stress_bounds (__main__.TestWebsiteAutomation) ... ok",
        "test_18_disk_space_bounds (__main__.TestWebsiteAutomation) ... ok",
        "test_19_memory_analyzer_alert (__main__.TestWebsiteAutomation) ... ok",
        "test_20_readme_portal_endpoint (__main__.TestWebsiteAutomation) ... ok"
      ];
      tests.forEach(t => logs.push(t));
      logs.push("\n----------------------------------------------------------------------");
      logs.push("Ran 20 automation tests in 0.448s");
      logs.push("\nOK");
    } else {
      logs.push("test_01_homepage_status_code (__main__.TestWebsiteAutomation) ... ok\n");
      logs.push("----------------------------------------------------------------------");
      logs.push("Ran 1 test in 0.015s");
      logs.push("\nOK");
      logs.push("\n💡 Tip: Complete all 20 units or click 'Autocomplete Solution' from code editor tabs to see a complete passing execution verifier!");
    }
  } else if (scriptPath.includes("test_api_endpoints.py")) {
    logs.push("$ pytest pytest-python-tests/test_api_endpoints.py");
    logs.push("============================= test session starts ==============================");
    logs.push("platform linux -- Python 3.10.12, pytest-7.4.3, pluggy-1.3.0");
    logs.push("rootdir: /workspace");
    logs.push("collected 3 items\n");
    
    const isAutocompleteSolution = userCode && (userCode.includes("def test_feedback_post_structure") || userCode.length > 500);
    if (isAutocompleteSolution) {
      logs.push("pytest-python-tests/test_api_endpoints.py . . .                          [100%]");
      logs.push("\n============================== 3 passed in 0.12s ===============================");
    } else {
      logs.push("pytest-python-tests/test_api_endpoints.py .                              [100%]");
      logs.push("\n============================== 1 passed in 0.04s ===============================");
      logs.push("\n💡 Tip: Complete the missing test assertions or click 'Autocomplete Solution' to see all 3 test specifications pass!");
    }
  } else if (scriptPath.includes("test_github.py")) {
    logs.push("$ pytest tests/test_github.py");
    logs.push("============================= test session starts ==============================");
    logs.push("platform linux -- Python 3.11.4, pytest-7.4.3, pluggy-1.3.0");
    logs.push("rootdir: /workspace, configfile: pytest.ini");
    logs.push("plugins: playwright-1.40.0, html-4.1.1");
    logs.push("collected 20 items\n");

    logs.push("tests/test_github.py::test_01_successful_login PASSED                    [  5%]");
    logs.push("tests/test_github.py::test_02_failed_login FAILED                        [ 10%]");
    logs.push("tests/test_github.py::test_03_password_reset_flow PASSED                 [ 15%]");
    logs.push("tests/test_github.py::test_04_profile_bio_update PASSED                  [ 20%]");
    logs.push("tests/test_github.py::test_05_repository_search PASSED                   [ 25%]");
    logs.push("tests/test_github.py::test_06_add_repo_to_stars PASSED                   [ 30%]");
    logs.push("tests/test_github.py::test_07_remove_repo_from_stars PASSED               [ 35%]");
    logs.push("tests/test_github.py::test_08_repository_creation_simulation PASSED      [ 40%]");
    logs.push("tests/test_github.py::test_09_infinite_scroll_explore PASSED             [ 45%]");
    logs.push("tests/test_github.py::test_10_repository_issues_form_validation FAILED    [ 50%]");
    logs.push("tests/test_github.py::test_11_profile_avatar_upload PASSED               [ 55%]");
    logs.push("tests/test_github.py::test_12_delete_repository_modal PASSED             [ 60%]");
    logs.push("tests/test_github.py::test_13_multi_tab_navigation PASSED                [ 65%]");
    logs.push("tests/test_github.py::test_14_api_network_mocking PASSED                 [ 70%]");
    logs.push("tests/test_github.py::test_15_release_asset_download_verification PASSED  [ 75%]");
    logs.push("tests/test_github.py::test_16_appearance_settings_toggle PASSED          [ 80%]");
    logs.push("tests/test_github.py::test_17_commit_pagination PASSED                   [ 85%]");
    logs.push("tests/test_github.py::test_18_pull_request_sorting PASSED                [ 90%]");
    logs.push("tests/test_github.py::test_19_file_tree_filtering PASSED                  [ 95%]");
    logs.push("tests/test_github.py::test_20_session_state_persistence PASSED           [100%]");

    logs.push("\n=================================== FAILURES ===================================");
    logs.push("___________________________ test_02_failed_login ___________________________");
    logs.push("github_page = <Page url='https://github.com/login'>");
    logs.push("\n    def test_02_failed_login(github_page):");
    logs.push(">       # expect(error_message).to_be_visible() timed out after 5000ms because the expected error element did not appear on the DOM.");
    logs.push("E       AssertionError: expect(error_message).to_be_visible() timed out after 5000ms because the expected error element did not appear on the DOM.");
    logs.push("\ntests/test_github.py:12: AssertionError");

    logs.push("\n__________________ test_10_repository_issues_form_validation ___________________");
    logs.push("github_page = <Page url='https://github.com/qa-test-user/sandbox-auto-test/issues/new'>");
    logs.push("\n    def test_10_repository_issues_form_validation(github_page):");
    logs.push(">       # AssertionError: Expected validation error 'Title cannot be blank' but instead received 'Field is required'.");
    logs.push("E       AssertionError: AssertionError: Expected validation error 'Title cannot be blank' but instead received 'Field is required'.");
    logs.push("\ntests/test_github.py:48: AssertionError\n");

    const dateStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    
    // Actually write genuine metadata summary JSON to disk representing custom hook execution
    const resultsDir = path.join(process.cwd(), "test-results");
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    const summaryData = [
      { test_name: "test_01_successful_login", outcome: "passed", duration: 0.18, failure_reason: "", timestamp: dateStr },
      { test_name: "test_02_failed_login", outcome: "failed", duration: 5.06, failure_reason: "expect(error_message).to_be_visible() timed out after 5000ms because the expected error element did not appear on the DOM.", timestamp: dateStr },
      { test_name: "test_03_password_reset_flow", outcome: "passed", duration: 0.11, failure_reason: "", timestamp: dateStr },
      { test_name: "test_04_profile_bio_update", outcome: "passed", duration: 0.15, failure_reason: "", timestamp: dateStr },
      { test_name: "test_05_repository_search", outcome: "passed", duration: 0.12, failure_reason: "", timestamp: dateStr },
      { test_name: "test_06_add_repo_to_stars", outcome: "passed", duration: 0.13, failure_reason: "", timestamp: dateStr },
      { test_name: "test_07_remove_repo_from_stars", outcome: "passed", duration: 0.14, failure_reason: "", timestamp: dateStr },
      { test_name: "test_08_repository_creation_simulation", outcome: "passed", duration: 0.15, failure_reason: "", timestamp: dateStr },
      { test_name: "test_09_infinite_scroll_explore", outcome: "passed", duration: 2.11, failure_reason: "", timestamp: dateStr },
      { test_name: "test_10_repository_issues_form_validation", outcome: "failed", duration: 0.12, failure_reason: "AssertionError: Expected validation error 'Title cannot be blank' but instead received 'Field is required'.", timestamp: dateStr },
      { test_name: "test_11_profile_avatar_upload", outcome: "passed", duration: 0.22, failure_reason: "", timestamp: dateStr },
      { test_name: "test_12_delete_repository_modal", outcome: "passed", duration: 0.16, failure_reason: "", timestamp: dateStr },
      { test_name: "test_13_multi_tab_navigation", outcome: "passed", duration: 0.31, failure_reason: "", timestamp: dateStr },
      { test_name: "test_14_api_network_mocking", outcome: "passed", duration: 0.18, failure_reason: "", timestamp: dateStr },
      { test_name: "test_15_release_asset_download_verification", outcome: "passed", duration: 0.44, failure_reason: "", timestamp: dateStr },
      { test_name: "test_16_appearance_settings_toggle", outcome: "passed", duration: 0.15, failure_reason: "", timestamp: dateStr },
      { test_name: "test_17_commit_pagination", outcome: "passed", duration: 0.33, failure_reason: "", timestamp: dateStr },
      { test_name: "test_18_pull_request_sorting", outcome: "passed", duration: 0.19, failure_reason: "", timestamp: dateStr },
      { test_name: "test_19_file_tree_filtering", outcome: "passed", duration: 0.21, failure_reason: "", timestamp: dateStr },
      { test_name: "test_20_session_state_persistence", outcome: "passed", duration: 0.17, failure_reason: "", timestamp: dateStr }
    ];
    fs.writeFileSync(path.join(resultsDir, "summary.json"), JSON.stringify(summaryData, null, 2), "utf-8");

    // Also write a beautiful simulated self-contained HTML report
    const htmlReportContent = `<!DOCTYPE html>
<html>
<head>
  <title>Playwright Automation Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; padding: 24px; background: #f8fafc; color: #1e293b; }
    h1 { font-size: 24px; font-weight: 800; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    .badge { padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge-pass { bg-color: rgb(240, 253, 244); background: #bbf7d0; color: #15803d; }
    .badge-fail { background: #fecaca; color: #b91c1c; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { padding: 12px 16px; text-align: left; font-size: 13px; }
    th { background: #f1f5f9; font-weight: 700; color: #475569; }
    tr { border-bottom: 1px solid #e2e8f0; }
    .err-msg { font-family: monospace; background: #fef2f2; color: #991b1b; padding: 8px; border-radius: 4px; font-size: 12px; border-left: 3px solid #f87171; margin-top: 6px; }
  </style>
</head>
<body>
  <h1>Playwright Test Automation Execution Report</h1>
  <p><strong>Generated At:</strong> ${dateStr} UTC</p>
  <p><strong>Summary:</strong> <span class="badge badge-pass">18 Passed</span> <span class="badge badge-fail">2 Failed</span> in 5.48 seconds</p>
  
  <table>
    <thead>
      <tr>
        <th>Test Identifier</th>
        <th>Duration</th>
        <th>Result Status</th>
        <th>Exception / Warning Detail</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>test_01_successful_login</td>
        <td>0.18s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_02_failed_login</td>
        <td>5.06s</td>
        <td><span class="badge badge-fail">Failed</span></td>
        <td><div class="err-msg">TimeoutError: expect(error_message).to_be_visible() timed out after 5000ms because the expected error element did not appear on the DOM.</div></td>
      </tr>
      <tr>
        <td>test_03_password_reset_flow</td>
        <td>0.11s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_04_profile_bio_update</td>
        <td>0.15s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_05_repository_search</td>
        <td>0.12s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_06_add_repo_to_stars</td>
        <td>0.13s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_07_remove_repo_from_stars</td>
        <td>0.14s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_08_repository_creation_simulation</td>
        <td>0.15s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_09_infinite_scroll_explore</td>
        <td>2.11s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_10_repository_issues_form_validation</td>
        <td>0.12s</td>
        <td><span class="badge badge-fail">Failed</span></td>
        <td><div class="err-msg">AssertionError: Expected validation error 'Title cannot be blank' but instead received 'Field is required'.</div></td>
      </tr>
      <tr>
        <td>test_11_profile_avatar_upload</td>
        <td>0.22s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_12_delete_repository_modal</td>
        <td>0.16s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_13_multi_tab_navigation</td>
        <td>0.31s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_14_api_network_mocking</td>
        <td>0.18s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_15_release_asset_download_verification</td>
        <td>0.44s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_16_appearance_settings_toggle</td>
        <td>0.15s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_17_commit_pagination</td>
        <td>0.33s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_18_pull_request_sorting</td>
        <td>0.19s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_19_file_tree_filtering</td>
        <td>0.21s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
      <tr>
        <td>test_20_session_state_persistence</td>
        <td>0.17s</td>
        <td><span class="badge badge-pass">Passed</span></td>
        <td>--</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`;
    fs.writeFileSync(path.join(resultsDir, "report.html"), htmlReportContent, "utf-8");

    logs.push("- Generated custom HTML report at: test-results/report.html");
    logs.push("- Saved JSON execution summary: test-results/summary.json [PASSED: 18, FAILED: 2]");
    logs.push("\n======================== 2 failed, 18 passed in 5.48s ==========================");
  } else if (scriptPath.includes("test_playwright_suite.py")) {
    logs.push("$ pytest pytest-python-tests/test_playwright_suite.py --playwright");
    logs.push("============================= test session starts ==============================");
    logs.push("platform linux -- Python 3.10.12, pytest-7.4.3, playwright-1.40.0");
    logs.push("rootdir: /workspace");
    logs.push("collected 1 item\n");
    
    logs.push("playwright-python-tests/test_playwright_suite.py .                       [100%]");
    logs.push("----------------------------- Captured stdout call -----------------------------");
    logs.push("Launching Playwright headless webkit container...");
    logs.push("Verified website title layout.");
    logs.push("Documentation portal modal popup open verified!");
    
    logs.push("\n============================== 1 passed in 1.42s ===============================");
  } else if (scriptPath.includes("conftest.py") || scriptPath.includes("base_page.py") || scriptPath.includes("home_page.py") || scriptPath.includes("login_page.py") || scriptPath.includes("issues_page.py") || scriptPath.includes("pytest.ini") || scriptPath.includes("requirements.txt") || scriptPath.includes("email_page.py")) {
    logs.push(`$ python3 ${scriptPath}`);
    logs.push(`Import context check successful. '${scriptPath}' contains valid definitions with no compilation formatting issues.`);
    logs.push("Process finished with exit status 0");
  }

  res.json({ logs, isSuccessful });
});

// Gemini Lab Coach API integrating server-side @google/genai as required
app.post("/api/gemini/coach", async (req, res) => {
  const { prompt, currentFile, code } = req.body;
  if (!prompt) return res.status(400).json({ error: "Empty prompt" });

  if (!ai) {
    return res.json({
      text: "👋 I'm your **Google IT Automation Lab Assistant**!\n\nTo enable my real-time AI capabilities for reviewing your Python code, offering Qwiklab solution guides, and explaining errors, please configure your `GEMINI_API_KEY` in the project settings.\n\nIn the meantime, I can offer pre-cached lab advice! Be sure to double-check that you are parsing the lines correctly, converting numbers using `int()`, stripping unnecessary units like `' lbs'`, and formatting string structures correctly!"
    });
  }

  try {
    const fullPrompt = `You are an expert Qwiklabs Python Instuctor. Assist the student who is learning how to automate real-world tasks in Python.
Current active file the student is inspecting: ${currentFile || "General Lab Instructions"}
Student's draft code for reference (if any):
\`\`\`python
${code || "# No code draft currently edited"}
\`\`\`

User question:
${prompt}

Provide a concise, extremely helpful, educational response. Offer smart code snippets or pseudocode where needed, and explain exactly which steps are needed to satisfy Google's grading key for the "Automating Real-world tasks with Python" Coursera capstone. Avoid dry jargon and be highly supportive. Return markdown text directly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
    });

    res.json({ text: response.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/readme", (req, res) => {
  try {
    const readmePath = path.join(process.cwd(), "README.md");
    const fbPath = path.join(process.cwd(), "requirements-feedback.md");
    const carPath = path.join(process.cwd(), "requirements-cars.md");
    const catPath = path.join(process.cwd(), "requirements-catalog.md");

    const readmeContent = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf-8") : "README file not found.";
    const feedbackContent = fs.existsSync(fbPath) ? fs.readFileSync(fbPath, "utf-8") : "";
    const carsContent = fs.existsSync(carPath) ? fs.readFileSync(carPath, "utf-8") : "";
    const catalogContent = fs.existsSync(catPath) ? fs.readFileSync(catPath, "utf-8") : "";

    res.json({
      readme: readmeContent,
      feedbackRequirements: feedbackContent,
      carsRequirements: carsContent,
      catalogRequirements: catalogContent
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend assets (Vite dev server)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express dev server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
