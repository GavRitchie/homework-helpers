import { Link, Route, Routes } from "react-router-dom";
import { ListeningGame } from "./game/ListeningGame";

function BookIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 11c9-2 16 0 20 5v38c-4-5-11-7-20-5V11Z" />
      <path d="M52 11c-9-2-16 0-20 5v38c4-5 11-7 20-5V11Z" />
      <path d="m41 23 3 3 6-7" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 35v-5a20 20 0 0 1 40 0v5" />
      <rect x="8" y="33" width="11" height="19" rx="5" />
      <rect x="45" y="33" width="11" height="19" rx="5" />
      <path d="M45 52c-2 5-6 7-12 7" />
    </svg>
  );
}

function HomePage() {
  return (
    <main className="home-shell">
      <header className="home-header">
        <div className="brand-mark"><BookIcon /></div>
        <div>
          <p className="eyebrow">A little help goes a long way</p>
          <h1>Homework Helpers</h1>
          <p className="home-intro">Quick, friendly practice for growing minds.</p>
        </div>
      </header>

      <section className="app-directory" aria-labelledby="practice-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Pick an activity</p>
            <h2 id="practice-heading">What are we practicing today?</h2>
          </div>
          <span className="app-count">1 helper</span>
        </div>

        <div className="app-grid">
          <Link to="/chinese-listening" className="app-card">
            <div className="app-card-icon"><HeadphonesIcon /></div>
            <div className="app-card-copy">
              <span className="subject-tag">Chinese</span>
              <h3>Listening Match</h3>
              <p>Listen carefully, then find the matching characters before time runs out.</p>
              <span className="card-action">Start practicing <span aria-hidden="true">→</span></span>
            </div>
            <span className="character-stamp" aria-hidden="true">听</span>
          </Link>

          <div className="app-card coming-soon" aria-label="More helpers coming soon">
            <div className="plus-mark">+</div>
            <div>
              <h3>More helpers soon</h3>
              <p>This directory is ready to grow with the next homework challenge.</p>
            </div>
          </div>
        </div>
      </section>

      <footer>Made for focused practice and happy learning.</footer>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chinese-listening" element={<ListeningGame />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
