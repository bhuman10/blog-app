import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, createContext, lazy, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import Header from './components/Header';
import Home from './components/Home';
import Loading from './components/Loading';
import API from './API';

const Login = lazy(() => import('./components/Login'));
const SignUp = lazy(() => import('./components/SignUp'));
const ViewPost = lazy(() => import('./components/ViewPost'));
const EditPost = lazy(() => import('./components/EditPost'));

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cookies] = useCookies(['XSRF-TOKEN']);

  const httpClient = axios.create({
    headers: { 'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] }
  });

  const getUser = () => {
    setIsLoading(true);
    httpClient.get(API.USER)
      .then(response => setUser(response.data || null))
      .catch(error => console.error("Error fetching user:", error))
      .finally(() => setIsLoading(false));
  };

  const logout = () => {
    setIsLoading(true);
    httpClient.post(API.LOGOUT)
      .then(() => {
        setUser(null);
        setIsLoading(false);
      })
      .catch(error => console.error(error));
  };

  const isSessionExpired = () => {
    return httpClient.get(API.SESSION_EXPIRED)
      .then(response => response.data);
  };

  useEffect(() => {
    getUser();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <UserContext.Provider value={{ user, httpClient, isSessionExpired, logout }}>
      <BrowserRouter>
        <Header logout={logout} />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login getUser={getUser} /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
            <Route path="/viewPost/:id" element={user ? <ViewPost /> : <Navigate to="/login" />} />
            <Route path="/editPost" element={user ? <EditPost /> : <Navigate to="/login" />} />
            <Route path="/editPost/:id" element={user ? <EditPost /> : <Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
