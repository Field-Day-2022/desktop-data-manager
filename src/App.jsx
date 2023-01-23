import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="absolute inset-0 flex flex-col items-center bg-neutral-100 text-neutral-800">
      <Navbar 
        title='FieldDay'
        subcomponents={[<div>Project Dropdown</div>, <div>User</div>]}
      />
      <Home />
    </div>
  )
}

export default App
