"use client";
import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "https://byte-babes.onrender.com";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const chat = async (message) => {
    try {
      setLoading(true);
      const data = await fetch(`${backendUrl}/voicechat/voice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const response = await data.json();
      const messages = response.messages || [];
      
      // Ensure messages is an array before spreading
      if (Array.isArray(messages)) {
        setMessages((prevMessages) => [...prevMessages, ...messages]);
      } else if (messages) {
        // If it's a single message, wrap it in an array
        setMessages((prevMessages) => [...prevMessages, messages]);
      }
    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setLoading(false);
    }
  };
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};