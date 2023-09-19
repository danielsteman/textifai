import Chat, { ChatProps } from "../../Chat/Chat";

const ChatPanel: React.FC<ChatProps> = ({ selectedDocuments }) => {
  return <Chat selectedDocuments={selectedDocuments} />;
};

export default ChatPanel;
