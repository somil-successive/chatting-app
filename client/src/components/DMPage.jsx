// import React, { useContext, useState } from "react";
// import Messages from "./Message";
// import { gql, useMutation, useQuery } from "@apollo/client";
// import { AuthContext, useAuth } from "./AuthContext";
// import Layout from "./Layout";
// import { useNavigate, useParams } from "react-router-dom";

// const DMPage = () => {

//   const {userId}=useParams();
// const navigate=useNavigate();

  
//   const { credentials,sender} = useContext(AuthContext);

//   console.log("sender is.........",sender);


//   const [text, setText] = useState("");

//   const receiverId=userId;
//   const senderId=sender.id;

//   console.log("sender id for post is.....",senderId);

//   const handleChange=(e)=>{
//     setText(e.target.value)

//   }

  


//   const SEND_MESSAGE = gql`
//     mutation ($text: String!, $senderId: ID!, $receiverId: ID!) {
//       sendMessage(text: $text, senderId: $senderId, receiverId: $receiverId) {
//         id
//       }
//     }
//   `;

//   const GET_ALL_USERS = gql`
//   query {
//     getUsers {
//       id
//       status
//       username
//       password
//     }
//   }
// `;

// const UPDATE_USER_STATUS = gql`
//   mutation ($id: ID!, $status: String!) {
//     updateUserStatus(id: $id, status: $status) {
//       status
//       id
//       password
//       username
//     }
//   }
// `;

// const { loading, error, data } = useQuery(GET_ALL_USERS,{
//   pollInterval:3000
// });

//   const [sendMessage,{ error: sendError }] = useMutation(SEND_MESSAGE);

//   const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);

//   const handleLogout=async()=>{
//     const userFound = data?.getUsers?.find(
//       (user) =>
//         user.id === senderId 
//     );

//       await updateUserStatus({
//         variables: {
//           id: userFound.id,
//           status: 'offline',
//         },
//       });

//       navigate("/");

//   }

//   const handleSend = async() => {
//     console.log("button start ........");
//     console.log("text is...........",text);
//     if (text.length > 0) {

//       console.log("inside handle send if block........");
//       await sendMessage({
//         variables: {
//           text: text,
//           senderId: sender.id,
//           receiverId:userId
          
//         },
//       });

//       console.log("message sent is .........",text);
//       setText("");
//     }
//   };

  
//   return (
//     <>
//       <Layout>
//       <button
//             style={{
//               padding: "10px",
//               fontSize: "16px",
//               backgroundColor: "red",
//               color: "white",
//               border: "none",
//               cursor: "pointer",
//             }}
//             onClick={handleLogout}
//           >
//             Logout
//           </button>

//         <Messages  senderId={sender.id} receiverId={userId} />
//         <div style={{ display: "flex", marginTop: "400px" }}>
//           <input
//             type="text"
//             value={text}
//             placeholder="Type Here..."
//             style={{
//               flex: 1,
//               marginRight: "10px",
//               padding: "8px",
//               fontSize: "16px",
//             }}
//             onChange={handleChange}
//           />
//           <button
//             style={{
//               padding: "10px",
//               fontSize: "16px",
//               backgroundColor: "#4caf50",
//               color: "#ffffff",
//               border: "none",
//               cursor: "pointer",
//             }}
//             onClick={handleSend}
//           >
//             SEND
//           </button>
//         </div>
//       </Layout>
//     </>
//   );
// };

// export default DMPage;


























import React, { useContext, useEffect, useState } from "react";
import Messages from "./Message";
import { gql, useMutation, useQuery } from "@apollo/client";
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
  const senderId = sender?.id || '';

  const handleChange = (e) => {
    setText(e.target.value);
  };

  // const SEND_MESSAGE = gql`
  //   mutation ($text: String!, $senderId: ID!, $receiverId: ID!) {
  //     sendMessage(text: $text, senderId: $senderId, receiverId: $receiverId) {
  //       id
  //     }
  //   }
  // `;

  // const GET_ALL_USERS = gql`
  //   query {
  //     getUsers {
  //       id
  //       status
  //       username
  //       password
  //     }
  //   }
  // `;

  // const UPDATE_USER_STATUS = gql`
  //   mutation ($id: ID!, $status: String!) {
  //     updateUserStatus(id: $id, status: $status) {
  //       status
  //       id
  //       password
  //       username
  //     }
  //   }
  // `;

  const { loading, error, data } = useQuery(GET_ALL_USERS, {
    pollInterval: 3000,
  });

  const [sendMessage, { error: sendError }] = useMutation(SEND_MESSAGE);
  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);

  useEffect(() => {
    // When the component mounts, update user status to "online"
    updateUserStatus({
      variables: {
        id: sender.id,
        status: "online",
      },
    });

    // Add a beforeunload event listener to handle page refresh/close
    const handleBeforeUnload = async () => {
      await updateUserStatus({
        variables: {
          id: sender.id,
          status: "offline",
        },
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sender, updateUserStatus]);

  const handleSend = async () => {
    if (text.length > 0) {
      await sendMessage({
        variables: {
          text: text,
          senderId: sender.id,
          receiverId: userId,
        },
      });

      setText("");
    }
  };

  const handleLogout = async () => {
    const userFound = data?.getUsers?.find(
      (user) => user.id === senderId
    );

    await updateUserStatus({
      variables: {
        id: userFound.id,
        status: "offline",
      },
    });

    navigate("/");
  };

  return (
    sender ? 
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
    :<h1>Loading..........</h1>
  );
};

export default DMPage;

