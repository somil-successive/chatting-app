import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialCredential = { username: "", password: "" };
  const [credentials, setCredentials] = useState(initialCredential);
  const [sender,setSender]=useState({});


  

  const login = (newSender) => {
    // setCredentials(newCredentials);
    setSender(newSender);
  };

  return (
    <AuthContext.Provider value={{ credentials, setCredentials,sender,setSender ,login}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

