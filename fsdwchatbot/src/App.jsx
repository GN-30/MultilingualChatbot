import React, { useState, useEffect, useRef } from "react";

// Helper to render clickable links
// ✅ FIX: Added a default empty string to the 'text' prop to prevent crashes.
const MessageRenderer = ({ text = "" }) => {
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
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center mr-3 shadow-lg flex-shrink-0">
      🤖
    </div>
  );

  const UserAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center ml-3 shadow-lg flex-shrink-0">
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
    { text: "Hello! Click a topic or type a message.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeIcon, setActiveIcon] = useState(null);
  const [darkMode] = useState(
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  const icons = [
    {
      name: "UNIT-1",
      color: "from-purple-400 via-pink-400 to-red-400",
      subtopics: [
        {
          name: "Internal/External Links, Colors, Images & Multimedia",
          resources: [
            {
              name: "Links Guide",
              url: "https://www.w3schools.com/html/html_links.asp",
            },
            {
              name: "Media Guide",
              url: "https://www.w3schools.com/html/html_media.asp",
            },
          ],
        },
        {
          name: "CSS Overview: Cascading Style Sheets",
          resources: [
            {
              name: "CSS Intro",
              url: "https://www.w3schools.com/css/css_intro.asp",
            },
          ],
        },
        {
          name: "Margin, Padding, Alignment & Floating",
          resources: [
            {
              name: "Box Model",
              url: "https://www.w3schools.com/css/css_boxmodel.asp",
            },
            {
              name: "Align & Float",
              url: "https://www.w3schools.com/css/css_align.asp",
            },
          ],
        },
        {
          name: "CSS Box Model, Positioning, Lists, & Navigation",
          resources: [
            {
              name: "Positioning",
              url: "https://www.w3schools.com/css/css_positioning.asp",
            },
            {
              name: "Navigation Bars",
              url: "https://www.w3schools.com/css/css_navbar.asp",
            },
          ],
        },
        {
          name: "Modern CSS Layouts (Flexbox & Grid)",
          resources: [
            {
              name: "Flexbox Guide",
              url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
            },
            {
              name: "Grid Guide",
              url: "https://css-tricks.com/getting-started-css-grid/",
            },
          ],
        },
        {
          name: "Backgrounds and Borders",
          resources: [
            {
              name: "Backgrounds",
              url: "https://www.w3schools.com/css/css_background.asp",
            },
            {
              name: "Borders",
              url: "https://www.w3schools.com/css/css_border.asp",
            },
          ],
        },
        {
          name: "CSS Transforms, Transitions, & Animations",
          resources: [
            {
              name: "2D Transforms",
              url: "https://www.w3schools.com/css/css3_2dtransforms.asp",
            },
            {
              name: "Transitions",
              url: "https://www.w3schools.com/css/css3_transitions.asp",
            },
            {
              name: "Animations",
              url: "https://www.w3schools.com/css/css3_animations.asp",
            },
          ],
        },
      ],
    },
    {
      name: "UNIT-2",
      color: "from-blue-400 via-purple-400 to-pink-400",
      subtopics: [
        {
          name: "JavaScript overview and understanding javascript - Understanding dynamic websites and Html 5 applications ",
          resources: [
            {
              name: "CSS Guide",
              url: "https://docs.google.com/forms/d/e/1FAIpQLSf73j9COxsDMIe7TvThR1JY2UE2nLhKWmZKQX0dKfEWA1gTFQ/viewform?usp=header",
            },
          ],
        },
        {
          name: "Getting started with javascript programs - working with the document object model(DOM)",
          resources: [
            {
              name: "Getting started with javascript programs - working with the document object model(DOM) ",
              url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
            },
          ],
        },
        {
          name: " understanding javascript variables, strings and arrays",
          resources: [
            {
              name: "Flexbox Guide",
              url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
            },
          ],
        },
        {
          name: "Control flow with conditions and loops - Responding to events and using windows",
          resources: [
            {
              name: "Flexbox Guide",
              url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
            },
          ],
        },
        {
          name: " Javascript best practices - using third party javascript libraries and frameworks ",
          resources: [
            {
              name: "Flexbox Guide",
              url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
            },
          ],
        },
        {
          name: "The foundations of react - JSX - all about components ",
          resources: [
            {
              name: "Flexbox Guide",
              url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
            },
          ],
        },
        {
          name: "Events - forms - refs - styling react - routing - hooks ",
          resources: [
            {
              name: "Flexbox Guide",
              url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
            },
          ],
        },
        {
          name: "Hooks : Rules of hooks , Built-in hooks ",
          resources: [
            {
              name: "Flexbox Guide",
              url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
            },
          ],
        },
        {
          name: "Writing custom hooks - Labeling custom hooks with usedebug value - Finding and using Custom hooks",
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
      name: "UNIT-3",
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
      name: "UNIT-4",
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
      name: "UNIT-5",
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

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleIconClick = (index) => {
    setActiveIcon(activeIcon === index ? null : index);
    setSelectedUnit(icons[index].name); // set unit when icon clicked
  };

  const handleSubtopicClick = (subtopic) => {
    setSelectedTopic(subtopic.name); // set topic when subtopic clicked
    const resourceLinks = subtopic.resources
      .map((res) => `• [${res.name}](${res.url})`)
      .join("\n");
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: `Here are resources for "${subtopic.name}":\n\n${resourceLinks}`,
      },
    ]);
    setIsSidebarOpen(false);
  };

  const handleSend = async () => {
    const message = input.trim(); // <-- define message here
    if (!message) return;

    const userMessage = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message, // <-- send message
          history: messages, // or just messages
          unit: selectedUnit,
          topic: selectedTopic,
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      // AFTER - This correctly reads the new Gemini API structure
      const data = await response.json();

      // Safely access the text from the new response structure
      const geminiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't get a valid response.";
      const botMessage = { text: geminiText, sender: "bot" };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I couldn't connect to the server.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } h-screen font-sans bg-gray-100 dark:bg-gray-900 transition-colors overflow-hidden`}
    >
      <div className="relative h-full flex">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <aside
          className={`w-64 bg-white dark:bg-gray-800 p-4 flex flex-col border-r border-gray-200 dark:border-gray-700
                                  fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                                  ${
                                    isSidebarOpen
                                      ? "translate-x-0"
                                      : "-translate-x-full"
                                  }`}
        >
          <h1 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex-shrink-0">
            AI Assistant
          </h1>

          <div className="flex-grow overflow-y-auto pr-2">
            {icons.map((icon, index) => (
              <div key={icon.name}>
                <button
                  className={`w-full flex items-center justify-between p-3 mb-2 rounded-lg text-white shadow-md transition transform hover:scale-105 active:scale-95 bg-gradient-to-r ${icon.color}`}
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
                        className="w-full text-left p-2 my-1 rounded-md bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors duration-200 text-gray-700 dark:text-gray-200 text-sm font-medium"
                        onClick={() => handleSubtopicClick(sub)}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full">
          <div className="md:hidden p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-800 dark:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold ml-4 text-gray-800 dark:text-white">
              Chat
            </h1>
          </div>

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
              onClick={() => handleSend()}
              className="ml-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
