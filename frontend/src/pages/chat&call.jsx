import React, { useState } from 'react';

const ChatAndCall = () => {
  const [isVideoCall, setIsVideoCall] = useState(true);
  const [message, setMessage] = useState('');  // State to hold the message

  const toggleView = () => {
    setIsVideoCall(!isVideoCall);
  };

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message logic here
      console.log("Message Sent:", message);
      setMessage('');  // Reset message input after sending
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 bg-gray-100">
      <div className="w-full max-w-4xl px-6 py-4 bg-white rounded-xl shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            {isVideoCall ? 'Video Call' : 'Chat'}
          </h2>
          <button
            onClick={toggleView}
            className="text-blue-500 font-medium"
          >
            Switch to {isVideoCall ? 'Chat' : 'Video Call'}
          </button>
        </div>

        {/* Video Call Section */}
        {isVideoCall ? (
          <div className="flex flex-col items-center justify-center bg-gray-200 p-6 rounded-md shadow-sm">
            <div className="w-full max-w-md bg-black h-60 rounded-lg mb-4">
              {/* Video call placeholder */}
              <div className="w-full h-full flex items-center justify-center text-white">
                <span>Video Call Screen</span>
              </div>
            </div>
            <button className="bg-green-500 text-white px-6 py-2 rounded-full">Start Call</button>
          </div>
        ) : (
          // Chat Section
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md bg-white rounded-lg p-4 border border-gray-300 shadow-sm mb-4">
              <div className="overflow-y-auto h-60 mb-4">
                {/* Example chat messages */}
                <div className="mb-2">
                  <p className="text-gray-700 text-sm">User: Hello, how can I assist you?</p>
                </div>
                <div className="mb-2">
                  <p className="text-gray-700 text-sm">You: I need some advice about health.</p>
                </div>
                {/* Add more chat messages as needed */}
              </div>

              <div className="flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border border-gray-300 rounded-l-md px-4 py-2 w-3/4"
                />
                <button
                  onClick={handleSend}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-r-md ${!message.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!message.trim()} // Disable button when message is empty
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatAndCall;
