
---

# Homework Submission Web App

A full-stack web application built with **Next.js 15**, **MongoDB**, and **Cloudinary** that allows students to upload homework and teachers to review and grade submissions.

---

## Features

### Student Dashboard

* Upload homework as **PDF or JPEG** (max 5 MB).
* View all previously submitted assignments.
* Uploads are stored in **Cloudinary**, metadata in **MongoDB**.

### Teacher Dashboard

* View all student submissions with pagination.
* Filter by student, assignment name, and submission date.
* Grade submissions (`A`, `B`, `C`, `D`, `F`, `Incomplete`).
* Add teacher notes for feedback.

---

##  Tech Stack

| Category     | Technology                                  |
| ------------ | ------------------------------------------- |
| Framework    | Next.js 15 (App Router)                     |
| Backend      | Node.js / TypeScript                        |
| Database     | MongoDB (Atlas) with Mongoose      |
| File Storage | Cloudinary                                  |
| Styling      | Tailwind CSS                                |
| Deployment   | MongoDB Atlas (Backend) |

---

## Setup Instructions

### 1️Clone the repository

```bash
git clone https://github.com/<your-username>/homework-submission-app.git
cd homework-submission-app
```

### 2 Install dependencies

```bash
npm install
```

### 3️Configure environment variables

Create a file named **`.env.local`** in the project root:

```bash
# MongoDB connection
MONGODB_URI=mongodb://127.0.0.1:27017/homework-api
# or
# MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/homework-api?retryWrites=true&w=majority

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret_key

# App URL (used for API calls)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> If you use MongoDB Atlas, ensure your IP is whitelisted (`0.0.0.0/0` for testing) and credentials are correct.

---

## Running the App

### Development

```bash
npm run dev
```

Then open:

```
http://localhost:3000/student  →  Student dashboard
http://localhost:3000/teacher  →  Teacher dashboard
```

###  Build for Production

```bash
npm run build
npm run start
```

---

## Project Structure

```
app/
 ├── api/
 │   └── student/
 │       └── route.ts        # Handles upload (POST) and fetch (GET)
 │   └── teacher/
 │       └── route.ts        # Handles grading and filtering
 │
 ├── student/
 │   └── page.tsx            # Student dashboard UI
 ├── teacher/
 │   └── page.tsx            # Teacher dashboard UI
 │
 ├── components/
 │   ├── SubmitForm.tsx      # File upload form
 │   ├── GradeForm.tsx       # Teacher grading form
 │   └── SubmissionList.tsx  # List of submissions
 │
 ├── models/
 │   └── HomeworkTemplate.ts # Mongoose schema
 │
 └── lib/
     └── database.ts         # MongoDB connection helper
```

---

## API Endpoints

### **POST** `/api/student`

Uploads a student’s homework.

#### Request (FormData)

| Field            | Type     | Description            |
| ---------------- | -------- | ---------------------- |
| `studentName`    | `string` | Name of the student    |
| `assignmentName` | `string` | Homework title         |
| `file`           | `File`   | PDF or JPEG (max 5 MB) |

#### Response

```json
{
  "message": "Homework submitted successfully",
  "homework": {
    "_id": "66fcf81b7a2c",
    "assignmentName": "Maths P1",
    "studentName": "Donell",
    "fileUrl": "https://res.cloudinary.com/.../file.pdf",
    "submissionDate": "2025-10-08T15:42:31.000Z"
  }
}
```

---

### **GET** `/api/student`

Fetches all student submissions.

#### Response

```json
[
  {
    "_id": "66fcf81b7a2c",
    "assignmentName": "Maths P1",
    "studentName": "Donell",
    "fileUrl": "https://res.cloudinary.com/.../file.pdf",
    "grade": "A",
    "teacherNotes": "Great job!",
    "submissionDate": "2025-10-08T15:42:31.000Z"
  }
]
```

---

### **PATCH** `/api/teacher`

Updates grade and teacher notes.

#### Request (JSON)

```json
{
  "id": "66fcf81b7a2c",
  "grade": "B",
  "teacherNotes": "Needs more explanation in part 2."
}
```
#### Response

```json
{
  "message": "Graded successfully",
  "homework": { "_id": "66fcf81b7a2c", "grade": "B" }
}
```
## Common Issues

| Issue                              | Fix                                                                         |
| ---------------------------------- | --------------------------------------------------------------------------- |
|  `MongoNetworkError`              | Add `NODE_OPTIONS=--openssl-legacy-provider` to your environment            |
|  `Invalid Signature` (Cloudinary) | Check that `CLOUDINARY_CLOUD_NAME`, `API_KEY`, and `API_SECRET` are correct |
|  `Failed to upload`               | Ensure MongoDB is running and reachable                                     |
|  `AVIF image not supported`       | Ignore — harmless Next.js build warning                                     |


##  Contributors
Donell Oageng


