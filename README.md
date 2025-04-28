# Blog Application

A full-stack blog application built with React, Spring Boot, and MySQL. Users can create, read, update, and delete blog posts with images and tags.

## Features

- User authentication (signup, login, logout)
- Create, read, update, and delete blog posts
- Image upload for blog posts
- Tag system for categorizing posts
- Responsive design with dark mode
- Real-time post updates
- User profile management

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Bootstrap for styling
- React Hook Form for form handling

### Backend
- Spring Boot
- Spring Security
- MySQL Database
- JPA/Hibernate for ORM
- Maven for dependency management

## Prerequisites

- Node.js (v14 or higher)
- Java JDK 17 or higher
- MySQL Server
- Maven

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd blog-app
```

### 2. Database Setup
1. Create a MySQL database named `blog`
2. Update the database configuration in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blog
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```
The backend server will start on `http://localhost:8080`

### 4. Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```
The frontend application will start on `http://localhost:3000`

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user

### Posts
- GET `/api/post` - Get all posts
- GET `/api/post/{id}` - Get post by ID
- POST `/api/post` - Create new post
- PUT `/api/post/{id}` - Update post
- DELETE `/api/post/{id}` - Delete post

### Tags
- GET `/api/tag` - Get all tags
- POST `/api/tag` - Create new tag

## Project Structure

```
blog-app/
├── frontend/
│   ├── public/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── backend/
    ├── src/
    │   ├── main/
    │   │   ├── java/
    │   │   └── resources/
    │   └── test/
    └── pom.xml
```

## Usage

1. Register a new account or login with existing credentials
2. Create a new post by clicking the "New Post" button
3. Add title, content, and optional image
4. Select tags for your post
5. Edit or delete your posts from the post view
6. Browse posts by tags or search for specific content

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Bootstrap for the UI components
- Spring Boot team for the backend framework
- React team for the frontend library
