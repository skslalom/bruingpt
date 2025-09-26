import {
  Exchange,
  MonthlyChatSessions,
  SessionSearchResult,
} from "../interfaces/Chat";

export interface PostMessageRes {
  content: string;
  sources: Sources;
  exchangeId: string;
}

export interface DocumentSource {
  type: "document";
  name: string;
  content: string;
  location: string;
  page_number: string;
  score: number;
  presigned_url: string;
}

export interface WebSource {
  type: "web";
  name: string;
  url: string;
  snippet: string;
  score: number;
}

export interface Sources {
  sources?: Source;
}

export interface GetSessionRes {
  chatId: string;
  timestamp: string;
  conversation: Exchange[];
}

export interface GetChatHistoryRes {
  monthlyChatSessions: MonthlyChatSessions;
}

export interface SearchSessionsRes {
  results: SessionSearchResult[];
  total_results: number;
  query: string;
  search_metadata?: {
    execution_time_ms: number;
    max_score: number;
  };
}

export interface Content {
  content: string;
}

export interface FinalResponse {
  complete_answer: string;
  sources: Source[];
  exchangeId: string;
  query: string;
  chat_id: string;
  generatedTitle?: string;
}

export interface StreamResponse<T = unknown> {
  data: T;
  type: "answer" | "sources" | "final_response" | "answer_complete";
  sources?: Sources;
  exchangeId?: string;
}

// Union type for all possible messages
export type StreamMessageTypes =
  | (StreamResponse<Content> & { type: "answer" })
  | (StreamResponse<Sources> & { type: "sources" })
  | (StreamResponse<FinalResponse> & { type: "final_response" })
  | (StreamResponse<Content> & { type: "answer_complete" });

export type Source = DocumentSource | WebSource;

export type DeleteChatSessionRes = 'success' | { message: 'Not Found' };

export type PutChatNameRes = 'success' | { message: 'Not Found' };

export type PutRatingResponse = 'success' | { message: 'Not Found' };

export interface PostDocumentRes {
  documentId: string;
  presignedUrl: string;
}

export interface GetDocumentRes {
  documentId: string;
  fileName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
