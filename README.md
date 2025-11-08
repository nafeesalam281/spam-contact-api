Spam & Contact Reporting API
This is a production-ready, Node.js-based REST API designed to power a mobile application similar to spam-blocking and contact-finder apps. It provides a secure backend for user registration, a global spam reporting system, and an intelligent search engine for contacts and users.

This project was built as a backend solution, focusing on performance, security, and scalability, adhering to strict production standards. It is designed to be consumed by a separate frontend application.



🚀 Features

Secure Authentication: User registration with password hashing (bcrypt.js)  and login via JWT (JSON Web Tokens). All key endpoints are private.



Spam Reporting: Logged-in users can mark any phone number as spam, which contributes to a global spam list.


Advanced Name Search: Search the "global database" (all users + all contacts)  by name. Results are intelligently sorted, showing names that start with the query first, followed by names that contain the query.


Intelligent Phone Search: Search by phone number.

If the number belongs to a registered user, only that user's profile is returned.

Otherwise, all contacts matching that number are returned (as one number can have multiple names across different users' contact books).

Data Privacy Rule: A person's email address is a private detail. It is only displayed in search results if the person is a registered user AND the user performing the search is in that person's personal contact list.


Data Seeding: Includes a script (seed.js) to populate the database with a large amount of random sample data for thorough testing.

🛠️ Tech Stack

Backend: Node.js 


Framework: Express.js 


Database: Relational Database  (SQLite is configured by default for ease of setup)


ORM: Sequelize (No raw SQL queries are used )


Authentication: jsonwebtoken (JWT) & bcrypt.js

Data Population: @faker-js/faker

🗃️ Data Model
The database schema is designed to be efficient and scalable, revolving around three core models:


Users: Stores registered users (name, phone number, email, password hash).


Contacts: Stores personal contacts for each user (linked by ownerId to the Users table).

Spam: Stores phone numbers that have been reported as spam and their corresponding report count.

🏁 Getting Started
1. Prerequisites
Node.js (v18 or higher recommended)

npm (Node Package Manager)

2. Installation
Clone the repository:

Bash

git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
Install dependencies:

Bash

npm install
Create the environment file: Create a .env file in the root of the project. This is crucial for storing your secret key.

Ini, TOML

# .env
JWT_SECRET=your_super_strong_and_secret_key_here
3. Data Population (Required Step)
Before starting the server, you must populate the database with sample data as required by the task.

Bash

node seed.js
This script will:

Wipe all existing tables.

Create 50 sample Users.

Create random Contacts for each user.

Create Spam reports for various numbers.

4. Run the Server
Once the database is seeded, start the application server:

Bash

node server.js
The API server will now be running on http://localhost:3000.

📖 API Endpoints Guide
All "Private" routes require a Bearer Token to be sent in the Authorization header.

🔒 Authentication (/api/auth)
POST /api/auth/register (Public)
Registers a new user. Name, phone number, and password are required.

Body (JSON):

JSON

{
  "name": "Your Name",
  "phoneNumber": "1234567890",
  "password": "yourpassword123",
  "email": "yourname@example.com"
}
Success Response: 201 Created

POST /api/auth/login (Public)
Logs in an existing user and returns a JWT token.

Body (JSON):

JSON

{
  "phoneNumber": "1234567890",
  "password": "yourpassword123"
}
Success Response: 200 OK

JSON

{
  "message": "Login successful!",
  "token": "ey...[your_jwt_token]...abc"
}
🚩 Spam (/api/spam)
POST /api/spam/mark (Private)
Marks a phone number as spam. If the number is already marked, its spam count is incremented.

Body (JSON):

JSON

{
  "phoneNumber": "9999988888"
}
Success Response: 200 OK

JSON

{
  "message": "Number marked as spam.",
  "spamCount": 8
}
🔍 Search (/api/search)
GET /api/search/name/:name (Private)
Searches the "global database" by name, sorting results by "starts with" and then "contains".

Example URL: http://localhost:3000/api/search/name/john

Success Response: 200 OK

JSON

[
  {
    "name": "John Doe",
    "phoneNumber": "5551234567",
    "spamLikelihood": 0
  },
  {
    "name": "Alex Johnson",
    "phoneNumber": "5559876543",
    "spamLikelihood": 3
  }
]
GET /api/search/phone/:number (Private)
Searches the "global database" by phone number.

Example URL: http://localhost:3000/api/search/phone/1234567890


Success Response (If Registered User): Returns only the registered user.

JSON

[
  {
    "name": "Registered User Name",
    "phoneNumber": "1234567890",
    "email": "user@example.com",
    "spamLikelihood": 5
  }
]

Success Response (If Contacts): Returns all matching contacts.

JSON

[
  {
    "name": "Contact Name 1",
    "phoneNumber": "1234567890",
    "spamLikelihood": 5
  },
  {
    "name": "Contact Name 2",
    "phoneNumber": "1234567890",
    "spamLikelihood": 5
  }
]
GET /api/search/details/:number (Private)
Fetches the detailed profile for a single phone number, applying the email privacy rule.

Example URL: http://localhost:3000/api/search/details/1234567890

Success Response (Email Hidden):

JSON

{
  "name": "Registered User Name",
  "phoneNumber": "1234567890",
  "spamLikelihood": 5
}
Success Response (Email Visible): (Only if the searcher is in this user's contact list).

JSON

{
  "name": "Registered User Name",
  "phoneNumber": "1234567890",
  "spamLikelihood": 5,
  "email": "user@example.com"
}
