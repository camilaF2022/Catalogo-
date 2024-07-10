// Source: https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

import React, { createContext, useState, useCallback, useMemo } from "react";

// Create a new context to manage authentication token state
export const TokenContext = createContext();

// TokenProvider component manages the state of the authentication token
export function TokenProvider({ children }) {

// Initialize token state, retrieving it from localStorage if available
  const [token, setTokenState] = useState(() => {
    const tokenString = localStorage.getItem("token");
    return tokenString ?? null;
  });

// Function to update the token state and store it in localStorage
  const setToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem("token", JSON.stringify(newToken));
    } else {
      localStorage.removeItem("token");
    }
    setTokenState(newToken);
  }, []);

 // Memoize the context value to optimize performance
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token, setToken]
  );

// Provide the TokenContext.Provider with the context value to its children
  return (
    <TokenContext.Provider value={contextValue}>
      {children}
    </TokenContext.Provider>
  );
}
