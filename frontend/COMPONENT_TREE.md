# 🎨 ChronoExchange - Component Tree & Page Flow

## 📱 Application Structure

```
App.jsx (Router + AuthProvider)
│
├── Public Routes
│   ├── /login → Login.jsx
│   │   ├── Split Screen Layout
│   │   ├── Branding Section (Left)
│   │   ├── Login Form (Right)
│   │   │   ├── Email Input
│   │   │   ├── Password Input (with show/hide)
│   │   │   ├── Submit Button (with loading)
│   │   │   └── Social Login Buttons
│   │   └── Link to Register
│   │
│   └── /register → Register.jsx
│       ├── Split Screen Layout
│       ├── Branding Section (Left)
│       ├── Register Form (Right)
│       │   ├── Profile Photo Upload
│       │   ├── Name Input
│       │   ├── Email Input
│       │   ├── Password Input (with show/hide)
│       │   ├── Confirm Password Input
│       │   ├── Role Dropdown
│       │   ├── Submit Button (with loading)
│       │   └── Social Login Buttons
│       └── Link to Login
│
└── Protected Routes (DashboardLayout)
    │
    ├── DashboardLayout.jsx
    │   ├── Sidebar.jsx (Collapsible)
    │   │   ├── Logo/Brand
    │   │   ├── Collapse Toggle
    │   │   └── Navigation Menu
    │   │       ├── User Menu (8 items)
    │   │       │   ├── Dashboard
    │   │       │   ├── Profile
    │   │       │   ├── Create Service
    │   │       │   ├── Browse Services
    │   │       │   ├── My Requests
    │   │       │   ├── Wallet
    │   │       │   ├── Transactions
    │   │       │   └── Chat
    │   │       └── Admin Menu (5 items)
    │   │           ├── Dashboard
    │   │           ├── Users
    │   │           ├── Services
    │   │           ├── Transactions
    │   │           └── Analytics
    │   │
    │   ├── Navbar.jsx
    │   │   ├── Notification Bell
    │   │   │   └── Notification Dropdown
    │   │   │       └── Notification Items
    │   │   └── Profile Section
    │   │       └── Profile Dropdown
    │   │           ├── Profile Link
    │   │           ├── Settings Link
    │   │           └── Logout Button
    │   │
    │   └── Main Content Area (Outlet)
    │
    ├── /dashboard → Dashboard.jsx
    │   ├── Stats Cards (4)
    │   │   ├── Total Credits
    │   │   ├── Active Services
    │   │   ├── Completed Exchanges
    │   │   └── Average Rating
    │   └── Recent Activity List
    │
    ├── /profile → Profile.jsx
    │   ├── Profile Card
    │   │   ├── Avatar
    │   │   ├── Name & Email
    │   │   └── Edit Button
    │   ├── Stats Card
    │   │   ├── Total Credits
    │   │   ├── Completed Exchanges
    │   │   └── Average Rating
    │   ├── Details Card
    │   │   ├── Bio
    │   │   ├── Skills Offered (Tags)
    │   │   └── Skills Needed (Tags)
    │   └── Edit Profile Modal
    │       ├── Name Input
    │       ├── Bio Textarea
    │       ├── Skills Offered Manager
    │       ├── Skills Needed Manager
    │       └── Save/Cancel Buttons
    │
    ├── /services → Services.jsx
    │   ├── Filters Card
    │   │   ├── Search Input
    │   │   ├── Category Dropdown
    │   │   └── Location Dropdown
    │   └── Service Cards Grid
    │       └── Service Card (each)
    │           ├── Category Badge
    │           ├── Rating Stars
    │           ├── Title
    │           ├── Description
    │           ├── Duration
    │           ├── Location
    │           ├── Credits
    │           ├── Provider Name
    │           └── Request Button
    │
    ├── /create-service → CreateService.jsx
    │   └── Service Form
    │       ├── Title Input
    │       ├── Description Textarea
    │       ├── Category Dropdown
    │       ├── Duration Input
    │       ├── Credits Input
    │       ├── Location Input
    │       ├── Image Upload Area
    │       └── Submit/Cancel Buttons
    │
    ├── /requests → MyRequests.jsx
    │   ├── Tabs (4)
    │   │   ├── Pending Tab
    │   │   ├── Accepted Tab
    │   │   ├── Completed Tab
    │   │   └── Cancelled Tab
    │   └── Request Cards
    │       └── Request Card (each)
    │           ├── Service Title
    │           ├── Status Badge
    │           ├── Provider Name
    │           ├── Credits & Date
    │           └── Action Buttons
    │               ├── Accept/Reject (Pending)
    │               ├── Mark Complete (Accepted)
    │               └── Rate Service (Completed)
    │
    ├── /wallet → Wallet.jsx
    │   ├── Summary Cards (3)
    │   │   ├── Total Credits
    │   │   ├── Credits Earned
    │   │   └── Credits Spent
    │   └── Transaction Table
    │       └── Table Rows
    │           ├── Date
    │           ├── Type (Earned/Spent)
    │           ├── From/To
    │           ├── Service
    │           ├── Credits
    │           └── Status Badge
    │
    ├── /chat → Chat.jsx
    │   ├── Conversation List (Left)
    │   │   ├── Search Input
    │   │   └── Conversation Items
    │   │       ├── Avatar
    │   │       ├── Online Indicator
    │   │       ├── Name
    │   │       ├── Last Message
    │   │       ├── Time
    │   │       └── Unread Badge
    │   └── Chat Window (Right)
    │       ├── Chat Header
    │       │   ├── Avatar
    │       │   ├── Name
    │       │   ├── Online Status
    │       │   └── More Options
    │       ├── Messages Area
    │       │   └── Message Bubbles
    │       │       ├── Text
    │       │       └── Timestamp
    │       └── Input Area
    │           ├── Attachment Button
    │           ├── Message Input
    │           └── Send Button
    │
    └── /analytics → Analytics.jsx (Admin Only)
        ├── Stats Cards (3)
        │   ├── Total Users
        │   ├── Total Exchanges
        │   └── Credits Circulated
        └── Charts Grid (4)
            ├── Line Chart (Monthly Exchanges)
            ├── Pie Chart (Top Categories)
            ├── Bar Chart (Active Users)
            └── Area Chart (Credits Flow)
```

## 🎭 Reusable Components

```
components/common/
├── Sidebar.jsx
│   └── Used in: DashboardLayout
├── Navbar.jsx
│   └── Used in: DashboardLayout
├── ProtectedRoute.jsx
│   └── Used in: App routing
├── RoleBasedRoute.jsx
│   └── Used in: Admin routes
├── RatingModal.jsx
│   └── Used in: MyRequests (Completed tab)
├── Toast.jsx
│   └── Used in: Any page for notifications
└── Loading.jsx
    └── Used in: Any page for loading states
```

## 🔄 Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
API Service (axios)
    ↓
Backend API (when connected)
    ↓
Response
    ↓
Update State (Context/Local)
    ↓
Re-render UI
    ↓
Show Feedback (Toast/Animation)
```

## 🎨 Animation Flow

```
Page Load
    ↓
Framer Motion Initial State (opacity: 0, y: 20)
    ↓
Animate to Final State (opacity: 1, y: 0)
    ↓
Stagger Effect on Lists (delay: index * 0.1)
    ↓
Hover Effects (scale, shadow, color)
    ↓
Exit Animations (modals, dropdowns)
```

## 🔐 Authentication Flow

```
User Visits App
    ↓
Check localStorage for token
    ↓
Token Exists? → Yes → Load user data → Show Dashboard
    ↓
Token Exists? → No → Redirect to Login
    ↓
User Logs In
    ↓
Store token & user in localStorage
    ↓
Update AuthContext
    ↓
Redirect to Dashboard
```

## 📱 Responsive Breakpoints

```
Mobile (< 768px)
    ├── Single column layouts
    ├── Stacked cards
    ├── Hamburger menu (if needed)
    └── Full-width components

Tablet (768px - 1024px)
    ├── 2-column grids
    ├── Sidebar visible
    └── Adjusted spacing

Desktop (> 1024px)
    ├── 3-4 column grids
    ├── Full sidebar
    ├── Optimal spacing
    └── All features visible
```

## 🎯 User Journey Map

```
New User
    ↓
Register → Upload Photo → Set Role
    ↓
Login → View Dashboard
    ↓
Complete Profile → Add Skills
    ↓
Browse Services → Request Service
    ↓
Chat with Provider
    ↓
Complete Exchange
    ↓
Rate Service → Earn Credits
    ↓
Offer Own Service
    ↓
Build Reputation
```

## 🔧 Component Props Flow

```
App.jsx
    ↓ (user, login, logout)
AuthContext.Provider
    ↓ (user)
DashboardLayout
    ├─→ Sidebar (collapsed, setCollapsed)
    ├─→ Navbar (notifications)
    └─→ Page Components
        └─→ Child Components (data, handlers)
```

---

**Visual representation of the complete ChronoExchange frontend architecture** 🎨
