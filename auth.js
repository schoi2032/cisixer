// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";  

// API Keys from environments
const apiKey = process.env.API_KEY;

// Firebase configuration
const firebaseConfig = {
  apiKey: "apiKey",
  authDomain: "sixers-18889.firebaseapp.com",
  projectId: "sixers-18889",
  storageBucket: "sixers-18889.firebasestorage.app",
  messagingSenderId: "931834747698",
  appId: "1:931834747698:web:7701d240c826a7f26f152b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign-In Handler
function handleGoogleSignIn() {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      const email = user.email;
      
      // Validate email is from chadwickschool.org
      if (!email.endsWith('@chadwickschool.org')) {
        showError('❌ Please use your @chadwickschool.org email address.');
        signOut(auth);
        return;
      }
      
      // Sign in successful
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: email,
        photo: user.photoURL
      }));
      
      window.location.href = './index.html';
    })
    .catch((error) => {
      showError('❌ Sign-in failed: ' + error.message);
    });
}

// Show error message
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }
}

// Sign out handler
function handleSignOut() {
  signOut(auth)
    .then(() => {
      localStorage.removeItem('user');
      window.location.href = './login.html';
    })
    .catch((error) => {
      console.error('Sign out error:', error);
    });
}

// Check authentication status
function checkAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email.endsWith('@chadwickschool.org')) {
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL
        }));
        resolve(user);
      } else {
        localStorage.removeItem('user');
        resolve(null);
      }
    });
  });
}

// Require authentication on protected pages
async function requireAuth() {
  const user = await checkAuth();
  if (!user && !window.location.pathname.includes('login.html')) {
    window.location.href = './login.html';
  }
  return user;
}

// Setup Google sign-in button
document.addEventListener('DOMContentLoaded', () => {
  const googleButton = document.getElementById('google-signin-button');
  if (googleButton) {
    googleButton.addEventListener('click', handleGoogleSignIn);
  }
  
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleSignOut);
  }
  
  // Check auth on page load
  if (!window.location.pathname.includes('login.html')) {
    requireAuth();
  }
});
