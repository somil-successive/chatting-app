import React, { useContext, useEffect, useState } from "react";
import Messages from "./Message";
import { useMutation, useQuery } from "@apollo/client";
import { AuthContext } from "./AuthContext";
import Layout from "./Layout";
import { useNavigate, useParams } from "react-router-dom";
import { GET_ALL_USERS, UPDATE_USER_STATUS } from "../query/UserQuery";
import { SEND_MESSAGE } from "../query/MsgQuery";

const DMPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { sender } = useContext(AuthContext);

  const [text, setText] = useState("");

  const receiverId = userId;
  const senderId = sender.id || JSON.parse(sessionStorage.getItem("sender-id"));

  console.log("rexeiverid is..........", receiverId);
  console.log("senderid is..........", senderId);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const { loading, error, data } = useQuery(GET_ALL_USERS, {
    pollInterval: 3000,
  });

  const [sendMessage, { error: sendError }] = useMutation(SEND_MESSAGE);
  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);

  const handleSend = async () => {
    if (text.length > 0) {
      await sendMessage({
        variables: {
          text: text,
          senderId: senderId,
          receiverId: userId,
        },
      });

      setText("");
    }
  };

  const handleLogout = async () => {
    const userFound = data?.getUsers?.find((user) => user.id === senderId);

    await updateUserStatus({
      variables: {
        id: sessionStorage.getItem("sender-id"),
        status: "offline",
      },
    });
    sessionStorage.removeItem("sender-id");

    navigate("/");
  };

  return sender ? (
    <Layout>
      <button
        style={{
          padding: "10px",
          fontSize: "16px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
        onClick={handleLogout}
      >
        Logout
      </button>

      <Messages senderId={sender.id} receiverId={userId} />
      <div style={{ display: "flex", marginTop: "400px" }}>
        <input
          type="text"
          value={text}
          placeholder="Type Here..."
          style={{
            flex: 1,
            marginRight: "10px",
            padding: "8px",
            fontSize: "16px",
          }}
          onChange={handleChange}
        />
        <button
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#4caf50",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleSend}
        >
          SEND
        </button>
      </div>
    </Layout>
  ) : (
    <h1>Loading..........</h1>
  );
};

export default DMPage;
