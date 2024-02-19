import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { SEND_USER } from "../query/UserQuery";

const SignUp = () => {
  const initialCredential = { username: "", password: "", status: "offline" };
  const [credentials, setCredentials] = useState(initialCredential);

  const navigate = useNavigate();

  // const SEND_USER = gql`
  //   mutation ($username: String!, $password: String!, $status: String!) {
  //     sendUser(username: $username, password: $password, status: $status) {
  //       id
  //       username
  //       password
  //     }
  //   }
  // `;

  const [sendUser] = useMutation(SEND_USER);

  const handleRegister = () => {
    if (credentials.username.length > 0 && credentials.password.length > 0) {
      sendUser({
        variables: {
          username: credentials.username,
          password: credentials.password,
          status: credentials.status,
        },
      });
    }
    alert("Registered Successfully!");
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
        <h1 style={{ marginBottom: "16px" }}>SIGN UP</h1>
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
          onClick={handleRegister}
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
          Register
        </button>
        <h3>OR</h3>
        <br />
        <button
          onClick={() => navigate("/")}
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
          Sign In
        </button>
      </div>
    </>
  );
};

export default SignUp;
