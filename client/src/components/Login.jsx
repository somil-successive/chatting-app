import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { gql, useMutation, useQuery } from "@apollo/client";

const Login = () => {
  const initialCredential = { username: "", password: "" };
  const [credentials, setCredentials] = useState(initialCredential);

  const { login } = useAuth();

  const navigate = useNavigate();

  const GET_ALL_USERS = gql`
    query {
      getUsers {
        id
        status
        username
        password
      }
    }
  `;

  const UPDATE_USER_STATUS = gql`
    mutation ($id: ID!, $status: String!) {
      updateUserStatus(id: $id, status: $status) {
        status
        id
        password
        username
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_ALL_USERS,{
    pollInterval:2000
  });
  console.log(("user data is .....", data));

  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);

  const handleLogin = async () => {
    const userFound = data?.getUsers?.find(
      (user) =>
        user.username === credentials.username &&
        user.password === credentials.password
    );

    if (userFound) {
      await updateUserStatus({
        variables: {
          id: userFound.id,
          status: "online",
        },
      });

      login(userFound);
      navigate("/online");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <>
      <div
        style={{
          maxWidth: "400px",
          margin: "auto",
          textAlign: "center",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ marginBottom: "16px" }}>Login</h1>
        <div style={{ marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="Enter username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials((prevCredentials) => ({
                ...prevCredentials,
                username: e.target.value,
              }))
            }
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <input
            type="password"
            placeholder="Enter password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((prevCredentials) => ({
                ...prevCredentials,
                password: e.target.value,
              }))
            }
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <button
          onClick={handleLogin}
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#4caf50",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Login
        </button>
        <h3>OR</h3>
        <br />
        <button
          onClick={() => navigate("/register")}
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Sign Up
        </button>
      </div>
    </>
  );
};

export default Login;
