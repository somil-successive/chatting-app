import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const messages = [];

let users = [];

const subscribers = [];
const onMessageUpdates = (fn) => subscribers.push(fn);

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

      const channel = "CHAT_CHANNEL";

      pubsub.publish(channel, { messageSent: newMessage });

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

      const userChannel = "USERS_CHANNEL";
      pubsub.publish(userChannel, { getUsers: users });

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
            (message.senderId === receiverId && message.receiverId === senderId)
        );

        console.log(":::::", parent, senderId, receiverId);

        const channel = "CHAT_CHANNEL";

        return pubsub.asyncIterator([channel, result]);
      },
    },

    getUsers: {
      subscribe: () => {
        const userChannel = "USERS_CHANNEL";
        return pubsub.asyncIterator(userChannel);
      },
    },

    messageSent: {
      subscribe: (parent, { senderId, receiverId }) => {
        const channel = "CHAT_CHANNEL";

        return pubsub.asyncIterator(channel);
      },
    },
  },
};

export default resolvers;
