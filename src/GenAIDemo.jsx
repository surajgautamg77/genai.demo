import React, { useState } from 'react';
import ChatHistory from './ChatHistory';

const GenAIDemo = () => {
  const [systemPrompt, setSystemPrompt] = useState('You are a strict assistant. Follow these rules:\n1. Answer the question using ONLY the context provided below.\n2. Do not use your own internal knowledge.\n3. If the answer is not explicitly in the context, reply exactly with: "Sorry, I have no information about that."');
  const [context, setContext] = useState(`🎡 Story: Sonu and Monu at the Village Mela

Sonu and Monu lived in a small village surrounded by green fields and tall mango trees. Every year their village hosted a big mela near the temple ground. The boys waited for it more eagerly than anything else.

The Exciting Morning

One sunny morning, Monu came running to Sonu’s house.

Monu: “Sonu! The mela has arrived! Let’s go!”
Sonu: “Wait, let me ask Amma first.”

Sonu’s mother smiled and gave them each 10 rupees.

Amma: “Spend it wisely. And stay together.”

They nodded and ran happily toward the fair.

At the Mela

The mela was full of colors, music, and laughter.
There were:

toy stalls

sweet shops selling jalebi and laddoo

a giant wheel turning slowly

puppet shows

and a magician performing tricks

Monu’s eyes sparkled the most at the sight of balloons.

Monu: “I want the biggest red balloon!”
Sonu: “And I want to ride the giant wheel!”

They decided to do everything one by one.

The Missing Moment

After buying their balloons, the boys moved through the crowd. Suddenly, Monu stopped.

Monu: “Sonu, where is my balloon? It flew away!”

Monu looked sad. Sonu held his hand.

Sonu: “Don’t worry. I’ll share mine.”

Sonu gave Monu his own balloon, even though he really wanted it.
Monu smiled again.

The Giant Wheel Ride

They went for the giant wheel. At the top, the whole village looked tiny.

Monu: “Sonu! Look! That’s our school!”
Sonu: “And there’s the river!”

The wind blew softly, and the boys laughed, forgetting everything else.

Sweet Surprise

When they came down, Monu’s father found them.

Monu’s Father: “So here you are! Come, I’ll buy you both jalebi.”

The boys happily ate hot, crispy jalebis.
Monu whispered, “This is the best day of my life.”

Going Home

The sun began to set. Lanterns lit the mela, and the crowd slowly thinned.

Sonu and Monu walked home, tired but happy.

Sonu: “Next year, we’ll come early!”
Monu: “Yes! And I’ll bring a bigger pocket money!”

They laughed, holding hands like true friends.

Moral:

Sharing makes every moment happier. Friendship makes every place brighter.`)
  const [query, setQuery] = useState('');
  const [maxTokens, setMaxTokens] = useState(200);
  const [temperature, setTemperature] = useState(0.1);
  const [topP, setTopP] = useState(0.9);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return; // Do not send empty messages
    setIsLoading(true);
    setError(null);

    const userMessage = { sender: 'user', text: query };
    setChatHistory(prev => [...prev, userMessage]);

    const formattedPrompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\nContext:\n${context}\n\nQuestion:\n${query}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`;

    const payload = {
      prompt: formattedPrompt,
      max_tokens: parseInt(maxTokens, 10),
      temperature: parseFloat(temperature),
      top_p: parseFloat(topP),
    };

    try {
      const res = await fetch('https://aibot14.studyineurope.xyz/genaiapi/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const aiMessageText = data.generated_text || JSON.stringify(data, null, 2);
      const aiMessage = { sender: 'ai', text: aiMessageText };
      setChatHistory(prev => [...prev, aiMessage]);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  const handleClearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-8">
      <div className="flex gap-8 py-8">
        {/* Chat Window Section */}
        <div className="flex flex-1 flex-col border rounded-lg shadow-lg bg-white dark:bg-gray-800 h-[90vh] md:h-[80vh]">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold">Chat Window</h1>
            <button
              onClick={handleClearChat}
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400"
            >
              Clear Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ChatHistory history={chatHistory} />
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300 dark:border-gray-700 flex items-center space-x-2">
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 resize-none"
              rows="1"
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </form>
        </div>

        {/* Knowledge/Context Section */}
        <div className="flex flex-1 flex-col border rounded-lg shadow-lg bg-white dark:bg-gray-800 p-4 h-[90vh] md:h-[80vh]">
          <h2 className="text-2xl font-bold mb-4">Knowledge (Context)</h2>
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="flex-1 w-full p-3 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 resize-none"
            rows="10" // Adjust rows as needed, flex-1 will handle height
          />
        </div>
      </div>

      {/* Settings Section */}
      <div className="p-8 mt-8 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Parameters */}
          <div>
            <h3 className="text-xl font-bold mb-4">Parameters</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="max-tokens" className="block text-lg font-medium mb-2">Max Tokens</label>
                <input
                  id="max-tokens"
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="temperature" className="block text-lg font-medium mb-2">Temperature: {temperature}</label>
                <input
                  id="temperature"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              <div>
                <label htmlFor="top-p" className="block text-lg font-medium mb-2">Top P: {topP}</label>
                <input
                  id="top-p"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={topP}
                  onChange={(e) => setTopP(e.target.value)}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <h3 className="text-xl font-bold mb-4">System Prompt</h3>
            <textarea
              id="system-prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 resize-none"
              rows="10" // Adjust rows as needed
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );

};

export default GenAIDemo;
