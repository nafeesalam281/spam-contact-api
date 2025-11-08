# Project Title (e.g., Spam & Contact Reporting API)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/node.js.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/node.js.yml)

A short, one-sentence description of what your project does. (e.g., A Node.js & Express API for a spam-reporting and contact-finder mobile application.)



---

## 📖 Table of Contents

* [About The Project](#about-the-project)
* [Key Features](#-key-features)
* [Tech Stack](#-tech-stack)
* [Getting Started](#-getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Running the App](#running-the-app)
* [API Endpoints](#-api-endpoints)
* [License](#-license)

---

## 🚩 About The Project

A more detailed paragraph about your project. What was the goal? What problem does it solve? Who is it for?

---

## ✨ Key Features

* **Secure Authentication:** JWT-based user registration and login.
* **Spam Reporting:** Users can mark any phone number as spam.
* **Advanced Search:** Search by name (with "starts with" priority) or by phone number.
* **Data Privacy:** Email addresses are protected and only shown to users in the contact list.
* **Data Seeding:** Includes a script to populate the database with test data.

---

## 🛠️ Tech Stack

List the main technologies you used.

* **Backend:** Node.js, Express.js
* **Database:** Relational Database (SQLite / PostgreSQL)
* **ORM:** Sequelize
* **Authentication:** `jsonwebtoken` & `bcrypt.js`
* **Testing:** Postman / Hoppscotch

---

## 🏁 Getting Started

Instructions on how to get a local copy up and running.

### Prerequisites

What does a user need to have installed?
* Node.js (v18 or higher)
* npm

### Installation

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPO.git](https://github.com/YOUR_USERNAME/YOUR_REPO.git)
    ```
2.  **Install NPM packages:**
    ```bash
    npm install
    ```
3.  **Create an environment file:**
    Create a `.env` file in the root and add your variables:
    ```ini
    JWT_SECRET=your_secret_key_here
    ```

### Running the App

1.  **Populate the database (first time only):**
    ```bash
    node seed.js
    ```
2.  **Start the server:**
    ```bash
    node server.js
    ```
The server will be available at `http://localhost:3000`.

---

## 📖 API Endpoints

A quick overview of your API routes.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user. |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT. |
| `POST` | `/api/spam/mark` | Private | Mark a number as spam. |
| `GET` | `/api/search/name/:name` | Private | Search by name. |
| `GET` | `/api/search/phone/:number`| Private | Search by phone number. |
| `GET` | `/api/search/details/:number`| Private | Get detailed profile (with privacy). |

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` file for more information.
