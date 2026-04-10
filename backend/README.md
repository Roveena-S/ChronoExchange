# ChronoExchange Backend API

Complete backend for ChronoExchange Digital Time Banking System.

## 🗄️ Database Collections

1. **Users** - User accounts and profiles
2. **Services** - Posted services
3. **Requests** - Service exchange requests
4. **Transactions** - Credit transactions
5. **Reviews** - User ratings and reviews
6. **Notifications** - User notifications
7. **Chats** - Messages between users
8. **AdminLogs** - Admin activity logs

## 🚀 Setup

```bash
cd backend
npm install
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Services
- `POST /api/services` - Create service (protected)
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `PUT /api/services/:id` - Update service (protected)
- `DELETE /api/services/:id` - Delete service (protected)

### Requests
- `POST /api/requests` - Create service request (protected)
- `GET /api/requests/my-requests` - Get my requests (protected)
- `PUT /api/requests/:id` - Update request status (protected)

### Users
- `GET /api/users/profile` - Get my profile (protected)
- `PUT /api/users/profile` - Update profile (protected)
- `GET /api/users` - Get all users (admin only)

### Transactions
- `GET /api/transactions/my-transactions` - Get my transactions (protected)
- `GET /api/transactions` - Get all transactions (admin only)

### Reviews
- `POST /api/reviews` - Create review (protected)
- `GET /api/reviews/service/:serviceId` - Get service reviews

### Notifications
- `GET /api/notifications` - Get my notifications (protected)
- `PUT /api/notifications/:id/read` - Mark as read (protected)

### Chat
- `GET /api/chats` - Get my chats (protected)
- `GET /api/chats/:userId` - Get or create chat (protected)
- `POST /api/chats/:chatId/message` - Send message (protected)

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

## ✅ Complete!

Backend is fully functional and ready to connect with frontend.
