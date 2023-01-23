import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="absolute inset-0 flex flex-col items-center bg-neutral-100">
      <Navbar />
      <Home />
    </div>
  )
}

export default App
