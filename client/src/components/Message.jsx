import { gql, useQuery, useSubscription } from "@apollo/client";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";

const Messages = (props) => {
  // console.log("props is ..........", props);
  const { senderId, receiverId } = props;

  const MESSAGE_SENT_SUBSCRIPTION = gql`
    subscription MessageSent($senderId: ID!, $receiverId: ID!) {
      messageSent(senderId: $senderId, receiverId: $receiverId) {
        id
        text
        sender {
          id
          username
        }
      }
    }
  `;

  // const { data, loading } = useSubscription(GET_ALL_MESSAGES, {
  //   variables: {
  //     senderId,
  //     receiverId,
  //   },
  // });

  const [result, setResult] = useState({});

  const { credentials, sender } = useAuth();

  const GET_ALL_MESSAGES = gql`
    query ($senderId: ID!, $receiverId: ID!) {
      getMessages(senderId: $senderId, receiverId: $receiverId) {
        id
        text
        sender {
          id
          username
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_ALL_MESSAGES, {
    variables: {
      senderId,
      receiverId,
      // pollInterval:2000
    },
  });

  const [chats, setChats] = useState(data?.getMessages || []);

  useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
    variables: {
      senderId,
      receiverId,
    },
     onData:({ client, subscriptionData }) => {
      const newMessage = subscriptionData?.data?.messageSent;
      client.cache.updateQuery(
        {query: GET_ALL_MESSAGES},
        ()=>{
          return  { data: newMessage }

        }
        
      );
      // setChats((prevChats) => [...prevChats, newMessage]);
    },
  });

  // useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
  //   variables: {
  //     senderId,
  //     receiverId,
  //   },
  //   onSubscriptionData: ({ client, subscriptionData }) => {
  //     const newMessage = subscriptionData.data.messageSent;
  //     const existingMessages = client.readQuery({
  //       query: GET_ALL_MESSAGES,
  //       variables: { senderId, receiverId },
  //     });

  //     if (existingMessages) {
  //       const updatedMessages = {
  //         getMessages: [...existingMessages.getMessages, newMessage],
  //       };

  //       client.writeQuery({
  //         query: GET_ALL_MESSAGES,
  //         variables: { senderId, receiverId },
  //         data: updatedMessages,
  //       });

  //       setChats(updatedMessages.getMessages);
  //     }
  //   },
  // });

  // useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
  //   variables: {
  //     senderId,
  //     receiverId,
  //   },
  //   onSubscriptionData: ({ client, subscriptionData }) => {
  //     const newMessage = subscriptionData.data.messageSent;

  //     // Read the existing messages from the cache
  //     const existingMessages = client.readQuery({
  //       query: GET_ALL_MESSAGES,
  //       variables: { senderId, receiverId },
  //     });

  //     if (existingMessages) {
  //       // Check if the new message is already in the cache
  //       const isMessageInCache = existingMessages.getMessages.some(
  //         (message) => message.id === newMessage.id
  //       );

  //       if (!isMessageInCache) {
  //         // Update the cache and local state with the new message
  //         const updatedMessages = {
  //           getMessages: [...existingMessages.getMessages, newMessage],
  //         };

  //         client.writeQuery({
  //           query: GET_ALL_MESSAGES,
  //           variables: { senderId, receiverId },
  //           data: updatedMessages,
  //         });

  //         setChats(updatedMessages.getMessages);
  //       }
  //     }
  //   },
  // });

  console.log("data from usequeryyyyyyy is..........", data);

  useEffect(() => {
    if (data) {
      setChats(data.getMessages);
    }
  }, [data]);

  // useEffect(() => {
  //   if (data) setResult(data);
  // }, [data, senderId, receiverId]);

  if (loading) return null;

  if (!data) {
    return null;
  }

  return (
    <>
      {chats.map(({ id, sender, text }) => (
        <div
          key={id}
          style={{
            display: "flex",
            justifyContent: sender.id === senderId ? "flex-end" : "flex-start",
            margin: "8px",
            padding: "8px",
            background: sender.id === senderId ? "#cce5ff" : "#f0f0f0",
            // background: "#f0f0f0",

            borderRadius: "8px",
            maxWidth: "60",
          }}
        >
          {/* {sender.id !== senderId && (  */}
          <div
            style={{
              border: "2px solid black",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "bold",
              marginRight: "8px",
              backgroundColor: "#ffffff",
              color: "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {sender.username.slice(0, 1).toUpperCase()}
          </div>
          {/* )} */}

          <div>{text}</div>
        </div>
      ))}
    </>
  );
};

export default Messages;
