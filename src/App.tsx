import './App.sass'
import { Route, Routes, useLocation } from 'react-router-dom'
import { auth, db } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
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
import Notifications from './routes/Notifications'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { CollectionReference, collection, orderBy, query, where } from 'firebase/firestore'
import { Chat, Notification } from './types'
import Messages from './routes/Messages'
import ChatRoom from './components/ChatRoom/ChatRoom'
import { GlobalContext } from './contexts/GlobalContext'

const App: React.FC = () => {
  const [user] = useAuthState(auth)
  const [userData] = useUserDataWithId(user?.uid)

  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location }  

  const [notifications] = useCollectionData(user ? collection(db, 'users', user.uid, 'notifications') as CollectionReference<Notification> : null)
  const [chats] = useCollectionData(user ? query(collection(db, 'chats') as CollectionReference<Chat>, where('members', 'array-contains', user.uid), orderBy('lastMessage.timestamp', 'desc')) : null)
  
  return (
    <GlobalContext.Provider value={{authUser: userData, notifications, chats}}>
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
            <Route path="notifications" element={<Notifications />} />
            <Route path="messages" element={<Messages />}>
              <Route path=":chatId" element={<ChatRoom />} />
            </Route>
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
    </GlobalContext.Provider>
  )
}

export default App
