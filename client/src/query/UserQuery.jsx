import { gql } from "@apollo/client";


export const GET_ALL_USERS = gql`
    query {
      getUsers {
        id
        status
        username
        password
      }
    }
  `;


export const UPDATE_USER_STATUS = gql`
    mutation ($id: ID!, $status: String!) {
      updateUserStatus(id: $id, status: $status) {
        status
        id
        password
        username
      }
    }
  `;


 export const SEND_USER = gql`
  mutation ($username: String!, $password: String!, $status: String!) {
    sendUser(username: $username, password: $password, status: $status) {
      id
      username
      password
    }
  }
`;