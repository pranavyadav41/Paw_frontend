import React, { useState, useEffect, useRef } from "react";
import { getMessages, sendMessage } from "../../api/chat";
import { FaTimes, FaPaperclip, FaUserCircle } from "react-icons/fa";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoMdChatbubbles } from "react-icons/io";
import { format } from "date-fns";
import Picker from 'emoji-picker-react';
import socket from "../socket";

interface Message {
  sender: string;
  receiver: string;
  message: string;
  timestamp: Date;
}

interface ChatRoomProps {
  userId: string;
  franchiseId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ userId, franchiseId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [sender, setSender] = useState<string>(userId);
  const [receiver, setReceiver] = useState<string>(franchiseId);
  const [showChat, setShowChat] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string>(`${userId}-${franchiseId}`);
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Join the room
    socket.emit("join", { room: roomId });

    // Fetch existing messages from the server
    const fetchMessages = async () => {
      try {
        const response = await getMessages(sender, receiver);
        setMessages(response?.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages(); 

    // Listen for new messages from the server
    const handleMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("newMessage", handleMessage);

    return () => {
      socket.off("newMessage", handleMessage);
      socket.emit("leave", { room: roomId });
    };
  }, [sender, receiver, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (messageInput.trim() !== "") {
      const newMessage: Message = {
        sender,
        receiver,
        message: messageInput,
        timestamp: new Date(),
      };
      try {
        // Send the message to the server
        await sendMessage(sender, receiver, messageInput);
        socket.emit("sendMessage", { room: roomId, message: newMessage });
        setMessageInput("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const onEmojiClick = (event: any, emojiObject: any) => {
    console.log(emojiObject.emoji)
    setMessageInput((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const handleAttachFile = () => {
    // Add your logic for attaching files here
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div
      className={`fixed bottom-4 md:right-5 m-4 bg-[#F5F5F5] rounded-lg shadow-lg w-[374px] h-[572px] z-30 ${
        showChat ? "block" : "hidden"
      }`}
    >
      <div className="flex justify-between items-center bg-[#9ad1aa] text-gray-600 px-4 py-2 rounded-t-lg">
        <div className="flex items-center">
          <IoMdChatbubbles className="mr-2" />
          <h3 className="text-md font-medium">Live Support</h3>
        </div>
        <FaTimes
          className="cursor-pointer"
          onClick={() => setShowChat(!showChat)}
        />
      </div>
      <div className="p-4 h-[calc(100%-144px)] max-h-[calc(100%-144px)] overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${
              message.sender === sender ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-flex items-start ${
                message.sender === sender ? "flex-row-reverse" : ""
              }`}
            >
              {message.sender !== sender && (
                <FaUserCircle className="mr-2 text-gray-500" size={20} />
              )}
              <div
                className={`inline-block px-4 py-2 rounded-md ${
                  message.sender === sender
                    ? "bg-gray-800 text-white text-sm font-normal rounded-xl rounded-tr-none"
                    : "bg-gray-300 text-gray-600 text-sm font-normal rounded-xl rounded-tl-none"
                }`}
              >
                <p>{message.message}</p>
                <span className="block text-xs text-gray-400">
                  {format(new Date(message.timestamp), "hh:mm a")}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="px-4 py-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="w-full mb-2 px-4 py-3 rounded-md border text-sm font-light border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <div className="flex justify-between">
          <div>
            <MdOutlineEmojiEmotions
              size={32}
              className="cursor-pointer text-gray-500 p-2 rounded-md hover:bg-gray-200"
              onClick={() => setShowPicker((val) => !val)}
            />
            {showPicker && (
              <div className="absolute bottom-20">
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
          <button
            onClick={handleAttachFile}
            className="text-gray-500 p-2 rounded-md hover:bg-gray-200"
          >
            <FaPaperclip size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
