import './App.sass'
import { Route, Routes, useLocation } from 'react-router-dom'
import { auth } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { UserContext } from './contexts/UserContext'
import { useUserDataWithId } from './hooks/useUserData'
import Layout from './components/Layout/Layout'
import Home from './routes/Home'
import Signup from './routes/Signup'
import Login from './routes/Login'
import Profile from './routes/Profile'
import ProfileIndex from './routes/ProfileIndex'
import ProfileLikes from './routes/ProfileLikes'
import Following from './routes/Following'
import Followers from './routes/Followers'
import Tweet from './routes/Tweet'
import TweetIndex from './routes/TweetIndex'
import Likes from './routes/Likes'
import Retweets from './routes/Retweets'
import EditProfile from './routes/EditProfile'
import PhotoModal from './components/Modals/PhotoModal'
import ComposeTweet from './routes/ComposeTweet'

/*
function App() {
  const [user] = useAuthState(auth)
  const [userData] = useUserDataWithId(user?.uid)
  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location }


  return (
    <UserContext.Provider value={userData}>
    
    {/*<Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Navigate to="/home" replace={true} />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/:username" element={<ProfilePage />} />
        <Route path="/:username/status/:tweetId" element={<TweetPage />} />
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
        <Route path="/compose/tweet" element={<HomePage><ComposeTweet /></HomePage>} />
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route path="/:username/photo" element={<PhotoModal />} />
          <Route path="/:username/header_photo" element={<PhotoModal />} />
        </Routes>
      )}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  )
}
*/
const App: React.FC = () => {
  const [user] = useAuthState(auth)
  const [userData] = useUserDataWithId(user?.uid)

  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location }

  return (
    <UserContext.Provider value={userData}>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Layout />}>
          <Route index path="home" element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path=":username" element={<Profile />}>
            <Route index element={<ProfileIndex />} />
            <Route path="likes" element={<ProfileLikes />} />
            <Route path="photo" element={<Home><PhotoModal /></Home>} />
            <Route path="header_photo" element={<Home><PhotoModal /></Home>} />
            <Route path="following" element={<Following />} />
            <Route path="followers" element={<Followers />} />
            <Route path="status/:tweetId" element={<Tweet />}>
              <Route index element={<TweetIndex />} />
              <Route path="photo/:photoId" element={<Home><PhotoModal /></Home>} />
              <Route path="likes" element={<Home><Likes /></Home>} />
              <Route path="retweets" element={<Home><Retweets /></Home>} />
            </Route>
          </Route>
          <Route path="compose/tweet" element={<Home><ComposeTweet /></Home>} />
          <Route path="settings/profile" element={<Home><EditProfile /></Home>} />
        </Route>
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route path=":username" element={<Profile />}>
            <Route path="photo" element={<PhotoModal />} />
            <Route path="header_photo" element={<PhotoModal />} />
            <Route path="status/:tweetId" element={<Tweet />}>
              <Route path="photo/:photoId" element={<PhotoModal />} />
              <Route path="likes" element={<Likes />} />
              <Route path="retweets" element={<Retweets />} />
            </Route>
          </Route>
          <Route path="compose/tweet" element={<ComposeTweet />} />
          <Route path="settings/profile" element={<EditProfile />} />
        </Routes>
      )}
    </UserContext.Provider>
  )
}

export default App
