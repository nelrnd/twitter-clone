import './App.sass'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase'
import useUserData from './hooks/useUserData'
import { UserContext } from './contexts/UserContext'

function App() {
  const [user] = useAuthState(auth)
  const [userData] = useUserData(user?.uid)

  return (
    <UserContext.Provider value={userData}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace={true} />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
