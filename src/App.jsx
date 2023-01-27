import Button from './components/Button'
import Dropdown from './components/Dropdown'
import TopNav from './components/TopNav'
import LoginWrapper from './pages/LoginWrapper'
import { signOut } from 'firebase/auth'

function App() {

  let user = null;

  function loginEnd(u) {
    user = u;
    console.log(user.email);
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center bg-neutral-100 text-neutral-800">
      <TopNav
        title='Field Day'
        subcomponents={[<Dropdown />, <div>User</div>, <Button text="Logout" enabled={true} onClick={() => signOut()} />]}
      />
      <LoginWrapper loginEnd={loginEnd}>
        <div>Hello</div>
      </LoginWrapper>

    </div>
  )
}

export default App
