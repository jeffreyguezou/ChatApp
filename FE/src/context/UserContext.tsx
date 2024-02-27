import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";
import React from "react";

export const UserContext = createContext<UserContextType>(
  {} as UserContextType
);

type UserContextType = {
  username: string;
  id: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setId: React.Dispatch<React.SetStateAction<string>>;
};

type UserContextPropType = {
  children: ReactNode;
};

type ProviderValueProp = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
};

export function UserContextProvider({ children }: UserContextPropType) {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    axios.get("/profile").then((response) => {
      setId(response.data.userId);
      setUsername(response.data.username);
    });
  }, []);

  let providerVal: ProviderValueProp = {
    username,
    setUsername,
    id,
    setId,
  };
  return (
    <UserContext.Provider value={providerVal}>{children}</UserContext.Provider>
  );
}
