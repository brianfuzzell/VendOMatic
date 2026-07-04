import { useEffect, useState } from 'react'
import './App.css'

const BEVERAGE_NAMES = ['Cherry Coke', 'LaCroix', 'Sprite']

function App() {
  const [quantities, setQuantities] = useState([])
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    fetch('/api/inventory')
      .then((response) => response.json())
      .then((data) => setQuantities(data))
  }, [])

  function handleInsertCoin() {
    fetch('/api/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coin: 1 }),
    }).then((response) => {
      setCoins(Number(response.headers.get('X-Coins')))
    })
  }

  return (
    <section id="center">
      <h1>Vend-O-Matic</h1>

      <ul className="inventory">
        {quantities.map((quantity, index) => (
          <li key={index}>
            {BEVERAGE_NAMES[index]}: {quantity} remaining
          </li>
        ))}
      </ul>

      <p>Coins inserted: {coins}</p>
      <button type="button" className="counter" onClick={handleInsertCoin}>
        Insert quarter
      </button>
    </section>
  )
}

export default App
