import { clockHands, formatCoins, type MathQuestion } from "./mathLogic";

export function CoinDisplay({ coins }: { coins: number[] }) {
  return <div className="coin-row" role="img" aria-label={`Coins shown: ${formatCoins(coins)}`}>{coins.map((coin,i)=><span key={`${coin}-${i}`} className={`coin coin-${coin}`} aria-hidden="true"><b>{coin}</b><small>¢</small></span>)}</div>;
}
export function Clock({ hour, minute }: { hour: number; minute: 0 | 30 }) {
  const hands = clockHands(hour, minute);
  return <svg className="math-clock" viewBox="0 0 220 220" role="img" aria-label="A numbered analog clock"><circle cx="110" cy="110" r="101"/><g className="clock-numbers">{Array.from({length:12},(_,i)=>{const n=i+1,a=n*30*Math.PI/180;return <text key={n} x={110+78*Math.sin(a)} y={115-78*Math.cos(a)} textAnchor="middle">{n}</text>})}</g><line className="hour-hand" x1="110" y1="110" x2="110" y2="55" transform={`rotate(${hands.hourDegrees} 110 110)`}/><line className="minute-hand" x1="110" y1="110" x2="110" y2="31" transform={`rotate(${hands.minuteDegrees} 110 110)`}/><circle className="clock-pin" cx="110" cy="110" r="6"/></svg>;
}
export function QuestionVisual({ question, hint }: { question: MathQuestion; hint: boolean }) {
  if (question.topic === "time") return <Clock hour={question.hour} minute={question.minute}/>;
  if (question.topic === "money") return <CoinDisplay coins={question.coins}/>;
  if (!hint) return null;
  return <div className="counter-row" role="img" aria-label={`${question.left} counters, ${question.topic === "addition" ? `plus ${question.right} counters` : `${question.right} crossed out`}`}>{Array.from({length: question.left},(_,i)=><span key={i} className={question.topic === "subtraction" && i >= question.left-question.right ? "crossed" : ""}/>) }{question.topic === "addition" && <i/>}{question.topic === "addition" && Array.from({length:question.right},(_,i)=><span key={`r${i}`} className="second"/>)}</div>;
}
