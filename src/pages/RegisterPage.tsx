import { auth, createUserInFirestore, db, joinWithGoogle } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

const STAGES = ['JOIN', 'CREATE_ACCOUNT', 'PICK_PASSWORD', 'PICK_USERNAME']

function RegisterPage() {
  // current stage
  const [stage, setStage] = useState(STAGES[0])
  const [user, loading] = useAuthState(auth)
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
    (async () => {
      if (user) {
        // check if user exists in Firestore
        const ref = collection(db, 'users')
        const qry = query(ref, where('id', '==', user.uid), limit(1))
        const doc = await getDocs(qry)
        if (doc.empty) {
          setStage(STAGES[3])
        } else {
          navigate('/')
        }
      }
    })()
  }, [user, navigate])

  if (loading) return <p>Loading...</p>

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

type CreateAccountProps = {
  setStage: React.Dispatch<React.SetStateAction<string>>
  name: string
  changeName: (e: React.ChangeEvent<HTMLInputElement>) => void
  email: string
  changeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void
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

function RegisterPage_PickPassword({ password, changePassword, email, name }: { password: string, changePassword: (e: React.ChangeEvent<HTMLInputElement>) => void, email: string, name: string }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await createUserWithEmailAndPassword(auth, email, password)
    if (result.user ) {
      await updateProfile(result.user, {
        displayName: name
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

function RegisterPage_PickUsername({username, changeUsername}: {username: string, changeUsername: (e: React.ChangeEvent<HTMLInputElement>) => void}) {
  const navigate = useNavigate()

  const handleClick = async () => {
    if (!username) return
    await createUserInFirestore(auth.currentUser, username)
    navigate('/')
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

export default RegisterPage
