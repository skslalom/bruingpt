import { useRef, useEffect, useState } from "react";
import ChatSessionsContext from "./ChatSessionsContext";
import { Outlet } from "react-router";
import { ChatSession, Message } from "../interfaces/Chat";
import { useChat } from "../hooks/UseChat";
import { GetDocumentRes } from "../models/Chat";

export function ChatSessionsContextProvider() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChatSession, setSelectedChatSession] = useState<
    string | null
  >();
  const [filesForChatSession, setFilesForChatSession] = useState<
    GetDocumentRes[]
  >([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const noMsgReset = useRef(false);

  const { createNewChatSession } = useChat();

  const updateSelectedChatSession = (chatSessionId: string) => {
    setSelectedChatSession(chatSessionId);
  };

  const addNewChatSession = (question?: string) => {
    const newChatSession = createNewChatSession(question);

    setChatSessions((prevChatSessions) => [
      newChatSession,
      ...prevChatSessions,
    ]);

    if (!noMsgReset.current) setMessages([]);
    setSelectedChatSession(newChatSession.chatInfo.chatId);
    return newChatSession.chatInfo.chatId;
  };

  const updateNewChatSession = (question: string) => {
    // update the chat session title if it is a new chat session
    const updatedChatSessions = [...chatSessions];
    updatedChatSessions[0] = {
      ...updatedChatSessions[0],
      chatInfo: {
        ...updatedChatSessions[0].chatInfo,
        chatTitle: question,
      },
    };
    setChatSessions(updatedChatSessions);
  };

  const renameChatTitle = (chatId: string, title: string) => {
    const updatedChatSessions = [...chatSessions];

    const foundSessionIndex = updatedChatSessions.findIndex(
      (id) => id.chatInfo.chatId === chatId
    );

    if (foundSessionIndex === -1) {
      return;
    }

    updatedChatSessions[foundSessionIndex].chatInfo.chatTitle = title;
  };

  const setFiles = (files: GetDocumentRes[] = []) => {
    setFilesForChatSession(files);
  };

  // reset files (uploaded files) when new chat session is created)
  useEffect(() => {
    if (selectedChatSession && messages.length === 0) {
      setFiles([]);
    }
  }, [selectedChatSession, messages]);

  return (
    <ChatSessionsContext.Provider
      value={{
        chatSessions,
        updateSelectedChatSession,
        addNewChatSession,
        updateNewChatSession,
        setChatSessions,
        selectedChatSession,
        messages,
        setMessages,
        noMsgReset,
        renameChatTitle,
        filesForChatSession,
        setFiles,
      }}
    >
      <Outlet />
    </ChatSessionsContext.Provider>
  );
}
