KNNY-utils API
A RESTful API for managing Assignments, Lectures, Links, and Snippets built with Express and MongoDB.

DIR structure
```
|KNNY-UTILS
------|backend
------------|middleware (housing responseHelpers, errorHandler and upload)
------------|models (housing Assignment, Lecture, Link and Snippet)
------------|node_modules(need not say much)
------------|routes(housing assignment, lecture, link and snippet)
------------|uploads(for uploaded files)
------------.env
------------server.js
------------package.json
------------package-lock.json
-----|frontend
-----------|css(housing styles.css)
-----------|js(housing interactive features of the program)
-----------index.html
```

📦 Base URL
https://knny-utils-api.onrender.com/api
📚 Assignments API
📍 GET /assignments/
Description:
Fetch all assignments sorted by newest first.

Response:

200 OK → Array of assignment objects

500 Server Error

Example Response:

json
```
[
  {
    "_id": "60d...",
    "course": "Node.js",
    "instruction": "Build a REST API",
    "dueDate": "2025-06-30T00:00:00.000Z",
    "submitted": false,
    "createdAt": "2025-06-28T14:30:00.000Z",
    "updatedAt": "2025-06-28T14:30:00.000Z",
    "__v": 0
  }
]
```
📍 GET /assignments/:id
Description:
Fetch a specific assignment by its ID.

Response:

200 OK → Assignment object

404 Not Found → If ID doesn’t exist

500 Server Error

### 📍 POST /assignments/
Description:
Create a new assignment.

Request Body:

json
```
{
  "course": "string",
  "instruction": "string",
  "dueDate": "ISO date string"
}
```
Response:

201 Created → New assignment object

400 Bad Request → Missing required fields

500 Server Error

### 📍 PATCH /assignments/:id/
Description:
Update assignment details (any subset of fields).

Request Body:

json
```
{
  "course": "string",
  "instruction": "string",
  "dueDate": "ISO date string",
  "submitted": true
}

```
Response:

200 OK → Updated assignment object

404 Not Found

500 Server Error

### 📍 PATCH /assignments/:id/submit
Description:
Mark an assignment as submitted.

Response:

200 OK → Updated assignment object with "submitted": true

404 Not Found

500 Server Error

### 📍 DELETE /assignments/:id
Description:
Delete an assignment by ID.

Response:

200 OK → Deletion success message

404 Not Found

500 Server Error

Example Response:

json
```
{
  "message": "Assignment deleted successfully"
}
```
# 📑 Assignment Object Structure
json
```
{
  "_id": "string",
  "course": "string",
  "instruction": "string",
  "dueDate": "ISO date string",
  "submitted": true,
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "__v": 0
}
```
🎓 Lectures API
### 📍 GET /lectures/
Description:
Fetch all lectures.

Response:

200 OK → Array of lecture objects

500 Server Error

### 📍 GET /lectures/:id
Description:
Fetch a lecture by ID.

Response:

200 OK → Lecture object

404 Not Found

500 Server Error

### 📍 POST /lectures/
Description:
Create a new lecture.

Request Body:

json
```
{
  "title": "string",
  "description": "string",
  "files": ["string", "string"] // optional array of file URLs or names
}
```
Response:

201 Created → New lecture object

400 Bad Request

500 Server Error

### 📍 PATCH /lectures/:id
Description:
Update lecture fields.

Request Body: (any fields)

json
```
{
  "title": "string",
  "description": "string",
  "files": ["string"]
}
```
Response:

200 OK → Updated lecture object

404 Not Found

500 Server Error

### 📍 DELETE /lectures/:id
Description:
Delete a lecture by ID.

Response:

200 OK → Deletion success message

404 Not Found

500 Server Error

📑 Lecture Object Structure
json
```
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "files": ["string"],
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "__v": 0
}
```
🔗 Links API
### 📍 GET /links/
Description:
Fetch all links.

Response:

200 OK → Array of link objects

500 Server Error

### 📍 GET /links/tag/:tag
Description:
Fetch links filtered by a specific tag.

Response:

200 OK → Array of matching link objects

404 Not Found → If no links found for tag

500 Server Error

### 📍 GET /links/:id
Description:
Fetch a link by ID.

Response:

200 OK → Link object

404 Not Found

500 Server Error

### 📍 POST /links/
Description:
Create a new link.

Request Body:

json
```
{
  "title": "string",
  "url": "string",
  "tag": "string" // optional, default: "Generic"
}
```
Response:

201 Created → New link object

400 Bad Request

500 Server Error

### 📍 PATCH /links/:id
Description:
Update link details.

Request Body: (any fields)

json
```
{
  "title": "string",
  "url": "string",
  "tag": "string"
}
```
Response:

200 OK → Updated link object

404 Not Found

500 Server Error

### 📍 DELETE /links/:id
Description:
Delete a link by ID.

Response:

200 OK → Deletion success message

404 Not Found

500 Server Error

📑 Link Object Structure
json
```
{
  "_id": "string",
  "title": "string",
  "url": "string",
  "tag": "string",
  "__v": 0
}
```
💻 Snippets API
### 📍 GET /snippets/
Description:
Fetch all code snippets.

Response:

200 OK → Array of snippet objects

500 Server Error

### 📍 GET /snippets/:id
Description:
Fetch a snippet by ID.

Response:

200 OK → Snippet object

404 Not Found

500 Server Error

### 📍 POST /snippets/
Description:
Create a new code snippet.

Request Body:

json
```
{
  "title": "string",
  "language": "string",
  "code": "string",
  "tags": "string",       // optional
  "description": "string" // optional
}
```
Response:

201 Created → New snippet object

400 Bad Request

500 Server Error

📑 Snippet Object Structure
json
```
{
  "_id": "string",
  "title": "string",
  "language": "string",
  "code": "string",
  "tags": "string",
  "description": "string",
  "__v": 0
}

```
🛠️ Error Handling
All endpoints use centralized middleware to catch and respond with clear error messages and appropriate HTTP status codes.

⚙️ Server Setup (Local)
Clone this repo

Create .env with your MongoDB URI under MONGO_URI

Run:

bash
Copy
Edit
npm install
npm start
Server runs on http://localhost:5000

🌐 Hosted API
Test and use the live API at:

https://knny-utils-api.onrender.com

