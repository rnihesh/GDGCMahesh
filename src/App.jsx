import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EcommercePlatform from './EcommercePlatform'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <EcommercePlatform/>
    </div>
  )
}

export default App
