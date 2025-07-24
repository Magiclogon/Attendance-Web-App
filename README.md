# AI-Powered Attendance Management System

A comprehensive **Attendance Management System** that leverages **facial recognition technology** to revolutionize workplace attendance tracking. Employees simply walk up to the system, get recognized instantly, and their attendance is automatically logged. Managers gain real-time visibility into attendance patterns, making workforce management effortless and accurate.

## What it does

The solution eliminates manual attendance processes by using advanced facial recognition algorithms. The system provides:

- **Instant Recognition**: Employees get recognized automatically without any manual input
- **Real-time Tracking**: Immediate attendance logging with timestamp accuracy  
- **Manager Dashboard**: Complete visibility into attendance patterns and employee data
- **Automated Records**: Daily cron jobs automatically generate attendance records
- **Secure Access**: JWT-based authentication for both employees and administrators

## 🏗️ Architecture

**Frontend Layer:**
- React-based web application for intuitive user experience
- Responsive design for both employee and admin interfaces

**Backend Services:**
- Spring Boot REST API with JWT authentication & authorization
- Python-based microservice handling facial recognition processing
- MySQL database for secure data persistence

## 🛠️ Tech Stack

- **Frontend**: React.js, TypeScript
- **Backend**: Spring Boot, Java
- **Face Recognition**: Python, OpenCV, Machine Learning libraries
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Architecture**: Microservices with RESTful APIs

## Deployment

The deployment was made with **Kubernetes** to ensure high availaility and scaling.