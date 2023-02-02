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
import classNames from "classnames";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";

function App() {

  const [user, loading, error] = useAuthState(auth);

  function validateUser(user) {
    if (!user) return false;
    if (user && user.email.slice(-7) === 'asu.edu') {
      return true;
    }
    else {
      toast.error(<div className="p-3">Field Day requires a valid ASU email address.</div>)
      signOut(auth);
      return false;
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-neutral-100 text-neutral-800 select-none">
      <Toaster />
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
