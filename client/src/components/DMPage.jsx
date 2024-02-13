import React, { useContext, useState } from "react";
import Messages from "./Message";
import { gql, useMutation, useQuery } from "@apollo/client";
import { AuthContext, useAuth } from "./AuthContext";
import Layout from "./Layout";
import { useNavigate, useParams } from "react-router-dom";

const DMPage = () => {

  const {userId}=useParams();
const navigate=useNavigate();

  
  const { credentials,sender} = useContext(AuthContext);

  console.log("sender is.........",sender);

  // const [user, setUser] = useState(credentials.username);


  const [text, setText] = useState("");
  const receiverId=userId;
  const senderId=sender.id;

  console.log("sender id for post is.....",senderId);


  const SEND_MESSAGE = gql`
    mutation ($text: String!, $senderId: ID!, $receiverId: ID!) {
      sendMessage(text: $text, senderId: $senderId, receiverId: $receiverId) {
        id
      }
    }
  `;

  const GET_ALL_USERS = gql`
  query {
    getUsers {
      id
      status
      username
      password
    }
  }
`;

const UPDATE_USER_STATUS = gql`
  mutation ($id: ID!, $status: String!) {
    updateUserStatus(id: $id, status: $status) {
      status
      id
      password
      username
    }
  }
`;

const { loading, error, data } = useQuery(GET_ALL_USERS);

  const [sendMessage] = useMutation(SEND_MESSAGE);

  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);

  const handleLogout=async()=>{
    const userFound = data?.getUsers?.find(
      (user) =>
        user.id === senderId 
    );

      await updateUserStatus({
        variables: {
          id: userFound.id,
          status: 'offline',
        },
      });

      navigate("/");

  }

  const handleSend = () => {
    console.log("button start ........");
    if (text.length > 0) {
      sendMessage({
        variables: {
          text: text,
          senderId: sender.id,
          receiverId:userId
        },
      });
      setText("");
    }
  };
  return (
    <>
      <Layout>
      <button
            style={{
              padding: "10px",
              fontSize: "16px",
              backgroundColor: "#4caf50",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>

        <Messages  senderId={sender.id} receiverId={userId} />
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
            onChange={(e) => setText(e.target.value)}
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
    </>
  );
};

export default DMPage;