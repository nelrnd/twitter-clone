import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, joinWithGoogle } from '../firebase'
import JoinLayout, { TwitterIcon } from '../components/JoinLayout/JoinLayout'
import GoogleIcon from '../assets/google.png'
import Button from '../components/Buttons/Button'
import Divider from '../components/Divider/Divider'
import TextInput from '../components/TextInput/TextInput'
import IconButton from '../components/Buttons/IconButton'
import BackIcon from '../assets/back.svg'
import Loader from '../components/Loader/Loader'

type EnterEmailProps = {
  email: string
  setEmail: (email: string) => void
  setStage: (stage: string) => void
}

type EnterPasswordProps = {
  email: string
  setStage: (stage: string) => void
}

const STAGES = ['ENTER_EMAIL', 'ENTER_PASSWORD']

const LoginPage: React.FC = () => {
  const [currentStage, setStage] = useState(STAGES[0])
  const [user, loading] = useAuthState(auth)
  const [email, setEmail] = useState('')

  return user ? (
    <Navigate to="/home" replace />
  ) : (
    <JoinLayout>
      {loading ? (
        <Loader />
      ) : (
        <>
          <TwitterIcon />
          {currentStage === 'ENTER_EMAIL' && <LoginPage_EnterEmail email={email} setEmail={setEmail} setStage={setStage} />}
          {currentStage === 'ENTER_PASSWORD' && <LoginPage_EnterPassword email={email} setStage={setStage} />}
          <p className="bottom-text">
            Don't have an account?{' '}
            <Link to="/signup" className="link">
              Sign up
            </Link>
          </p>
        </>
      )}
    </JoinLayout>
  )
}

const LoginPage_EnterEmail: React.FC<EnterEmailProps> = ({ email, setEmail, setStage }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStage(STAGES[1])
  }

  return (
    <>
      <h1>Sign in to Twitter</h1>
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

const LoginPage_EnterPassword: React.FC<EnterPasswordProps> = ({ email, setStage }) => {
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
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
        <Button size="large">Log in</Button>
      </form>
    </>
  )
}

export default LoginPage
