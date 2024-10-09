import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, deleteUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore';


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXOhdQVXpMZrRdPUkQpzGM6tjpzAkk6Bk",
  authDomain: "the-rouge-prince.firebaseapp.com",
  databaseURL: "https://the-rouge-prince-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "the-rouge-prince",
  storageBucket: "the-rouge-prince.appspot.com",
  messagingSenderId: "904830004911",
  appId: "1:904830004911:web:52773012421d9e9ae66e5a",
  measurementId: "G-NCSSZ4HZ89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize auth instance with the app

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');

  return (
    <div style={styles.container}>
      {(userData === null || userData?.username !== username) && 
      <div style={styles.container}>
      <h1 style={styles.title}>Sign In</h1>
      <form onSubmit={handleSignIn} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="username">Username:</label>
          <input
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Sign In</button>
      </form>
      {status && <p style={styles.status}>{status}</p>}
      </div>
       }
      {userData?.username === username && (
        <div style={styles.userProfile}>
          <img src={userData.imageUrl} alt="User" style={styles.profileImage} />
          <p style={styles.username}>{userData.username}</p>
          <p style={styles.email}>{userData.email}</p>
          <button onClick={() => [signOut(auth), setUserData(null),setEmail(''),setPassword(''),setUsername('')]} style={styles.button}>Sign Out</button>
          <button onClick={() => [deleteUser(auth.currentUser), deleteDoc(doc(db, 'usersList', username)),setUserData(null),setEmail(''),setPassword(''),setUsername(''), setStatus('User profile deleted!')]} style={styles.button}>Delete User Profile</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  email:{
    fontSize: '12px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  userProfile: {
    marginTop: '20px',
    textAlign: 'center',
  },
  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
  },

  status: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#FF0000',
  },
};

export default SignIn;
