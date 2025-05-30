// pages/support-bot-mobile.js
"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import BottomNavigation from "../../../components/BottomNavigation";

export default function SupportBotMobile() {
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

  const handleBack = () => {
    // You can implement navigation logic here
    console.log("Back button clicked");
    // Example: router.back() or window.history.back()
  };

  return (
    <>
      <Head>
        <title>Support Bot | Customer Service</title>
        <meta
          name="description"
          content="Chat with our AI support bot for customer service assistance"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        {/* Main content - will be pushed to the right on desktop by the lg:pl-56 class */}
        <div className="flex-1 flex flex-col lg:pl-56">
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-2 md:px-1 pb-16 flex flex-col h-screen">
            {/* Bot header */}
            <div className="bg-white p-4 flex items-center border-b rounded-t-lg mt-4">
              {/* Back button */}
              <button
                onClick={handleBack}
                className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-800"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5"></path>
                  <path d="M12 19l-7-7 7-7"></path>
                </svg>
              </button>

              <div className="flex items-center w-full">
                <div className="relative w-14 h-14">
                  <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
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
                  <h1 className="text-2xl font-bold text-black">Support Bot</h1>
                  <p className="text-gray-500 text-sm">Online</p>
                </div>
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-100">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.sender === "bot" ? (
                    <div className="flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
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
                        <span className="font-medium text-black">
                          Support Bot
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-3 ml-10 max-w-[85%] shadow-sm text-gray-800">
                        <p>{message.text}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <div className="mb-2 mr-2 text-right">
                        <span className="font-medium text-gray-600">
                          Customer
                        </span>
                      </div>
                      <div className="bg-blue-600 rounded-lg p-3 max-w-[85%] shadow-sm text-white">
                        <p>{message.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Exit site button */}
            <div className="absolute bottom-24 left-8 z-10">
              <button className="bg-white text-gray-800 rounded-full px-4 py-2 text-sm font-medium shadow-md hover:bg-gray-50">
                Exit site
              </button>
            </div>

            {/* Message input */}
            <div className="bg-white border-t p-4 rounded-b-lg">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border rounded-full px-4 py-3 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Import and render the BottomNavigation component */}
      <BottomNavigation />
    </>
  );
}
