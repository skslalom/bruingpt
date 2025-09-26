import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useChatSessionsContext } from "../lib/contexts/ChatSessionsContext";
import { useUserInfoContext } from "../lib/contexts/UserInfoContext";
import { AnswerFormatter } from "../lib/helpers/answerFormatter";
import { useChat } from "../lib/hooks/UseChat";
import { useTheme, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import AnswerLoadingState from "./answerLoadingState";
import ChatBubble from "./chatBubble";
import InputArea from "./inputArea";
import WelcomeMessage from "./welcomeMessage";
import { Source } from "../lib/interfaces/Chat";
import { StreamMessageTypes, Source as StreamSource } from "../lib/models/Chat";
import MarkdownRenderer from "./markdownRenderer";
import SourcesLoadingState from "./sourcesLoadingState";
import Avatar from '@mui/material/Avatar';
import botIcon from '../../src/public/bot.png';

interface MessageWindowProps {
  chatId: string;
  addMessage: (
    currentMessage: string,
    fromUser: boolean,
    exchangeId: string,
    sources?: Source[]
  ) => void;
  isLoading: MutableRefObject<boolean>;
}

export const MessageWindow = ({
  chatId,
  addMessage,
  isLoading,
}: MessageWindowProps) => {
  const { postMessage } = useChat();
  const {
    chatSessions,
    addNewChatSession,
    updateNewChatSession,
    selectedChatSession,
    messages,
    noMsgReset,
  } = useChatSessionsContext();
  const theme = useTheme();
  const viewportIsSmall = useMediaQuery(theme.breakpoints.between("xs", "sm"));

  const { userInfo } = useUserInfoContext();

  const endOfMessages = useRef<null | HTMLDivElement>(null); // variable that holds the reference to the last message in the chat
  const [currentMessage, setCurrentMessage] = useState<string>(""); // handling state of current message being typed by user
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [streamingAnswer, setStreamingAnswer] = useState<string>(""); // current streaming answer
  const [streamingSources, setStreamingSources] = useState<StreamSource[]>([]); // current streaming sources
  const [currentExchangeId, setCurrentExchangeId] = useState<string>(""); // current exchange ID for streaming
  const [isStreamingComplete, setIsStreamingComplete] = useState<boolean>(false); // track if streaming is complete

  console.log("Selected Model in MessageWindow:", selectedModel);
  //sets the text in the textbox as the current message
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(event.target.value);
  };

  const handleSubmit = (event?: React.FormEvent, selectedQuestion?: string) => {
    event?.preventDefault();
    let newChatId;
    const questionText = selectedQuestion || currentMessage;

    if (!questionText.trim()) return;

    if (selectedChatSession) {
      if (
        (currentMessage !== "" || selectedQuestion) &&
        messages.length === 0
      ) {
        // update the chat session title if it is a new chat session
        updateNewChatSession(questionText);
      }
    } else if (!selectedQuestion && currentMessage) {
      // the user submitted a question from the homepage
      noMsgReset.current = true;
      newChatId = addNewChatSession(currentMessage);
    } else {
      // a prefilled question from homepage was selected
      noMsgReset.current = true;
      newChatId = addNewChatSession(selectedQuestion);
    }

    isLoading.current = true;
    setStreamingAnswer("");
    setStreamingSources([]);
    setCurrentExchangeId("");
    setIsStreamingComplete(false);
    
    // Add user message immediately
    addMessage(questionText, true, "");

    // Handle streaming response
    const handleStreamData = (streamData: StreamMessageTypes) => {
      switch (streamData.type) {
        case "answer":
          // Append to streaming answer
          if (streamData.data && 'content' in streamData.data) {
            setStreamingAnswer(prev => prev + streamData.data.content);
          }
          if (streamData.exchangeId) {
            setCurrentExchangeId(streamData.exchangeId);
          }
          break;
        
        case "answer_complete":
          // Answer is complete, sources may start loading
          console.log("Answer streaming complete.");
          setIsStreamingComplete(true);
          break;
        
        case "sources":
          // Update sources
          if (streamData.sources?.sources) {
            const sourcesArray = Array.isArray(streamData.sources.sources) 
              ? streamData.sources.sources 
              : [streamData.sources.sources];
            setStreamingSources(sourcesArray);
          }
          break;
        
        case "final_response":
          // Complete response with final answer and sources
          if (streamData.data && 'complete_answer' in streamData.data) {
            const finalAnswer = streamData.data.complete_answer;
            const finalSources = streamData.data.sources || [];
            const exchangeId = streamData.data.exchangeId;
            
            // Convert StreamSource[] to Source[] for compatibility
            const convertedSources: Source[] = finalSources.map(source => {
              if (source.type === "document") {
                return {
                  name: source.name,
                  location: source.presigned_url,
                  page_number: source.page_number, // Default page number for documents
                  content: source.content
                };
              } else {
                console.warn("Unknown source type:", source);
                return {
                  name: source.name || "Unknown Source",
                  location: "",
                  page_number: "N/A",
                  content: "Invalid source data"
                };
              }
            });
            
            // Add final bot message
            addMessage(AnswerFormatter(finalAnswer), false, exchangeId, convertedSources);
            
            // Reset streaming state
            setStreamingAnswer("");
            setStreamingSources([]);
            setCurrentExchangeId("");
            setIsStreamingComplete(false);
            isLoading.current = false;
          }
          break;
      }
    };

    const handleComplete = () => {
      // Fallback in case final_response is not received
      if (streamingAnswer && currentExchangeId) {
        const convertedSources: Source[] = streamingSources.map(source => {
          if (source.type === "document") {
            return {
              name: source.name,
              location: source.presigned_url,
              page_number: source.page_number,
              content: source.content
            };
          } else {
            return {
              name: source.name,
              location: source.url,
              page_number: "1",
              content: source.snippet
            };
          }
        });
        
        addMessage(AnswerFormatter(streamingAnswer), false, currentExchangeId, convertedSources);
        
        // Reset streaming state
        setStreamingAnswer("");
        setStreamingSources([]);
        setCurrentExchangeId("");
        setIsStreamingComplete(false);
      }
      isLoading.current = false;
    };

    if (userInfo) {
      postMessage(
        questionText,
        userInfo,
        newChatId || chatId,
        handleStreamData,
        handleComplete
      );
    }

    setCurrentMessage(""); // resetting currentMessage variable
  };

  const handleClearInput = (_event: React.SyntheticEvent<HTMLInputElement>) => {
    setCurrentMessage("");
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  // scrolling down to the current/latest message when messages array changes
  useEffect(() => {
    if (endOfMessages.current) {
      endOfMessages.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // scrolling down when streaming answer updates
  useEffect(() => {
    if (endOfMessages.current && streamingAnswer) {
      endOfMessages.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [streamingAnswer, streamingSources]);

  return (
    <Box
      id="message-container"
      component="section"
      sx={{
        background: theme.palette.backgroundColor.main,
        display: "flex",
        flexDirection: "column",
        height: viewportIsSmall
          ? undefined
          : `calc(100vh - ${theme.constants.footerHeight}px)`,
        width: "100%",
        pt: "65px",
      }}
    >
      {/* if the array of messages is empty (if no messages have been sent yet), the phone image and intro text will be rendered */}
      {chatSessions.length === 0 ||
      (messages.length === 0 && !isLoading.current) ? (
        <WelcomeMessage
          chatId={chatId}
          handleSubmit={handleSubmit}
          setCurrentMessage={setCurrentMessage}
          onModelChange={handleModelChange}
        />
      ) : (
        <Box
          id="messages"
          sx={{ margin: "auto", width: "100%", overflowY: "auto" }}
        >
          {messages.map((message, index) => {
            return (
              <ChatBubble
                key={index}
                message={message}
                index={index}
                previousMessage={messages[index - 1]}
                chatId={chatId}
              />
            );
          })}
          
          {/* Show streaming answer if available */}
          {isLoading.current && streamingAnswer && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: '20px 25px',
              }}
            >
              <Avatar
                variant="square"
                sx={{
                  bgcolor: theme.palette.slalomSecondaryRed.dark,
                  marginRight: '20px',
                  fontSize: '0.6em',
                  borderRadius: '5px',
                  padding: '2px',
                  flexShrink: 0
                }}
              >
                <Box
                  component="img"
                  src={botIcon}
                  alt="botIcon"
                  style={{ width: '25px', height: '25px' }}
                />
              </Avatar>
              <Box
                sx={{
                  backgroundColor: theme.palette.common.white,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '10px',
                  padding: '16px',
                  width: '100%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <MarkdownRenderer content={AnswerFormatter(streamingAnswer)} />
                
                {/* Show sources loading indicator when answer is complete but sources haven't loaded yet */}
                {isStreamingComplete && streamingSources.length === 0 && (
                  <SourcesLoadingState />
                )}
                
                {/* Show sources if available and answer is complete */}
                {isStreamingComplete && streamingSources.length > 0 && streamingSources.some(source => source.name) && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ fontSize: '0.9em', color: theme.palette.text.secondary, mb: 1, fontWeight: 'bold' }}>
                      Sources:
                    </Box>
                    {streamingSources.map((source, index) => (
                      <Box
                        key={index}
                        sx={{
                          fontSize: '0.8em',
                          color: theme.palette.text.secondary,
                          mb: 0.5,
                          pl: 2
                        }}
                      >
                        <>📄 {source.name}</>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}
          
          <div id="eom" ref={endOfMessages} />
          {/** if the bot's answer is still loading... */}
          {isLoading.current && !streamingAnswer && <AnswerLoadingState />}
        </Box>
      )}
      <InputArea
        currentMessage={currentMessage}
        disabled={isLoading.current}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleClearInput={handleClearInput}
      />
    </Box>
  );
};
