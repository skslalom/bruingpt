export interface ChatSession {
  month: string;
  chatInfo: ChatInfo;
}

export interface ChatInfo {
  chatId: string;
  chatTitle: string;
  timestamp: string;
  conversation?: Exchange[];
}

export interface Exchange {
  exchangeId: string;
  question: string;
  response: string;
  sources?: Source[];
  rating?: string;
  timestamp: string;
}

export interface Source {
  name: string
  page_number: string
  location: string
  content: string
}

export interface SessionSearchResult {
  chatId: string;
  chatTitle: string;
  timestamp: string;
  score: number;
  highlights?: string[];
}

export interface Message {
  message: string;
  fromUser: boolean;
  exchangeId: string;
  rating?: string;
  sources?: Source[];
}

export interface MonthlyChatSessions {
  [key: string]: ChatInfo[];
}
