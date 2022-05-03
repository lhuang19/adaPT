import React, { useState, useEffect, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "antd";

import NavBar from "../components/NavBar/Navbar";
import { checkLoggedIn } from "../modules/storage";
import { doAPIRequest } from "../modules/api";

const { Header, Content } = Layout;

const AuthUserContext = createContext([{}, () => {}]);

function WithAuth({ children }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "" });
  const location = useLocation();
  useEffect(() => {
    async function loadToken() {
      const token = checkLoggedIn();
      const { data } = await doAPIRequest("/login/returning", {
        method: "POST",
        body: { token },
      });
      if (data) {
        setCredentials(data);
        if (location.pathname === "/login" || location.pathname === "/signup") {
          navigate("/");
        }
      } else {
        navigate("/login");
      }
    }
    loadToken();
  }, []);
  const passInValue = React.useMemo(
    () => ({
      credentials,
      setCredentials,
    }),
    [credentials]
  );

  console.log("CREDENTIALS: ", credentials);
  return (
    <AuthUserContext.Provider value={passInValue}>
      <Layout>
        <Header
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            paddingLeft: "20px",
            paddingRight: "10px",
          }}
        >
          <NavBar
            credentials={credentials}
            setCredentials={(input) => setCredentials(input)}
          />
        </Header>
      </Layout>
      <Content
        style={{
          height: "100vh",
          width: "100vw",
          paddingTop: "60px",
        }}
      >
        {/* eslint-disable-next-line */}
        {children}
      </Content>
    </AuthUserContext.Provider>
  );
}
export { AuthUserContext, WithAuth };
