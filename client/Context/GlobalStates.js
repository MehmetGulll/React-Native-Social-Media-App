import React, { createContext, useState, useContext } from "react";
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [username, setUsername] = useState();
  const [caption, setCaption] = useState("");
  const [currentUserId, setCurrentUserId] = useState();
  const [notificationsModal, setNotificationsModal] = useState(false);
  const [messageSendUsers, setMessageSendUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([])
  const [following, setFollowing] = useState([]);
  return (
    <GlobalContext.Provider
      value={{
        username,
        setUsername,
        caption,
        setCaption,
        currentUserId,
        setCurrentUserId,
        notificationsModal,
        setNotificationsModal,
        messageSendUsers,
        setMessageSendUsers,
        blockedUsers,
        setBlockedUsers,
        following,
        setFollowing
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
