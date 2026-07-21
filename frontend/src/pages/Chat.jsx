import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API from "../api";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";

function Chat() {
     

  const { chatId } = useParams();

  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");

  const [message, setMessage] = useState("");

  const socketRef = useRef(null);
  useEffect(() => {
socketRef.current = io("https://campuscart-backend-u3i3.onrender.com");

  return () => {
    socketRef.current.disconnect();
  };
}, []);

  const token = localStorage.getItem("token");
  

  useEffect(() => {
  if (!chat) return;

  socketRef.current.emit("joinChat", chat._id);

}, [chat]);

 

  const fetchChat = async () => {
    try {
      const res = await API.get(
        `/chat/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

 useEffect(() => {
  fetchChat();

  const interval = setInterval(fetchChat, 2000);

  return () => clearInterval(interval);
}, []);

  const sendMessage = async () => {
  if (!message.trim()) return;

  try {
    await API.post(
      `/chat/${chat._id}`,
      {
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // Fetch the updated chat
    const response = await API.get(
      `/chat/${chat._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setChat(response.data);
    setMessage("");

  } catch (error) {
    console.log(error);
  }
};

  if (!chat) {
    return (
      <>
        <Navbar />
        <div className="container">
          <h2>Loading Chat...</h2>
        </div>
      </>
    );
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");


  

 return (
  <div className="chat-box">

    <h3>Chat with Seller</h3>

    <div className="messages">

      {chat.messages.map((msg) => {
  console.log("SENDER ID:", msg.sender?._id);
  console.log("MY ID:", user.id);

  return (
    <div
  key={msg._id}
  style={{
    display: "flex",
    justifyContent:
      msg.sender?._id === user.id ? "flex-end" : "flex-start",
    marginBottom: "10px",
  }}
>
  <div
    style={{
      backgroundColor:
        msg.sender?._id === user.id ? "#4CAF50" : "#E5E5EA",
      color:
        msg.sender?._id === user.id ? "#fff" : "#000",
      padding: "10px 14px",
      borderRadius: "18px",
      maxWidth: "70%",
      wordWrap: "break-word",
    }}
  >
    {msg.text}
  </div>
</div>
  );
})}

    </div>

    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message..."
    />
    <button onClick={sendMessage}>Send</button>
  </div>
);
}

export default Chat;