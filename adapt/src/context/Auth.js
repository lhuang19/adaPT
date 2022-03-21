import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthUserContext = createContext([{}, () => {}]);

function WithAuth({ children }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ user: "" });
  useEffect(() => {
    if (credentials.user.length === 0) {
      navigate("/login");
    }
  }, [credentials]);
  const passInValue = React.useMemo(
    () => ({
      credentials,
      setCredentials,
    }),
    [credentials]
  );
  return (
    <AuthUserContext.Provider value={passInValue}>
      {/* eslint-disable-next-line */}
      {children}
    </AuthUserContext.Provider>
  );
}
export { AuthUserContext, WithAuth };
