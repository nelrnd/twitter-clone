import './App.sass'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { auth } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { UserContext } from './contexts/UserContext'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import useUserData from './hooks/useUserData'
import FollowingPage from './pages/FollowingPage'
import FollowersPage from './pages/FollowersPage'
import NotificationsPage from './pages/NotificationsPage'
import MessagesPage from './pages/MessagesPage'

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
          <Route path="/:username/following" element={<FollowingPage />} />
          <Route path="/:username/followers" element={<FollowersPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
