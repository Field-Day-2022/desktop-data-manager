import Dropdown from './components/Dropdown'
import TopNav from './components/TopNav'
import LoginWrapper from './pages/LoginWrapper'

function App() {

  return (
    <div className="absolute inset-0 flex flex-col items-center bg-neutral-100 text-neutral-800">
      <TopNav
        title='Field Day'
        subcomponents={[<Dropdown />, <div>User</div>]}
      />
      <LoginWrapper>
        <div>Hello</div>
      </LoginWrapper>

    </div>
  )
}

export default App
