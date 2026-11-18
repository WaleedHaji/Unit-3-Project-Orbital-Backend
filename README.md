# Orbital Backend API

## Overview

This repository contains the Node.js, Express and MongoDB backend for the **Orbital** application.

The API provides endpoints for managing planets, astronauts, space missions and user accounts. It uses MongoDB with Mongoose for data persistence, JSON Web Tokens (JWT) for authentication, and role-based middleware to restrict selected management operations to administrators.

## Related Links

https://github.com/WaleedHaji/Unit-3-Project-Orbital-Backend

## Technologies Used

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Tokens (`jsonwebtoken`)
- bcrypt — password hashing
- dotenv — environment variables
- Morgan — HTTP request logging
- CORS
- Multer — image uploads
- express-rate-limit — rate-limiter configurations are defined in the project
- Jest — test runner configured in `package.json`
- Supertest — API testing dependency

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- User and administrator roles
- Admin-only astronaut and space mission management
- Planet CRUD endpoints
- Astronaut CRUD endpoints
- Space mission CRUD endpoints
- Image uploads for users, planets, astronauts and missions
- MongoDB document relationships between astronauts and space missions
- Population of related astronaut and mission data
- Recent planet activity endpoint
- Admin endpoints for listing users, counting users and toggling user roles
- ObjectId validation middleware for astronaut and mission detail/update/delete routes
- CORS configuration for the frontend application

## Project Structure

```text
backend/
├── config/
│   └── db.js
├── middleware/
│   ├── isAdmin.js
│   ├── rateLimiters.js
│   ├── upload.js
│   ├── validateObjectId.js
│   └── verifyToken.js
├── models/
│   ├── Astronaut.js
│   ├── Planet.js
│   ├── SpaceMission.js
│   └── User.js
├── public/
│   └── uploads/
├── routes/
│   ├── admin.routes.js
│   ├── astronauts.routes.js
│   ├── auth.routes.js
│   ├── planetRoutes.js
│   └── spaceMissions.routes.js
├── uploads/
├── .env
├── .gitignore
├── package.json
└── server.js
```

### Folder Responsibilities

| **Folder / File** | **Purpose** |
| ----------------- | ----------- |
| `config` | MongoDB connection configuration |
| `middleware` | JWT verification, admin authorization, image uploads, ObjectId validation and rate-limiter configurations |
| `models` | Mongoose schemas for users, planets, astronauts and space missions |
| `routes` | Express route definitions and API request handling |
| `public/uploads` | Uploaded images handled by the shared upload middleware |
| `uploads` | Upload destination used by the planet routes |
| `server.js` | Express configuration, middleware registration, route mounting, database connection and server startup |
| `.env` | Environment variables for the application and database connection |
| `package.json` | Project dependencies and npm scripts |

## Getting Started

### Prerequisites

Install:

- [Node.js](https://nodejs.org/)
- MongoDB locally or a MongoDB Atlas account
- npm (included with Node.js)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/WaleedHaji/Unit-3-Project-Orbital-Backend
cd Unit-3-Project-Orbital-Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI= mongodb+srv://WaleedHaji_MongoDB:******@waleed-cluster.ayvoco6.mongodb.net/orbital-app?appName=Waleed-Cluster
JWT_SECRET=your-own-long-random-secret
CLIENT_URL=http://localhost:5173
```

| **Variable** | **Purpose** |
| ------------ | ----------- |
| `PORT` | Port used by the Express server. Defaults to `3000` if omitted. |
| `MONGODB_URI` | mongodb+srv://WaleedHaji_MongoDB:******@waleed-cluster.ayvoco6.mongodb.net/orbital-app?appName=Waleed-Cluster |
| `JWT_SECRET` | Secret used to sign and verify JWT access tokens |
| `CLIENT_URL` | Allowed frontend origin for CORS. Defaults to `http://localhost:5173` if omitted. |

Do not commit your real `.env` file or share your JWT secret or database credentials.

### 4. Start the development server

```bash
npm run dev
```

To start the application without nodemon:

```bash
npm start
```

The API should be available at:

```text
http://localhost:3000
```

The server connects to MongoDB before it starts listening for requests.

## Database Models

### User

| **Field** | **Type** | **Rules / Description** |
| --------- | -------- | ----------------------- |
| `username` | String | Required, unique, trimmed and converted to lowercase |
| `hashedPassword` | String | Required; stores the bcrypt password hash |
| `role` | String | `user` or `admin`; defaults to `user` |
| `isDeleted` | Boolean | Defaults to `false`; used to mark an account as deleted |
| `profilePicture` | String | Optional profile image filename |
| `createdAt` | Date | Generated automatically by Mongoose timestamps |
| `updatedAt` | Date | Generated automatically by Mongoose timestamps |

The User model removes `hashedPassword` when the document is converted to JSON.

### Planet

| **Field** | **Type** | **Rules / Description** |
| --------- | -------- | ----------------------- |
| `planetName` | String | Required |
| `description` | String | Required |
| `type` | String | Required |
| `diameter` | Number | Required |
| `distanceFromTheSun` | Number | Required |
| `numberOfMoons` | Number | Required |
| `image` | String | Optional image filename |
| `createdAt` | Date | Generated automatically by Mongoose timestamps |
| `updatedAt` | Date | Generated automatically by Mongoose timestamps |

### Astronaut

| **Field** | **Type** | **Rules / Description** |
| --------- | -------- | ----------------------- |
| `astronautName` | String | Required |
| `spaceAgency` | String | Required |
| `description` | String | Required |
| `debutYear` | Number | Required |
| `image` | String | Optional image path |
| `missions` | Array of ObjectIds | References `SpaceMission` documents |

The `missions` field allows an astronaut document to reference the space missions they are associated with.

### SpaceMission

| **Field** | **Type** | **Rules / Description** |
| --------- | -------- | ----------------------- |
| `missionName` | String | Required |
| `spaceAgency` | String | Required |
| `description` | String | Required |
| `launchDate` | Date | Required |
| `status` | String | Required |
| `destination` | String | Required |
| `image` | String | Optional image path |
| `astronauts` | Array of ObjectIds | References `Astronaut` documents |
| `createdAt` | Date | Generated automatically by Mongoose timestamps |
| `updatedAt` | Date | Generated automatically by Mongoose timestamps |

The `astronauts` field references the astronauts assigned to a mission.

## Entity Relationships

The project uses MongoDB references to connect astronauts and space missions:

- An astronaut can reference multiple space missions through `Astronaut.missions`.
- A space mission can reference multiple astronauts through `SpaceMission.astronauts`.
- The astronaut and mission GET endpoints populate selected fields from their related documents.

```mermaid
erDiagram
    ASTRONAUT }o--o{ SPACE_MISSION : "references"
    ASTRONAUT {
        ObjectId _id
        String astronautName
        String spaceAgency
        Number debutYear
        ObjectId[] missions
    }
    SPACE_MISSION {
        ObjectId _id
        String missionName
        String spaceAgency
        Date launchDate
        String status
        String destination
        ObjectId[] astronauts
    }
```

## API Base URL

Local development:

```text
http://localhost:3000
```




## Authentication

### Sign up

`POST /auth/sign-up`

Creates a user account. The request accepts `username` and `password`. Passwords must be at least six characters and are hashed with bcrypt before being stored. An optional image can be uploaded using the `image` field.

### Sign in

`POST /auth/sign-in`

Authenticates a user and returns an access token and basic user information. The JWT expires after one hour.

For protected endpoints, send the token in the request header:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

There is no logout endpoint implemented in the current backend. Since authentication uses stateless JWTs, the client should discard its stored token when the user logs out.

## Endpoints

### Authentication

| **Method** | **Endpoint** | **Access** | **Description** |
| ---------- | ------------ | ---------- | --------------- |
| `POST` | `/auth/sign-up` | Public | Register a user account; optionally upload a profile image |
| `POST` | `/auth/sign-in` | Public | Sign in and receive a JWT access token |

### Admin

All admin endpoints below require a valid JWT and the `admin` role.

| **Method** | **Endpoint** | **Access** | **Description** |
| ---------- | ------------ | ---------- | --------------- |
| `GET` | `/admin` | Admin | Get users whose `isDeleted` value is `false` |
| `GET` | `/admin/count` | Admin | Get the total number of user documents |
| `PUT` | `/admin/:userId` | Admin | Toggle the target user's role between `user` and `admin` |

The role-toggle endpoint prevents an administrator from changing their own admin role and prevents demoting the last active administrator.

### Planets

The planet routes do not currently apply JWT or admin middleware.

| **Method** | **Endpoint** | **Access** | **Description** |
| ---------- | ------------ | ---------- | --------------- |
| `GET` | `/planets` | Public | Get all planets |
| `GET` | `/planets/recent-activity` | Public | Get the most recently created planet and the two most recently updated planets |
| `GET` | `/planets/:id` | Public | Get a planet by its ID |
| `POST` | `/planets` | Public | Create a planet; optionally upload an image |
| `PUT` | `/planets/:id` | Public | Update a planet; optionally upload a new image |
| `DELETE` | `/planets/:id` | Public | Delete a planet |

### Astronauts

Creating, updating and deleting astronauts requires a valid JWT and the `admin` role. Read endpoints are public.

| **Method** | **Endpoint** | **Access** | **Description** |
| ---------- | ------------ | ---------- | --------------- |
| `GET` | `/astronauts` | Public | Get all astronauts, including selected populated mission fields |
| `GET` | `/astronauts/:id` | Public | Get one astronaut by ID, including selected populated mission fields |
| `POST` | `/astronauts` | Admin | Create an astronaut; optionally upload an image |
| `PUT` | `/astronauts/:id` | Admin | Update an astronaut; optionally upload a new image |
| `DELETE` | `/astronauts/:id` | Admin | Delete an astronaut |

### Space Missions

Creating, updating and deleting missions requires a valid JWT and the `admin` role. Read endpoints are public.

| **Method** | **Endpoint** | **Access** | **Description** |
| ---------- | ------------ | ---------- | --------------- |
| `GET` | `/missions` | Public | Get all missions, including selected populated astronaut fields |
| `GET` | `/missions/:id` | Public | Get one mission by ID, including selected populated astronaut fields |
| `POST` | `/missions` | Admin | Create a mission; optionally upload an image |
| `PUT` | `/missions/:id` | Admin | Update a mission; optionally upload a new image |
| `DELETE` | `/missions/:id` | Admin | Delete a mission |

## Image Uploads

Image upload endpoints use `multipart/form-data` with the form field name `image`.

- Sign-up accepts an optional profile image.
- Planet create and update endpoints accept an optional image.
- Astronaut and mission create/update endpoints accept an optional image.
- The shared upload middleware stores files in `public/uploads`.
- The planet routes configure their own Multer storage and save files in `uploads/`.

Use the image path or filename returned/stored by the relevant endpoint when displaying uploaded images in the frontend.

## Middleware

| **Middleware** | **Purpose** |
| -------------- | ----------- |
| `verifyToken.js` | Verifies the JWT from the `Authorization` header and attaches its decoded payload to `req.user` |
| `isAdmin.js` | Allows requests only when the authenticated user's role is `admin` |
| `validateObjectId.js` | Checks whether the route parameter `id` is a valid MongoDB ObjectId |
| `upload.js` | Configures Multer disk storage for image uploads |
| `rateLimiters.js` | Defines standard and authentication rate-limit configurations |

The rate-limit configurations are defined in the project, but they are not currently mounted on the routes in `server.js`.

## Status Codes

The API uses the following status codes in its implemented routes:

| **Status** | **Meaning in this API** |
| ---------- | ----------------------- |
| `200` | Successful request |
| `201` | Resource created |
| `400` | Invalid input, validation error or invalid ObjectId |
| `401` | Missing/invalid authentication token or invalid login credentials |
| `403` | Authenticated user does not have permission |
| `404` | Requested astronaut, mission or user was not found |
| `409` | Username already exists |
| `500` | Unexpected server or database-operation error |

Some planet endpoints return the result without explicitly setting a status code, so Express uses its default success status.

## Testing

The project includes the following test dependencies and script:

```bash
npm test
```


## Future Enhancements

- Add automated tests for authentication, authorization and all resource endpoints.
- Protect planet creation, updating and deletion with admin authorization.
- Add request validation and consistent error handling to all planet endpoints.
- Add an admin user-deletion endpoint and resolve the duplicate `PUT /admin/:userId` route definition.
- Add pagination, search and filtering for planets, astronauts and missions.
- Add a dedicated logout/token-revocation strategy if server-side token invalidation is required.
- Improve database connection error handling and server startup behavior.


## Team Members

| **Name** | **GitHub** | **Responsibilities** |
| -------- | ---------- | -------------------- |
| Nouf Mohammed | [Noufmuhammed](https://github.com/Noufmuhammed) | Space Mission & Astronauts Routes |
| Husna Rajabi  | [HusnaAli111](https://github.com/HusnaAli111) | Planets Routes |
| Waleed Haji  | [WaleedHaji](https://github.com/WaleedHaji) | Admin Routes |

## Credits

- Our respected Instructor Omar Kamal
- Class Materials
- https://www.npmjs.com/package/multer
- https://www.w3schools.com/

