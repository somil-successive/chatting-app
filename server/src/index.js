import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServer } from "@apollo/server";
import express from "express";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";

import { PubSub } from "graphql-subscriptions";
import bodyParser from "body-parser";

async function startServer() {
  const pubsub = new PubSub();
  
  const app = express();

  const httpServer = createServer(app);
  const messages = [];

  let users = [];

  const subscribers = [];
  const onMessageUpdates = (fn) => subscribers.push(fn);

  const typeDefs = `
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


  type Subscription{
    getMessages(senderId: ID!, receiverId: ID!):[Message!]
    }
  
  `;

  const resolvers = {
    Message: {
      // sender: async(parent) => await users.find((user) => user.id === parent.senderId),
      sender: async (parent) => {
        try {
          return await users.find((user) => user.id === parent.senderId);
        } catch (error) {
          console.error(`Error fetching sender information: ${error.message}`);
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
            (message.senderId === receiverId && message.receiverId === senderId)
        ),
    },

    Mutation: {
      sendMessage: (parent, { text, senderId, receiverId }) => {
        const newMessage = {
          id: messages.length.toString(),
          text,
          senderId,
          receiverId,
        };

        messages.push(newMessage);

        const result = messages.filter(
          (message) =>
            (message.senderId === senderId &&
              message.receiverId === receiverId) ||
            (message.senderId === receiverId &&
              message.receiverId === senderId)
        );

    
          const channel = `MESSAGE_CHANNEL_${senderId}_${receiverId}`;
         pubsub.publish(channel, { getMessages:result});

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
        const targetUser = users.find((user) => user.id == id);

        const updatedUser = {
          id: targetUser.id,
          username: targetUser.username,
          password: targetUser.password,
          status: status,
        };
        users[targetUser.id] = updatedUser;

        return updatedUser;
      },
    },
    Subscription: {
      getMessages: {
        subscribe: (parent, { senderId, receiverId }, contextValue) => {

          const result = messages.filter(
            (message) =>
              (message.senderId === senderId &&
                message.receiverId === receiverId) ||
              (message.senderId === receiverId &&
                message.receiverId === senderId)
          );
          
          console.log(":::::", parent, senderId, receiverId)

          if (result.length > 0) {
            return existingMessages;
          }

          const channel = `MESSAGE_CHANNEL_${senderId}_${receiverId}`;

          return pubsub.asyncIterator([channel,result]);
        },
      },
    },
  };

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  
  app.use(cors());

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  app.use(bodyParser.json());
  await server.start();
  app.use("/graphql", expressMiddleware(server));

  httpServer.listen(5500, () => console.log(`Server running at PORT 5500`));
}

await startServer();
