import { useParams } from "react-router-dom"
import PageHeader from "../components/PageHeader/PageHeader"

const Messages: React.FC = () => {
  const { chatId } = useParams<'chatId'>()

  return (
    <div className="messages">
      <nav>
        <PageHeader>
          <h1 className="heading-2">Messages</h1>
        </PageHeader>
      </nav>
      <main>
        { chatId ? <p>{chatId}</p> :
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