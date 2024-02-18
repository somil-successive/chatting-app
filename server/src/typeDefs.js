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
    getUsers:[User!]
    messageSent(senderId: ID!, receiverId: ID!):Message!
    }
  
  `;

export default typeDefs;
