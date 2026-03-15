// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";  

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDjW3iIlIDjQVMurDu-EDwQa-OHvH9oS7U",
    authDomain: "sixers-18889.firebaseapp.com",
    projectId: "sixers-18889",
    storageBucket: "sixers-18889.firebasestorage.app",
    messagingSenderId: "931834747698",
    appId: "1:931834747698:web:7701d240c826a7f26f152b"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);


const submit=document.getElementById("submit");



submit.addEventListener('click', (e) => {
  e.preventDefault();

  const email=document.getElementById("email").value;
  const password=document.getElementById("password").value;
  
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
    // ..
  });

});