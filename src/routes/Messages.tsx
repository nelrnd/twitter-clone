import { Outlet, useParams } from "react-router-dom"
import PageHeader from "../components/PageHeader/PageHeader"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { CollectionReference, collection, orderBy, query, where } from "firebase/firestore"
import { auth, db } from "../firebase"
import Loader from "../components/Loader/Loader"
import ChatTab from "../components/ChatTab/ChatTab"
import { Chat } from "../types"

const Messages: React.FC = () => {
  const { chatId } = useParams<'chatId'>()

  const authUserId = auth.currentUser?.uid

  const chatsCollection = collection(db, 'chats') as CollectionReference<Chat>
  const chatsQuery = authUserId ? query(chatsCollection, where('members', 'array-contains', authUserId), orderBy('lastMessage.timestamp', 'desc')) : null
  const [chats, loading] = useCollectionData(chatsQuery)

  return (
    <div className="messages">
      {loading ? <Loader /> : 
      <>
      <nav>
        <PageHeader>
          <h1 className="heading-2">Messages</h1>
        </PageHeader>

        <div>
          {chats?.map((chat) => <ChatTab key={chat.id} chat={chat} isActive={chatId === chat.id} />)}
        </div>
      </nav>
      <main>
        { chatId ? <Outlet /> :
          <div style={{padding: 130, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
            <h1 className="big">Select a message</h1>
            <p className="grey">Choose from your existing conversations, start a new one, or just keep swimming.</p>
          </div>
        }
      </main>
      </>}
    </div>
  )
}

export default Messages