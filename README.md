
# Digigyan - E-Book Store

Digigyan is an online e-book store that allows users to browse a list of available books. Authorized users have additional capabilities to upload, update, and delete books from the portal. The backend of this project is developed using Node.js and Express, with TypeScript providing type safety and modern JavaScript features.




## Table of Contents

- Features
- Tech Stack
- Installation
- Environment Variables
- Usage
- API Documentation
- Contributing
- License

## Features

- View a list of available books
- Authorized user functionalities:
  - Upload new books
  - Update book details
  - Delete books
- Secure authentication and authorization
- Robust error handling
- Image upload capabilities

## Tech Stack

- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT (jsonwebtoken), bcrypt
- File Upload: Multer, Cloudinary
- Environment Variables: dotenv
- Error Handling: http-errors
- CORS Handling: cors
- Linting and Formatting: ESLint, Prettier
- API Development and Testing: Postman


## Installation

Clone the repository:

```bash
git clone https://github.com/tanwarabhinandan/digigyan.git
```

Install dependencies:

```bash
npm install
```

Set up environment variables:

```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Run the application:

```bash
npm run dev
```

## Environment Variables

The project requires the following environment variables:

- PORT: The port on which the server will run.
- MONGO_URI: MongoDB connection string.
- JWT_SECRET: Secret key for JWT authentication.
- CLOUDINARY_CLOUD_NAME: Cloudinary cloud name for image uploads.
- CLOUDINARY_API_KEY: Cloudinary API key for image uploads.
- CLOUDINARY_API_SECRET: Cloudinary API secret for image uploads.

## Usage

Start the server:

```bash
npm run dev
```

Access the API:

The server will run on http://localhost:3000. Use Postman or any API client to interact with the API endpoints.


## API Documentation

#### Authenticate and books (CRUD)

The API includes the following endpoints:

#### Authentication:

  - POST : Register a new user

```http
  POST /api/users/resgister
```

| Body | Raw     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | ` JSON object` | **Required** |
| `email` | ` JSON object` | **Required** |
| `password` | ` JSON object` | **Required** |


  - POST : Authenticate a user

```http
  POST /api/users/login
```
| Body | Raw     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | ` JSON object` | **Required** |
| `password` | ` JSON object` | **Required** |


#### Books:

- GET : Get a single

```http
  GET /api/books/${bookId}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `bookId` | `string` | **Required** |

- GET : Get a list of all books

```http
  GET /api/books
```

- POST : Create/Upload a new book (Authorized users)

```http
  POST /api/books
```

- PATCH : Update book details (Authorized users)

```http
  POST /api/books/${bookId}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `bookId` | `string` | **Required** |

- DELETE : Delete a book (Authorized users)

```http
  DELETE /api/books/${bookId}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `bookId` | `string` | **Required** |


## Contributing

Contributions are welcome! Please follow these steps to contribute:

- Fork the repository
- Create a new branch: git checkout -b feature/your-feature-name
- Commit your changes: git commit -m 'Add some feature'
- Push to the branch: git push origin feature/your-feature-name
- Open a pull request

Please ensure your code adheres to the project's coding standards by running:

```bash
npm run lint
npm run format
```




## License

This project is licensed under the MIT License. See the LICENSE file for details.

[MIT](https://choosealicense.com/licenses/mit/)

