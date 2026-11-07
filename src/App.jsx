import { useEffect, useRef, useState } from 'react';

import { getActivities, getActivityById } from './api/activities';
import { loginUser, registerUser } from './api/auth';
import { createBooking, getBookings } from './api/bookings';
import { useAuth } from './auth-context';
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

function getAuthenticationErrorMessage(error) {
  const payload = error?.payload;
  const validationMessages = Array.isArray(payload?.errors)
    ? payload.errors
      .map((item) => item?.message)
      .filter((message) => typeof message === 'string' && message.length > 0)
    : [];
  const apiMessages = [payload?.message, ...validationMessages]
    .filter((message) => typeof message === 'string' && message.length > 0);

  if (apiMessages.length > 0) {
    return [...new Set(apiMessages)].join(' ');
  }
  if (error?.status !== undefined) {
    return `The API responded with HTTP ${error.status}.`;
  }
  return 'No API response was received.';
}

function App() {
  const { accessToken, setAccessToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [listStatus, setListStatus] = useState('loading');
  const [isReviewingBookings, setIsReviewingBookings] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsStatus, setBookingsStatus] = useState('idle');
  const [bookingsAttempt, setBookingsAttempt] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [activity, setActivity] = useState(null);
  const [detailStatus, setDetailStatus] = useState('idle');
  const [detailAttempt, setDetailAttempt] = useState(0);
  const [authMode, setAuthMode] = useState('login');
  const [authStatus, setAuthStatus] = useState('idle');
  const [authMessage, setAuthMessage] = useState('');
  const [bookingParticipants, setBookingParticipants] = useState('');
  const [bookingStatus, setBookingStatus] = useState('idle');
  const [bookingResponse, setBookingResponse] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const bookingPendingRef = useRef(false);
  const participantCount = Number(bookingParticipants);
  const hasValidParticipants = bookingParticipants !== ''
    && Number.isInteger(participantCount)
    && participantCount >= 1;
  const hasActivityId = activity?.id !== undefined
    && activity?.id !== null
    && activity.id !== '';

  async function submitBooking(event) {
    event.preventDefault();
    if (
      bookingPendingRef.current
      || !accessToken
      || !hasActivityId
      || !hasValidParticipants
    ) {
      return;
    }

    bookingPendingRef.current = true;
    setBookingStatus('pending');
    setBookingResponse(null);
    setBookingError(null);
    try {
      const result = await createBooking({
        activityId: activity.id,
        participants: participantCount,
        jwt: accessToken,
      });
      setBookingResponse(result);
      setBookingStatus('success');
    } catch (error) {
      setBookingError({ status: error.status, payload: error.payload });
      setBookingStatus('error');
    } finally {
      bookingPendingRef.current = false;
    }
  }

  async function submitAuthentication(event) {
    event.preventDefault();
    if (authStatus === 'pending') {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    if (authMode === 'register' && !formData.has('terms')) {
      return;
    }

    setAuthStatus('pending');
    setAuthMessage('');
    try {
      const response = authMode === 'register'
        ? await registerUser({
          email,
          username: formData.get('username'),
          password,
          terms: true,
        })
        : await loginUser({ email, password });
      setAccessToken(response.accessToken);
      setAuthStatus('success');
      setAuthMessage(authMode === 'register' ? 'Account created.' : 'You are signed in.');
    } catch (error) {
      setAuthStatus('error');
      setAuthMessage(getAuthenticationErrorMessage(error));
    }
  }

  function changeAuthMode(mode) {
    setAuthMode(mode);
    setAuthStatus('idle');
    setAuthMessage('');
  }

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

  useEffect(() => {
    if (!isReviewingBookings || !accessToken) {
      setBookingsStatus('idle');
      return undefined;
    }

    let active = true;
    setBookingsStatus('loading');

    getBookings({ jwt: accessToken })
      .then((result) => {
        if (!Array.isArray(result)) {
          throw new Error('The bookings response must be a list.');
        }
        if (active) {
          setBookings(result);
          setBookingsStatus('loaded');
        }
      })
      .catch(() => {
        if (active) {
          setBookingsStatus('error');
        }
      });

    return () => {
      active = false;
    };
  }, [isReviewingBookings, accessToken, bookingsAttempt]);

  function openBookingReview() {
    setSelectedId(null);
    setActivity(null);
    setDetailStatus('idle');
    setIsReviewingBookings(true);
  }

  function returnToActivities() {
    setIsReviewingBookings(false);
    setSelectedId(null);
    setActivity(null);
    setDetailStatus('idle');
    setBookingParticipants('');
    setBookingStatus('idle');
    setBookingResponse(null);
    setBookingError(null);
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Activity Bookings home">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>Activity Bookings</span>
        </a>
        <button className="text-button header-action" type="button" onClick={openBookingReview}>
          Review bookings
        </button>
      </header>

      <section className="page-content" aria-labelledby="app-title">
        <div className="page-heading">
          <p className="eyebrow">Plan something memorable</p>
          <h1 id="app-title">{isReviewingBookings ? 'Your bookings' : 'Find your next activity'}</h1>
          <p className="description">
            {isReviewingBookings
              ? 'Review your reservations and payment status.'
              : 'Browse what is coming up and see the details.'}
          </p>
        </div>

        <section className="account-section" aria-labelledby="account-title">
          <div className="section-heading">
            <h2 id="account-title">Your account</h2>
            <div className="auth-switch" role="group" aria-label="Account action">
              <button
                type="button"
                aria-pressed={authMode === 'login'}
                disabled={authStatus === 'pending'}
                onClick={() => changeAuthMode('login')}
              >
                Log in
              </button>
              <button
                type="button"
                aria-pressed={authMode === 'register'}
                disabled={authStatus === 'pending'}
                onClick={() => changeAuthMode('register')}
              >
                Create account
              </button>
            </div>
          </div>

          <form className="auth-form" aria-label={authMode === 'register' ? 'Registration' : 'Login'} onSubmit={submitAuthentication}>
            <label className="auth-field">
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            {authMode === 'register' && (
              <label className="auth-field">
                <span>Username</span>
                <input name="username" type="text" autoComplete="username" required />
              </label>
            )}
            <label className="auth-field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                required
                minLength={authMode === 'register' ? 6 : undefined}
              />
            </label>
            {authMode === 'register' && (
              <label className="terms-field">
                <input name="terms" type="checkbox" required />
                <span>I accept the terms.</span>
              </label>
            )}
            <button className="auth-submit" type="submit" disabled={authStatus === 'pending'}>
              {authStatus === 'pending'
                ? (authMode === 'register' ? 'Creating account...' : 'Signing in...')
                : (authMode === 'register' ? 'Create account' : 'Log in')}
            </button>
          </form>
          {authStatus === 'pending' && (
            <p className="auth-feedback" role="status">{authMode === 'register' ? 'Creating account...' : 'Signing in...'}</p>
          )}
          {(authStatus === 'success' || authStatus === 'error') && (
            <p className={`auth-feedback ${authStatus === 'error' ? 'auth-feedback--error' : ''}`} role={authStatus === 'error' ? 'alert' : 'status'}>
              {authMessage}
            </p>
          )}
        </section>

        {isReviewingBookings ? (
          <section className="booking-review-section" aria-label="Booking review">
            <button className="back-button" type="button" onClick={returnToActivities}>
              <span aria-hidden="true">&lt;-</span> All activities
            </button>
            {!accessToken && (
              <p className="message" role="status">Sign in to review your bookings.</p>
            )}
            {accessToken && bookingsStatus === 'loading' && (
              <p className="message" role="status">Loading bookings...</p>
            )}
            {accessToken && bookingsStatus === 'error' && (
              <div className="message message--error" role="alert">
                <p>Bookings could not be loaded.</p>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => setBookingsAttempt((attempt) => attempt + 1)}
                >
                  Try again
                </button>
              </div>
            )}
            {accessToken && bookingsStatus === 'loaded' && bookings.length === 0 && (
              <p className="message">You have no bookings yet.</p>
            )}
            {accessToken && bookingsStatus === 'loaded' && bookings.length > 0 && (
              <ol className="booking-review-list" aria-label="Your bookings">
                {bookings.map((booking) => (
                  <li className="booking-review-item" key={booking.id}>
                    <dl className="booking-review-fields">
                      <div>
                        <dt>Booking ID</dt>
                        <dd>{booking.id}</dd>
                      </div>
                      <div>
                        <dt>Activity ID</dt>
                        <dd>{booking.activityId}</dd>
                      </div>
                      <div>
                        <dt>Participants</dt>
                        <dd>{booking.participants}</dd>
                      </div>
                      <div>
                        <dt>Created</dt>
                        <dd>{booking.createdAt}</dd>
                      </div>
                      <div>
                        <dt>Payment status</dt>
                        <dd>{booking.paymentStatus}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ol>
            )}
          </section>
        ) : selectedId === null ? (
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
            <button
              className="back-button"
              type="button"
              disabled={bookingStatus === 'pending'}
              onClick={returnToActivities}
            >
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
                <section className="booking-section" aria-label="Activity booking">
                  <h3>Book this activity</h3>
                  {!accessToken && (
                    <p className="booking-note" role="status">Sign in to book this activity.</p>
                  )}
                  <form className="booking-form" aria-label="Book this activity" onSubmit={submitBooking}>
                    <label className="booking-field">
                      <span>Participants</span>
                      <input
                        name="participants"
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={bookingParticipants}
                        disabled={!accessToken || bookingStatus === 'pending'}
                        onChange={(event) => {
                          setBookingParticipants(event.target.value);
                          setBookingStatus('idle');
                          setBookingResponse(null);
                          setBookingError(null);
                        }}
                      />
                    </label>
                    <button
                      className="booking-submit"
                      type="submit"
                      disabled={!accessToken || !hasActivityId || !hasValidParticipants || bookingStatus === 'pending'}
                    >
                      {bookingStatus === 'pending' ? 'Submitting...' : 'Book activity'}
                    </button>
                  </form>
                  {bookingStatus === 'pending' && (
                    <p className="booking-note" role="status">Submitting booking...</p>
                  )}
                  {bookingStatus === 'success' && (
                    <div className="booking-result" role="status" aria-label="Booking response">
                      <h4>Booking response</h4>
                      <pre>{JSON.stringify(bookingResponse, null, 2)}</pre>
                    </div>
                  )}
                  {bookingStatus === 'error' && (
                    <div className="booking-result booking-result--error" role="alert">
                      {bookingError?.payload !== undefined ? (
                        <>
                          <h4>Booking response</h4>
                          <pre>{JSON.stringify(bookingError.payload, null, 2)}</pre>
                        </>
                      ) : bookingError?.status !== undefined ? (
                        <p>The API responded with HTTP {bookingError.status} without a JSON payload.</p>
                      ) : (
                        <p>No API response was received.</p>
                      )}
                    </div>
                  )}
                </section>
              </article>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
