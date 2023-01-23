import Dropdown from './components/Dropdown'
import TopNav from './components/TopNav'
import Home from './pages/Home'

function App() {

  return (
    <div className="absolute inset-0 flex flex-col items-center bg-neutral-100 text-neutral-800">
      <TopNav 
        title='FieldDay'
        subcomponents={[<Dropdown />, <div>User</div>]}
      />
      <Home />
    </div>
  )
}

export default App
