# File Upload and Analysis System

This project is a comprehensive file upload and analysis system built using **Node.js (NestJS)** for the backend and **React (Next.js)** for the frontend. Below are the details of the project setup and functionality.

## Project Overview

The system comprises two main components:

1. **Backend** (Node.js with NestJS):

   - Runs on port `9000`.
   - Handles API endpoints for user authentication, profile management, document management, and other functionalities.

2. **Frontend** (React with Next.js):

   - Runs on port `3000`.
   - Provides user interfaces for authentication, profile management, and document operations.

---

## Features

### Backend (API Endpoints)

The backend supports the following features:

- **Authentication**:
  - User login.
  - User registration.
- **User Management**:
  - Edit user details (admin/owner privileges).
  - Edit user profile (first name, last name, etc.).
  - Delete users (admin/owner privileges).
- **Document Management**:
  - Upload documents.
  - Delete documents.
- **Authorization**:
  - Role-based access control (admin, owner, etc.).

### Frontend (User Interface)

The frontend provides the following features:

- **Authentication Pages**:
  - Login.
  - Register.
- **User Profile Management**:
  - Edit user profile.
- **User Management (Admin/Owner)**:
  - Manage users (edit roles, delete users).
- **Document Management**:
  - Upload documents.
  - View and manage uploaded documents.

---

## Installation and Setup

### Backend

1. Navigate to the backend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the server:
   ```bash
   npm run start
   ```
4. The backend will be available at `http://localhost:9000`.

### Frontend

1. Navigate to the frontend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The frontend will be available at `http://localhost:3000`.

---

## Technologies Used

- **Backend**:

  - Node.js
  - NestJS
  - TypeScript
  - TypeORM (for database operations)

- **Frontend**:

  - React.js
  - Next.js
  - TypeScript

- **Database**:

  - SQLlite (inbuilt in NodeJs)

---

## Contribution

Feel free to contribute to this project by submitting issues or pull requests. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push to your fork.
4. Submit a pull request with a detailed description of your changes.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

For any inquiries or support, please contact the project maintainer.

Akshay Sharma

