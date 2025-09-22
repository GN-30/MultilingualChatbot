import React from "react";

const ChatMessage = ({ message, sender, isLoading }) => {
  const isBot = sender === "bot";

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl ${
          isBot
            ? "bg-gray-700 rounded-bl-none"
            : "bg-cyan-600 text-white rounded-br-none"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
          </div>
        ) : (
          <p className="text-sm">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
