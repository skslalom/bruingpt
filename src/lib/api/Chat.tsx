import axios, { AxiosResponse, isAxiosError } from 'axios';
import { API_URL, STREAMING_API_URL } from '../constants';
import { UserInfo } from '../contexts/UserInfoContext';
import {
  GetChatHistoryRes,
  GetSessionRes,
  PostMessageRes,
  DeleteChatSessionRes,
  PutChatNameRes,
  PutRatingResponse,
  GetDocumentRes,
  PostDocumentRes,
  StreamMessageTypes,
} from '../models/Chat';
import { checkSessionExpired } from './Auth';

export async function postChatMessage(
  message: string,
  chatId: string,
  selectedModel: string,
  accessToken: string
): Promise<PostMessageRes | undefined> {
  if (!checkSessionExpired(accessToken)) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const requestBody = {
      question: message,
      chatId,
      selectedModel,
    };

    try {
      const response: AxiosResponse = await axios.post(`${API_URL}chat`, requestBody, {
        headers,
      });

      return response.data as PostMessageRes;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data as PostMessageRes;
      }
      return undefined;
    }
  } else {
    return undefined;
  }
}

export async function postChatMessageStream(
  message: string,
  chatId: string,
  accessToken: string,
  onStream: (data: StreamMessageTypes) => void,
  onError: (error: Error) => void,
  onComplete: () => void
): Promise<void> {
  if (!checkSessionExpired(accessToken)) {
    try {
      const requestBody = {
        question: message,
        chatId,
      };

      const response = await fetch(`${STREAMING_API_URL}stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onComplete();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const streamedData = JSON.parse(line.slice(6)) as StreamMessageTypes;
              onStream(streamedData);

              if (streamedData.type === "final_response") {
                onComplete();
                return;
              }
            } catch (error) {
              console.error("Error parsing stream data:", error);
            }
          }
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  }
}

export async function getChatSession(
  userInfo: UserInfo,
  chatId: string
): Promise<GetSessionRes | undefined> {
  if (!checkSessionExpired(userInfo.accessToken)) {
    const headers = {
      Authorization: `Bearer ${userInfo.accessToken}`,
    };
    try {
      const response: AxiosResponse = await axios.get(`${API_URL}chat/${chatId}`, {
        headers,
      });

      return response.data as GetSessionRes;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data as GetSessionRes;
      }
      return undefined;
    }
  } else {
    return undefined;
  }
}

export async function deleteChatSession(
  chatId: string,
  accessToken: string
): Promise<DeleteChatSessionRes | undefined> {
  if (!checkSessionExpired(accessToken)) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response: AxiosResponse = await axios.delete(`${API_URL}chat/${chatId}`, {
        headers,
      });

      return response.data as DeleteChatSessionRes;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.data as DeleteChatSessionRes;
      }
      return undefined;
    }
  } else {
    return undefined;
  }
}

export async function putConversationName(
  userInfo: UserInfo,
  chatId: string,
  title: string | null
): Promise<PutChatNameRes | undefined> {
  if (!checkSessionExpired(userInfo.accessToken)) {
    const headers = {
      Authorization: `Bearer ${userInfo.accessToken}`,
    };
    const request = { title };

    try {
      const response: AxiosResponse = await axios.put(`${API_URL}chat/${chatId}/title`, request, {
        headers,
      });
      return response.data as PutChatNameRes;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.data as PutChatNameRes;
      }
      return undefined;
    }
  } else {
    return undefined;
  }
}

export async function putResponseRating(
  chatId: string,
  exchangeId: string,
  rating: string | null,
  accessToken?: string
): Promise<PutRatingResponse | undefined> {
  if (!checkSessionExpired(accessToken)) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const request = { rating };

    try {
      const response: AxiosResponse = await axios.put(
        `${API_URL}chat/${chatId}/exchange/${exchangeId}/rating`,
        request,
        {
          headers,
        }
      );
      return response.data as PutRatingResponse;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.data as PutRatingResponse;
      }
      return undefined;
    }
  } else {
    return undefined;
  }
}

export async function getChatHistory(userInfo: UserInfo): Promise<GetChatHistoryRes | undefined> {
  if (!checkSessionExpired(userInfo.accessToken)) {
    const headers = {
      Authorization: `Bearer ${userInfo.accessToken}`,
    };
    try {
      const response = await axios.get(`${API_URL}chats`, {
        headers,
      });

      return response.data as GetChatHistoryRes;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data as GetChatHistoryRes;
      }
      return undefined;
    }
  } else {
    return undefined;
  }
}

// Document Upload: 2 calls
// 1. POST to get presignedUrl
// 2. Put File object via presignedUrl
export async function postDocumentFile(
  userInfo: UserInfo,
  chatId: string,
  file: File
): Promise<string | undefined> {
  if (!checkSessionExpired(userInfo.accessToken)) {
    const requestBody = {
      fileName: file.name,
    };

    try {
      const getPresignedUrlResponse: AxiosResponse = await axios.post(
        `${API_URL}chat/${chatId}/document`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${userInfo.accessToken}`,
          },
        }
      );

      const responseData = getPresignedUrlResponse.data as PostDocumentRes;
      if (responseData.presignedUrl) {
        const { presignedUrl } = responseData;

        // set file as blob
        const blob = new Blob([file]);

        const response: AxiosResponse = await axios.put(presignedUrl, blob, {
          headers: {
            "Content-Type": null,
          },
          // needed to tell Axios not to add content-type header and to leave file blob alone
          transformRequest: [
            function (data, headers) {
              delete headers["content-type"];
              return data;
            },
          ],
        });

        // PUT to presignedUrl returns no response body; only 200
        if (response.status === 200) {
          return "success";
        }
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return error.response?.data as string;
      }
      return undefined;
    }
  } else return undefined;
}

// Document Upload: POST to get presigned URL only
export async function postUploadGetPresignedUrl(
  userInfo: UserInfo,
  chatId: string,
  file: File
): Promise<PostDocumentRes | undefined> {
  if (!checkSessionExpired(userInfo.accessToken)) {
    const requestBody = {
      fileName: file.name,
    };

    try {
      const getPresignedUrlResponse: AxiosResponse = await axios.post(
        `${API_URL}chat/${chatId}/document`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${userInfo.accessToken}`,
          },
        }
      );
      return getPresignedUrlResponse.data;
    } catch (error: any) {
      return error?.response?.data;
    }
  } else return undefined;
}

// Document Upload: PUT to upload file via presignedUrl
export async function postUploadPutFile(
  presignedUrl: string,
  file: File
): Promise<string | undefined> {
  if (presignedUrl) {
    try {
      // set file as blob
      const blob = new Blob([file]);

      const response: AxiosResponse = await axios.put(presignedUrl, blob, {
        headers: {
          "Content-Type": null,
        },
        // needed to tell Axios not to add content-type header and to leave file blob alone
        transformRequest: [
          function (data, headers) {
            delete headers["content-type"];
            return data;
          },
        ],
      });

      // PUT to presignedUrl returns no response body; only 200
      if (response.status === 200) {
        return "success";
      }
    } catch (error: any) {
      return error?.response?.data;
    }
  } else return undefined;
}

export async function getDocumentFiles(
  userInfo: UserInfo,
  chatId: string
): Promise<GetDocumentRes[] | undefined> {
  if (!checkSessionExpired(userInfo.accessToken)) {
    const headers = {
      Authorization: `Bearer ${userInfo.accessToken}`,
    };
    try {
      const response: AxiosResponse = await axios.get(
        `${API_URL}chat/${chatId}/document`,
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      return undefined;
    }
  } else return undefined;
}

export async function getDocumentFile(
  userInfo: UserInfo,
  chatId: string,
  documentId: string
): Promise<GetDocumentRes | undefined> {
  if (!checkSessionExpired(userInfo.accessToken)) {
    const headers = {
      Authorization: `Bearer ${userInfo.accessToken}`,
    };
    try {
      const response: AxiosResponse = await axios.get(
        `${API_URL}chat/${chatId}/document/${documentId}`,
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      return undefined;
    }
  } else return undefined;
}
