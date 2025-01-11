import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./components/context/AuthContext";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
  cache: new InMemoryCache(),
});
console.log("server url ", process.env.REACT_APP_SERVER_URL);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  //<React.StrictMode>
  <ApolloProvider client={client}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ApolloProvider>
  // </React.StrictMode>
);

reportWebVitals();
