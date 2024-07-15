import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';

interface UserCredentials {
  userID: string | null;
  userName: string | null;
  profileImage: string | null;
}

interface UserContextType {
  userCredentials: UserCredentials;
}

const UserContext = createContext<UserContextType>({
  userCredentials: {
    userID: null,
    userName: null,
    profileImage: null
  }
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userCredentials, setUserCredentials] = useState<UserCredentials>({
    userID: null,
    userName: null,
    profileImage: null
  });

  useEffect(() => {
    const loadUserCredentials = async () => {
      try {
        const jsonValue = await SecureStore.getItemAsync('User');
        if (jsonValue) {
          const { userID, userName, profileImage } = JSON.parse(jsonValue);
          setUserCredentials({ userID, userName, profileImage });
        }
      } catch (error) {
        console.error('Error loading user credentials:', error);
      }
    };

    loadUserCredentials();
  }, []);

  return (
    <UserContext.Provider value={{ userCredentials }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserCredentials => {
  const { userCredentials } = useContext(UserContext);
  return userCredentials;
};
