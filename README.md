# ChatApp - Modern Web Messaging Application

A modern, real-time messaging web application built with React and Firebase, featuring user authentication, real-time messaging, and image sharing capabilities.

## 🚀 Features

### Core Features
- **User Authentication**: Secure registration and login with Firebase Auth
- **Real-time Messaging**: Instant message delivery using Firestore real-time listeners
- **User Search**: Find and connect with other users
- **Chat Management**: Organized chat list with last message preview
- **Image Sharing**: Upload and share images with automatic compression
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### UI/UX Features
- **Modern Design**: Clean, intuitive interface using shadcn/ui components
- **Material Icons**: Lucide React icons for consistent visual language
- **Real-time Updates**: Live message status and online indicators
- **Message Timestamps**: Smart time formatting (now, 5m ago, 2h ago, etc.)
- **Message Bubbles**: Distinct styling for sent and received messages
- **Loading States**: Smooth loading indicators for better UX

## 🛠️ Technology Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Icons**: Lucide React
- **State Management**: React Context API
- **Build Tool**: Vite
- **Package Manager**: pnpm

## 📦 Project Structure

```
web-chat-app/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── chat/
│   │   │   ├── ChatArea.jsx
│   │   │   ├── ChatLayout.jsx
│   │   │   └── ChatSidebar.jsx
│   │   └── ui/                    # shadcn/ui components
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ChatContext.jsx
│   ├── lib/
│   │   └── firebase.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── package.json
└── vite.config.js
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ and pnpm
- Firebase project with Auth, Firestore, and Storage enabled

### 1. Clone and Install
```bash
git clone <repository-url>
cd web-chat-app
pnpm install
```

### 2. Firebase Configuration
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Enable Firebase Storage
5. Get your Firebase config from Project Settings > General > Your apps
6. Create a `.env` file in your project root with the following variables:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Important**: Replace the placeholder values with your actual Firebase credentials. The signup functionality will not work until Firebase is properly configured.

### 3. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }
    
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId);
    }
    
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
  }
}
```

### 4. Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /chat-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run the Application
```bash
pnpm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 Usage Guide

### Getting Started
1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Search Users**: Use the search bar to find other users
4. **Start Chat**: Click on a user to start a conversation
5. **Send Messages**: Type and send text messages or images
6. **Real-time Updates**: Messages appear instantly across all devices

### Key Features

#### Authentication
- **Registration**: Email, password, and display name required
- **Login**: Email and password authentication
- **Auto-login**: Persistent authentication state
- **Logout**: Secure logout with status updates

#### Messaging
- **Text Messages**: Send and receive text messages in real-time
- **Image Sharing**: Upload images up to 5MB with automatic compression
- **Message Status**: See when messages were sent with smart timestamps
- **Chat History**: All messages are stored and synchronized

#### User Interface
- **Responsive**: Works on desktop, tablet, and mobile
- **Dark/Light**: Automatic theme based on system preference
- **Modern Design**: Clean, intuitive interface
- **Real-time**: Live updates without page refresh

## 🔒 Security Features

### Authentication Security
- Firebase Auth handles secure authentication
- Password requirements enforced
- Email verification available
- Secure session management

### Data Security
- Firestore security rules prevent unauthorized access
- Users can only access their own data and conversations
- Image uploads restricted to authenticated users
- Real-time database rules enforce permissions

### Privacy
- Messages are private between participants
- User search respects privacy settings
- No data is stored locally beyond session

## 🚀 Deployment

### Development
```bash
pnpm run dev
```

### Production Build
```bash
pnpm run build
pnpm run preview
```

### Deploy to Vercel/Netlify
1. Build the project: `pnpm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables for Firebase

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔄 Real-time Features

### Live Updates
- **Messages**: Appear instantly without refresh
- **Online Status**: Real-time user presence
- **Chat List**: Updates with new messages
- **Typing Indicators**: See when someone is typing (future feature)

### Performance
- **Optimized Queries**: Efficient Firestore queries
- **Image Compression**: Automatic image optimization
- **Lazy Loading**: Components load as needed
- **Caching**: Firebase handles offline caching

## 🛠️ Development

### Available Scripts
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

### Code Structure
- **Components**: Reusable UI components
- **Contexts**: Global state management
- **Hooks**: Custom React hooks
- **Utils**: Helper functions

## 🐛 Troubleshooting

### Common Issues

**Firebase Connection**
- Verify Firebase config in `firebase.js`
- Check Firebase project settings
- Ensure all services are enabled

**Authentication Issues**
- Check Firebase Auth configuration
- Verify email/password provider is enabled
- Check browser console for errors

**Messages Not Appearing**
- Verify Firestore security rules
- Check network connectivity
- Ensure user is authenticated

**Image Upload Fails**
- Check Firebase Storage configuration
- Verify file size (max 5MB)
- Ensure proper permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review Firebase documentation
- Create an issue in the repository

---

Built with ❤️ using React and Firebase

