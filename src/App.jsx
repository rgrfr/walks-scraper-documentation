import React, { useState } from 'react';

// Placeholder for lucide-react icons if not available in this environment
const ChevronDown = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const ChevronRight = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const CopyIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v2"/>
  </svg>
);

// Reusable Copy Button Component
const CopyButton = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers or environments where execCommand is restricted
      alert('Failed to copy. Please copy manually: ' + textToCopy);
    }
    document.body.removeChild(textarea);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
      <CopyIcon />
    </button>
  );
};

// Reusable Section Component
const DocSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-orange-200 rounded-lg mb-4 bg-white shadow-sm">
      <button
        className="flex justify-between items-center w-full p-4 text-lg font-semibold text-orange-800 bg-orange-100 hover:bg-orange-200 rounded-t-lg focus:outline-none transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronDown className="text-orange-700" /> : <ChevronRight className="text-orange-700" />}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-orange-200 text-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

// Reusable CodeBlock Component
const CodeBlock = ({ language, children, title = "Code Snippet" }) => (
  <div className="bg-gray-800 text-white rounded-md overflow-hidden mb-4">
    <div className="bg-gray-700 px-4 py-2 text-sm font-mono flex justify-between items-center">
      <span>{title}</span>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-xs">{language}</span>
        <CopyButton textToCopy={children} />
      </div>
    </div>
    <pre className="p-4 text-sm overflow-x-auto">
      <code className={`language-${language}`}>
        {children}
      </code>
    </pre>
  </div>
);

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-8">
          Hikers Walks Scraper & API Project Documentation
        </h1>

        <DocSection title="Project Overview" defaultOpen={true}>
          <p className="mb-4">
            This project automates the process of scraping Hikers group walk data from their website, storing it in a MySQL database, and making it accessible via a PHP API for a frontend application. It ensures data is kept up-to-date and avoids duplication.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Components:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Python Scraper (Dockerized):</strong> Fetches walk data from Hikers website.</li>
            <li><strong>PHP API (Ionos Webspace):</strong> Acts as a secure intermediary between the scraper/frontend and the MySQL database.</li>
            <li><strong>MySQL Database (Ionos):</strong> Stores the scraped walk information.</li>
            <li><strong>Cron Job:</strong> Schedules daily execution of the scraper.</li>
            <li><strong>Frontend Application:</strong> Consumes the PHP API to display walk data (developed by LOVABLE.dev).</li>
          </ul>
        </DocSection>

        <DocSection title="1. MySQL Database Setup">
          <p className="mb-2">
            The project uses a MySQL database on your Ionos hosting. You need to ensure the database exists and the necessary tables are created.
          </p>
          <h4 className="font-semibold text-gray-700 mb-1">Database Credentials:</h4>
          <p className="mb-2">
            Your database credentials (host, user, password, database name) are crucial. These are used by both the PHP API and the Python scraper.
          </p>
          <h4 className="font-semibold text-gray-700 mb-1">`walks` Table Schema:</h4>
          <p className="mb-2">
            This table stores the main walk data. It uses <code>id</code> (a unique hash) as the primary key to prevent duplicates.
          </p>
          <CodeBlock language="sql" title="SQL: Create 'walks' Table">
            {`CREATE TABLE IF NOT EXISTS walks (
    id VARCHAR(255) PRIMARY KEY,
    group_name VARCHAR(255),
    title TEXT,
    difficulty VARCHAR(50),
    distance VARCHAR(50),
    walk_date DATETIME,
    location TEXT,
    details_url TEXT,
    description TEXT,
    last_scraped DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`}
          </CodeBlock>
          <h4 className="font-semibold text-gray-700 mb-1">`scraper_status` Table Schema:</h4>
          <p className="mb-2">
            This table tracks the last successful run of the scraper, providing a timestamp for the frontend.
          </p>
          <CodeBlock language="sql" title="SQL: Create 'scraper_status' Table">
            {`CREATE TABLE IF NOT EXISTS scraper_status (
    id INT PRIMARY KEY DEFAULT 1,
    last_successful_run DATETIME NOT NULL,
    last_run_status VARCHAR(50) NOT NULL,
    last_error_message TEXT
);`}
          </CodeBlock>
          <p className="mt-2">
            <strong>Action:</strong> Run these SQL queries in your phpMyAdmin's SQL tab.
          </p>
        </DocSection>

        <DocSection title="2. PHP API Files (on Ionos Webspace)">
          <p className="mb-2">
            These PHP scripts act as the secure interface to your database. They should be uploaded to a directory like <code>example.com/api/</code> on your Ionos webspace.
          </p>
          <h4 className="font-semibold text-gray-700 mb-1">Secure Database Credentials (`db_config.php`):</h4>
          <p className="mb-2">
            To prevent exposing sensitive database credentials, they are stored in a separate PHP file (`db_config.php`) and protected by a <code>.htaccess</code> rule.
          </p>
          <h5 className="font-semibold text-gray-600 mb-1">`db_config.php` content:</h5>
          <p className="mb-2 text-sm">
            Create this file in your <code>/api/</code> directory (e.g., <code>/kunden/homepages/38/d84954935/htdocs/roger/api/db_config.php</code>).
          </p>
          <CodeBlock language="php" title="db_config.php">
            {`<?php
// db_config.php
// This file contains sensitive database credentials.
// It is located in a web-accessible directory but is protected by a .htaccess file.
// It is included by PHP scripts that need to connect to the database.

define('DB_SERVER', 'your_db_host_example.com'); // e.g., db12345678.hosting-data.io
define('DB_USERNAME', 'your_db_user_example'); // e.g., dbu1234567
define('DB_PASSWORD', 'your_db_password_example'); // Your actual database password
define('DB_NAME', 'your_db_name_example'); // e.g., dbs12345678
?>`}
          </CodeBlock>
          <h5 className="font-semibold text-gray-600 mb-1">`.htaccess` in `/api/` to protect `db_config.php`:</h5>
          <p className="mb-2 text-sm">
            Create or edit <code>.htaccess</code> in the same <code>/api/</code> directory.
          </p>
          <CodeBlock language="apache" title=".htaccess">
            {`# .htaccess in /example.com/api/

# Deny direct access to the database configuration file
<Files db_config.php>
    Require all denied
</Files>`}
          </CodeBlock>
          <p className="mt-2">
            <strong>Action:</strong> Create `db_config.php` and `.htaccess` in your `/api/` directory. **Replace placeholders with your actual database credentials and path.**
          </p>

          <h4 className="font-semibold text-gray-700 mt-4 mb-1">`insert_walks.php`:</h4>
          <p className="mb-2">
            Receives JSON data (walks) from the Python scraper via a POST request and inserts/updates them in the `walks` table. It also updates the `scraper_status` table.
          </p>
          <CodeBlock language="php" title="insert_walks.php">
            {`<?php
// insert_walks.php
// This script receives JSON data via POST request and inserts it into a MySQL database.
// Designed to run on Ionos hosting to bypass external firewall restrictions.
// Version 2.2: Fixed "mysqli object is already closed" error by removing redundant finally block.

// Include secure database credentials
require_once '/absolute/path/to/your/api/db_config.php'; // IMPORTANT: Replace with your actual absolute path

// Set content type to JSON for responses
header('Content-Type: application/json');

// Allow requests from any origin (CORS) - adjust for production if needed for security
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request (for CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Function to sanitize input (basic example) ---
function sanitize($conn, $data) {
    // Ensure $conn is a valid mysqli object before using it
    if ($conn instanceof mysqli) {
        return mysqli_real_escape_string($conn, $data);
    }
    // Fallback if connection is not available (e.g., during connection error)
    return str_replace(["\\\\", "'", "\"", "\\0"], ["\\\\\\\\", "\\'", "\\\"", "\\0"], $data);
}

// --- Function to update scraper_status table ---
function updateScraperStatus($conn, $status, $errorMessage = null) {
    // Only attempt to update if the connection is valid and alive
    if ($conn instanceof mysqli && $conn->ping()) {
        $stmt = $conn->prepare("
            INSERT INTO scraper_status (id, last_successful_run, last_run_status, last_error_message)
            VALUES (1, NOW(), ?, ?)
            ON DUPLICATE KEY UPDATE
                last_successful_run = NOW(),
                last_run_status = VALUES(last_run_status),
                last_error_message = VALUES(last_error_message);
        ");
        if ($stmt) {
            $stmt->bind_param("ss", $status, $errorMessage);
            $stmt->execute();
            $stmt->close();
        } else {
            error_log("Failed to prepare scraper_status update statement: " . $conn->error);
        }
    } else {
        error_log("Cannot update scraper_status: Database connection is not valid or alive.");
    }
}

// --- Main Logic ---
$response = ['status' => 'error', 'message' => 'An unknown error occurred.'];
$conn = null; // Initialize connection to null

try {
    // Create database connection using constants from db_config.php
    $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

    // Check connection
    if ($conn->connect_error) {
        // If connection fails, we can't update scraper_status in DB, so just log
        error_log("Database connection failed in insert_walks.php: " . $conn->connect_error);
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Get the raw POST data
    $json_data = file_get_contents('php://input');
    
    // Decode the JSON data
    $walks = json_decode($json_data, true); // true to get associative array

    // Check if JSON decoding was successful and if it's an array
    if (json_last_error() !== JSON_ERROR_NONE) {
        $errorMessage = "Invalid JSON received: " . json_last_error_msg();
        error_log($errorMessage);
        updateScraperStatus($conn, 'failure', $errorMessage); // Update status before throwing
        throw new Exception($errorMessage);
    }
    if (!is_array($walks)) {
        $errorMessage = "Expected an array of walks, but received something else.";
        error_log($errorMessage);
        updateScraperStatus($conn, 'failure', $errorMessage); // Update status before throwing
        throw new Exception($errorMessage);
    }

    // Prepare SQL statement for insertion/update (UPSERT)
    $stmt = $conn->prepare("
        INSERT INTO walks (id, group_name, title, difficulty, distance, walk_date, location, details_url, description, last_scraped)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
            group_name = VALUES(group_name),
            title = VALUES(title),
            difficulty = VALUES(difficulty),
            distance = VALUES(distance),
            walk_date = VALUES(walk_date),
            location = VALUES(location),
            details_url = VALUES(details_url),
            description = VALUES(description),
            last_scraped = NOW();
    ");

    if (!$stmt) {
        $errorMessage = "Failed to prepare walk insertion statement: " . $conn->error;
        error_log($errorMessage);
        updateScraperStatus($conn, 'failure', $errorMessage); // Update status before throwing
        throw new Exception($errorMessage);
    }

    $stmt->bind_param("sssssssss", $id, $group_name, $title, $difficulty, $distance, $walk_date, $location, $details_url, $description);

    $inserted_count = 0;
    foreach ($walks as $walk) {
        $id = sanitize($conn, $walk['id']);
        $group_name = sanitize($conn, $walk['group_name']);
        $title = sanitize($conn, $walk['title']);
        $difficulty = sanitize($conn, $walk['difficulty']);
        $distance = sanitize($conn, $walk['distance']);
        $walk_date = $walk['walk_date']; // walk_date is already ISO string from Python
        $location = sanitize($conn, $walk['location']);
        $details_url = sanitize($conn, $walk['details_url']);
        $description = sanitize($conn, $walk['description']);

        if ($stmt->execute()) {
            $inserted_count++;
        } else {
            error_log("Failed to insert walk: " . $stmt->error);
        }
    }

    $stmt->close();
    
    // Update scraper_status as success
    updateScraperStatus($conn, 'success');

    $response['status'] = 'success';
    $response['message'] = "Successfully processed {$inserted_count} walks.";
    http_response_code(200);

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code(500); // Internal Server Error
    // If connection was established, update status as failure
    if ($conn && $conn->ping()) {
        updateScraperStatus($conn, 'failure', $e->getMessage());
    }
} finally {
    // Ensure connection is closed if it's still open
    if ($conn && $conn->ping()) {
        $conn->close();
    }
}

echo json_encode($response);
?>`}
          </CodeBlock>
          <h4 className="font-semibold text-gray-700 mt-4 mb-1">`get_walks.php`:</h4>
          <p className="mb-2">
            Fetches walk data from the `walks` table and the `last_successful_run` from `scraper_status`, returning them as JSON for the frontend.
          </p>
          <CodeBlock language="php" title="get_walks.php">
            {`<?php
// get_walks.php
// This script fetches walk data from a MySQL database and returns it as JSON.
// Designed to run on Ionos hosting to serve data to the React frontend.
// Version 2.2: Ensures 'lastScrapeTime' is formatted as UTC ISO 8601 string with 'Z'.

// Include secure database credentials
require_once '/absolute/path/to/your/api/db_config.php'; // IMPORTANT: Replace with your actual absolute path

// Set content type to JSON for responses
header('Content-Type: application/json');

// Allow requests from any origin (CORS)
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request (for CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Main Logic ---
$response = ['status' => 'error', 'message' => 'An unknown error occurred.', 'data' => [], 'lastScrapeTime' => null];
$conn = null; // Initialize connection to null

try {
    // Create database connection using constants from db_config.php
    $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Fetch walks, ordered by walk_date
    $sql_walks = "SELECT id, group_name, title, difficulty, distance, walk_date, location, details_url, description FROM walks ORDER BY walk_date ASC";
    $result_walks = $conn->query($sql_walks);

    if (!$result_walks) {
        throw new Exception("Error fetching walks: " . $conn->error);
    }

    $walks = [];
    while ($row = $result_walks->fetch_assoc()) {
        $walks[] = $row;
    }
    $response['data'] = $walks;

    // Fetch last successful scrape time
    $sql_status = "SELECT last_successful_run FROM scraper_status WHERE id = 1 AND last_run_status = 'success'";
    $result_status = $conn->query($sql_status);
    if ($result_status && $result_status->num_rows > 0) {
        $status_row = $result_status->fetch_assoc();
        // Format the timestamp as ISO 8601 with 'Z' (UTC indicator)
        $dt = DateTime::createFromFormat('Y-m-d H:i:s', $status_row['last_successful_run'], new DateTimeZone('UTC'));
        if ($dt) {
            $response['lastScrapeTime'] = $dt->format(DateTime::ATOM); // Outputs ISO 8601 with Z
        } else {
            // Fallback if parsing fails, send original string or null
            $response['lastScrapeTime'] = $status_row['last_successful_run'];
            error_log("Failed to parse last_successful_run for UTC formatting: " . $status_row['last_successful_run']);
        }
    }

    // Close the connection after all database operations are complete
    $conn->close();

    $response['status'] = 'success';
    $response['message'] = "Successfully fetched " . count($walks) . " walks.";
    http_response_code(200);

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code(500); // Internal Server Error
    error_log("get_walks.php: Caught Exception: " . $e->getMessage());
    // If an error occurred before connection was closed, ensure it's closed now
    if ($conn && $conn->ping()) { // Only try to close if connection is still alive
        $conn->close();
    }
}

echo json_encode($response);
?>`}
          </CodeBlock>
          <p className="mt-2">
            <strong>File Permissions:</strong> Ensure PHP files (`.php`) have `644` permissions and directories (`/api/`) have `755`.
          </p>
        </DocSection>

        <DocSection title="3. Python Scraper (Docker Environment)">
          <p className="mb-2">
            The Python scraper runs in a Docker container, making it portable and isolated.
          </p>
          <h4 className="font-semibold text-gray-700 mb-1">`Dockerfile`:</h4>
          <p className="mb-2">
            Defines the environment for the scraper, including Python, Playwright, and necessary libraries.
          </p>
          <CodeBlock language="dockerfile" title="Dockerfile">
            {`FROM python:3.9-slim-buster
WORKDIR /app
# Install system dependencies for Playwright and other tools
RUN apt-get update && apt-get install -y --no-install-recommends \\
    libnss3 \\
    libatk-bridge2.0-0 \\
    libxkbcommon-x11-0 \\
    libgbm-dev \\
    libasound2 \\
    libgconf-2-4 \\
    libwoff1 \\
    libwebp6 \\
    libwebpdemux2 \\
    libenchant1c2a \\
    libgdk-pixbuf2.0-0 \\
    libgl1-mesa-glx \\
    libharfbuzz0b \\
    libicu-dev \\
    libjpeg-turbo8 \\
    libnotify4 \\
    libpangocairo-1.0-0 \\
    libpng16-16 \\
    libsecret-1-0 \\
    libvpx6 \\
    libxcomposite1 \\
    libxcursor1 \\
    libxdamage1 \\
    libxext6 \\
    libxfixes3 \\
    libxi6 \\
    libxrandr2 \\
    libxrender1 \\
    libxss1 \\
    libxtst6 \\
    ca-certificates \\
    fonts-liberation \\
    xdg-utils \\
    --no-install-recommends && \\
    rm -rf /var/lib/apt/lists/*

# Copy Python requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Install requests library specifically for HTTP calls
RUN pip install requests
# Install Playwright browsers
RUN playwright install chromium

# Copy the scraper script into the container
COPY scraper.py .

# Command to run the scraper
CMD ["python", "scraper.py"]`}
          </CodeBlock>
          <h4 className="font-semibold text-gray-700 mb-1">`requirements.txt`:</h4>
          <p className="mb-2">
            Lists Python dependencies.
          </p>
          <CodeBlock language="text" title="requirements.txt">
            {`playwright==1.44.0
beautifulsoup4==4.12.3`}
          </CodeBlock>
          <h4 className="font-semibold text-gray-700 mb-1">`scraper.py`:</h4>
          <p className="mb-2">
            Scrapes multiple Hikers URLs, extracts walk details, generates unique IDs, and sends them as JSON to `insert_walks.php`.
          </p>
          <CodeBlock language="python" title="scraper.py">
            {`import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import json
import hashlib
import re
import requests
import os

# --- Configuration ---
# Hikers search URLs to scrape (ALL will be used)
# Format: "Group Name", Group Code
# Royston Group, HF05
# Cambridge Group, CB01
# East Hertfordshire Group, HF02
# North Hertfordshire Group, HF03
# Walk Cambridge Group, CB02
# Staines Hikers, SK03
# Inner London Hikers, ES15
# Sudbury Hikers, BF04
RAMBLERS_URLS = [ # Keep this variable name as is
    "https://www.ramblers.org.uk/go-walking/search?longitude=0.06618170925826858&latitude=52.114138674671715&type=group-walk&distance=40&sort=date&groups=HF05&walk_length=0,998.9",
    "https://www.ramblers.org.uk/go-walking/search?longitude=0.06618170925826858&latitude=52.114138674671715&type=group-walk&distance=40&sort=date&groups=CB01&walk_length=0,998.9",
    "https://www.ramblers.org.uk/go-walking/search?longitude=0.06618170925826858&latitude=52.114138674671715&type=group-walk&distance=40&sort=date&groups=HF02&walk_length=0,998.9",
    "https://www.ramblers.org.uk/go-walking/search?longitude=0.06618170925826858&latitude=52.114138674671715&type=group-walk&distance=40&sort=date&groups=HF03&walk_length=0,998.9",
    "https://www.ramblers.org.uk/go-walking/search?longitude=0.06618170925826858&latitude=52.114138674671715&type=group-walk&distance=40&sort=date&groups=CB02&walk_length=0,998.9",
    "https://www.ramblers.org.uk/go-walking/search?longitude=0.06618170925826858&latitude=52.114138674671715&type=group-walk&distance=40&sort=date&groups=SK03&walk_length=0,998.9",
    "https://www.ramblers.org.uk/go-walking/search?longitude=0.06618170925826858&latitude=52.114138674671715&type=group-walk&distance=40&sort=date&groups=ES15&walk_length=0,998.9",
    "https://www.ramblers.org.uk/go-walking/search?longitude=0.06618170925826858&latitude=52.114138674671715&type=group-walk&distance=40&sort=date&groups=BF04&walk_length=0,998.9",
]

# Max number of "Load more walks" clicks
MAX_LOAD_MORE_CLICKS = 5

# PHP API Endpoint URL (*** IMPORTANT: REPLACE WITH YOUR ACTUAL IONOS PHP SCRIPT URL ***)
PHP_API_ENDPOINT = os.getenv("PHP_API_ENDPOINT", "https://example.com/api/insert_walks.php")

# Helper function to extract data from <dt><dd> pairs
def get_dl_value(item_soup, dt_text_to_find):
    dt_tag = None
    for tag in item_soup.find_all('dt'):
        if hasattr(tag, 'get_text') and tag.get_text(strip=True) == dt_text_to_find:
            dt_tag = tag
            break
    
    if dt_tag:
        dd_tag = dt_tag.find_next_sibling('dd')
        if dd_tag and hasattr(dd_tag, 'get_text'):
            return dd_tag.get_text(strip=True)
    return "N/A"

# --- Web Scraping Function ---
async def scrape_walks_from_url(page_url: str):
    walks_data = []
    print(f"--- Starting Scraping: {page_url} ---")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            await page.goto(page_url, wait_until="networkidle")
            print(f"Waiting for {page_url} content to settle (7s)...")
            await page.wait_for_timeout(7000) 

            clicks = 0
            while clicks < MAX_LOAD_MORE_CLICKS:
                load_more_button = await page.query_selector("button.button-load-more-results, button.btn-load-more, button[data-v-513ed93a].btn.btn-outline-primary")
                if load_more_button and await load_more_button.is_visible():
                    print("Clicking 'Load more walks'...")
                    await load_more_button.click()
                    print("Waiting for new content to load (4s)...")
                    await page.wait_for_timeout(4000)
                    clicks += 1
                else:
                    print("No 'Load more walks' button found or visible.")
                    break

            content = await page.content()
            soup = BeautifulSoup(content, 'html.parser')

            walk_items = soup.find_all('div', class_='search-results-card')

            if not walk_items:
                print(f"No walk listings found on {page_url}.")
                return []
            else:
                print(f"Found {len(walk_items)} potential walk items on {page_url}.")


            for i, item in enumerate(walk_items):
                try:
                    group_name = get_dl_value(item, "Group:")

                    title = "No Title"
                    details_url = "No URL"
                    title_link_tag = item.select_one('h2.h4 > a') 
                    if title_link_tag:
                        title_span = title_link_tag.select_one('span.rams-text-decoration-pink')
                        if title_span and hasattr(title_span, 'get_text'):
                            title = title_span.get_text(strip=True)
                        elif hasattr(title_link_tag, 'get_text'):
                            title = title_link_tag.get_text(strip=True) 
                        
                        if 'href' in title_link_tag.attrs:
                            details_url = "https://www.ramblers.org.uk" + title_link_tag['href']

                    difficulty = get_dl_value(item, "Difficulty:")
                    distance = get_dl_value(item, "Distance:")

                    walk_date = None
                    date_time_tag = item.select_one('p.text-left time')
                    if date_time_tag and 'datetime' in date_time_tag.attrs:
                        datetime_attr = date_time_tag['datetime']
                        try:
                            walk_date = datetime.fromisoformat(datetime_attr)
                        except ValueError:
                            if hasattr(date_time_tag, 'get_text'):
                                date_time_text = date_time_tag.get_text(strip=True) 
                                date_part_match = re.search(r'(\d{1,2} \\w+ \\d{4})(?: (\\d{1,2}:\\d{2}(?: (?:am|pm))?))?', date_time_text, re.IGNORECASE)
                                if date_part_match:
                                    date_str = date_part_match.group(1)
                                    time_str = date_part_match.group(2)
                                    if time_str:
                                        try:
                                            walk_date = datetime.strptime(f"{date_str} {time_str}", '%d %B %Y %I:%M %p')
                                        except ValueError:
                                            walk_date = datetime.strptime(f"{date_str} {time_str}", '%d %B %Y %H:%M')
                                    else:
                                        walk_date = datetime.strptime(date_str, '%d %B %Y')
                                        walk_date = walk_date.replace(hour=0, minute=0, second=0)
                    elif date_time_tag and hasattr(date_time_tag, 'get_text'):
                        date_time_text = date_time_tag.get_text(strip=True)
                        date_part_match = re.search(r'(\\d{1,2} \\w+ \\d{4})(?: (\\d{1,2}:\\d{2}(?: (?:am|pm))?))?', date_time_text, re.IGNORECASE)
                        if date_part_match:
                            date_str = date_part_match.group(1)
                            time_str = date_part_match.group(2)
                            if time_str:
                                try:
                                    walk_date = datetime.strptime(f"{date_str} {time_str}", '%d %B %Y %I:%M %p')
                                except ValueError:
                                    walk_date = datetime.strptime(f"{date_str} {time_str}", '%d %B %Y %H:%M')
                            else:
                                walk_date = datetime.strptime(date_str, '%d %B %Y')
                                walk_date = walk_date.replace(hour=0, minute=0, second=0)

                    location = "No Location"
                    location_p_tag = item.select_one('div.row > div.col-12.mb-2.col > p.text-left.mb-1')
                    if location_p_tag and hasattr(location_p_tag, 'get_text'):
                        full_text_content = location_p_tag.get_text(separator=' ', strip=True) 
                        temp_location = full_text_content.replace('Start:', '').strip()
                        temp_location = re.sub(r'(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\\s+\\d{1,2}\\s+\\w+\\s+\\d{4}', '', temp_location, flags=re.IGNORECASE).strip()
                        temp_location = re.sub(r'\\d{1,2}:\\d{2}\\s*(?:am|pm)?', '', temp_location, flags=re.IGNORECASE).strip()
                        location = temp_location if temp_location else "No Location Specified"

                    description = ""
                    description_tag = item.select_one('div.search-results-summary p')
                    if description_tag and hasattr(description_tag, 'get_text'):
                        description = description_tag.get_text(strip=True) 

                    unique_id_str = f"{details_url}-{title}-{str(walk_date) if walk_date else 'NoDate'}"
                    unique_id = hashlib.sha256(unique_id_str.encode()).hexdigest()

                    walks_data.append({
                        'id': unique_id,
                        'group_name': group_name,
                        'title': title,
                        'difficulty': difficulty,
                        'distance': distance,
                        'walk_date': walk_date.isoformat() if walk_date else None,
                        'location': location,
                        'details_url': details_url,
                        'description': description
                    })

                except Exception as item_e:
                    print(f"Error processing individual walk item {i}: {item_e}")
                    continue

            print(f"Scraped {len(walks_data)} walks from {page_url}.")

        except Exception as e:
            print(f"An error occurred during scraping {page_url}: {e}")
        finally:
            await browser.close()
    return walks_data

# --- Main Execution ---
async def main():
    all_scraped_walks = []
    for url in RAMBLERS_URLS: # Loop through all URLs
        walks_from_url = await scrape_walks_from_url(url)
        all_scraped_walks.extend(walks_from_url)

    if all_scraped_walks:
        print("\n--- Sending Scraped Walks to PHP API ---")
        try:
            headers = {'Content-Type': 'application/json'}
            response = requests.post(PHP_API_ENDPOINT, data=json.dumps(all_scraped_walks), headers=headers)
            response.raise_for_status()
            print(f"Successfully sent data to API. Response: {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"Error sending data to PHP API: {e}")
    else:
        print("No walks were scraped from any URL. No data sent to API.")

    print("\n--- Scraper finished. ---")

if __name__ == "__main__":
    asyncio.run(main())`}
          </CodeBlock>
          <h4 className="font-semibold text-gray-700 mb-1">`docker-compose.yml`:</h4>
          <p className="mb-2">
            Defines the Docker service, including volume mounts and environment variables for the PHP API endpoint and (optionally) database credentials if not using `db_config.php` directly in PHP.
          </p>
          <CodeBlock language="yaml" title="docker-compose.yml">
            {`services:
  ramblers-scraper:
    build: .
    volumes:
      # Example: Mount a local directory for logs or other data
      - /path/to/your/local/logs:/app/logs
    container_name: ramblers-scraper
    environment:
      # These are examples if you were to pass credentials directly to Python
      # DB_HOST: "your_db_host_example.com"
      # DB_USER: "your_db_user_example"
      # DB_PASSWORD: "your_db_password_example"
      # DB_NAME: "your_db_name_example"
      PHP_API_ENDPOINT: "https://example.com/api/insert_walks.php" # Replace with your actual domain
    restart: "no"`}
          </CodeBlock>
          <h4 className="font-semibold text-gray-700 mb-1">Docker Commands:</h4>
          <p className="mb-2">
            To build and run the scraper.
          </p>
          <CodeBlock language="bash" title="Build Docker Image">
            {`docker compose build`}
          </CodeBlock>
          <CodeBlock language="bash" title="Run Scraper (removes container after exit)">
            {`docker compose run --rm ramblers-scraper`}
          </CodeBlock>
        </DocSection>

        <DocSection title="4. Cron Job Setup">
          <p className="mb-2">
            A cron job is used to schedule the scraper to run automatically (e.g., daily).
          </p>
          <h4 className="font-semibold text-gray-700 mb-1">Cron Entry:</h4>
          <CodeBlock language="bash" title="crontab -e entry">
            {`# Run Hikers Scraper daily at 3:00 AM
0 3 * * * /usr/bin/docker compose -f /root/ramblers-scraper/docker-compose.yml run --rm ramblers-scraper > /var/log/ramblers_scraper_cron.log 2>&1`}
          </CodeBlock>
          <p className="mt-2">
            <strong>Action:</strong> Add this line to your crontab (<code>crontab -e</code>). Ensure the paths to `docker compose` and `docker-compose.yml` are absolute and correct for your server.
          </p>
        </DocSection>

        <DocSection title="5. Frontend Requirements (for LOVABLE.dev)">
          <p className="mb-2">
            The frontend application (developed by LOVABLE.dev) needs to fetch data from your `get_walks.php` API endpoint.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>API Endpoint:</strong> <code>https://example.com/api/get_walks.php</code></li>
            <li><strong>Data Format:</strong> JSON, including `lastScrapeTime` as an ISO 8601 UTC timestamp.</li>
            <li><strong>No Credentials:</strong> The frontend should *never* contain database credentials.</li>
            <li><strong>CORS:</strong> Ensure your PHP API's `Access-Control-Allow-Origin` header is set to your frontend's domain for production.</li>
          </ul>
          <p className="mt-2">
            The frontend can display the `lastScrapeTime` to inform users when the data was last updated (e.g., "Website checked X days/hours ago").
          </p>
        </DocSection>

        <DocSection title="6. Troubleshooting & Monitoring">
          <p className="mb-2">
            If the scraper fails or the API doesn't return expected data:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>PHP Error Logs (Ionos):</strong> This is your primary source for diagnosing `500 Server Errors` from your PHP API. Log into your Ionos control panel to access these.</li>
            <li><strong>Scraper Console Output:</strong> Check the output when running `docker compose run ramblers-scraper` manually.</li>
            <li><strong>Cron Log File:</strong> Examine `/var/log/ramblers_scraper_cron.log` for output from scheduled runs.</li>
            <li><strong>Database Content:</strong> Verify data directly in phpMyAdmin.</li>
          </ul>
        </DocSection>
      </div>
    </div>
  );
};

export default App;
