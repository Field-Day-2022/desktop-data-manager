import Button from './components/Button'
import Dropdown from './components/Dropdown'
import TopNav from './components/TopNav'
import UserImage from "./components/UserImage";

import LoginPage from "./pages/LoginPage";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";

import React from "react";
import { notify, Notifier, Type } from "./components/Notifier";
import { Authenticator } from './utils/authenticator'

function App() {

  const auth = new Authenticator();

  return (
    <div className="flex flex-col w-full min-h-screen bg-neutral-100 text-neutral-800 select-none">
      <Notifier />
      <TopNav
        title='Field Day'
        auth={auth}
      />
      <div className="flex flex-grow" >
        <Sidebar />
        {(auth.validateUser()) ?
          <HomePage />
          :
          <LoginPage
            auth={auth}
          />}

      </div>

    </div>
  )
}

export default App
