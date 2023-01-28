import { auth } from "./main";
import { useAuthState } from 'react-firebase-hooks/auth';

import Button from './components/Button'
import Dropdown from './components/Dropdown'
import TopNav from './components/TopNav'
import { signOut } from 'firebase/auth'
import LoginPage from "./pages/LoginPage";

function App() {

  const [user, loading, error] = useAuthState(auth);

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
      {(user && user.email.slice(-7) === 'asu.edu') ?
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
