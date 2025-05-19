Flint Backend

Flint Backend is the server-side component for the Flint application, providing robust and scalable APIs for handling chat, user authentication, and real-time messaging. This project is built using Node.js and Express.js, with MongoDB as the primary database. It also integrates Socket.IO for real-time chat capabilities.

Features

User Authentication (JWT-based)

Real-time Chat with Socket.IO

Chat Session Management

Secure Password Hashing (bcrypt)

API for Chat Messages

MongoDB for Data Storage

Environment-based Configuration

Technologies Used

Node.js

Express.js

MongoDB (Mongoose)

Socket.IO

bcrypt.js

JWT (JSON Web Token)

Prerequisites

Node.js (v18+)

MongoDB Database

npm or yarn package manager

Getting Started

1. Clone the Repository

git clone https://github.com/yuzamarde/flin-backend
cd flint-backend

2. Install Dependencies

npm install

3. Environment Variables

Create a .env file in the root directory and configure the following variables:

NODE_ENV=development
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
SOCKET_PORT=5001
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/

4. Run the Server

npm start

5. Run in Development Mode

npm run dev

API Endpoints

User Authentication

POST /api/sign-up - Register a new user

POST /api/sign-in - User login


Chat Management

POST /api/chats - Create a new chat session

GET /api/chats - Get all chat sessions

GET /api/chats/:chatId - Get messages for a specific chat

POST /api/chats/:chatId/messages - Send a message in a chat


Socket.IO Events

connection - Client connected to the server

message - Message sent by a user

disconnect - Client disconnected from the server

Directory Structure

flint-backend/
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── .env
├── package.json
├── README.md
└── server.js

Contributing

Contributions are welcome! Please follow the guidelines:

Fork the repository

Create a new branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m 'Add your feature')

Push to the branch (git push origin feature/your-feature)

Open a pull request

License

This project is licensed under the MIT License. See the LICENSE file for details.

Contact

For any inquiries or support, please contact the project maintainer.

