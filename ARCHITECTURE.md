# API Vinco - Architecture Overview

## 🎯 Project Overview

**API Vinco** is a RESTful API built with modern JavaScript technologies to manage data for a children's book series. The API provides full CRUD operations for books, characters, points of interest (POIs), and species, with proper relationships and validation. The codebase follows f## 📊 Statistics & Analytics Endpoints

The API includes specialized endpoints for data analytics and statistics:

### Character Statistics

#### Species Distribution

- **Endpoint**: `GET /api/characters/stats/species`
- **Description**: Returns count of characters grouped by species
- **Implementation**: MongoDB aggregation pipeline with `$group` and `$lookup`
- **Response Format**:

```json
{
	"success": true,
	"data": [
		{ "species": "Human", "count": 15 },
		{ "species": "Elf", "count": 8 },
		{ "species": "Dragon", "count": 3 }
	]
}
```

#### Character Book Statistics

- **Endpoint**: `GET /api/characters/:id/book-stats`
- **Description**: Shows how many books a character appears in and character count per book
- **Implementation**: Mongoose populate with manual processing
- **Response Format**:

```json
{
	"success": true,
	"data": {
		"characterId": "64f...",
		"characterName": "Hero Name",
		"totalBooks": 3,
		"books": [
			{
				"bookId": "64f...",
				"title": "Book Title",
				"characterCount": 12
			}
		]
	}
}
```

### Implementation Approach

These endpoints use **simpler approaches** for maintainability:

1. **Species Statistics**: MongoDB aggregation with `$lookup` for species name resolution
2. **Character Book Stats**: Mongoose populate followed by JavaScript processing

This approach prioritizes code readability and maintainability over maximum performance, suitable for moderate data volumes.

## 🚀 Future Enhancements

- **Authentication**: JWT-based user authentication
- **Rate Limiting**: API rate limiting middleware
- **Caching**: Redis for response caching
- **Testing**: Unit and integration tests
- **Documentation**: OpenAPI/Swagger documentation
- **Metrics**: Performance monitoring
- **Background Jobs**: Queue system for heavy operations
- **Advanced Analytics**: More complex statistical queries and data visualization endpoints

---

This architecture provides a solid foundation for a scalable, maintainable API with proper separation of concerns, type safety, modern development practices, and built-in analytics capabilities.gramming principles with abstracted utilities for maintainability and consistency.

## 🏗️ Technology Stack

- **Runtime**: Node.js with ES Modules (ESM)
- **Language**: TypeScript for type safety
- **Framework**: Express.js for REST API
- **Database**: MongoDB with Mongoose ODM
- **Validation**: JSON Schema validation in MongoDB + Mongoose schemas
- **Security**: Helmet, CORS, input sanitization
- **Development**: Hot reload with tsx, structured logging with Morgan
- **Paradigm**: Functional programming with factory functions and utilities

## 📁 Project Structure

```
api-vinco/
├── src/
│   ├── app.ts              # Express app configuration & middleware
│   ├── server.ts           # Server startup & graceful shutdown
│   ├── config/
│   │   └── database.ts     # MongoDB connection management
│   ├── controllers/        # Request handlers (business logic)
│   │   ├── books.ts
│   │   ├── characters.ts
│   │   ├── pois.ts
│   │   └── species.ts
│   ├── middleware/
│   │   └── errorHandler.ts # Centralized error handling
│   ├── models/            # Mongoose schemas & models
│   │   ├── Book.ts
│   │   ├── Character.ts
│   │   ├── Poi.ts
│   │   └── Species.ts
│   ├── routes/            # Express route definitions
│   │   ├── books.ts
│   │   ├── characters.ts
│   │   ├── pois.ts
│   │   └── species.ts
│   ├── types/             # TypeScript type definitions
│   │   ├── index.ts       # Interfaces & shared types
│   │   └── errors.ts      # Error message constants
│   ├── utils/             # Utility functions for code reuse
│   │   ├── asyncHandler.ts # Async error handling wrapper
│   │   ├── errors.ts      # Error creation utilities
│   │   ├── filters.ts     # Query filter builders
│   │   └── pagination.ts  # Pagination helpers
├── dist/                  # Compiled JavaScript (generated)
├── node_modules/          # Dependencies
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Project metadata & scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # User documentation
```

## 🔄 Request Flow

```
Client Request
    ↓
Express App (app.ts)
    ↓
Route Handler (routes/*.ts)
    ↓
Controller (controllers/*.ts)
    ↓
Model Operation (models/*.ts)
    ↓
MongoDB
    ↓
Response
```

### Detailed Flow Example

1. **Client**: `GET /api/books?page=1&limit=10`
2. **Route** (`routes/books.ts`): Matches `/` route, calls `getAllBooks` controller
3. **Controller** (`controllers/books.ts`):
   - Parses query parameters
   - Builds filter object
   - Calls `BookModel.find()` and `BookModel.countDocuments()`
   - Formats response with pagination metadata
4. **Model** (`models/Book.ts`): Executes MongoDB query with Mongoose
5. **Database**: Returns documents matching criteria
6. **Response**: JSON with `{success: true, data: {data: [...], total: N, page: 1, ...}}`

## 🎨 Design Patterns

### 1. **Functional Programming**

- Pure functions where possible
- Factory functions for error creation
- Type guards for runtime type checking
- Module-level exports instead of classes

### 2. **Separation of Concerns**

- **Routes**: Only define URL patterns and HTTP methods
- **Controllers**: Handle business logic and data transformation
- **Models**: Define data schemas and database operations
- **Middleware**: Cross-cutting concerns (error handling, logging)

### 3. **Error Handling**

- Centralized error messages in `types/errors.ts`
- Dynamic error generation with entity names using typed ENTITIES object
- Type-safe error creation with `keyof typeof ENTITIES` for entity-specific errors
- Consistent error response format
- Async error handling with `asyncHandler`

### 4. **Utility Functions**

- **asyncHandler**: Wraps async route handlers for automatic error catching
- **Error Utils**: Factory functions for creating standardized errors
- **Filter Builders**: Dynamic query filter construction from request parameters
- **Pagination Helpers**: Consistent pagination logic across all endpoints

### 5. **Type Safety**

- Strict TypeScript configuration
- Interface definitions for all data structures
- Generic types for reusable components
- Runtime validation with Mongoose schemas

## 🔗 Data Relationships

```
Book
├── title (string)
├── blurb (string)
├── pages (number)
├── publication_year (number)
└── characters (ObjectId[] → Character)

Character
├── name (string)
├── age (number)
├── species (ObjectId → Species)
├── appears_in (ObjectId[] → Book)
└── desc (string)

Point of Interest (Poi)
├── name (string, optional)
├── desc (string)
└── type (string)

Species
├── name (string)
└── desc (string)
```

## 🛡️ Security & Validation

### Input Validation

- **Mongoose Schemas**: Type checking and basic validation
- **MongoDB JSON Schema**: Database-level validation rules
- **TypeScript**: Compile-time type checking

### Security Measures

- **Helmet**: Security headers
- **CORS**: Cross-origin request handling
- **Input Sanitization**: Trimmed strings, validated numbers
- **Error Masking**: No sensitive data in error responses

## 🚀 Development Workflow

### Local Development

```bash
npm install          # Install dependencies
npm run dev         # Start development server with hot reload
# Server runs on http://localhost:3000
```

### Production Build

```bash
npm run build      # Compile TypeScript to JavaScript
npm start          # Start production server
```

### Testing

```bash
# Use Postman collection (postman_collection.json)
# Or curl commands:
curl http://localhost:3000/health
curl http://localhost:3000/api/books
```

## 📊 Key Files Explained

### `src/app.ts`

- Express application setup
- Middleware configuration (CORS, Helmet, Morgan, JSON parsing)
- Route mounting for all entities
- Error handling middleware

### `src/server.ts`

- Server startup logic
- Database connection initialization
- Graceful shutdown handling
- Port configuration

### `src/config/database.ts`

- MongoDB connection management
- Connection status checking
- Error handling for database operations

### `src/types/index.ts`

- TypeScript interfaces for all entities
- API response types
- Pagination and metadata types

### `src/types/errors.ts`

- Centralized error message definitions
- Dynamic error generation functions
- ENTITIES object with singular/plural forms for type-safe entity references

### `src/utils/asyncHandler.ts`

- Higher-order function for async error handling
- Automatically catches and forwards errors to middleware
- Eliminates try-catch boilerplate in controllers

### `src/utils/errors.ts`

- Factory functions for creating standardized errors
- Type-safe error creation using `keyof typeof ENTITIES` for entity-specific errors
- Specific error types (not found, invalid ID, validation, fetch errors)
- Consistent error message formatting with ENTITIES object

### `src/utils/filters.ts`

- Dynamic filter query builder from request parameters
- Case-insensitive regex for string fields
- Type-safe parameter mapping

### `src/utils/pagination.ts`

- Pagination options extraction from requests
- Consistent pagination metadata calculation
- Reusable pagination result formatting

### Controllers (`src/controllers/*.ts`)

- Request parameter parsing
- Business logic execution
- Response formatting
- Error handling delegation

### Models (`src/models/*.ts`)

- Mongoose schema definitions
- Database indexes
- Model relationships
- Validation rules

### Routes (`src/routes/*.ts`)

- URL pattern definitions
- HTTP method routing
- Controller method binding

## 🔧 Configuration

### Environment Variables (`.env`)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3000
```

### TypeScript (`tsconfig.json`)

- Strict mode enabled
- ES2020 target
- CommonJS module resolution for Node.js compatibility
- Source maps for debugging

### Package.json Scripts

- `dev`: Development server with hot reload
- `build`: TypeScript compilation
- `start`: Production server
- `clean`: Remove build artifacts

## � API Endpoints

### Books

- `GET /api/books` - Get all books with pagination and filters
- `GET /api/books/:id` - Get a single book by ID
- `GET /api/books/:id/metadata` - Get book metadata
- `GET /api/books/metadata` - Get metadata for all books
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book by ID
- `DELETE /api/books/:id` - Delete a book by ID

### Characters

- `GET /api/characters` - Get all characters with pagination and filters
- `GET /api/characters/:id` - Get a single character by ID
- `GET /api/characters/stats/species` - Get character count by species ✨
- `GET /api/characters/:id/book-stats` - Get book statistics for a character ✨
- `POST /api/characters` - Create a new character
- `PUT /api/characters/:id` - Update a character by ID
- `DELETE /api/characters/:id` - Delete a character by ID

### Points of Interest (POIs)

- `GET /api/pois` - Get all POIs with pagination and filters
- `GET /api/pois/:id` - Get a single POI by ID
- `POST /api/pois` - Create a new POI
- `PUT /api/pois/:id` - Update a POI by ID
- `DELETE /api/pois/:id` - Delete a POI by ID

### Species

- `GET /api/species` - Get all species with pagination and filters
- `GET /api/species/:id` - Get a single species by ID
- `POST /api/species` - Create a new species
- `PUT /api/species/:id` - Update a species by ID
- `DELETE /api/species/:id` - Delete a species by ID

### System

- `GET /health` - Health check endpoint

✨ = New analytics endpoints

## �🎯 API Design Principles

### RESTful Design

- Resource-based URLs (`/api/books`, `/api/characters`)
- HTTP methods for CRUD operations
- Consistent response formats
- Proper HTTP status codes

### Pagination

- Page-based pagination with `page` and `limit` parameters
- Total count and page metadata in responses
- Default limits to prevent large responses

### Filtering

- Query parameter-based filtering
- Case-insensitive regex for text searches
- Type-safe parameter parsing

### Error Responses

```json
{
	"success": false,
	"error": "Error message",
	"message": "Optional additional details"
}
```

## 🚀 Deployment Considerations

### Environment Setup

- Production MongoDB cluster
- Environment-specific configuration
- Secure credential management

### Performance

- Database indexes on frequently queried fields
- Connection pooling
- Response compression

### Monitoring

- Health check endpoint (`/health`)
- Structured logging
- Error tracking

## 🔄 Future Enhancements

- **Authentication**: JWT-based user authentication
- **Rate Limiting**: API rate limiting middleware
- **Caching**: Redis for response caching
- **Testing**: Unit and integration tests
- **Documentation**: OpenAPI/Swagger documentation
- **Metrics**: Performance monitoring
- **Background Jobs**: Queue system for heavy operations
