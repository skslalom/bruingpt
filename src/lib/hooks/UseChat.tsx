import {
  getChatSession as getSession,
  deleteChatSession,
  putResponseRating,
  getChatHistory,
  putConversationName,
  getDocumentFiles,
  getDocumentFile,
  postDocumentFile,
  postUploadPutFile,
  postUploadGetPresignedUrl,
  postChatMessageStream,
} from '../api/Chat';
import { AnswerFormatter } from '../helpers/answerFormatter';
import { ChatSession, Message } from '../interfaces/Chat';
import _ from 'lodash';
import { GetChatHistoryRes, StreamMessageTypes } from '../models/Chat';
import { UserInfo } from '../contexts/UserInfoContext';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export const useChat = () => {
  const postMessage = (
    message: string,
    userInfo: UserInfo,
    chatId: string,
    onStream: (data: StreamMessageTypes) => void,
    onComplete: () => void,
    selectedModel?: string
  ) => {
    // Call the streaming API with proper error handling
    console.log(selectedModel)
    const onError = (error: Error) => {
      console.error("Chat message error:", error);
      onComplete();
    };

    void postChatMessageStream(message, chatId, userInfo.accessToken, onStream, onError, onComplete);
  };
  
  const getChatSession = async (userInfo: UserInfo, chatId: string) => {
    const res = await getSession(userInfo, chatId);
    return res;
  };

  const getChatMessages = async (userInfo: UserInfo, chatId: string) => {
    const res = await getChatSession(userInfo, chatId);
    if (res) {
      const messages: Message[] = [];
      const conversation = res.conversation;
      for (const exchange of Object.values(conversation)) {
        messages.push({
          message: exchange.question,
          fromUser: true,
          exchangeId: exchange.exchangeId,
        });
        messages.push({
          message: AnswerFormatter(exchange.response),
          fromUser: false,
          exchangeId: exchange.exchangeId,
          sources: exchange?.sources,
        });
      }
      return messages;
    }
    return undefined;
  };

  const createNewChatSession = (title?: string) => {
    const newChatSessionId = uuidv4();
    const currentDate = new Date();
    const currentMonthYear = currentDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
    const newChatSession: ChatSession = {
      chatInfo: {
        chatId: newChatSessionId,
        chatTitle: title ? title : 'Untitled',
        timestamp: format(new Date(), 'PPpp'),
        conversation: [],
      },
      month: currentMonthYear,
    };
    return newChatSession;
  };

  const removeChatSession = async (userInfo: UserInfo, chatId: string) => {
    const res = await deleteChatSession(chatId, userInfo.accessToken);
    return res;
  };

  const putResponseFeedback = async (
    accessToken: string | undefined,
    chatId: string,
    exchangeId: string,
    rating: string | null
  ) => {
    const result = await putResponseRating(chatId, exchangeId, rating, accessToken);
    return result;
  };

  const getUpdatedSelectedChatSession = (chatId: string, chatSessions: ChatSession[]) => {
    let newlySelectedChatSessionId = '';
    if (chatSessions.length === 1) return newlySelectedChatSessionId;
    const deletedChatSessionIndex = _.findIndex(chatSessions, function (chatSession) {
      return chatSession.chatInfo.chatId === chatId;
    });
    if (deletedChatSessionIndex === chatSessions.length - 1) {
      newlySelectedChatSessionId = chatSessions[deletedChatSessionIndex - 1].chatInfo.chatId;
    } else newlySelectedChatSessionId = chatSessions[deletedChatSessionIndex + 1].chatInfo.chatId;

    return newlySelectedChatSessionId;
  };

  const getHistory = async (userInfo: UserInfo) => {
    const result = await getChatHistory(userInfo);
    if (!result) return result;
    const chatSessionArray = getChatSessionArray(result);
    return chatSessionArray;
  };

  const getChatSessionArray = (result: GetChatHistoryRes) => {
    const chatSessionsArray: ChatSession[] = [];
    if (_.isEmpty(result['monthlyChatSessions'])) {
      return chatSessionsArray;
    } else {
      const monthlyChatSessions = result['monthlyChatSessions'];
      for (const monthYear in monthlyChatSessions) {
        if (Object.prototype.hasOwnProperty.call(monthlyChatSessions, monthYear)) {
          const sessions = monthlyChatSessions[monthYear];
          sessions.map(session => {
            const chatSession: ChatSession = {
              month: monthYear,
              chatInfo: session,
            };
            return chatSessionsArray.push(chatSession);
          });
        }
      }
      return chatSessionsArray;
    }
  };

  const putRenameConversation = async (userInfo: UserInfo, chatId: string, title: string) => {
    const result = await putConversationName(userInfo, chatId, title);
    return result;
  };

  const postUploadDocument = async (userInfo: UserInfo, chatId: string, file: File) => {
    const result = await postDocumentFile(userInfo, chatId, file);
    return result;
  };

  const postUploadDocumentGetPresignedUrl = async (
    userInfo: UserInfo,
    chatId: string,
    file: File
  ) => {
    const result = await postUploadGetPresignedUrl(userInfo, chatId, file);
    return result;
  };

  const postUploadDocumentPutFile = async (presignedUrl: string, file: File) => {
    const result = await postUploadPutFile(presignedUrl, file);
    return result;
  };

  const getUploadedFiles = async (userInfo: UserInfo, chatId: string) => {
    const result = await getDocumentFiles(userInfo, chatId);
    return result;
  };

  const getUploadedFile = async (userInfo: UserInfo, chatId: string, documentId: string) => {
    const result = await getDocumentFile(userInfo, chatId, documentId);
    return result;
  };

  return {
    postMessage,
    getChatSession,
    getChatMessages,
    createNewChatSession,
    removeChatSession,
    putResponseFeedback,
    getUpdatedSelectedChatSession,
    getHistory,
    putRenameConversation,
    postUploadDocument,
    postUploadDocumentGetPresignedUrl,
    postUploadDocumentPutFile,
    getUploadedFiles,
    getUploadedFile,
  };
};
