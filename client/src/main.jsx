import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/global.css";
import "./App.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext";

function Root() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RoleProvider>
        <Root />
      </RoleProvider>
    </AuthProvider>
  </React.StrictMode>
);