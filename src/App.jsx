import { useEffect, useState } from 'react';

import { apiFetch } from './api/client';
import './App.css';

function App() {
  const [health, setHealth] = useState('checking');

  async function checkHealth() {
    setHealth('checking');

    try {
      const response = await apiFetch('/health');

      if (response.status === 'ok') {
        setHealth('available');
      } else {
        console.error('API health check returned an unexpected status:', response.status);
        setHealth('unavailable');
      }
    } catch (error) {
      console.error('Unable to check API health:', error);
      setHealth('unavailable');
    }
  }

  useEffect(() => {
    checkHealth();
  }, []);

  const statusLabels = {
    checking: 'Checking API...',
    available: 'API available',
    unavailable: 'API unavailable',
  };

  return (
    <main className="app-shell">
      <section className="welcome-card" aria-labelledby="app-title">
        <p className="eyebrow">Activity Bookings</p>
        <h1 id="app-title">Your next experience starts here.</h1>
        <p className="description">
          Discover activities and keep your bookings in one place.
        </p>

        <div className={`api-status api-status--${health}`} role="status">
          <span className="status-dot" aria-hidden="true" />
          <span>{statusLabels[health]}</span>
        </div>

        <button className="retry-button" type="button" onClick={checkHealth}>
          Check availability
        </button>
      </section>
    </main>
  );
}

export default App;
