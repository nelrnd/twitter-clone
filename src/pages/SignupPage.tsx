import { useEffect, useRef, useState } from 'react'
import { auth, checkIfEmailExists, checkIfUsernameExists, createUser, joinWithGoogle } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { checkEmailFormat } from '../utils'
import { useUserDataWithId } from '../hooks/useUserData'
import JoinLayout, { TwitterIcon } from '../components/JoinLayout/JoinLayout'
import Button from '../components/Buttons/Button'
import IconButton from '../components/Buttons/IconButton'
import BackIcon from '../assets/back.svg'
import GoogleIcon from '../assets/google.png'
import Divider from '../components/Divider/Divider'
import TextInput from '../components/TextInput/TextInput'
import Loader from '../components/Loader/Loader'

const STAGES = ['JOIN', 'CREATE_ACCOUNT', 'PICK_PASSWORD', 'PICK_USERNAME']

type StageProps = {
  setStage: (stage: string) => void
}

type CreateAccountProps = {
  setStage: (stage: string) => void
  name: string
  setName: (e: string) => void
  email: string
  setEmail: (e: string) => void
}

type PickPasswordProps = {
  setStage: (stage: string) => void
  password: string
  setPassword: (e: string) => void
  email: string
  name: string
}

const SignupPage: React.FC = () => {
  const [currentStage, setStage] = useState(STAGES[0])
  const [user] = useAuthState(auth)
  const [userData, dataLoading] = useUserDataWithId(user?.uid || '_')
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (userData) {
      navigate('/home')
    } else if (user) {
      setStage(STAGES[3])
    }
  }, [user, userData, navigate])

  if (dataLoading) {
    return (
      <JoinLayout paddingSize="large">
        <Loader />
      </JoinLayout>
    )
  }

  return (
    <JoinLayout paddingSize={currentStage === 'JOIN' ? 'large' : 'small'}>
      {currentStage === 'JOIN' && <SignupPage_Join setStage={setStage} />}
      {currentStage === 'CREATE_ACCOUNT' && <SignupPage_CreateAccount setStage={setStage} name={name} setName={setName} email={email} setEmail={setEmail} />}
      {currentStage === 'PICK_PASSWORD' && <SignupPage_PickPassword setStage={setStage} password={password} setPassword={setPassword} email={email} name={name} />}
      {currentStage === 'PICK_USERNAME' && <SignupPage_PickUsername />}
    </JoinLayout>
  )
}

const SignupPage_Join: React.FC<StageProps> = ({ setStage }) => {
  return (
    <>
      <TwitterIcon />
      <h1 className="centered">Join Twitter today</h1>
      <Button style="outline rgl" onClick={joinWithGoogle}>
        <img src={GoogleIcon} alt="Google icon" />
        Sign up with Google
      </Button>
      <Divider />
      <Button onClick={() => setStage(STAGES[1])}>Create account</Button>
      <p className="bottom-text">
        Have an account already?{' '}
        <Link className="link" to="/login">
          Log in
        </Link>
      </p>
    </>
  )
}

const SignupPage_CreateAccount: React.FC<CreateAccountProps> = ({ setStage, name, setName, email, setEmail }) => {
  const [canNext, setCanNext] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [checkAgain, setCheckAgain] = useState<number>(0)
  const emailValidationTimeout = useRef<number | null>(null)

  useEffect(() => {
    ;(async () => {
      setEmailError('')
      if (emailValidationTimeout.current) {
        clearTimeout(emailValidationTimeout.current)
        emailValidationTimeout.current = null
      }
      if (email) {
        const validFormat = checkEmailFormat(email)
        if (!validFormat) {
          const timeout = window.setTimeout(() => setEmailError('Please enter valid email.'), 800)
          emailValidationTimeout.current = timeout
          return
        }
        emailValidationTimeout.current = Math.random()
        const emailExists = await checkIfEmailExists(email)
        if (emailExists) {
          setEmailError('Email has already been taken.')
        } else {
          emailValidationTimeout.current = null
          setCheckAgain(Math.random())
        }
      }
      return () => {
        if (emailValidationTimeout.current) {
          clearTimeout(emailValidationTimeout.current)
          emailValidationTimeout.current = null
        }
      }
    })()
  }, [email])

  useEffect(() => {
    if (name && email && !emailError && !emailValidationTimeout.current) {
      setCanNext(true)
    } else {
      setCanNext(false)
    }
  }, [name, email, emailError, checkAgain])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStage(STAGES[2])
  }

  return (
    <>
      <IconButton onClick={() => setStage(STAGES[0])}>
        <BackIcon />
      </IconButton>
      <div className="top-bar">Step 1 of 2</div>
      <h1>Create your account</h1>
      <form onSubmit={handleSubmit}>
        <TextInput label="Name" value={name} setValue={setName} />
        <TextInput type="email" label="Email" value={email} setValue={setEmail} error={emailError} />
        <Button size="large" disabled={!canNext}>
          Next
        </Button>
      </form>
    </>
  )
}

const SignupPage_PickPassword: React.FC<PickPasswordProps> = ({ setStage, password, setPassword, email, name }) => {
  const [passwordError, setPasswordError] = useState('')
  const timeoutId = useRef<number | null>(null)

  useEffect(() => {
    setPasswordError('')
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
      timeoutId.current = null
    }
    if (password) {
      if (password.length < 8) {
        const errorText = 'Your password needs to be at least 8 characters. Please enter a longer one.'
        const timeout = window.setTimeout(() => setPasswordError(errorText), 800)
        timeoutId.current = timeout
      }
    }
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }
    }
  }, [password])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await createUserWithEmailAndPassword(auth, email, password)
    if (result.user) {
      await updateProfile(result.user, {
        displayName: name,
      })
    }
  }

  return (
    <>
      <IconButton onClick={() => setStage(STAGES[1])}>
        <BackIcon />
      </IconButton>
      <div className="top-bar">Step 2 of 2</div>
      <h1>You'll need a password</h1>
      <p className="subtitle">Make sure it's 8 characters or more.</p>
      <form onSubmit={handleSubmit}>
        <TextInput type="password" label="Password" value={password} setValue={setPassword} error={passwordError} />
        <Button size="large" disabled={!password || password.length < 8}>
          Next
        </Button>
      </form>
    </>
  )
}

const SignupPage_PickUsername: React.FC = () => {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [canNext, setCanNext] = useState(false)
  const [checkAgain, setCheckAgain] = useState<number>(0)
  const timeoutId = useRef<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      setError('')
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }
      if (username) {
        if (username.length < 5) {
          const errorText = 'Your username must be longer than 4 characters.'
          const timeout = window.setTimeout(() => setError(errorText), 800)
          timeoutId.current = timeout
          setCheckAgain(Date.now())
          return
        }
        timeoutId.current = Date.now()
        setCheckAgain(Date.now())
        const usernameExists = await checkIfUsernameExists(username)
        timeoutId.current = null
        if (usernameExists) {
          setError('That username has been taken. Please choose another.')
          return
        }
        timeoutId.current = null
        setCheckAgain(Date.now())
      }
      return () => {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current)
          timeoutId.current = null
        }
      }
    })()
  }, [username])

  useEffect(() => {
    if (username.length < 5 || error || timeoutId.current) {
      setCanNext(false)
    } else {
      setCanNext(true)
    }
  }, [username, error, checkAgain])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await createUser(auth.currentUser, username)
    navigate('/home')
  }

  return (
    <>
      <TwitterIcon />
      <h1>What should we call you?</h1>
      <p className="subtitle">You @username is unique. You can always change it later.</p>
      <form onSubmit={handleSubmit}>
        <TextInput label="Username" value={username} setValue={setUsername} error={error} />
        <Button size="large" disabled={!canNext}>
          Next
        </Button>
      </form>
    </>
  )
}

export default SignupPage
