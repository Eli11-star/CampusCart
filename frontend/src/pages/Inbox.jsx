import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Inbox() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await API.get(
        "/chat",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>💬 Inbox</h1>

        {chats.length === 0 ? (
          <h3>No conversations yet.</h3>
        ) : (
          chats.map((chat) => {
            const otherUser = chat.participants.find(
              (p) => p._id !== user.id
            );

            return (
              <div
                key={chat._id}
                className="card"
                style={{ cursor: "pointer", marginBottom: "15px" }}
                onClick={() => navigate(`/chat/${chat._id}`)}
              >
                <h2>{otherUser?.name}</h2>

                <p>{otherUser?.email}</p>

                <p style={{ color: "#666", marginTop: "10px" }}>
  {chat.messages.length > 0
    ? `Last message: ${
        chat.messages[chat.messages.length - 1].text
      }`
    : "No messages yet"}
</p>
<p style={{ fontSize: "14px", color: "#999" }}>
  {chat.messages.length} messages
</p>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default Inbox;