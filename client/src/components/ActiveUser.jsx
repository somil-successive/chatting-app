import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ActiveUser = () => {
    const{sender}=useAuth();

    console.log("sender in active user page......",sender)
  const GET_ALL_USERS = gql`
  query{
    getUsers {
      id
      status
      username
    }
  }
  `;

  const { loading, error, data } = useQuery(GET_ALL_USERS,{
    pollInterval:2000
  });
  console.log(data)
  if (loading) return <h1>Loading....</h1>;
  
  const onlineUsers = data?.getUsers?.filter(user => user.status === 'online')|| [];

// const onlineUsers = data?.getUsers?.filter((user) => {
//     const isOnline = user.status === 'online';
  
//     const isNotSender = sender && sender.id !== user.id;
  
//     return isOnline && isNotSender;
//   }) || [];


  return (
    <>
      <h1>Online users are:</h1>
      <ul>
        {onlineUsers.map(user => (
          <li key={user.id}>
          <Link to={`/dm/${user.id}`}>{user.username}</Link>
        </li>
        ))}
      </ul>
    </>
  );
};

export default ActiveUser;
