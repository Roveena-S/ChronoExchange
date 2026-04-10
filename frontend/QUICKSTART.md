# ChronoExchange Frontend - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Navigate to: `http://localhost:5173`

## 🎯 Test Accounts (Mock Data)

Since this is frontend-only, you can use any credentials to test:

**User Account:**
- Email: user@example.com
- Password: password123

**Admin Account:**
- Email: admin@example.com
- Password: admin123

## 📋 Features to Test

### ✅ Authentication
1. Visit `/register` to see the registration page
2. Visit `/login` to see the login page
3. Try the social login buttons (UI only)
4. Test show/hide password functionality

### ✅ Dashboard
1. View stats cards with animations
2. Check recent activity section
3. Test sidebar collapse/expand
4. Try notification dropdown
5. Test profile dropdown

### ✅ Profile
1. View profile information
2. Click "Edit Profile" to open modal
3. Add/remove skills
4. Test save functionality

### ✅ Services
1. Browse service cards
2. Use search functionality
3. Filter by category
4. Filter by location
5. Hover over cards for animation

### ✅ Create Service
1. Fill out the service form
2. Test form validation
3. Try file upload UI
4. Submit the form

### ✅ My Requests
1. Switch between tabs (Pending, Accepted, Completed, Cancelled)
2. View color-coded status badges
3. Test action buttons

### ✅ Wallet
1. View wallet stats
2. Check transaction history table
3. Test table hover effects

### ✅ Chat
1. Select a conversation
2. View message history
3. Test message input
4. Check online indicators

### ✅ Analytics (Admin Only)
1. View stats cards
2. Check all 4 charts:
   - Line chart (Monthly Exchanges)
   - Pie chart (Top Categories)
   - Bar chart (Active Users)
   - Area chart (Credits Flow)

## 🎨 UI Components to Explore

### Animations
- Page transitions
- Card hover effects
- Button loading states
- Modal animations
- Toast notifications
- Stagger effects on lists

### Responsive Design
- Test on mobile (< 768px)
- Test on tablet (768px - 1024px)
- Test on desktop (> 1024px)
- Sidebar collapses on mobile

### Interactive Elements
- Collapsible sidebar
- Dropdown menus
- Tabs
- Modals
- Star rating
- Form validation

## 🔧 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#4F46E5',    // Change this
  secondary: '#6366F1',  // Change this
  accent: '#22C55E',     // Change this
}
```

### Change API URL
Edit `src/services/api.js`:
```javascript
baseURL: 'http://localhost:5000/api',  // Change this
```

### Add New Routes
Edit `src/App.jsx`:
```javascript
<Route path="/new-page" element={<NewPage />} />
```

## 📱 Mobile Testing

### Chrome DevTools
1. Press F12
2. Click device toolbar icon
3. Select device (iPhone, iPad, etc.)
4. Test all features

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
npm run dev
```

### Tailwind Not Working
```bash
# Reinstall Tailwind
npm uninstall tailwindcss
npm install -D tailwindcss postcss autoprefixer
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## 🎯 Next Steps

1. **Connect to Backend**: Update API endpoints in `src/services/api.js`
2. **Add Real Authentication**: Implement JWT token handling
3. **Socket.io Integration**: Connect real-time chat functionality
4. **Image Upload**: Implement actual file upload logic
5. **Form Validation**: Add comprehensive validation
6. **Error Handling**: Improve error messages and handling
7. **Loading States**: Add more loading indicators
8. **Pagination**: Add pagination to lists
9. **Search**: Implement real search functionality
10. **Notifications**: Connect to real notification system

## 💡 Tips

- Use React DevTools for debugging
- Check console for errors
- Test all responsive breakpoints
- Verify all animations work smoothly
- Test form validation
- Check accessibility (keyboard navigation)

## 📚 Documentation

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Framer Motion](https://www.framer.com/motion)
- [Recharts](https://recharts.org)

## 🤝 Need Help?

- Check the main README.md
- Review component code
- Check browser console
- Verify all dependencies are installed

---

Happy Coding! 🚀
