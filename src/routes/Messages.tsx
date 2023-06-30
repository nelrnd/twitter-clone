import { Outlet, useParams } from "react-router-dom"
import PageHeader from "../components/PageHeader/PageHeader"
import ChatTab from "../components/ChatTab/ChatTab"
import { useContext } from "react"
import { GlobalContext } from "../contexts/GlobalContext"

const Messages: React.FC = () => {
  const { chatId } = useParams<'chatId'>()
  
  const { chats } = useContext(GlobalContext)

  return (
    <div className="messages">
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
    </div>
  )
}

export default Messages