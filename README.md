# Campus Study Group Matcher

A simple web application that helps college students create and discover study groups based on their course and study topics.

The project is developed as a **CI/CD demonstration project**, using GitHub Actions, Docker, and automated testing/deployment to demonstrate a practical DevOps workflow.

---

## 📌 Project Overview

Finding classmates to study with can be difficult, especially when students are interested in the same subject but do not know who else is looking for a study group.

**Campus Study Group Matcher** provides a simple platform where students can:

* Create a study group
* Specify the course they are studying
* Add a topic or subject
* View existing study groups
* Search through available groups

The project also demonstrates how a web application can be integrated with a modern **CI/CD pipeline**.

---

## ✨ Features

### 👥 Study Group Creation

Students can create a study group by providing:

* Student name
* Course code
* Study topic

### 🔎 Study Group Search

Users can search existing groups using:

* Course code
* Topic
* Student name

### 📋 Study Group Listing

All created groups are displayed in a clean, responsive interface.

### ❤️ Simple Student-Focused UI

The frontend is designed specifically for a campus environment with a clean and lightweight interface.

### 🩺 Health Check

The application provides a health-check endpoint that can be used by deployment platforms and CI/CD systems.

---

## 🛠️ Technology Stack

| Technology     | Purpose                |
| -------------- | ---------------------- |
| Node.js        | Runtime environment    |
| Express.js     | Backend web framework  |
| HTML           | Page structure         |
| CSS            | User interface styling |
| JavaScript     | Frontend interactions  |
| Docker         | Containerization       |
| GitHub         | Source code management |
| GitHub Actions | CI/CD automation       |
| Jest           | Automated testing      |

---

## 🏗️ Project Structure

```text
study-group-matcher/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Before running the project locally, make sure you have:

* Node.js
* npm
* Git
* Docker (optional)

Check your installations:

```bash
node --version
npm --version
git --version
docker --version
```

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Yug1010/study-group-matcher.git
```

Move into the project directory:

```bash
cd study-group-matcher
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the application

```bash
npm start
```

The application will run locally at:

```text
http://localhost:3000
```

Open the URL in your browser.

---

## 🧪 Running Tests

The project includes automated tests.

Run:

```bash
npm test
```

The tests verify important application functionality before changes are deployed.

---

# 🐳 Running with Docker

The application can also be packaged and executed as a Docker container.

### Build the Docker image

```bash
docker build -t campus-study-group-matcher .
```

### Run the container

```bash
docker run -p 3000:3000 campus-study-group-matcher
```

The application will then be available at:

```text
http://localhost:3000
```

---

# 🔄 CI/CD Pipeline

One of the main objectives of this project is to demonstrate a **Continuous Integration and Continuous Deployment workflow**.

The project uses **GitHub Actions** to automate the software delivery process.

### Pipeline Flow

```text
Developer
    │
    ▼
Git Push
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ├── Install Dependencies
    │
    ├── Run Tests
    │
    ├── Build Docker Image
    │
    └── Deploy Application
            │
            ▼
       Live Application
```

### Continuous Integration

Whenever changes are pushed to the repository, GitHub Actions can automatically:

1. Check out the latest source code
2. Install Node.js dependencies
3. Run automated tests
4. Verify that the application builds successfully

This helps detect problems before the application is deployed.

### Continuous Deployment

After the CI stage succeeds, the pipeline can continue with the deployment process.

The Docker image can be built and the application deployed to the configured hosting platform.

This reduces the need for manual deployment after every code change.

---

## 🔗 API Endpoints

### Get All Study Groups

```http
GET /api/groups
```

Returns the list of currently created study groups.

Example:

```json
[
  {
    "id": 1,
    "name": "Yug Agarwal",
    "course": "CSE3004",
    "topic": "Docker & CI/CD"
  }
]
```

---

### Create a Study Group

```http
POST /groups
```

Creates a new study group.

Form fields:

| Field    | Description  |
| -------- | ------------ |
| `name`   | Student name |
| `course` | Course code  |
| `topic`  | Study topic  |

---

### Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok"
}
```

This endpoint can be used to verify that the application is running correctly.

---

## 📊 Current Application Flow

```text
Student
   │
   ▼
CampusMatch Web Interface
   │
   ├───────────────┐
   ▼               ▼
Create Group    Browse Groups
   │               │
   ▼               ▼
POST /groups    GET /
   │               │
   └───────┬───────┘
           ▼
      Express.js
           │
           ▼
    In-Memory Storage
```

> **Note:** The current version uses in-memory storage. Therefore, study groups are cleared when the application restarts.

---

## 🔐 Security Considerations

This project is intended as an academic and CI/CD demonstration application.

For a production version, additional security features could be implemented, including:

* User authentication
* Password hashing
* Database-backed storage
* Input validation
* Rate limiting
* HTTPS
* CSRF protection
* Secure HTTP headers

---

## 🔮 Future Enhancements

Possible improvements include:

* [ ] Student authentication
* [ ] Database integration
* [ ] Student profiles
* [ ] Course-based matching
* [ ] Availability/time matching
* [ ] Study group join requests
* [ ] Group chat
* [ ] Notifications
* [ ] Online/offline study preferences
* [ ] Group size limits
* [ ] Personalized matching scores
* [ ] Persistent cloud storage

---

## 🎯 Project Objectives

The project demonstrates two important areas:

### Application Development

Building a web application that solves a simple campus-related problem.

### DevOps / CI/CD

Applying DevOps practices including:

* Version control with Git
* GitHub-based collaboration
* Automated testing
* Docker containerization
* Continuous Integration
* Continuous Deployment
* Automated deployment pipelines

---

## 📚 Learning Outcomes

Through this project, the following concepts can be demonstrated:

* Web application development using Node.js and Express
* REST API fundamentals
* Git and GitHub
* Automated testing
* Docker containerization
* GitHub Actions
* CI/CD pipeline design
* Deployment automation
* Basic DevOps practices

---

## 👨‍💻 Author

**Yug Agarwal**

B.Tech Computer Science Engineering

MIT World Peace University

GitHub: [Yug1010](https://github.com/Yug1010)

---

## 📄 License

This project is developed for educational and academic purposes.
