import { useEffect, useState } from 'react';

import { getActivities, getActivityById } from './api/activities';
import './App.css';

export function getActivityDetailFields(activity) {
  return [
    { label: 'Date', value: activity.date },
    { label: 'Duration', value: activity.duration },
    { label: 'Location', value: activity.location },
    { label: 'Price', value: activity.price },
    { label: 'Minimum participants', value: activity.minParticipants },
    { label: 'Maximum participants', value: activity.maxParticipants },
  ];
}

function App() {
  const [activities, setActivities] = useState([]);
  const [listStatus, setListStatus] = useState('loading');
  const [selectedId, setSelectedId] = useState(null);
  const [activity, setActivity] = useState(null);
  const [detailStatus, setDetailStatus] = useState('idle');
  const [detailAttempt, setDetailAttempt] = useState(0);

  async function loadActivities() {
    setListStatus('loading');
    try {
      const result = await getActivities();
      if (!Array.isArray(result)) {
        throw new Error('The activities response must be a list.');
      }
      setActivities(result);
      setListStatus('loaded');
    } catch {
      setListStatus('error');
    }
  }

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    if (selectedId === null) {
      return undefined;
    }

    let active = true;
    setActivity(null);
    setDetailStatus('loading');

    getActivityById(selectedId)
      .then((result) => {
        if (active) {
          setActivity(result);
          setDetailStatus('loaded');
        }
      })
      .catch(() => {
        if (active) {
          setDetailStatus('error');
        }
      });

    return () => {
      active = false;
    };
  }, [selectedId, detailAttempt]);

  function returnToActivities() {
    setSelectedId(null);
    setActivity(null);
    setDetailStatus('idle');
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Activity Bookings home">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>Activity Bookings</span>
        </a>
        <span className="header-note">Explore activities</span>
      </header>

      <section className="page-content" aria-labelledby="app-title">
        <div className="page-heading">
          <p className="eyebrow">Plan something memorable</p>
          <h1 id="app-title">Find your next activity</h1>
          <p className="description">Browse what is coming up and see the details.</p>
        </div>

        {selectedId === null ? (
          <section className="activity-section" aria-label="Activities">
            <div className="section-heading">
              <h2>Activities</h2>
              {listStatus === 'loaded' && (
                <span className="activity-count">
                  {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
                </span>
              )}
            </div>

            {listStatus === 'loading' && (
              <p className="message" role="status">Loading activities...</p>
            )}
            {listStatus === 'error' && (
              <div className="message message--error" role="alert">
                <p>Activities could not be loaded.</p>
                <button className="text-button" type="button" onClick={loadActivities}>
                  Try again
                </button>
              </div>
            )}
            {listStatus === 'loaded' && activities.length === 0 && (
              <p className="message">There are no activities to show right now.</p>
            )}
            {listStatus === 'loaded' && activities.length > 0 && (
              <div className="activity-grid">
                {activities.map((item) => (
                  <button
                    className="activity-item"
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                  >
                    <span className="activity-item__topline">
                      <span>{item.date}</span>
                      <span className="activity-price">{item.price}</span>
                    </span>
                    <span className="activity-item__name">{item.name}</span>
                    <span className="activity-item__location">{item.location}</span>
                    <span className="activity-item__action">
                      View details <span aria-hidden="true">-&gt;</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="detail-section" aria-label="Activity details">
            <button className="back-button" type="button" onClick={returnToActivities}>
              <span aria-hidden="true">&lt;-</span> All activities
            </button>
            {detailStatus === 'loading' && (
              <p className="message" role="status">Loading activity details...</p>
            )}
            {detailStatus === 'error' && (
              <div className="message message--error" role="alert">
                <p>Activity details could not be loaded.</p>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => setDetailAttempt((attempt) => attempt + 1)}
                >
                  Try again
                </button>
              </div>
            )}
            {detailStatus === 'loaded' && activity && (
              <article className="activity-detail">
                <p className="eyebrow">Activity details</p>
                <h2>{activity.name}</h2>
                <dl className="detail-grid">
                  {getActivityDetailFields(activity).map(({ label, value }) => (
                    <div className="detail-item" key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
