import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, joinWithGoogle } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react'

function LoginPage() {
  const [user, loading] = useAuthState(auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
  }

  if (loading) return <p>Loading...</p>
  
  return user ? <Navigate to="/" replace /> : (
    <div>
      <h1>Sign in to Twitter</h1>
      <button onClick={joinWithGoogle}>Sign in with Google</button>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={changeEmail} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={changePassword} />
        <button>Next</button>
      </form>

      <p>Don't have an ccount? <Link to="/signup">Sign up</Link></p>
    </div>
  )
}

export default LoginPage
