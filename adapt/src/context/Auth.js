import React, { useState, useEffect, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "antd";

import NavBar from "../components/NavBar/Navbar";
import { checkLoggedIn } from "../modules/storage";

const { Header, Content } = Layout;

const AuthUserContext = createContext([{}, () => {}]);

function WithAuth({ children }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "" });
  const location = useLocation();
  useEffect(() => {
    const loginToken = checkLoggedIn();
    if (loginToken !== null) {
      setCredentials(loginToken);
      if (location.pathname === "/login" || location.pathname === "/signup") {
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, []);
  const passInValue = React.useMemo(
    () => ({
      credentials,
      setCredentials,
    }),
    [credentials]
  );
  return (
    <AuthUserContext.Provider value={passInValue}>
      <Layout>
        <Header style={{ paddingLeft: "20px", paddingRight: "10px" }}>
          <NavBar
            credentials={credentials}
            setCredentials={(input) => setCredentials(input)}
          />
        </Header>
      </Layout>
      <Content
        style={{
          paddingTop: "50px",
        }}
      >
        {/* eslint-disable-next-line */}
        {children}
      </Content>
    </AuthUserContext.Provider>
  );
}
export { AuthUserContext, WithAuth };
