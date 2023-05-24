import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, createUserInFirestore } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Navigate } from 'react-router-dom'

function LoginPage() {
  const [user, loading] = useAuthState(auth)

  async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    await createUserInFirestore(auth.currentUser)
  }

  if (loading) return <p>Loading...</p>

  return user ? (
    <Navigate to="/" replace />
  ) : (
    <div>
      <h1>Sign in</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  )
}

export default LoginPage
