import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Ben from './components/Ben'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Ben />
    </>
  )
}

export default App
