// pages/support-bot.js
"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";

export default function SupportBotPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "👋 Welcome to Support Bot. I'm ChatBot, your AI assistant. Let me know how I can help you.",
    },
    {
      id: 2,
      sender: "user",
      text: "Hi, How much time do I have left for my order to be returned?",
    },
    {
      id: 3,
      sender: "bot",
      text: "You can return your items within 30 days of receiving your package from the store.",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        sender: "bot",
        text: "I'm here to help! Is there anything else you'd like to know?",
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Support Bot | Customer Service</title>
        <meta
          name="description"
          content="Chat with our AI support bot for customer service assistance"
        />
      </Head>

      <div className="flex flex-col h-screen bg-gray-100">
        {/* Bot header */}
        <div className="bg-white p-4 flex items-center shadow-sm">
          <div className="flex items-center">
            <div className="relative w-16 h-16">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-3">
              <h1 className="text-3xl font-bold text-gray-900">Support Bot</h1>
              <p className="text-gray-500">Online</p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="flex items-start mb-1">
                {message.sender === "bot" && (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                )}
                <div className="font-medium">
                  {message.sender === "bot" ? "Support Bot" : "Customer"}
                </div>
              </div>
              <div
                className={`max-w-xl rounded-lg p-4 ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-white text-gray-800"
                }`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="bg-white border-t p-4">
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send
            </button>
          </form>
        </div>

        {/* Exit site button */}
        <div className="absolute bottom-4 left-4">
          <button className="bg-white text-gray-800 rounded-full px-4 py-2 text-sm font-medium shadow-md">
            Exit site
          </button>
        </div>
      </div>
    </>
  );
}
