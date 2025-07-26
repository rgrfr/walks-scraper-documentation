# **Website scraper & API project**

This repository explains the backend components for a project designed to automatically scrape eg walk data from a Hikers website, store it in a MySQL database, and expose it via a PHP API. This setup is for developers looking to build a dynamic frontend application that displays up-to-date hiking event information. Once the scraper is functional, and if you're as lazy as I am, Lovable.dev might be used to create a frontend.

## **🚀 View the Live Documentation**

To see the full, interactive documentation please visit:
[**https://rgrfr.github.io/walks-scraper-documentation/**](https://rgrfr.github.io/walks-scraper-documentation/)

## **What you will learn**

By setting up and running this project, you will gain practical experience in:

* **Web Scraping with Python & Playwright:** See how to programmatically navigate websites, handle dynamic content (like "Load More" buttons), and extract structured data using Playwright and BeautifulSoup.  
* **Building a RESTful PHP API:** Understand how to create PHP scripts that interact with a MySQL database, handle incoming JSON data (POST requests), retrieve data (GET requests), and serve it securely.  
* **MySQL Database Management:** Learn to design simple database schemas, perform "upsert" operations (update or insert) to prevent data duplication, and manage data persistence.  
* **Dockerization:** Containerize your Python scraper using Docker, ensuring a consistent and isolated execution environment.  
* **Automated Scheduling with Cron:** Set up cron jobs to automatically run your scraper at regular intervals, keeping your data fresh without manual intervention.  
* **Secure Credential Handling:** Implement best practices for storing and accessing sensitive database credentials, protecting them from unauthorized access.  
* **Frontend Integration Concepts:** Understand the API contract for integrating a frontend application (like a React app) to consume the scraped data.

## **What you need to get going**

To set up and run this project, you will need the following:

### **Prerequisites:**

* **Web Hosting Account:** A hosting provider (e.g., Ionos) with:  
  * **PHP Support:** For running the API scripts.  
  * **MySQL Database:** For storing walk data.  
  * **SSH Access:** To your webspace for directory creation, file editing, and cron job setup.  
* **Server for Docker:** A server (e.g., a VPS, a dedicated server, or even a robust local machine) with:  
  * **Docker and Docker Compose Installed:** To build and run the Python scraper container.  
* **Basic Command Line / Linux Knowledge:** Familiarity with cd, ls, mkdir, nano, crontab, etc.  
* **Basic Understanding of:**  
  * Python programming.  
  * PHP programming.  
  * SQL and MySQL databases.  
  * Web concepts (HTTP methods, JSON).

### **Initial Setup Steps:**

1. **MySQL Database Setup:**  
   * Access your MySQL database via phpMyAdmin.  
   * Create the walks and scraper\_status tables (SQL schemas provided in the full documentation).  
   * Note down your database host, username, password, and database name.  
2. **PHP API Files Deployment:**  
   * Create an api directory on your webspace (e.g., example.com/api/).  
   * Create a db\_config.php file *inside* this api directory containing your database credentials as PHP constants.  
   * Create a .htaccess file *in the same api directory* to deny direct web access to db\_config.php.  
   * Upload the insert\_walks.php and get\_walks.php scripts to your api directory.  
   * **Crucially, update the require\_once path in your PHP scripts** to point to the absolute path of your db\_config.php file.  
3. **Python Scraper Setup (on your Docker server):**  
   * Clone this repository to your Docker server.  
   * Ensure Dockerfile, requirements.txt, and scraper.py are in the same directory.  
   * Edit scraper.py to set the correct PHP\_API\_ENDPOINT (your insert\_walks.php URL).  
   * Build the Docker image: docker compose build  
   * Test run the scraper: docker compose run \--rm hikers-scraper  
4. **Cron Job Configuration:**  
   * Access your server's crontab via SSH (crontab \-e).  
   * Add a cron entry to schedule the docker compose run command at your desired interval.

Refer to the project documentation - link above - for detailed code examples, SQL schemas, and troubleshooting tips.