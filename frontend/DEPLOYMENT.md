# Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)

#### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)

#### Steps:
1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/web-chat-manus.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite app
   - Add environment variables (see below)
   - Click "Deploy"

3. **Environment Variables** (Add in Vercel dashboard):
   ```
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=karobataa.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=karobataa
   VITE_FIREBASE_STORAGE_BUCKET=karobataa.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=662140031605
   VITE_FIREBASE_APP_ID=1:662140031605:web:c699458133fb8b6f009e3c
   VITE_FIREBASE_MEASUREMENT_ID=G-JMSKTDGYRL
   ```

### Option 2: Netlify

#### Steps:
1. **Build the app**:
   ```bash
   pnpm build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login
   - Drag and drop the `dist` folder
   - Or connect your GitHub repository

3. **Environment Variables** (Add in Netlify dashboard):
   - Same as Vercel above

### Option 3: Firebase Hosting

#### Steps:
1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase**:
   ```bash
   firebase init hosting
   ```

4. **Build and Deploy**:
   ```bash
   pnpm build
   firebase deploy
   ```

### Option 4: GitHub Pages

#### Steps:
1. **Add GitHub Pages dependency**:
   ```bash
   pnpm add -D gh-pages
   ```

2. **Update package.json**:
   ```json
   {
     "scripts": {
       "predeploy": "pnpm build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   pnpm deploy
   ```

## 🔧 Pre-deployment Checklist

### 1. Environment Variables
Make sure your `.env` file has all the Firebase credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSyAwp4znkO1j9EMcptunBCuxGIExWluhy0o
VITE_FIREBASE_AUTH_DOMAIN=karobataa.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=karobataa
VITE_FIREBASE_STORAGE_BUCKET=karobataa.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=662140031605
VITE_FIREBASE_APP_ID=1:662140031605:web:c699458133fb8b6f009e3c
VITE_FIREBASE_MEASUREMENT_ID=G-JMSKTDGYRL
```

### 2. Firebase Configuration
Ensure these services are enabled in your Firebase Console:
- ✅ Authentication (Email/Password)
- ✅ Firestore Database
- ✅ Storage

### 3. Build Test
Test the build locally:
```bash
pnpm build
pnpm preview
```

## 🌐 Custom Domain (Optional)

### Vercel:
1. Go to your project dashboard
2. Settings → Domains
3. Add your custom domain
4. Update DNS records

### Netlify:
1. Site settings → Domain management
2. Add custom domain
3. Update DNS records

## 📱 PWA Configuration (Optional)

To make your app installable as a PWA:

1. **Add manifest.json** to `public/` folder
2. **Add service worker**
3. **Update index.html** with PWA meta tags

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Firebase Rules**: Review and update Firestore security rules
3. **CORS**: Configure Firebase for your domain
4. **HTTPS**: All hosting platforms provide HTTPS by default

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check for missing dependencies
   - Verify environment variables
   - Check console for errors

2. **Firebase Connection Issues**:
   - Verify API keys
   - Check Firebase console for errors
   - Ensure services are enabled

3. **CORS Errors**:
   - Add your domain to Firebase Auth authorized domains
   - Check Firestore rules

## 📊 Performance Optimization

1. **Image Optimization**: Use WebP format
2. **Code Splitting**: Vite handles this automatically
3. **Caching**: Configure proper cache headers
4. **CDN**: Most hosting platforms provide CDN

## 🎯 Recommended Workflow

1. **Development**: Use `pnpm dev` for local development
2. **Testing**: Use `pnpm build && pnpm preview` for production testing
3. **Deployment**: Use Vercel for automatic deployments
4. **Monitoring**: Use Firebase Analytics and hosting platform analytics 