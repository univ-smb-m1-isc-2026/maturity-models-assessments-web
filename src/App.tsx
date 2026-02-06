import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState<string>('Loading...')

  useEffect(() => {
    axios.get('http://localhost:8080/api/hello')
      .then(response => {
        setMessage(response.data.message)
      })
      .catch(error => {
        console.error('Error connecting to backend:', error)
        setMessage('Error connecting to backend')
      })
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Maturity Models Assessment</h1>
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
        <h2>Backend Status:</h2>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default App
