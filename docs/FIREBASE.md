# Firebase Read-Only Integration Guide

This document explains how to use Firebase for read-only operations in the LeapRoad Admin UI v2.

## Overview

The Firebase integration provides **read-only** access to:
- **Authentication**: Custom token-based authentication with backend
- **Realtime Database**: Real-time data listening and reading
- **Cloud Storage**: File download and URL retrieval
- **Firestore**: Document reading and querying

> **Note**: This integration is configured for **read-only operations only**. No write, update, or delete operations are available.

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env` and configure your Firebase project:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com/
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Install Dependencies

Firebase is already included in package.json:

```bash
npm install
```

## Usage

### Authentication

```jsx
import { useFirebaseAuth } from '../contexts/FirebaseContext';

function MyComponent() {
  const { user, loading, signInWithCustomToken, signOut, isAuthenticated } = useFirebaseAuth();

  const handleSignIn = async () => {
    try {
      await signInWithCustomToken();
      console.log('Signed in successfully');
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.uid}</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
    </div>
  );
}
```

### Realtime Database (Read-Only)

```jsx
import { useRealtimeDatabase, useRealtimeListener } from '../hooks/useFirebaseOperations';

function DataComponent() {
  const { readData, listenToData, checkPathExists, loading, error } = useRealtimeDatabase();

  // One-time read
  const loadData = async () => {
    try {
      const data = await readData('users/123');
      console.log('User data:', data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Check if data exists
  const checkData = async () => {
    try {
      const exists = await checkPathExists('users/123');
      console.log('Data exists:', exists);
    } catch (error) {
      console.error('Error checking data:', error);
    }
  };

  return (
    <div>
      <button onClick={loadData} disabled={loading}>Load Data</button>
      <button onClick={checkData} disabled={loading}>Check Data</button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}

// Real-time listener with automatic cleanup
function RealtimeDataComponent() {
  const { data, loading, error } = useRealtimeListener('users/123');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Real-time Data:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

### Cloud Storage (Read-Only)

```jsx
import { useFirebaseStorage } from '../hooks/useFirebaseOperations';

function FileViewComponent() {
  const { getDownloadURL, validateFile, loading, error } = useFirebaseStorage();

  const viewFile = async (filePath) => {
    try {
      const url = await getDownloadURL(filePath);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error getting file URL:', error);
    }
  };

  const checkFileType = (fileName) => {
    const isValidImage = validateFile(fileName, ['jpg', 'jpeg', 'png', 'gif']);
    console.log('Is valid image:', isValidImage);
  };

  return (
    <div>
      <button 
        onClick={() => viewFile('uploads/document.pdf')} 
        disabled={loading}
      >
        View File
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Firestore (Read-Only)

```jsx
import { useFirestore } from '../hooks/useFirebaseOperations';

function DocumentComponent() {
  const { readDocument, queryCollection, getAllDocuments, loading, error } = useFirestore();

  const loadUser = async (userId) => {
    try {
      const user = await readDocument('users', userId);
      console.log('User:', user);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const findAdmins = async () => {
    try {
      const conditions = [{ field: 'role', operator: '==', value: 'admin' }];
      const orderBy = { field: 'createdAt', direction: 'desc' };
      const admins = await queryCollection('users', conditions, orderBy, 10);
      console.log('Admins found:', admins);
    } catch (error) {
      console.error('Error finding admins:', error);
    }
  };

  const loadAllUsers = async () => {
    try {
      const users = await getAllDocuments('users');
      console.log('All users:', users);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  return (
    <div>
      <button onClick={() => loadUser('user123')} disabled={loading}>Load User</button>
      <button onClick={findAdmins} disabled={loading}>Find Admins</button>
      <button onClick={loadAllUsers} disabled={loading}>Load All Users</button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Cached Data Hook

```jsx
import { useFirebaseData } from '../hooks/useFirebaseOperations';

function CachedDataComponent() {
  const { 
    data, 
    loading, 
    error, 
    refetch 
  } = useFirebaseData('users/123', 'realtime');

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && (
        <div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <button onClick={refetch}>Refresh</button>
        </div>
      )}
    </div>
  );
}
```

### Combined Operations

```jsx
import { useFirebaseOperations } from '../hooks/useFirebaseOperations';

function CombinedComponent() {
  const { realtimeDb, storage, firestore, utils } = useFirebaseOperations();

  const handleMultipleOperations = async () => {
    try {
      // Read from multiple sources
      const realtimeData = await realtimeDb.readData('stats/daily');
      const firestoreData = await firestore.readDocument('configs', 'app');
      const fileUrl = await storage.getDownloadURL('assets/logo.png');
      
      console.log('Realtime data:', realtimeData);
      console.log('Firestore data:', firestoreData);
      console.log('File URL:', fileUrl);
      
      // Format timestamp
      const formatted = utils.formatTimestamp(Date.now());
      console.log('Formatted timestamp:', formatted);
    } catch (error) {
      console.error('Error in operations:', error);
    }
  };

  return (
    <button onClick={handleMultipleOperations}>
      Load All Data
    </button>
  );
}
```

## API Integration

### Backend Firebase Token

The admin UI automatically fetches Firebase custom tokens from the backend:

```javascript
// Backend endpoint: GET /admin/auth/firebase-token
// Returns: { data: { firebaseToken: "custom_token_here" } }
```

Ensure your backend provides this endpoint for Firebase authentication.

## File Structure

```
src/
├── config/
│   └── firebase.js              # Firebase configuration and initialization
├── contexts/
│   └── FirebaseContext.jsx      # React context for Firebase
├── hooks/
│   └── useFirebaseOperations.js # Custom hooks for Firebase read operations
├── services/
│   └── firebaseService.js       # Core Firebase read-only services
└── api/
    └── authServices.js          # Authentication API services
```

## Security Rules (Read-Only)

### Realtime Database Rules

```json
{
  "rules": {
    ".read": "auth != null && auth.token.role == 'admin'",
    ".write": false
  }
}
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null && request.auth.token.role == 'admin';
      allow write: if false;
    }
  }
}
```

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null && request.auth.token.role == 'admin';
      allow write: if false;
    }
  }
}
```

## Best Practices

1. **Always handle errors** when calling Firebase functions
2. **Use loading states** to provide user feedback
3. **Implement proper read-only security rules** for your Firebase project
4. **Clean up listeners** to prevent memory leaks using `useRealtimeListener`
5. **Use caching** with `useFirebaseData` to reduce API calls
6. **Validate file types** before attempting to display files
7. **Use environment variables** for all configuration

## Available Hooks

| Hook | Purpose | Use Case |
|------|---------|----------|
| `useFirebaseAuth` | Authentication management | Sign in/out, check auth status |
| `useRealtimeDatabase` | One-time data reads | Load specific data when needed |
| `useRealtimeListener` | Real-time data listening | Auto-updating components |
| `useFirebaseStorage` | File URL retrieval | Display/download files |
| `useFirestore` | Document operations | Query collections, read documents |
| `useFirebaseData` | Cached data with auto-refresh | General data loading with caching |
| `useFirebaseOperations` | Combined operations | Multiple Firebase services |

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure your backend provides the Firebase token endpoint
2. **Permission Denied**: Check your Firebase security rules (should allow read for admins)
3. **CORS Issues**: Configure Firebase project for your domain
4. **Environment Variables**: Ensure all VITE_FIREBASE_* variables are set
5. **Read-Only Errors**: Remember this setup only supports read operations

### Debug Mode

Enable Firebase debug mode in development:

```javascript
// In firebase.js
if (import.meta.env.DEV) {
  // Enable Firebase debug mode
  window.FIREBASE_DEBUG = true;
}
```

## Limitations

- **No Write Operations**: Cannot create, update, or delete data
- **Authentication Only**: Can authenticate but cannot manage user accounts
- **File Download Only**: Cannot upload or delete files
- **Read-Only Monitoring**: Can view data but cannot log activities

For write operations, use the backend API endpoints directly.

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)

For implementation issues, check the console logs and ensure all environment variables are properly configured.