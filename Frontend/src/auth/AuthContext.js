import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const tokenFromStorage = localStorage.getItem("token");
  const usernameFromStorage = localStorage.getItem("username");
  const [token, setToken] = useState(tokenFromStorage);
  const [username,setUsername] = useState(usernameFromStorage);

  const login = (newToken,newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUser);
    setToken(newToken);
    setUsername(newUser);
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
