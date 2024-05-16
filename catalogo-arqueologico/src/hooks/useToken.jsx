import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem("token");
    return tokenString;
  };

  const [token, setToken] = useState(getToken());
  console.log("Usetoken:token",token)
  const saveToken = (userToken) => {
    if (!!userToken) {
      // if token is not null, save it to sessionStorage
      sessionStorage.setItem("token", JSON.stringify(userToken));
    } else {
      // if token is null, remove it from sessionStorage
      sessionStorage.removeItem("token");
    }
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token,
  };
}
