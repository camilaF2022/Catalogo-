// Source: https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

import React, { createContext, useState, useCallback, useMemo } from "react";

// Create a context for managing authentication token
export const TokenContext = createContext();

/**
 * TokenProvider component manages authentication token using context API.
 * It provides methods to set and retrieve the token, storing it in sessionStorage.
 * @param children The components rendered within TokenProvider.
 */

export function TokenProvider({ children }) {

// State to hold the authentication token, initialized from sessionStorage
  const [token, setTokenState] = useState(() => {
    const tokenString = sessionStorage.getItem("token");
    return tokenString ?? null;
  });

// Function to set the authentication token and store it in sessionStorage
  const setToken = useCallback((newToken) => {
    if (newToken) {
      sessionStorage.setItem("token", newToken);
    } else {
      sessionStorage.removeItem("token");
    }
    setTokenState(newToken);
  }, []);

// Memoized context value containing token and setToken function
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token, setToken]
  );

 // Render TokenContext.Provider with context value and children components
  return (
    <TokenContext.Provider value={contextValue}>
      {children}
    </TokenContext.Provider>
  );
}
