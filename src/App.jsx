import { auth } from "./main";
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth'

import Button from './components/Button'
import Dropdown from './components/Dropdown'
import TopNav from './components/TopNav'
import UserImage from "./components/UserImage";

import LoginPage from "./pages/LoginPage";
import Sidebar from "./components/Sidebar";

function App() {

  const [user, loading, error] = useAuthState(auth);

  function validateUser(user) {
    if (!user) return false;
    if (user && user.email.slice(-7) === 'asu.edu') {
      return true;
    }
    else {
      signOut(auth);
      return false;
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-neutral-100 text-neutral-800">
      <TopNav
        title='Field Day'
        subcomponents={
          [<Dropdown />,
          (user) ? <div>{user.email}</div> : null,
          <UserImage className='h-12' user={user} />,
          <Button
            text="Logout"
            enabled={user}
            onClick={() => {
              signOut(auth)
            }} />
          ]}
      />
      <div className="flex flex-grow" >
        <Sidebar />
        {(validateUser(user)) ?
          <div>Hello</div>
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
