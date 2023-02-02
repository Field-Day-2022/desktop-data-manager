import { auth } from "./main";
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth'

import Button from './components/Button'
import Dropdown from './components/Dropdown'
import TopNav from './components/TopNav'
import UserImage from "./components/UserImage";

import LoginPage from "./pages/LoginPage";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";

import React from "react";
import {notify, Notifier} from "./components/Notifier";

function App() {

  const [user, loading, error] = useAuthState(auth);

  function validateUser(user) {
    if (!user) return false;
    if (user && user.email.slice(-7) === 'asu.edu') {
      notify(1, "Welcome to Field Day, " + user.displayName + "!")
      return true;
    }
    else {
      signOut(auth);
      notify(0, "Field Day requires a valid ASU email address.")
      return false;
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-neutral-100 text-neutral-800 select-none">
      <Notifier />
      <TopNav
        title='Field Day'
        subcomponents={
          [<div>Project: </div>,
          <Dropdown
            options={
              ["Gateway", "Virgin River", "San Pedro"]
            } />,
          (user) ? <div>{user.email}</div> : null,
          <UserImage className='h-12' user={user} />,
          <Button
            text="Logout"
            enabled={true}
            onClick={() => {
              signOut(auth)
            }} />
          ]}
      />
      <div className="flex flex-grow" >
        <Sidebar />
        {(validateUser(user)) ?
          <HomePage />
          :
          <LoginPage
            loading={loading}
            loginEvent={() => {
              signInWithRedirect(auth, new GoogleAuthProvider())
            }} />}

      </div>

    </div>
  )
}

export default App
