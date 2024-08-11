import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar.component';
import UserAuthForm from './pages/userAuthForm.page';
import { createContext, useEffect, useState } from 'react';
import { lookInSession } from './common/session';

// create a global context to access user sessions
export const UserContext = createContext({});
// wrap the context below to make it global

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  // check whether user is in session
  useEffect(() => {
    let userInSession = lookInSession('user');

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null });
  }, []);

  return (
    // now you can access user session globally
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path='/' element={<Navbar />}>
          <Route path='/signin' element={<UserAuthForm type='sign-in' />} />
          <Route path='/signup' element={<UserAuthForm type='sign-up' />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
