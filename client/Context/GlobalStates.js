import React, { createContext, useState, useContext } from "react";
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [username, setUsername] = useState();
  const [caption, setCaption] = useState("");
  const [currentUserId, setCurrentUserId] = useState();
  return (
    <GlobalContext.Provider
      value={{ username, setUsername, caption, setCaption,currentUserId,setCurrentUserId  }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
