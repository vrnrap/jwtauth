import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  from,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import React from "react";
import ReactDOM from "react-dom";
import { getAccessToken, setAccessToken } from "./accessToken";
import { App } from "./App";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : "",
    },
  };
});

const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();
    if (!token) {
      return true;
    }
    try {
      const { exp }: any = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      console.log("error tokenRefreshLink");
      return false;
    }
  },
  fetchAccessToken: () => {
    return fetch("http://localhost:4000/refresh_token", {
      method: "POST",
      credentials: "include",
    });
  },
  handleFetch: (accessToken) => {
    setAccessToken(accessToken);
  },
  handleError: (err) => {
    console.warn("refresh token is invalid.");
    console.log(err);
  },
});

const client = new ApolloClient({
  link: from([tokenRefreshLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
