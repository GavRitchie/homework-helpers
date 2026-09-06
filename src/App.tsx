import { Link, Route, Routes } from "react-router-dom";
import { ListeningGame } from "./game/ListeningGame";
import { MathAdventures } from "./math/MathAdventures";

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

function MathIcon() { return <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="20" cy="20" r="13"/><path d="M14 20h12M20 14v12M40 14l16 16M56 14 40 30M39 44h18M39 52h18"/></svg>; }

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
          <span className="app-count">2 helpers</span>
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

          <Link to="/math-adventures" className="app-card math-app-card"><div className="app-card-icon"><MathIcon /></div><div className="app-card-copy"><span className="subject-tag">Math</span><h3>Math Adventures</h3><p>Practice addition, subtraction, money, and clocks with friendly hints along the way.</p><span className="card-action">Start practicing <span aria-hidden="true">→</span></span></div><span className="character-stamp math-stamp" aria-hidden="true">+</span></Link>
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
      <Route path="/math-adventures" element={<MathAdventures />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
