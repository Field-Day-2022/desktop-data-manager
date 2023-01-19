import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="absolute inset-0 flex flex-col items-center">
        <h1 className="text-3xl">Hello world!</h1>
    </div>
  )
}

export default App
