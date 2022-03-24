import React, { useState, useEffect, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "antd";

import NavBar from "../components/NavBar/Navbar";

const { Header, Content } = Layout;

const AuthUserContext = createContext([{}, () => {}]);

// const WithAuth = (WrappedComponent, protectedPage = true) => {
//   const Wrapping = () => {
//     let navigate = useNavigate();
//     const [credentials, setCredentials] = useState({ user: "" });
//     useEffect(() => {
//       if (protectedPage && credentials.user.length == 0) {
//         navigate("/login");
//       }
//     }, [credentials]);

//     function loginHandler(input) {
//       console.log("[login handler called]|", input);
//       setCredentials(input);
//     }
//     return (
//       <AuthUserContext.Provider value={{ credentials, loginHandler }}>
//         {/* eslint-disable-next-line */}
//         <WrappedComponent />
//       </AuthUserContext.Provider>
//     );
//   };
//   return Wrapping;
// };

const protectedPages = ["/"];

function WithAuth({ children }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "" });
  const location = useLocation();
  console.log(credentials);
  useEffect(() => {
    if (
      credentials.username.length === 0 &&
      protectedPages.includes(location.pathname)
    ) {
      navigate("/login");
    }
  }, [credentials, location]);
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
          <NavBar {...credentials} />
        </Header>
      </Layout>
      <Content style={{ paddingTop: "50px" }}>
        {/* eslint-disable-next-line */}
        {children}
      </Content>
    </AuthUserContext.Provider>
  );
}
export { AuthUserContext, WithAuth };
