# API Endpoints

## Student Endpoints
- **POST /api/student**
  - Description: Submit homework
  - Body: `{"assignmentName": "string", "studentName": "string", "file": file}`
  - Response: `{"message": "Submitted", "id": "string"}` (201)
- **GET /api/student**
  - Description: View submissions
  - Query: `?grade=A&assignmentName=Math101`
  - Response: `[{...submission objects}]` (200)

## Teacher Endpoints
- **GET /api/teacher**
  - Description: View all submissions
  - Query: `?assignmentName=Math&from=2025-10-01&to=2025-10-07&studentName=John`
  - Response: `[{...submission objects}]` (200)
- **PATCH /api/teacher**
  - Description: Grade submission
  - Body: `{"id": "string", "grade": "A", "teacherNotes": "string"}`
  - Response: `{"message": "Graded", "homework": {...}}` (200)