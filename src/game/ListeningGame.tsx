import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { vocabularyLists, type VocabularyEntry } from "../data/vocabulary";
import {
  calculateScore,
  createChoices,
  getCharacters,
  shuffle,
  validateVocabularyList,
  type AnswerResult,
  type CharacterVariant,
} from "./gameLogic";

const DEFAULT_QUESTION_SECONDS = 8;
const MIN_QUESTION_SECONDS = 1;
const MAX_QUESTION_SECONDS = 60;
const FEEDBACK_DELAY_MS = 900;

type Screen = "setup" | "playing" | "results";
type RoundPhase = "answering" | "feedback";

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4h4l5 4V6L8 10H4Z" />
      <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
    </svg>
  );
}

export function ListeningGame() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [listId, setListId] = useState("weekly");
  const [variant, setVariant] = useState<CharacterVariant>("simplified");
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [questionSeconds, setQuestionSeconds] = useState(DEFAULT_QUESTION_SECONDS);
  const [questions, setQuestions] = useState<VocabularyEntry[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choices, setChoices] = useState<VocabularyEntry[]>([]);
  const [phase, setPhase] = useState<RoundPhase>("answering");
  const [selected, setSelected] = useState<VocabularyEntry | null>(null);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_QUESTION_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const [audioError, setAudioError] = useState("");
  const feedbackTimer = useRef<number | undefined>(undefined);
  const acceptingAnswer = useRef(false);

  const selectedList = vocabularyLists.find((list) => list.id === listId) ?? vocabularyLists[0];
  const validationErrors = useMemo(() => validateVocabularyList(selectedList), [selectedList]);
  const currentWord = questions[questionIndex];

  const speak = useCallback((entry: VocabularyEntry) => {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setAudioError("Speech is not available in this browser. Try Chrome, Edge, or Safari on a device with a Chinese voice installed.");
      return;
    }

    const locale = variant === "simplified" ? "zh-CN" : "zh-TW";
    const utterance = new SpeechSynthesisUtterance(getCharacters(entry, variant));
    const chineseVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.toLowerCase().startsWith(locale.toLowerCase()));

    utterance.lang = locale;
    utterance.rate = 0.8;
    if (chineseVoice) utterance.voice = chineseVoice;
    utterance.onerror = () => setAudioError("The word could not be played. Check that a Chinese voice is installed, then try again.");
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setAudioError("");
  }, [variant]);

  const startGame = () => {
    if (validationErrors.length) return;
    const nextQuestions = shuffle(selectedList.entries);
    setQuestions(nextQuestions);
    setQuestionIndex(0);
    setChoices(createChoices(nextQuestions[0], selectedList.entries));
    setResults([]);
    setSelected(null);
    setTimedOut(false);
    setPhase("answering");
    acceptingAnswer.current = true;
    setTimeLeft(questionSeconds);
    setScreen("playing");
    setAudioError("");
    // Calling from the Start button's user gesture helps browsers allow speech.
    speak(nextQuestions[0]);
  };

  const finishQuestion = useCallback((answer: VocabularyEntry | null) => {
    if (!currentWord || phase !== "answering" || !acceptingAnswer.current) return;
    acceptingAnswer.current = false;
    const correct = answer === currentWord;
    setSelected(answer);
    setTimedOut(answer === null);
    setResults((previous) => [...previous, { entry: currentWord, correct }]);
    setPhase("feedback");
  }, [currentWord, phase]);

  useEffect(() => {
    if (screen !== "playing" || phase !== "answering" || !currentWord) return;
    if (!timerEnabled) return;

    setTimeLeft(questionSeconds);
    const deadline = Date.now() + questionSeconds * 1000;
    const intervalId = window.setInterval(() => {
      setTimeLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    }, 100);
    const timeoutId = window.setTimeout(() => finishQuestion(null), questionSeconds * 1000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [currentWord, finishQuestion, phase, questionSeconds, screen, timerEnabled]);

  useEffect(() => {
    if (screen !== "playing" || phase !== "feedback") return;
    feedbackTimer.current = window.setTimeout(() => {
      const nextIndex = questionIndex + 1;
      if (nextIndex >= questions.length) {
        setScreen("results");
        return;
      }
      setQuestionIndex(nextIndex);
      setChoices(createChoices(questions[nextIndex], selectedList.entries));
      setSelected(null);
      setTimedOut(false);
      setPhase("answering");
      acceptingAnswer.current = true;
      speak(questions[nextIndex]);
    }, FEEDBACK_DELAY_MS);

    return () => window.clearTimeout(feedbackTimer.current);
  }, [phase, questionIndex, questions, screen, selectedList.entries, speak]);

  useEffect(() => () => {
    window.clearTimeout(feedbackTimer.current);
    window.speechSynthesis?.cancel();
  }, []);

  const resetToSetup = () => {
    window.speechSynthesis?.cancel();
    setScreen("setup");
  };

  if (screen === "setup") {
    return (
      <main className="game-shell setup-shell">
        <nav className="game-nav">
          <Link to="/" className="back-link"><span aria-hidden="true">←</span> All helpers</Link>
          <span className="mini-brand">Homework Helpers</span>
        </nav>

        <section className="setup-card">
          <div className="setup-hero">
            <div className="hero-speaker"><SpeakerIcon /></div>
            <p className="eyebrow">Chinese practice</p>
            <h1>Listening Match</h1>
            <p>Hear a word. Find its characters. Use a timer—or take your time.</p>
          </div>

          <div className="setup-options">
            <fieldset>
              <legend>1. Choose your words</legend>
              <div className="selection-grid">
                {vocabularyLists.map((list) => (
                  <label key={list.id} className={`selection-card ${listId === list.id ? "selected" : ""}`}>
                    <input type="radio" name="word-list" value={list.id} checked={listId === list.id} onChange={() => setListId(list.id)} />
                    <span className="selection-check" aria-hidden="true">✓</span>
                    <strong>{list.name}</strong>
                    <small>{list.description} · {list.entries.length} words</small>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>2. Choose how to read</legend>
              <div className="segmented-control">
                <label className={variant === "simplified" ? "selected" : ""}>
                  <input type="radio" name="variant" checked={variant === "simplified"} onChange={() => setVariant("simplified")} />
                  <span className="sample-character">汉</span>
                  <span><strong>Simplified</strong><small>简体中文</small></span>
                </label>
                <label className={variant === "traditional" ? "selected" : ""}>
                  <input type="radio" name="variant" checked={variant === "traditional"} onChange={() => setVariant("traditional")} />
                  <span className="sample-character">漢</span>
                  <span><strong>Traditional</strong><small>繁體中文</small></span>
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend>3. Set your pace</legend>
              <div className="timer-setting">
                <label className="timer-toggle">
                  <input
                    type="checkbox"
                    checked={timerEnabled}
                    onChange={(event) => setTimerEnabled(event.target.checked)}
                  />
                  <span className="toggle-track" aria-hidden="true"><span /></span>
                  <span><strong>Use a timer</strong><small>Move on automatically when time runs out</small></span>
                </label>
                <label className="duration-setting">
                  <span>Seconds per word</span>
                  <input
                    type="number"
                    min={MIN_QUESTION_SECONDS}
                    max={MAX_QUESTION_SECONDS}
                    value={questionSeconds}
                    disabled={!timerEnabled}
                    onChange={(event) => {
                      const seconds = Number(event.target.value);
                      if (Number.isFinite(seconds)) {
                        setQuestionSeconds(Math.min(MAX_QUESTION_SECONDS, Math.max(MIN_QUESTION_SECONDS, seconds)));
                      }
                    }}
                  />
                </label>
              </div>
            </fieldset>

            {validationErrors.length > 0 && (
              <div className="error-panel" role="alert">
                <strong>This word list needs attention:</strong>
                <ul>{validationErrors.map((error) => <li key={error}>{error}</li>)}</ul>
              </div>
            )}

            <button className="primary-button" onClick={startGame} disabled={validationErrors.length > 0}>
              Start listening <span aria-hidden="true">→</span>
            </button>
            <p className="game-note">
              <span aria-hidden="true">{timerEnabled ? "⏱" : "∞"}</span>{" "}
              {timerEnabled ? `${questionSeconds} seconds per word` : "No timer"} · 10 choices · {selectedList.entries.length} questions
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (screen === "results") {
    const score = calculateScore(results);
    const missed = results.filter((result) => !result.correct);
    return (
      <main className="game-shell results-shell">
        <nav className="game-nav"><Link to="/" className="back-link">← All helpers</Link><span className="mini-brand">Homework Helpers</span></nav>
        <section className="results-card">
          <div className="confetti" aria-hidden="true">✦</div>
          <p className="eyebrow">Practice complete</p>
          <h1>{score.percentage >= 80 ? "Great listening!" : "Nice practice!"}</h1>
          <div className="score-ring" style={{ "--score": `${score.percentage * 3.6}deg` } as React.CSSProperties}>
            <div><strong>{score.correct}</strong><span>out of {score.total}</span></div>
          </div>
          <p className="accuracy">{score.percentage}% correct</p>

          {missed.length > 0 ? (
            <div className="missed-words">
              <h2>Words to practice again</h2>
              <div className="missed-grid">
                {missed.map(({ entry }, index) => (
                  <div key={`${entry.simplified}-${index}`}>
                    <strong>{entry.simplified}</strong>
                    <span>{entry.traditional}</span>
                    <button aria-label={`Play ${getCharacters(entry, variant)} again`} onClick={() => speak(entry)}><SpeakerIcon /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="perfect-message">You matched every word. Amazing work!</p>}

          <div className="result-actions">
            <button className="primary-button" onClick={startGame}>Play again</button>
            <Link to="/" className="secondary-button">Back to directory</Link>
          </div>
        </section>
      </main>
    );
  }

  const correctCharacters = currentWord ? getCharacters(currentWord, variant) : "";
  const selectedIsCorrect = selected === currentWord;

  return (
    <main className="game-shell play-shell">
      <nav className="game-nav">
        <button className="back-link plain-button" onClick={resetToSetup}>← End practice</button>
        <div className="progress-copy">Word <strong>{questionIndex + 1}</strong> of {questions.length}</div>
      </nav>

      <div className="progress-track" aria-hidden="true"><span style={{ width: `${((questionIndex + (phase === "feedback" ? 1 : 0)) / questions.length) * 100}%` }} /></div>

      <section className="question-area">
        {timerEnabled && (
          <div className={`timer ${timeLeft <= 3 ? "urgent" : ""}`} aria-label={`${timeLeft} seconds remaining`}>
            <svg viewBox="0 0 44 44" aria-hidden="true">
              <circle cx="22" cy="22" r="19" />
              <circle className="timer-progress" cx="22" cy="22" r="19" pathLength="100" style={{ strokeDashoffset: 100 - (timeLeft / questionSeconds) * 100 }} />
            </svg>
            <strong>{timeLeft}</strong>
          </div>
        )}

        <p className="eyebrow">Listen carefully</p>
        <h1>Which word did you hear?</h1>
        <button className="listen-button" onClick={() => speak(currentWord)}>
          <SpeakerIcon /> <span>Play word again</span>
        </button>
        {audioError && <p className="audio-error" role="alert">{audioError}</p>}

        <div className="choice-grid" aria-label="Answer choices">
          {choices.map((entry) => {
            const isCorrect = entry === currentWord;
            const isSelected = entry === selected;
            const stateClass = phase === "feedback" && isCorrect ? "correct" : phase === "feedback" && isSelected ? "incorrect" : "";
            return (
              <button
                key={`${entry.simplified}-${entry.traditional}`}
                className={`choice-card ${stateClass}`}
                onClick={() => finishQuestion(entry)}
                disabled={phase !== "answering"}
                aria-label={`Choose ${getCharacters(entry, variant)}`}
              >
                {getCharacters(entry, variant)}
                {stateClass && <span className="answer-mark" aria-hidden="true">{isCorrect ? "✓" : "×"}</span>}
              </button>
            );
          })}
        </div>

        <div className={`feedback-message ${phase === "feedback" ? "visible" : ""}`} aria-live="polite">
          {phase === "feedback" && (timedOut ? `Time's up — the answer was ${correctCharacters}` : selectedIsCorrect ? "That's right!" : `Almost — the answer was ${correctCharacters}`)}
        </div>
      </section>
    </main>
  );
}
