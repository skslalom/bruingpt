import { createContext, useContext } from "react";
import { ChatSession, Message } from "../interfaces/Chat";
import { GetDocumentRes } from "../models/Chat";

interface ChatSessionsContextType {
  chatSessions: ChatSession[];
  updateSelectedChatSession: (chatSessionId: string) => void;
  addNewChatSession: (question?: string) => string;
  updateNewChatSession: (question: string) => void;
  renameChatTitle: (chatId: string, title: string) => void;
  setChatSessions: any;
  selectedChatSession: string | null | undefined;
  messages: Message[];
  setMessages: any;
  noMsgReset: React.MutableRefObject<boolean>;
  filesForChatSession: GetDocumentRes[];
  setFiles: (files: GetDocumentRes[]) => void;
}

const ChatSessionsContext = createContext<ChatSessionsContextType | undefined>(
  undefined
);

export function useChatSessionsContext() {
  const context = useContext(ChatSessionsContext);
  if (context === undefined) {
    throw new Error();
  }
  return context;
}

export default ChatSessionsContext;
