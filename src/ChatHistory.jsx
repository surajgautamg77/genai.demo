import React from 'react';

const ChatHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      {history.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-lg rounded-lg px-4 py-2 ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}
          >
            <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
