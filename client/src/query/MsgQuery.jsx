import { gql } from "@apollo/client";

export const MESSAGE_SENT_SUBSCRIPTION = gql`
subscription MessageSent($senderId: ID!, $receiverId: ID!) {
  messageSent(senderId: $senderId, receiverId: $receiverId) {
    id
    text
    sender {
      id
      username
    }
    receiver{
      id
    }
  }
}
`;



export const GET_ALL_MESSAGES = gql`
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


export const SEND_MESSAGE = gql`
    mutation ($text: String!, $senderId: ID!, $receiverId: ID!) {
      sendMessage(text: $text, senderId: $senderId, receiverId: $receiverId) {
        id
      }
    }
  `;