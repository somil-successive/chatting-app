import { gql, useQuery } from "@apollo/client";
import { useAuth } from "./AuthContext";

const Messages = (props) => {
  console.log("props is ..........",props);

  const { senderId, receiverId }=props;
   
  const { credentials ,sender} = useAuth();

  const GET_ALL_MESSAGES = gql`
    query ($senderId: ID!, $receiverId: ID!) {
      getMessages(senderId: $senderId, receiverId: $receiverId) {
        text
        sender {
          id
          username
        }
        
       
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_ALL_MESSAGES, {
    variables: { senderId, receiverId },
  });

  console.log("datataa is .......",data);

  if (loading) return <h1>Loading....</h1>;

  return (
    <>
      {data?.getMessages?.map(({id,sender, text }) => (
        <div
          key={id}
          style={{
            display: "flex",
            justifyContent: sender.id=== senderId ? "flex-end" : "flex-start",
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
