import './App.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase'
import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth'

function App() {
  const [user, loading] = useAuthState(auth)

  if (loading) return <p>Loading...</p>

  return user ? <Home /> : <Login />
}

function Login() {
  function signInWithGoogle(): void {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  return (
    <div>
      <h1>Sign in</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  )
}

function Home() {
  function logout(): void {
    signOut(auth)
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default App
