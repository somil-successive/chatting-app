import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";
import axios from "axios";

import { ApolloServer } from "@apollo/server";

async function startServer() {
  const app = express();
  const messages = [];

  let users = [
    // {
    //   id: 0,
    //   username: "john",
    //   password: "12345",
    //   status: "offline",
    // },
    // {
    //   id: 1,
    //   username: "somil",
    //   password: "12345",
    //   status: "offline",
    // },
    // {
    //   id: 2,
    //   username: "kaushik",
    //   password: "12345",
    //   status: "offline",
    // },
    // {
    //   id: 3,
    //   username: "doe",
    //   password: "4444",
    //   status: "offline",
    // },
    // {
    //   id: 4,
    //   username: "joe",
    //   password: "12345",
    //   status: "offline",
    // },
  ];
  // const server = new ApolloServer({
  //   typeDefs: `
  //       type Message{
  //           id:ID!
  //           text:String!
  //           user:String!

  //       }

  //       type Query{
  //           getMessages:[Message!]
  //       }

  //       type Mutation{
  //         sendMessage(text:String!,user:String!):ID!
  //       }

  //       type Subscription{
  //         showMessage:[Message!]
  //       }

  //       `,
  //   resolvers: {
  //     Query: {
  //       getMessages: () =>messages,

  //     },
  //     Mutation: {
  //       sendMessage:(parent,{text,user})=>{
  //         const id=messages.length;
  //         messages.push({
  //           id,
  //           text,
  //           user
  //         });
  //         return id;
  //       }
  //     },
  //     Subscription:{
  //       showMessage:(parent)=>{

  //       }

  //     }
  //   },
  // });

  const server = new ApolloServer({
    typeDefs: `
        type Message{
            id:ID!
            text:String!
            sender:User
            receiver:User
            
        }
        type User{
          id:ID!
          username:String!
          password:String
          status:String!
        }

        type Query{
          getUsers:[User!]
          getUser(id:ID!):User
            getMessages(senderId: ID!, receiverId: ID!):[Message!]
        }

        type Mutation{
          sendMessage(text: String!, senderId: ID!, receiverId: ID!): Message
          sendUser(username:String,password:String,status:String):User
          updateUserStatus(id:ID!,status:String!):User

          


        }
        
        `,
    resolvers: {
      Message: {
        // sender: async(parent) => await users.find((user) => user.id === parent.senderId),
        sender: async (parent) => {
          try {
            return await users.find((user) => user.id === parent.senderId);
          } catch (error) {
            console.error(
              `Error fetching sender information: ${error.message}`
            );
            throw new Error("Failed to fetch sender information");
          }
        },

        receiver: async (parent) =>
          await users.find((user) => user.id === parent.receiverId),
      },

      Query: {
        getUsers: () => users,
        getUser: (parent, { id }) => users.find((user) => user.id === id),

        getMessages: (parent, { senderId, receiverId }) =>
          messages.filter(
            (message) =>
              (message.senderId === senderId &&
                message.receiverId === receiverId) ||
              (message.senderId === receiverId &&
                message.receiverId === senderId)
          ),
      },

      Mutation: {
        sendMessage: (parent, { text, senderId, receiverId }) => {
          // const sender = users.find(user => user.id === senderId);
          // const receiver = users.find(user => user.id === receiverId);
          const newMessage = {
            id: messages.length.toString(),
            text,
            senderId,
            receiverId,
          };

          messages.push(newMessage);
          return newMessage;
        },

        sendUser: (parent, { username, password, status }) => {
          const newUser = {
            id: users.length.toString(),
            username,
            password,
            status,
          };
          users.push(newUser);
          return newUser;
        },

        updateUserStatus: (parent, { id, status }) => {

          console.log("id,status are.....",id);

          const targetUser= users.find((user) => user.id == id)

          console.log("status befor was.....",targetUser);


          console.log("users are..........",users);

          const updatedUser = {
            id:targetUser.id,
            username:targetUser.username,
            password:targetUser.password,
            status: status,
          };
    
          // console.log("status befor was.....",updatedUser.status);

        
          // const updatedUsers = users.map((user) => (user.id === id ? updatedUser : user));

          users[targetUser.id]=updatedUser;
    
          // users = updatedUsers;
          console.log("updated user is ..........",updatedUser);
          console.log(("target user is ......",targetUser));
    
       
          return updatedUser;
        },
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());
  await server.start();
  app.use("/graphql", expressMiddleware(server));

  app.listen(5500, () => console.log(`Server running at PORT 5500`));
}

await startServer();
