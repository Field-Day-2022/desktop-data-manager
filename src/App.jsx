import { auth } from "./main";
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider ,signInWithRedirect, signOut } from 'firebase/auth'

import Button from './components/Button'
import Dropdown from './components/Dropdown'
import TopNav from './components/TopNav'

import LoginPage from "./pages/LoginPage";

function App() {

  const [user, loading, error] = useAuthState(auth);

  function validateUser(user) {
    if (user && user.email.slice(-7) === 'asu.edu') { return true }
    else {
      signOut(auth);
      return false;
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center bg-neutral-100 text-neutral-800">
      <TopNav
        title='Field Day'
        subcomponents={
          [<Dropdown />,
          <div>User</div>,
          <Button
            text="Logout"
            enabled={user}
            onClick={() => signOut(auth)} />
          ]}
      />
      {(validateUser(user)) ?
        <div>Hello</div>
        :
        <LoginPage
          loading={loading}
          loginEvent={() => {
            signInWithRedirect(auth, new GoogleAuthProvider())
          }} />}
    </div>
  )
}

export default App
