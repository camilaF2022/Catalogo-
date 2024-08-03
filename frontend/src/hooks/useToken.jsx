import { useContext } from "react";
import { TokenContext } from "./components/TokenProvider";

/**
 * Custom hook to access TokenContext and retrieve authentication token and setToken function.
 * @returns {{
 *   token: string | null,     // Current authentication token stored in TokenProvider.
 *   setToken: Function        // Function to update the authentication token in TokenProvider.
 * }}
 * @throws Will throw an error if used outside of a TokenProvider.
 */
export const useToken = () => {
  const context = useContext(TokenContext); // Retrieves context from TokenProvider.
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context; // Returns context containing token and setToken function.
};
