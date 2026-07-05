import { useEffect, useState } from "react";
import "./App.css";

const BEVERAGE_NAMES = ["Cherry Coke", "LaCroix", "Sprite"];

function App() {
  const [quantities, setQuantities] = useState([]);
  const [coins, setCoins] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("/api/inventory")
      .then((response) => response.json())
      .then((data) => setQuantities(data));
  }, []);

  function handleInsertCoin() {
    fetch("/api/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coin: 1 }),
    }).then((response) => {
      setCoins(Number(response.headers.get("X-Coins")));
    });
  }

  function handlePurchase(id, index) {
    fetch(`/api/inventory/${id}`, { method: "PUT" }).then((response) => {
      const name = BEVERAGE_NAMES[index];
      const returnedCoins = Number(response.headers.get("X-Coins"));

      if (response.status === 200) {
        const remaining = Number(response.headers.get("X-Inventory-Remaining"));
        setQuantities((prev) =>
          prev.map((quantity, i) => (i === index ? remaining : quantity)),
        );
        setCoins(0);
        setResult(`Vended ${name}. Change returned: ${returnedCoins}.`);
      } else if (response.status === 403) {
        setResult(`Insufficient funds for ${name}. Insert more coins.`);
      } else if (response.status === 404) {
        setCoins(0);
        setResult(`${name} is out of stock. Coins returned: ${returnedCoins}.`);
      }
    });
  }

  return (
    <section id="center">
      <h1>Vend-O-Matic</h1>

      <button type="button" className="counter" onClick={handleInsertCoin}>
        Insert quarter
      </button>
      <p>Coins inserted: {coins}</p>

      <div className="beverages">
      <ul className="inventory">
        {quantities.map((quantity, index) => (
          <li key={index}>
            {BEVERAGE_NAMES[index]}: {quantity} remaining
            <button
              type="button"
              className="counter"
              disabled={quantity === 0}
              onClick={() => handlePurchase(index + 1, index)}
            >
              Select
            </button>
          </li>
        ))}
      </ul>
      </div>

      {result && <p>{result}</p>}
    </section>
  );
}

export default App;
