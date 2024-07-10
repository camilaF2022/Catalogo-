// Source: https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

import { useState } from "react";

/**
 * useToken Hook
 *
 * A custom React hook that manages user authentication token using sessionStorage.
 * It provides methods to get, set, and remove the authentication token.
 *
 * @returns {Object} An object containing token state and methods to manage it.
 */

export default function useToken() {

  // Function to retrieve token from sessionStorage
  const getToken = () => {
    const tokenString = sessionStorage.getItem("token");
    // const userToken = JSON.parse(tokenString); // Uncomment if token needs parsing
    return tokenString;
  };

  // State hook to manage token state
  const [token, setToken] = useState(getToken());

  // Function to save or remove token in sessionStorage and update state
  const saveToken = (userToken) => {
    if (!!userToken) {
      // if token is not null, save it to sessionStorage
      sessionStorage.setItem("token", JSON.stringify(userToken));
    } else {
      // if token is null, remove it from sessionStorage
      sessionStorage.removeItem("token");
    }

    // Update token state with the new token value
    setToken(userToken);
  };

  // Return an object containing state and methods related to token management
  return {
    setToken: saveToken, // Method to set or remove the authentication token
    token, // Current authentication token
  };
}
