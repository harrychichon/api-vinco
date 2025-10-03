# API Vinco

A RESTful API for managing data from a children's book series, built with Node.js, TypeScript, Express, and MongoDB.

## 🚀 Features

- **CRUD**: Create, Read, Update and Delete for every entity
- **Filtering & Pagination**: Query parameters for filtering and paginated results
- **Data Analytics**: Meta data and aggregation-specific endpoints
- **Type Safety**: Full TypeScript implementation with strict typing
- **Error Handling**: Centralized, type-safe error management with masking
- **Validation**: Input validation with TS, MongoDB and Mongoose
- **Security**: Helmet, CORS and input sanitisation
- **Dev tools**: Hot reload, structured logging, health endpoint and layered architecture

## 🛠️ Technology Stack

- **Runtime**: Node.js with ES Modules
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Development**: tsx for hot reload, Morgan for logging

## 📋 Prerequisites

- MongoDB (local or cloud instance)
- npm or yarn

## 🔒 Set up environment variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/api-vinco
PORT=3000
```

## 📖 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Books

| Method | Endpoint              | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| GET    | `/books`              | Get all books with pagination and filters |
| GET    | `/books/:id`          | Get a single book by ID                   |
| GET    | `/books/:id/metadata` | Get book metadata                         |
| GET    | `/books/metadata`     | Get metadata for all books                |
| POST   | `/books`              | Create a new book                         |
| PUT    | `/books/:id`          | Update a book by ID                       |
| DELETE | `/books/:id`          | Delete a book by ID                       |

### Characters

| Method | Endpoint                     | Description                                    |
| ------ | ---------------------------- | ---------------------------------------------- |
| GET    | `/characters`                | Get all characters with pagination and filters |
| GET    | `/characters/:id`            | Get a single character by ID                   |
| GET    | `/characters/stats/species`  | Get character count by species                 |
| GET    | `/characters/:id/book-stats` | Get book statistics for a character            |
| POST   | `/characters`                | Create a new character                         |
| PUT    | `/characters/:id`            | Update a character by ID                       |
| DELETE | `/characters/:id`            | Delete a character by ID                       |

### Points of Interest (POIs)

| Method | Endpoint    | Description                              |
| ------ | ----------- | ---------------------------------------- |
| GET    | `/pois`     | Get all POIs with pagination and filters |
| GET    | `/pois/:id` | Get a single POI by ID                   |
| POST   | `/pois`     | Create a new POI                         |
| PUT    | `/pois/:id` | Update a POI by ID                       |
| DELETE | `/pois/:id` | Delete a POI by ID                       |

### Species

| Method | Endpoint       | Description                                 |
| ------ | -------------- | ------------------------------------------- |
| GET    | `/species`     | Get all species with pagination and filters |
| GET    | `/species/:id` | Get a single species by ID                  |
| POST   | `/species`     | Create a new species                        |
| PUT    | `/species/:id` | Update a species by ID                      |
| DELETE | `/species/:id` | Delete a species by ID                      |

### System

| Method | Endpoint  | Description           |
| ------ | --------- | --------------------- |
| GET    | `/health` | Health check endpoint |

## 🔍 Query Parameters

### Pagination

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

### Filtering

- `name`: Filter by name (case-insensitive regex)
- `species`: Filter characters by species ID
- `book`: Filter characters by book ID

Example: `GET /api/characters?page=1&limit=5&name=hero`

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "data": [...],
    "total": 25,
    "page": 1,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🏗️ Project Structure

```
api-vinco/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server startup
│   ├── config/
│   │   └── database.ts     # MongoDB connection
│   ├── controllers/        # Business logic
│   ├── middleware/
│   │   └── errorHandler.ts # Error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
├── dist/                  # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
