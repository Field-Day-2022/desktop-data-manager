import Button from './components/Button'
import Dropdown from './components/Dropdown'
import TopNav from './components/TopNav'
import UserImage from "./components/UserImage";

import LoginPage from "./pages/LoginPage";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";

import React from "react";
import { notify, Notifier, Type } from "./components/Notifier";
import {Authenticator} from './utils/authenticator'

function App() {
  const auth = new Authenticator();

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
          (auth.user) ? <div>{auth.user.email}</div> : null,
          <UserImage className='h-12' user={auth.user} />,
          (auth.user) ?
            <Button
              text="Logout"
              enabled={true}
              onClick={() => {
                auth.logout()
                if (!user) {
                  notify(Type.success, "Sign out successful!")
                }
              }} /> : null
          ]}
      />
      <div className="flex flex-grow" >
        <Sidebar />
        {(auth.validateUser()) ?
          <HomePage />
          :
          <LoginPage
            loading={auth.loading}
            loginEvent={() => {
              if (auth.login()) {
                notify(Type.success, "Welcome to Field Day, " + user.displayName + "!")
              } else {
                notify(Type.error, "Field Day requires a valid ASU email address.")
              }
            }} />}

      </div>

    </div>
  )
}

export default App
