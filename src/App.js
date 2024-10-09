import { useState } from 'react';
import { Moon, Sun, LogOut, Trash2 } from 'lucide-react';

// Replacing your custom components with simplified versions
function Button({ children, onClick, variant = "default", ...props }) {
  const variantClasses = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-gray-300 text-gray-900',
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

function Input({ id, type, value, onChange, ...props }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded"
      {...props}
    />
  );
}

function Label({ htmlFor, children }) {
  return <label htmlFor={htmlFor} className="block text-gray-700">{children}</label>;
}

function Switch({ checked, onCheckedChange }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="w-6 h-6 cursor-pointer"
    />
  );
}

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
            className="mr-2"
          />
          {isDarkTheme ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </div>

        {!userData ? (
          <>
            <h1 className="text-3xl font-bold text-center">Sign In</h1>
            <form onSubmit={handleSignIn} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <img src={userData.imageUrl} alt="User" className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{userData.username}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{userData.email}</p>
            <div className="space-x-4">
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
              <Button onClick={handleDeleteUser} variant="destructive">
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