# ChronoExchange - Digital Time Banking System (Frontend)

A modern, clean, and professional frontend for the ChronoExchange time banking platform built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Authentication System**: Login and Register pages with split-screen design
- **Dashboard Layout**: Collapsible sidebar with role-based navigation
- **Service Marketplace**: Browse, search, and filter services
- **Request Management**: Track pending, accepted, completed, and cancelled requests
- **Wallet & Transactions**: View credits and transaction history
- **Real-time Chat**: Message other users with online indicators
- **Analytics Dashboard**: Visualize data with Recharts (Admin only)
- **Profile Management**: Edit profile with skills and bio
- **Rating System**: Rate completed services with star ratings
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for delightful interactions

## 🎨 Design System

### Color Palette
- **Primary**: #4F46E5 (Indigo)
- **Secondary**: #6366F1
- **Accent**: #22C55E (Green)
- **Background**: #F9FAFB (Light Gray)
- **Cards**: White
- **Text**: #111827 (Dark Gray)

### UI Principles
- Clean and minimal design
- Professional corporate style
- Soft shadows and rounded cards
- Smooth transitions
- Good spacing and typography
- Dashboard-style layout

## 📦 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management
- **Recharts** - Data visualization
- **Socket.io-client** - Real-time features (UI only)
- **React Icons** - Icon library
- **Framer Motion** - Animations

## 🛠️ Installation

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
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── RoleBasedRoute.jsx
│   │   ├── RatingModal.jsx
│   │   └── Toast.jsx
│   ├── auth/            # Authentication components
│   └── dashboard/       # Dashboard-specific components
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── Services.jsx
│   ├── CreateService.jsx
│   ├── MyRequests.jsx
│   ├── Wallet.jsx
│   ├── Chat.jsx
│   └── Analytics.jsx
├── layouts/
│   └── DashboardLayout.jsx
├── context/
│   └── AuthContext.jsx
├── hooks/
│   └── useToast.js
├── services/
│   └── api.js
├── utils/
│   └── helpers.js
├── assets/
├── App.jsx
├── main.jsx
└── index.css
```

## 🔐 Authentication

The app uses JWT-based authentication with the following flow:
1. User logs in or registers
2. Token is stored in localStorage
3. Token is attached to all API requests via Axios interceptor
4. Protected routes check for valid token
5. Role-based routes restrict access based on user role

## 🎯 Available Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### User Routes
- `/dashboard` - Main dashboard
- `/profile` - User profile
- `/services` - Browse services
- `/create-service` - Create new service
- `/requests` - My requests
- `/wallet` - Wallet and transactions
- `/chat` - Chat interface

### Admin Routes
- `/analytics` - Analytics dashboard
- `/users` - User management

## 🎨 Custom Tailwind Classes

```css
.card - White card with shadow and padding
.btn-primary - Primary button style
.btn-secondary - Secondary button style
.input-field - Styled input field
```

## 🔧 Configuration

Update the API base URL in `src/services/api.js`:
```javascript
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## 🎭 Key Features Explained

### Collapsible Sidebar
- Click the chevron icon to collapse/expand
- Shows icons only when collapsed
- Smooth animation transition

### Notification System
- Bell icon in navbar shows unread count
- Dropdown displays recent notifications
- Click outside to close

### Profile Dropdown
- Shows user name and avatar
- Quick access to profile and settings
- Logout functionality

### Service Cards
- Hover effect with lift animation
- Category badges
- Rating display
- Request button

### Request Tabs
- Color-coded status badges
- Action buttons based on status
- Smooth tab transitions

### Chat Interface
- Real-time message display
- Online/offline indicators
- Smooth scroll to bottom
- Message bubbles with timestamps

### Analytics Charts
- Line chart for monthly exchanges
- Pie chart for category distribution
- Bar chart for active users
- Area chart for credits flow

## 🎨 Animation Details

All animations use Framer Motion with:
- Fade in on mount
- Stagger effect for lists
- Hover animations on cards
- Smooth page transitions
- Modal animations

## 📝 Notes

- This is a frontend-only implementation
- API calls are configured but need backend integration
- Socket.io is set up for UI only
- Mock data is used for demonstration
- All components are fully responsive

## 🤝 Contributing

1. Follow the existing code style
2. Use functional components with hooks
3. Keep components small and focused
4. Add proper prop validation
5. Write clean, readable code

## 📄 License

This project is part of the ChronoExchange Digital Time Banking System.

---

Built with ❤️ using React, Vite, and Tailwind CSS
