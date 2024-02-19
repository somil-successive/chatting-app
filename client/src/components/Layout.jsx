import React from "react";
import ActiveUser from "./ActiveUser";

const Layout = ({ children }) => {
  return (
    <div>
      <ActiveUser />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
