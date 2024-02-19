import { gql, useQuery, useSubscription } from "@apollo/client";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { GET_ALL_MESSAGES, MESSAGE_SENT_SUBSCRIPTION } from "../query/MsgQuery";

const Messages = (props) => {
  // console.log("props is ..........", props);
  const {  receiverId } = props;

  const senderId=sessionStorage.getItem("sender-id")
  const [chats, setChats] = useState([]);
  

  const { credentials, sender } = useAuth();

  const { loading, error, data,refetch } = useQuery(GET_ALL_MESSAGES, {
    variables: {
      senderId,
      receiverId,
      // pollInterval:2000
    },
    onCompleted(data){
      setChats(data?.getMessages)
    }
  });

  

//   useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
//     variables: {
//       senderId,
//       receiverId,
//     },
//      onData:({ client, subscriptionData }) => {
//       const newMessage = subscriptionData?.data?.messageSent;
//       client.cache.modify({
//         fields: {
//           getMessages: (existingMessages = []) => {
//             // Ensure the new message is not already in the cache
//             const isMessageInCache = existingMessages.some(
//               (message) => message.id === newMessage.id
//             );
  
//             if (!isMessageInCache) {
//               return [...existingMessages, newMessage];
//             }
  
//             return existingMessages;
//           },
//         },
//       });
//   }
// });

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

  //         refetch();
  //       }
  //     }
  //   },
  // });


  useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
    variables: {
      senderId,
      receiverId,
    },
    onData: ({ client,data:subscriptionData }) => {

      console.log('Subscription Datais....................:', subscriptionData);
      const newMessage = subscriptionData?.data?.messageSent;
  
      // Update cache for sender
      const senderMessages = client.readQuery({
        query: GET_ALL_MESSAGES,
        variables: { senderId, receiverId },
      });


      
      if (senderMessages) {
        client.writeQuery({
          query: GET_ALL_MESSAGES,
          variables: { senderId, receiverId },
          data: {
            getMessages: [...senderMessages.getMessages, newMessage],
          },
        });
      }
      
      // Update cache for receiver
      const receiverMessages = client.readQuery({
        query: GET_ALL_MESSAGES,
        variables: { senderId: receiverId, receiverId: senderId },
      });
      
      console.log("receiver cache is..........",receiverMessages);
      
      if (receiverMessages) {
        client.writeQuery({
          query: GET_ALL_MESSAGES,
          variables: { senderId: receiverId, receiverId: senderId },
          data: {
            getMessages: [...receiverMessages.getMessages, newMessage],
          },
        });
      }


      refetch();
    },
  });

  console.log("data from usequeryyyyyyy is..........", data);


  // useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
  //   variables: {
  //     senderId,
  //     receiverId,
  //   },
  //   onData: ({ client, subscriptionData }) => {
  //     const newMessage = subscriptionData?.data?.messageSent;
  //     // client.cache.updateQuery(
  //     //   { query: GET_ALL_MESSAGES },
  //     //   () => {
  //     //     return { data: newMessage };
  //     //   }
  //     // );
  //     // Manually refetch the data when a new message is received
  //     refetch();
  //   },
  // });


  // const {data:subData} = useSubscription(MESSAGE_SENT_SUBSCRIPTION,{
  //   onSubscriptionData({subscriptionData:{data}}){
  //      if(
  //        (data.messageSent.receiver.id == receiverId && data.messageSent.sender.id == senderId) ||
  //        (data.messageSent.receiver.id == senderId && data.messageSent.sender.id == receiverId) 
  //      ){
  //         setChats((prevMessages)=>[...prevMessages,data.messageSent])  
  //         refetch();
          
  //      }

  //   }
  // })
 


  useEffect(() => {
    if (data) {
      setChats(data.getMessages);
    }
  }, [data,refetch]);

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
