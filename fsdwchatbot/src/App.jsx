import React, { useState, useEffect, useRef } from "react";

// Helper component to render clickable links in messages
const MessageRenderer = ({ text }) => {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const [, linkText, url] = match;
    parts.push(
      <a
        href={url}
        key={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-500 dark:text-indigo-400 underline hover:text-indigo-600"
      >
        {linkText}
      </a>
    );
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <p className="text-sm leading-6 whitespace-pre-wrap">
      {parts.map((part, index) => (
        <React.Fragment key={index}>{part}</React.Fragment>
      ))}
    </p>
  );
};

// ✅ REDESIGNED ChatMessage Component
const ChatMessage = ({ message, sender, isLoading }) => {
  const isBot = sender === "bot";

  const BotAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center mr-3 flex-shrink-0">
      <svg
        className="w-5 h-5 text-indigo-500"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5.5C12 4.39543 12.8954 3.5 14 3.5C15.1046 3.5 16 4.39543 16 5.5V6.5C16 7.60457 15.1046 8.5 14 8.5C12.8954 8.5 12 7.60457 12 6.5V5.5Z"
          fill="currentColor"
        />
        <path
          d="M8 5.5C8 4.39543 8.89543 3.5 10 3.5C11.1046 3.5 12 4.39543 12 5.5V6.5C12 7.60457 11.1046 8.5 10 8.5C8.89543 8.5 8 7.60457 8 6.5V5.5Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 12C2 7.85786 5.35786 4.5 9.5 4.5H14.5C18.6421 4.5 22 7.85786 22 12V13.625C22 15.6888 20.7323 17.5133 18.9168 18.356L18.0441 18.7505C16.8504 19.2974 15.8427 20.1272 15.1485 21.1415C14.2884 22.4042 12.9298 22.9512 11.5126 22.7533L10.7186 22.636C8.2934 22.2811 6.30594 20.6548 5.3905 18.4526L5.34001 18.3496C4.44473 16.2016 4.96005 13.791 6.68533 12.2104C6.88372 12.0298 7.20579 12.0401 7.39158 12.2294L7.56158 12.4029C7.79093 12.6363 7.77732 13.0121 7.53582 13.2257C6.38891 14.276 6.09033 15.854 6.7863 17.2023L6.8299 17.2923C7.40049 18.4283 8.54222 19.231 9.83294 19.462L10.6269 19.5793C11.233 19.6677 11.7946 19.4326 12.1818 18.9916C12.7226 18.3562 13.1093 17.5459 13.2921 16.6669L13.5606 15.3433C13.8341 13.9922 14.9213 13 16.289 13H17.5C18.3284 13 19 12.3284 19 11.5C19 10.6716 18.3284 10 17.5 10H16.289C15.3347 10 14.5126 9.4582 14.102 8.65377L13.898 8.24948C13.2208 6.90159 11.7139 6.22393 10.3323 6.61115C8.94191 7.00064 7.9575 8.24151 7.9575 9.66667V10.5C7.9575 11.3284 7.28593 12 6.4575 12C5.62907 12 4.9575 11.3284 4.9575 10.5V9.66667C4.9575 7.1593 6.97401 5.08377 9.46766 4.69234C11.9788 4.30089 14.4173 5.4194 15.6559 7.43928L15.8286 7.72475C16.1422 8.24021 16.7908 8.5 17.5 8.5H18.5C19.8807 8.5 21 9.61929 21 11V12C21 13.1046 20.1046 14 19 14H17.5C16.9477 14 16.5 14.4477 16.5 15C16.5 15.5523 16.9477 16 17.5 16H19C20.6569 16 22 14.6569 22 13V12C22 8.68629 19.3137 6 16 6H9.5C6.46243 6 4 8.46243 4 11.5C4 11.9615 4.15933 12.3953 4.43845 12.7896C4.0537 12.5651 3.48148 12.3653 3 12.2428C2.51977 12.1206 2.14619 11.9961 2 11.9803V12Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );

  const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center ml-3 flex-shrink-0">
      <svg
        className="w-5 h-5 text-indigo-500"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 7.5C16 9.433 14.433 11 12.5 11C10.567 11 9 9.433 9 7.5C9 5.567 10.567 4 12.5 4C14.433 4 16 5.567 16 7.5Z"
          fill="currentColor"
        />
        <path
          d="M12.5 14C17.1565 14 21 16.0523 21 18.5C21 20.9477 17.1565 23 12.5 23C7.84346 23 4 20.9477 4 18.5C4 16.0523 7.84346 14 12.5 14Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );

  return (
    <div
      className={`flex items-start my-4 ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {isBot && <BotAvatar />}
      <div
        className={`max-w-md lg:max-w-xl px-4 py-3 rounded-xl shadow-md animate-[fadeInUp_0.4s_ease_forwards] ${
          isBot
            ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none"
            : "bg-indigo-500 text-white rounded-br-none"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-1 space-x-1.5">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></div>
          </div>
        ) : (
          <MessageRenderer text={message} />
        )}
      </div>
      {!isBot && <UserAvatar />}
    </div>
  );
};

// Main App component
const App = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI assistant, powered by Gemini. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const chatEndRef = useRef(null);

  // --- All your logic and data remains unchanged ---
  const unitTopics = {
    unit1: [
      {
        label: "HTML Overview",
        resources: [
          {
            name: "Official PDF Guide",
            url: "https://www.tutorialspoint.com/html/html_tutorial.pdf",
          },
          {
            name: "In-Depth Video Tutorial",
            url: "https://www.youtube.com/watch?v=ywebi2jX_oI",
          },
        ],
      },
      {
        label: "Understanding CSS",
        resources: [
          {
            name: "Gov.UK CSS Guide",
            url: "https://www.gov.uk/guidance/using-cascading-style-sheets-css",
          },
        ],
      },
    ],
    unit2: [
      {
        label: "JavaScript Variables",
        resources: [
          {
            name: "YouTube Explainer",
            url: "https://www.youtube.com/watch?v=jS4aFq5-91M",
          },
          {
            name: "W3Schools Reference",
            url: "https://www.w3schools.com/js/js_variables.asp",
          },
        ],
      },
    ],
  };

  useEffect(() => {
    if (selectedUnit && unitTopics[selectedUnit]) {
      setTopics(unitTopics[selectedUnit]);
      setSelectedTopic("");
    } else {
      setTopics([]);
      setSelectedTopic("");
    }
  }, [selectedUnit]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          unit: selectedUnit,
          topic: selectedTopic,
        }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const botMessage = { text: data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to fetch bot reply:", error);
      const errorMessage = {
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleTopicChange = (topicLabel) => {
    setSelectedTopic(topicLabel);
    if (!topicLabel) return;
    const selected = unitTopics[selectedUnit]?.find(
      (t) => t.label === topicLabel
    );
    if (selected && selected.resources && selected.resources.length > 0) {
      const resourceLinks = selected.resources
        .map((res) => `• [${res.name}](${res.url})`)
        .join("\n");
      const botMessage = {
        sender: "bot",
        text: `Here are the resources for "${topicLabel}":\n\n${resourceLinks}`,
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  return (
    // ✅ REDESIGNED Main Layout
    <div
      className={`${
        darkMode ? "dark" : ""
      } font-sans bg-slate-100 dark:bg-slate-900 transition-colors duration-300`}
    >
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-white dark:bg-slate-800 p-6 flex-shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-700 transition-colors duration-300">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-indigo-500 rounded-lg text-white">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5.5C12 4.39543 12.8954 3.5 14 3.5C15.1046 3.5 16 4.39543 16 5.5V6.5C16 7.60457 15.1046 8.5 14 8.5C12.8954 8.5 12 7.60457 12 6.5V5.5Z"
                  fill="currentColor"
                />
                <path
                  d="M8 5.5C8 4.39543 8.89543 3.5 10 3.5C11.1046 3.5 12 4.39543 12 5.5V6.5C12 7.60457 11.1046 8.5 10 8.5C8.89543 8.5 8 7.60457 8 6.5V5.5Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 12C2 7.85786 5.35786 4.5 9.5 4.5H14.5C18.6421 4.5 22 7.85786 22 12V13.625C22 15.6888 20.7323 17.5133 18.9168 18.356L18.0441 18.7505C16.8504 19.2974 15.8427 20.1272 15.1485 21.1415C14.2884 22.4042 12.9298 22.9512 11.5126 22.7533L10.7186 22.636C8.2934 22.2811 6.30594 20.6548 5.3905 18.4526L5.34001 18.3496C4.44473 16.2016 4.96005 13.791 6.68533 12.2104C6.88372 12.0298 7.20579 12.0401 7.39158 12.2294L7.56158 12.4029C7.79093 12.6363 7.77732 13.0121 7.53582 13.2257C6.38891 14.276 6.09033 15.854 6.7863 17.2023L6.8299 17.2923C7.40049 18.4283 8.54222 19.231 9.83294 19.462L10.6269 19.5793C11.233 19.6677 11.7946 19.4326 12.1818 18.9916C12.7226 18.3562 13.1093 17.5459 13.2921 16.6669L13.5606 15.3433C13.8341 13.9922 14.9213 13 16.289 13H17.5C18.3284 13 19 12.3284 19 11.5C19 10.6716 18.3284 10 17.5 10H16.289C15.3347 10 14.5126 9.4582 14.102 8.65377L13.898 8.24948C13.2208 6.90159 11.7139 6.22393 10.3323 6.61115C8.94191 7.00064 7.9575 8.24151 7.9575 9.66667V10.5C7.9575 11.3284 7.28593 12 6.4575 12C5.62907 12 4.9575 11.3284 4.9575 10.5V9.66667C4.9575 7.1593 6.97401 5.08377 9.46766 4.69234C11.9788 4.30089 14.4173 5.4194 15.6559 7.43928L15.8286 7.72475C16.1422 8.24021 16.7908 8.5 17.5 8.5H18.5C19.8807 8.5 21 9.61929 21 11V12C21 13.1046 20.1046 14 19 14H17.5C16.9477 14 16.5 14.4477 16.5 15C16.5 15.5523 16.9477 16 17.5 16H19C20.6569 16 22 14.6569 22 13V12C22 8.68629 19.3137 6 16 6H9.5C6.46243 6 4 8.46243 4 11.5C4 11.9615 4.15933 12.3953 4.43845 12.7896C4.0537 12.5651 3.48148 12.3653 3 12.2428C2.51977 12.1206 2.14619 11.9961 2 11.9803V12Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
              AI Assistant
            </h1>
          </div>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="unit-select"
                className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
              >
                Select Unit
              </label>
              <select
                id="unit-select"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Choose a Unit --</option>
                {Object.keys(unitTopics).map((unit) => (
                  <option key={unit} value={unit}>{`Unit ${unit.slice(
                    -1
                  )}`}</option>
                ))}
              </select>
            </div>
            {selectedUnit && (
              <div>
                <label
                  htmlFor="topic-select"
                  className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
                >
                  Select Topic
                </label>
                <select
                  id="topic-select"
                  value={selectedTopic}
                  onChange={(e) => handleTopicChange(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={!topics.length}
                >
                  <option value="">-- Choose a Topic --</option>
                  {topics.map((topic) => (
                    <option key={topic.label} value={topic.label}>
                      {topic.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="mt-auto">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <span>
                {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </span>
              {darkMode ? "🌞" : "🌙"}
            </button>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg.text} sender={msg.sender} />
            ))}
            {isLoading && (
              <ChatMessage message="..." sender="bot" isLoading={true} />
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-lg py-3 pl-4 pr-12 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-transform transform active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 2L11 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
