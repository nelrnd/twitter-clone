import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, checkIfEmailExists, joinWithGoogle } from '../firebase'
import { FirebaseError } from 'firebase/app'
import JoinCard from '../components/JoinCard/JoinCard'
import Button from '../components/Buttons/Button'
import Divider from '../components/Divider/Divider'
import TextInput from '../components/TextInput/TextInput'
import IconButton from '../components/Buttons/IconButton'
import BackIcon from '../assets/back.svg'
import Loader from '../components/Loader/Loader'
import Alert from '../components/Alert/Alert'
import TwitterIcon from '../assets/twitter.svg'
import GoogleIcon from '../assets/google.png'

type EnterEmailProps = {
  email: string
  setEmail: (email: string) => void
  setStage: (stage: string) => void
  setError: (error: { text: string }) => void
}

type EnterPasswordProps = {
  email: string
  setStage: (stage: string) => void
  setError: (error: { text: string }) => void
}

const STAGES = ['ENTER_EMAIL', 'ENTER_PASSWORD']

const Login: React.FC = () => {
  const [currentStage, setStage] = useState(STAGES[0])
  const [user, loading] = useAuthState(auth)
  const [email, setEmail] = useState('')
  const [error, setError] = useState({ text: '' })

  useEffect(() => {
    let timeoutId: number | null = null
    if (error) {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = window.setTimeout(() => setError({ text: '' }), 4000)
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [error])

  return user ? (
    <Navigate to="/home" replace />
  ) : (
    <JoinCard width={currentStage === 'ENTER_EMAIL' ? 300 : 440}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <TwitterIcon />
          {currentStage === 'ENTER_EMAIL' && <Login_EnterEmail email={email} setEmail={setEmail} setStage={setStage} setError={setError} />}
          {currentStage === 'ENTER_PASSWORD' && <Login_EnterPassword email={email} setStage={setStage} setError={setError} />}
          <p className="bottom-text">
            Don't have an account?{' '}
            <Link to="/signup" className="link">
              Sign up
            </Link>
          </p>
        </>
      )}
      <Alert text={error.text} />
    </JoinCard>
  )
}

const Login_EnterEmail: React.FC<EnterEmailProps> = ({ email, setEmail, setStage, setError }) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const accountExists = await checkIfEmailExists(email)
    if (accountExists) {
      setStage(STAGES[1])
    } else {
      setError({ text: 'Sorry, we could not find your account.' })
    }
  }

  return (
    <>
      <h1 className="centered">Sign in to Twitter</h1>
      <Button style="outline rgl" onClick={joinWithGoogle}>
        <img src={GoogleIcon} alt="Google icon" />
        Sign in with Google
      </Button>
      <Divider />
      <form onSubmit={handleSubmit}>
        <TextInput type="email" label="Email" value={email} setValue={setEmail} />
        <Button>Next</Button>
      </form>
    </>
  )
}

const Login_EnterPassword: React.FC<EnterPasswordProps> = ({ email, setStage, setError }) => {
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/wrong-password') {
          setError({ text: 'Wrong password!' })
        }
      }
    }
  }

  return (
    <>
      <IconButton onClick={() => setStage(STAGES[0])}>
        <BackIcon />
      </IconButton>
      <h1>Enter your password</h1>
      <form onSubmit={handleSubmit}>
        <TextInput type="email" label="Email" value={email} setValue={() => null} disabled={true} />
        <TextInput type="password" label="Password" value={password} setValue={setPassword} />
        <Button size="large" disabled={!password}>
          Log in
        </Button>
      </form>
    </>
  )
}

export default Login
