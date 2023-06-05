import { auth, checkIfAccountExists, createUserInFirestore, joinWithGoogle } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import useUserData from '../hooks/useUserData'
import JoinLayout, { TwitterIcon } from '../components/JoinLayout/JoinLayout'
import Button from '../components/Buttons/Button'
import IconButton from '../components/Buttons/IconButton'
import BackIcon from '../assets/back.svg'

const STAGES = ['JOIN', 'CREATE_ACCOUNT', 'PICK_PASSWORD', 'PICK_USERNAME']

function RegisterPage() {
  // current stage
  const [stage, setStage] = useState(STAGES[0])
  const [user] = useAuthState(auth)
  const [userData, dataLoading] = useUserData((!!user && user.uid) || '_')
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)
  const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
  const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

  useEffect(() => {
    if (user) {
      if (userData) navigate('/home')
      else setStage(STAGES[3])
    }
  }, [user, userData, navigate])

  if (user && dataLoading) return <p>Loading...</p>

  switch (stage) {
    case 'JOIN':
      return <RegisterPage_Join setStage={setStage} />
    case 'CREATE_ACCOUNT':
      return <RegisterPage_CreateAccount setStage={setStage} name={name} changeName={changeName} email={email} changeEmail={changeEmail} />
    case 'PICK_PASSWORD':
      return <RegisterPage_PickPassword password={password} changePassword={changePassword} email={email} name={name} />
    case 'PICK_USERNAME':
      return <RegisterPage_PickUsername username={username} changeUsername={changeUsername} />
    default:
      return null
  }
}

function RegisterPage_Join({ setStage }: { setStage: React.Dispatch<React.SetStateAction<string>> }) {
  return (
    <div>
      <h1>Join Twitter today</h1>
      <button onClick={joinWithGoogle}>Sign up with Google</button>
      <button onClick={() => setStage(STAGES[1])}>Create account</button>
      <p>
        Have an account already? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}



function RegisterPage_CreateAccount({ setStage, name, changeName, email, changeEmail }: CreateAccountProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStage(STAGES[2])
  }

  return (
    <div>
      <h1>Create your account</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" value={name} onChange={changeName} />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={changeEmail} />
        <button>Next</button>
      </form>
    </div>
  )
}

function RegisterPage_PickPassword({ password, changePassword, email, name }: { password: string; changePassword: (e: React.ChangeEvent<HTMLInputElement>) => void; email: string; name: string }) {
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
    <div>
      <h1>You'll need a password</h1>
      <p>Make sure it's 8 characters or more.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={changePassword} />
        <button>Next</button>
      </form>
    </div>
  )
}

function RegisterPage_PickUsername({ username, changeUsername }: { username: string; changeUsername: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const navigate = useNavigate()

  const handleClick = async () => {
    if (!username) return
    await createUserInFirestore(auth.currentUser, username)
    navigate('/home')
  }

  return (
    <div>
      <h1>What should we call you?</h1>
      <p>Your @username is unique. You can always change it later.</p>
      <label htmlFor="username">Username</label>
      <input type="text" id="username" value={username} onChange={changeUsername} />
      <button onClick={handleClick}>Next</button>
    </div>
  )
}

import GoogleIcon from '../assets/google.png'
import Divider from '../components/Divider/Divider'
import TextInput from '../components/TextInput/TextInput'
import { checkEmailFormat } from '../utils'

type StageProps = {
  setStage: (stage: string) => void
}

type CreateAccountProps = {
  setStage: (stage: string) => void
  name: string
  setName: (e:string) => void
  email: string
  setEmail: (e: string) => void
}

type PickPasswordProps = {
  setStage: (stage: string) => void
  password: string
  setPassword: (e: string) => void
}

const SignupPage: React.FC = () => {
  const [currentStage, setStage] = useState(STAGES[0])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <JoinLayout paddingSize={currentStage === 'JOIN' ? 'large' : 'small'}>
      {currentStage === 'JOIN' && <SignupPage_Join setStage={setStage} />}
      {currentStage === 'CREATE_ACCOUNT' && <SignupPage_CreateAccount setStage={setStage} name={name} setName={setName} email={email} setEmail={setEmail} />}
      {currentStage === 'PICK_PASSWORD' && <SignupPage_PickPassword setStage={setStage} password={password} setPassword={setPassword} />}
      {currentStage === 'PICK_USERNAME' && <SignupPage_PickUsername />}
    </JoinLayout>
  )
}

const SignupPage_Join: React.FC<StageProps> = ({ setStage }) => {
  return (
    <>
      <TwitterIcon />
      <h1 className="centered">Join Twitter today</h1>
      <Button style="outline rgl">
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
    (async () => {
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
        const emailExists = await checkIfAccountExists(email)
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
      <div className="top-bar">Step 1 of 5</div>
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

const SignupPage_PickPassword: React.FC<PickPasswordProps> = ({ setStage, password, setPassword }) => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStage(STAGES[3])
  }

  return (
    <>
    <IconButton onClick={() => setStage(STAGES[1])}>
      <BackIcon />
    </IconButton>
    <div className="top-bar">Step 2 of 5</div>
      <h1>You'll need a password</h1>
      <p className="subtitle">Make sure it's 8 characters or more.</p>
      <form onSubmit={handleSubmit}>
        <TextInput type="password" label="Password" value={password} setValue={setPassword} error={passwordError} />
        <Button size='large' disabled={!password || password.length < 8}>Next</Button>
      </form>
    </>
  )
}

const SignupPage_PickUsername: React.FC = () => {
  const [username, setUsername] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // do something
  }

  return (
    <>
      <h1>What would you like to be called?</h1>
      <p className="grey">You @username is unique. You can always change it later.</p>
      <form onSubmit={handleSubmit}>
        <TextInput label="Username" value={username} setValue={setUsername} />
      </form>
    </>
  )
}

export default SignupPage
