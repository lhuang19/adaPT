import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";

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
