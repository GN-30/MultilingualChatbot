import React, { useState, useEffect, useRef } from "react";

// Helper to render clickable links
const MessageRenderer = ({ text }) => {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const [, linkText, url] = match;
    parts.push(
      <a
        key={url}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-pink-500 dark:text-pink-400 underline hover:text-pink-600 transition-colors"
      >
        {linkText}
      </a>
    );
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return <p className="text-sm leading-6 whitespace-pre-wrap">{parts}</p>;
};

// Chat message component
const ChatMessage = ({ message, sender, isLoading }) => {
  const isBot = sender === "bot";

  const BotAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center mr-3 shadow-lg">
      🤖
    </div>
  );

  const UserAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center ml-3 shadow-lg">
      🧑
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
        className={`max-w-full sm:max-w-md md:max-w-lg px-4 py-3 rounded-xl shadow-lg ${
          isBot
            ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none"
            : "bg-gradient-to-r from-green-400 to-teal-400 text-white rounded-br-none"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-1.5">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
          </div>
        ) : (
          <MessageRenderer text={message} />
        )}
      </div>
      {!isBot && <UserAvatar />}
    </div>
  );
};

// Main App
const App = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! Click an icon or type a message.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeIcon, setActiveIcon] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const chatEndRef = useRef(null);

  const icons = [
    {
      name: "HTML",
      color: "from-purple-400 via-pink-400 to-red-400",
      subtopics: [
        {
          name: "HTML Basics",
          resources: [
            { name: "Guide", url: "https://www.w3schools.com/html/" },
          ],
        },
        {
          name: "HTML Forms",
          resources: [
            {
              name: "Forms Guide",
              url: "https://www.w3schools.com/html/html_forms.asp",
            },
          ],
        },
      ],
    },
    {
      name: "CSS",
      color: "from-blue-400 via-purple-400 to-pink-400",
      subtopics: [
        {
          name: "CSS Basics",
          resources: [
            { name: "CSS Guide", url: "https://www.w3schools.com/css/" },
          ],
        },
        {
          name: "Flexbox",
          resources: [
            {
              name: "Flexbox Guide",
              url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
            },
          ],
        },
      ],
    },
    {
      name: "JS",
      color: "from-green-400 to-teal-400",
      subtopics: [
        {
          name: "JS Basics",
          resources: [
            { name: "JS Guide", url: "https://www.w3schools.com/js/" },
          ],
        },
        {
          name: "DOM Manipulation",
          resources: [
            {
              name: "DOM Guide",
              url: "https://www.w3schools.com/js/js_htmldom.asp",
            },
          ],
        },
      ],
    },
    {
      name: "React",
      color: "from-pink-400 to-red-400",
      subtopics: [
        {
          name: "React Intro",
          resources: [
            {
              name: "React Docs",
              url: "https://reactjs.org/docs/getting-started.html",
            },
          ],
        },
        {
          name: "Hooks",
          resources: [
            {
              name: "Hooks Guide",
              url: "https://reactjs.org/docs/hooks-intro.html",
            },
          ],
        },
      ],
    },
    {
      name: "Python",
      color: "from-indigo-400 via-purple-400 to-pink-400",
      subtopics: [
        {
          name: "Python Basics",
          resources: [
            { name: "Python Docs", url: "https://docs.python.org/3/tutorial/" },
          ],
        },
        {
          name: "OOP",
          resources: [
            {
              name: "OOP Guide",
              url: "https://realpython.com/python3-object-oriented-programming/",
            },
          ],
        },
      ],
    },
  ];

  const handleIconClick = (index) =>
    setActiveIcon(activeIcon === index ? null : index);

  const handleSubtopicClick = (subtopic) => {
    const resourceLinks = subtopic.resources
      .map((res) => `• [${res.name}](${res.url})`)
      .join("\n");
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: `Here are the resources for "${subtopic.name}":\n\n${resourceLinks}`,
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://fswd-luow.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const botMessage = { text: data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API error:", error);
      const errorMessage = {
        text: "Sorry, I couldn't connect to the server.",
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } flex h-screen font-sans bg-gray-100 dark:bg-gray-900 transition-colors`}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-4 flex flex-col border-r border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
          AI Assistant
        </h1>
        {icons.map((icon, index) => (
          <div key={icon.name}>
            <button
              className={`w-full flex items-center justify-between p-3 mb-2 rounded-lg text-white shadow-md transition transform hover:scale-105 active:scale-95`}
              style={{
                background: `linear-gradient(90deg, ${icon.color.replace(
                  /\s/g,
                  ","
                )})`,
              }}
              onClick={() => handleIconClick(index)}
            >
              {icon.name}
              <span>{activeIcon === index ? "▲" : "▼"}</span>
            </button>
            {activeIcon === index && (
              <div className="ml-4 flex flex-col space-y-1 mb-2">
                {icon.subtopics.map((sub) => (
                  <button
                    key={sub.name}
                    className="text-gray-800 dark:text-gray-200 text-left px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    onClick={() => handleSubtopicClick(sub)}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-auto px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? "Switch to Light Mode 🌞" : "Switch to Dark Mode 🌙"}
        </button>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg.text} sender={msg.sender} />
          ))}
          {isLoading && (
            <ChatMessage message="..." sender="bot" isLoading={true} />
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-lg py-3 px-4 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className="ml-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
