import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";

type SetValue = (value: any) => void;

interface ContextInterface {
  isUserLoggedIn?: boolean,
  doneloading?: boolean,
  setIsUserLoggedIn: SetValue
}

const LoginContext = createContext<ContextInterface>({
  setIsUserLoggedIn: () => { }
});

const Logout = () => {
  const { setIsUserLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();
  const logoutHandle = () => {
    setIsUserLoggedIn(false);
    localStorage.removeItem("tokenYoutubeIMDB");
    navigate("/");
  };
  return (
    <div>
      <button onClick={logoutHandle}>logout</button>
    </div>
  );
}

const PrivateRoute = (props: {
  children: React.ReactNode
}): React.ReactElement => {
  const { isUserLoggedIn, doneloading } = useContext(LoginContext);
  if (!isUserLoggedIn && doneloading) return <Navigate to="/login" />
  if (doneloading) {
    return (
      <React.Fragment>
        {props.children}
      </React.Fragment>
    )
  }
  return (<React.Fragment></React.Fragment>)
}

const PrivateRouteReversed = (props: {
  children: React.ReactNode
}): React.ReactElement => {
  const { isUserLoggedIn, doneloading } = useContext(LoginContext);
  if (isUserLoggedIn && doneloading) return <Navigate to="/" />
  if (doneloading) {
    return (
      <React.Fragment>
        {props.children}
      </React.Fragment>
    )
  }
  return (<React.Fragment></React.Fragment>)
}

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [doneloading, setDoneloading] = useState(false);
  const isUserPresent = async () => {
    const getUserStatus = localStorage.getItem("tokenYoutubeIMDB");
    getUserStatus ? setIsUserLoggedIn(true) : setIsUserLoggedIn(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      await isUserPresent();
      setDoneloading(true);
    }; fetchUser();
  }, []);

  useEffect(() => {
    console.log("logged in state changed " + isUserLoggedIn);
  }, [isUserLoggedIn]);


  return (
    <BrowserRouter>
      <LoginContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn, doneloading }}>
        <Link to="/">Home</Link>
        {
          !isUserLoggedIn ?
            <React.Fragment>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </React.Fragment>
            :
            <Link to="/logout">Log out</Link>
        }

        <Routes>
          <Route path="/" element={<div>Home page</div>} />
          <Route path="/login" element={
            <PrivateRouteReversed>
              <div>Login page</div>
            </PrivateRouteReversed>
          } />
          <Route path="/signup" element={
            <PrivateRouteReversed>
              <div>Sign up page</div>
            </PrivateRouteReversed>
          } />
          <Route path="/logout" element={
            <PrivateRoute>
              <Logout />
            </PrivateRoute>
          } />
        </Routes>
      </LoginContext.Provider>
    </BrowserRouter>
  )
}

export default App
