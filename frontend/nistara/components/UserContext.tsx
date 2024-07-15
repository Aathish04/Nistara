import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';

interface UserDetails {
  userID: string | null;
  userName: string | null;
  profileImage: string | null;
}

interface UserContextType {
  userDetails: UserDetails;
}

const UserContext = createContext<UserContextType>({
  userDetails: {
    userID: null,
    userName: null,
    profileImage: null
  }
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    userID: null,
    userName: null,
    profileImage: null
  });

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const jsonValue = await SecureStore.getItemAsync('User');
        if (jsonValue) {
          const { userID, userName, profileImage } = JSON.parse(jsonValue);
          setUserDetails({ userID, userName, profileImage });
        }
      } catch (error) {
        console.error('Error loading user credentials:', error);
      }
    };

    loadUserDetails();
  }, []);

  return (
    <UserContext.Provider value={{ userDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserDetails => {
  const { userDetails } = useContext(UserContext);
  return userDetails;
};
