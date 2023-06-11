import './App.sass'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { auth } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { UserContext } from './contexts/UserContext'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { useUserDataWithId } from './hooks/useUserData'
import FollowingPage from './pages/FollowingPage'
import FollowersPage from './pages/FollowersPage'
import NotificationsPage from './pages/NotificationsPage'
import MessagesPage from './pages/MessagesPage'
import PhotoModal from './components/Modals/PhotoModal'

function App() {
  const [user] = useAuthState(auth)
  const [userData] = useUserDataWithId(user?.uid)
  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location }

  return (
    <UserContext.Provider value={userData}>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Navigate to="/home" replace={true} />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/:username" element={<ProfilePage />} />
        <Route path="/:username/likes" element={<ProfilePage />} />
        <Route path="/:username/following" element={<FollowingPage />} />
        <Route path="/:username/followers" element={<FollowersPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/:username/photo"
          element={
            <HomePage>
              <PhotoModal />
            </HomePage>
          }
        />
        <Route
          path="/:username/header_photo"
          element={
            <HomePage>
              <PhotoModal />
            </HomePage>
          }
        />
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route path="/:username/photo" element={<PhotoModal />} />
          <Route path="/:username/header_photo" element={<PhotoModal />} />
        </Routes>
      )}
    </UserContext.Provider>
  )
}

export default App
