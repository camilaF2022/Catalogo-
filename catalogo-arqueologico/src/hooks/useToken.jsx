import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem("token");
    // const userToken = JSON.parse(tokenString);
    return tokenString;
  };

  const [token, setToken] = useState(getToken());
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
