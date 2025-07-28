# Wedding Authentication System

This directory contains the wedding authentication system with login, registration, and dashboard functionality.

## File Structure

```
src/app/wedding/
├── components/
│   └── WeddingNavbar.tsx          # Wedding-specific navbar with auth integration
├── login/
│   └── page.tsx                   # User login page
├── register/
│   └── page.tsx                   # User registration page
├── dashboard/
│   └── page.tsx                   # Wedding dashboard for logged-in users
├── templates/
│   └── [slag]/
│       ├── contexts/
│       │   ├── WeddingAuthContext.tsx    # Authentication context
│       │   ├── WeddingContext.tsx        # Wedding data context
│       │   └── WeddingProvider.tsx       # Wedding provider
│       ├── types/
│       │   └── wedding.ts                # Type definitions
│       └── model_1/                      # Wedding template
└── layout.tsx                     # Wedding layout with auth providers
```

## Features

### 🔐 Authentication
- **Login Page**: Secure user authentication with email/password
- **Registration Page**: New user account creation
- **Session Management**: Persistent login state with localStorage
- **Logout Functionality**: Secure logout with session cleanup

### 🎨 UI Components
- **WeddingNavbar**: Integrated navbar with authentication status
- **Responsive Design**: Mobile-friendly interface
- **Toast Notifications**: User feedback for actions
- **Loading States**: Smooth user experience

### 🏠 Dashboard
- **User Information**: Display bride/groom names
- **Quick Actions**: Easy access to wedding management
- **Template Selection**: Wedding website template management
- **Navigation**: Seamless navigation between sections

## Authentication Flow

1. **Registration**: Users create accounts with email, password, and wedding details
2. **Login**: Users authenticate with email/password
3. **Session**: Authentication state persists across browser sessions
4. **Dashboard**: Logged-in users access wedding management features
5. **Logout**: Secure session termination

## Integration with Navbar

The `WeddingNavbar` component integrates with the main navbar to provide:
- **Login Button**: For unauthenticated users
- **Wedding Dashboard**: For authenticated users
- **Logout**: Secure logout functionality
- **Mobile Support**: Responsive mobile navigation

## Usage

### Login Page
```tsx
// Navigate to login
navigate('/wedding/login');
```

### Registration Page
```tsx
// Navigate to registration
navigate('/wedding/register');
```

### Dashboard
```tsx
// Navigate to dashboard (requires authentication)
navigate('/wedding/dashboard');
```

### Navbar Integration
```tsx
import WeddingNavbar from '@/app/wedding/components/WeddingNavbar';

// Use in your layout
<WeddingNavbar />
```

## Authentication Context

The wedding authentication system uses React Context for state management:

```tsx
import { useWeddingAuth } from '@/app/wedding/templates/[slag]/contexts/WeddingAuthContext';

const { isLoggedIn, user, login, logout } = useWeddingAuth();
```

## Database Schema

The system integrates with Supabase and expects the following table structure:

### user_profile Table
```sql
CREATE TABLE user_profile (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  bride_name TEXT,
  groom_name TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Features

- **Password Validation**: Minimum 6 characters required
- **Email Validation**: Proper email format validation
- **Session Management**: Secure localStorage usage
- **Error Handling**: Comprehensive error messages
- **Loading States**: User feedback during operations

## Styling

The wedding authentication system uses:
- **Tailwind CSS**: For responsive styling
- **Shadcn/ui**: For consistent component design
- **Lucide React**: For icons
- **Gradient Backgrounds**: Purple/pink theme for wedding aesthetic

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Social media login integration
- [ ] Advanced user profile management
- [ ] Wedding website analytics
- [ ] Guest RSVP system 