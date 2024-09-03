
# OLMS - Online Learning Management System

## Project Overview

OLMS (Online Learning Management System) is a comprehensive platform designed to streamline the learning process for students and instructors. The system includes a professional landing page, a course home page for searching and categorizing courses, and a responsive dashboard with an elegant menu that adapts to small screens. The platform is built with React and Firebase, ensuring dynamic data rendering and storage. The system is equipped with role-based management, private routing, and user account management to secure and personalize the user experience.

## Features

### 1. **Professional Design**
   - **Landing Page**: A visually appealing landing page that serves as the entry point to the platform.
   - **Course Home Page**: Allows users to search, categorize, and enroll in various courses.
   - **Responsive Dashboard**: Features an elegant menu that becomes a floating menu on small screens for easy navigation.

### 2. **User Account Management**
   - Role-based access control ensuring that only authorized users can access the dashboard.
   - Private routing to protect sensitive pages from unauthorized access.

### 3. **Student Dashboard**
   - **Account Management**: Manage and edit personal information.
   - **Track Progress**: Visualize progress with charts, including daily study recommendations and predicted progress.
   - **Enrolled Courses**: View a list of enrolled courses, track progress with a progress bar, and schedule exams. Upon completing the required exams, students can generate a certificate.

### 4. **Instructor Dashboard**
   - **Manage Students**: Access and manage student records, including their course details, exams, and attendance.
   - **Attendance Management**: Toggle attendance for enrolled students, with switches disabled for non-enrolled students.
   - **Assessment Management**: Upload and edit marks for student exams, with a clear indication if marks have already been uploaded.

### 5. **Course Enrollment**
   - Courses are categorized and searchable.
   - Enrollment is restricted to one course at a time, with notifications for already enrolled students or instructors attempting to enroll.
   - Payment integration for secure and easy enrollment.
   - Post-enrollment, students receive a notification to check their dashboard for course details.

### 6. **Tech Stack**
   - **Frontend**: React
   - **Styling** : SCSS
   - **Backend**: Firebase
   - **UI Components**: Ant Design
   - **Responsiveness**: Bootstrap
   - **Notifications**: Toastify JS
   - **Data Visualization**: Chart.js
   - **Certificate Generation**: jsPDF, html2canvas, and pdf-lib

## Installation (Run locally)

To get started with OLMS, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nouman475/OLMS.git
   ```
2. **Change directory (if applies)**:
   ```bash
   cd OLMS
   ```
3. **Install dependencies**:
   ```bash
   npm i
   ```
4. **Run it**:
   ```bash
   npm start
   ```
### Setup Firebase
Replace the Firebase configuration in src/config/firebase.js with your own Firebase project credentials.

## Usage

1. **Landing Page**: Explore the courses offered by OLMS.
2. **Course Home Page**: Search and categorize courses, then enroll in them.
3. **Student Dashboard**:
   - Manage account settings, track progress, view enrolled courses, and schedule exams.
   - After completing all exams, generate a certificate.
4. **Instructor Dashboard**:
   - Manage student records, attendance, and assessments.

## Contributing

Contributions are always welcome!
Please adhere to this project's `code of conduct`.


## Authors

- [Muhammad Nouman](https://github.com/Nouman475)


## Acknowledgements
Special thanks to the open-source community for the tools and libraries used in this project.
## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


