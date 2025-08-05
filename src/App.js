import { useState } from 'react';
import { Moon, Sun, LogOut, Trash2 } from 'lucide-react';
import { initializeApp } from 'firebase/app'; 
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
// Replacing your custom components with simplified versions
function Button({ children, onClick, variant = "default", isDarkTheme, ...props }) {
  const variantClasses = {
    default: isDarkTheme
      ? 'bg-white text-black hover:bg-gray-300'
      : 'bg-black text-white hover:bg-gray-800',
    outline: isDarkTheme
      ? 'border border-gray-500 text-white hover:bg-gray-700'
      : 'border border-gray-300 text-black hover:bg-gray-300',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      className={`px-4 py-2 rounded ${variantClasses[variant]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ id, type, value, onChange, isDarkTheme, ...props }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full p-2 rounded ${
        isDarkTheme ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-black border-gray-300'
      }`}
      {...props}
    />
  );
}

function Label({ htmlFor, children, isDarkTheme }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block ${isDarkTheme ? 'text-white' : 'text-black'}`}
    >
      {children}
    </label>
  );
}

function Switch({ checked, onCheckedChange, isDarkTheme }) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="w-6 h-6 cursor-pointer"
      />
      <span className="ml-2">
        {isDarkTheme ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m8.66-9.34h-1M4.34 12h-1m15.02 5.66l-.71-.71m-12.02 0l-.71.71m12.02-12.02l-.71-.71m-12.02 0l-.71.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m8.66-9.34h-1M4.34 12h-1m15.02 5.66l-.71-.71m-12.02 0l-.71.71m12.02-12.02l-.71-.71m-12.02 0l-.71.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </span>
    </div>
  );
}


const firebaseConfig = {
  apiKey: "AIzaSyDojFudKt9k-cLmpzFKDZdU7XLkUHgPxx8",
  authDomain: "instagram-clone-ab65f.firebaseapp.com",
  databaseURL: "https://instagram-clone-ab65f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "instagram-clone-ab65f",
  storageBucket: "instagram-clone-ab65f.appspot.com",
  messagingSenderId: "1070350682511",
  appId: "1:1070350682511:web:8a30213fd482f6af1063fa",
  measurementId: "G-S91WM03QR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize auth instance with the app  


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Signed in
      const user = userCredential.user;
      setStatus('Sign in successful!');
      console.log('User:', user);
      // Redirect or perform other actions after successful sign-in
      const userDoc = await getDoc(doc(db, 'usersList', username));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        console.error('No such user document!');
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error signing in:', errorCode, errorMessage);
      setStatus('Error signing in: ' + errorMessage);
    }
  };

  const handleSignOut = () => {
    setUserData(null);
    setEmail('');
    setPassword('');
    setUsername('');
    setStatus('Signed out successfully!');
  };

  const handleDeleteUser = () => {
    setUserData(null);
    setEmail('');
    setPassword('');
    setUsername('');
    setStatus('User profile deleted!');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-end">
          <Switch
            checked={isDarkTheme}
            onCheckedChange={setIsDarkTheme}
            isDarkTheme={isDarkTheme} // Pass theme to the Switch component
            className="mr-2"
          />
          {isDarkTheme ? <Moon className="h-5 w-5 text-white" /> : <Sun className="h-5 w-5 text-black" />}
        </div>

        {!userData ? (
          <>
            <h1 className="text-3xl font-bold text-center">Sign In</h1>
            <form onSubmit={handleSignIn} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" isDarkTheme={isDarkTheme}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    isDarkTheme={isDarkTheme} // Pass theme to the Input component
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password" isDarkTheme={isDarkTheme}>Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    isDarkTheme={isDarkTheme} // Pass theme to the Input component
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="username" isDarkTheme={isDarkTheme}>Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    isDarkTheme={isDarkTheme} // Pass theme to the Input component
                    className="mt-1"
                  />
                </div>
              </div>
              <Button type="submit" isDarkTheme={isDarkTheme} className="w-full">
                Sign In
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <img src={userData.imageUrl} alt="User" className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{userData.username}</h2>
            <p className={`text-gray-500 ${isDarkTheme ? 'dark:text-gray-400' : 'text-gray-500'}`}>{userData.email}</p>
            <div className="space-x-4">
              <Button onClick={handleSignOut} variant="outline" isDarkTheme={isDarkTheme}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
              <Button onClick={handleDeleteUser} variant="destructive" isDarkTheme={isDarkTheme}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Profile
              </Button>
            </div>
          </div>
        )}

        {status && (
          <p className={`mt-4 text-center ${isDarkTheme ? 'text-green-400' : 'text-green-600'}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

export default SignIn;
