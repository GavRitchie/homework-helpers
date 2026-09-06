export type Topic = "addition" | "subtraction" | "money" | "time";
export type TopicSetting = Topic | "mixed";
export type Difficulty = "starting" | "next";
export type Random = () => number;

type BaseQuestion = { id: string; topic: Topic; prompt: string; choices: string[]; answer: string; explanation: string; hint: string };
export type ArithmeticQuestion = BaseQuestion & { topic: "addition" | "subtraction"; left: number; right: number };
export type MoneyKind = "identify" | "count" | "afford" | "change";
export type MoneyQuestion = BaseQuestion & { topic: "money"; kind: MoneyKind; coins: number[]; price?: number; payment?: number };
export type TimeQuestion = BaseQuestion & { topic: "time"; hour: number; minute: 0 | 30 };
export type MathQuestion = ArithmeticQuestion | MoneyQuestion | TimeQuestion;

export const shuffle = <T,>(items: T[], random: Random = Math.random) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
};
const integer = (max: number, random: Random) => Math.floor(random() * (max + 1));
const cents = (value: number) => value < 100 ? `${value}¢` : `$${(value / 100).toFixed(2)}`;
const fourNumbers = (answer: number, max: number, random: Random) => {
  const values = new Set([answer]);
  const offsets = shuffle([-3, -2, -1, 1, 2, 3, 4], random);
  for (const offset of offsets) if (answer + offset >= 0 && answer + offset <= max) values.add(answer + offset);
  for (let value = 0; values.size < 4 && value <= max; value++) values.add(value);
  return shuffle([...values].slice(0, 4), random);
};
const id = (topic: Topic, random: Random) => `${topic}-${random().toString(36).slice(2)}-${Date.now()}`;

export function makeArithmetic(topic: "addition" | "subtraction", difficulty: Difficulty, random: Random = Math.random): ArithmeticQuestion {
  const max = difficulty === "starting" ? 10 : 20;
  let left = integer(max, random), right = integer(max, random);
  if (topic === "addition") right = integer(max - left, random);
  else if (right > left) [left, right] = [right, left];
  const answer = topic === "addition" ? left + right : left - right;
  const symbol = topic === "addition" ? "+" : "−";
  return { id: id(topic, random), topic, left, right, prompt: `What is ${left} ${symbol} ${right}?`, choices: fourNumbers(answer, max, random).map(String), answer: String(answer), explanation: `${left} ${symbol} ${right} = ${answer}.`, hint: topic === "addition" ? `Put ${left} counters and ${right} counters together.` : `Start with ${left} counters and cross out ${right}.` };
}

const COIN_NAMES: Record<number, string> = { 1: "penny", 5: "nickel", 10: "dime", 25: "quarter" };
function coinsFor(total: number, allowed: number[]) { const result: number[] = []; for (const coin of [...allowed].sort((a,b)=>b-a)) while (total >= coin) { result.push(coin); total -= coin; } return result; }
function moneyChoices(answer: number, max: number, random: Random) { return fourNumbers(answer, max, random).map(cents); }
export function makeMoney(difficulty: Difficulty, kind: MoneyKind, random: Random = Math.random): MoneyQuestion {
  const allowed = difficulty === "starting" ? [1, 5, 10] : [1, 5, 10, 25];
  const max = difficulty === "starting" ? 20 : 100;
  if (kind === "identify") {
    const coin = allowed[integer(allowed.length - 1, random)];
    const options = shuffle(allowed.map(coin => COIN_NAMES[coin]), random).slice(0, 4);
    while (options.length < 4) options.push(["penny", "nickel", "dime", "quarter"].find(x => !options.includes(x))!);
    return { id: id("money", random), topic: "money", kind, coins: [coin], prompt: "What coin is this?", choices: shuffle(options, random), answer: COIN_NAMES[coin], explanation: `This is a ${COIN_NAMES[coin]}, worth ${cents(coin)}.`, hint: `Look at the coin label and its value: ${cents(coin)}.` };
  }
  if (kind === "count") {
    const total = 1 + integer(max - 1, random), coins = coinsFor(total, allowed);
    return { id: id("money", random), topic: "money", kind, coins, prompt: "How much money is shown?", choices: moneyChoices(total, max, random), answer: cents(total), explanation: `The coins add up to ${cents(total)}.`, hint: "Count the biggest coins first, then add the smaller coins." };
  }
  if (kind === "afford") {
    const total = Math.max(4, 4 + integer(max - 4, random)), coins = coinsFor(total, allowed);
    const answer = Math.max(1, total - integer(Math.min(3, total - 1), random));
    const wrong = [total + 1, total + 2, total + 3].filter(x => x <= max + 3);
    while (wrong.length < 3) wrong.push(total + wrong.length + 1);
    return { id: id("money", random), topic: "money", kind, coins, prompt: "Which item can you afford?", choices: shuffle([answer, ...wrong.slice(0,3)].map(cents), random), answer: cents(answer), explanation: `You have ${cents(total)}, so you can buy the item that costs ${cents(answer)}.`, hint: `First count your coins. You have ${cents(total)}. Only one price is no more than that.` };
  }
  const payment = Math.max(2, 2 + integer(max - 2, random));
  const price = integer(payment - 1, random), change = payment - price;
  return { id: id("money", random), topic: "money", kind, coins: coinsFor(payment, allowed), payment, price, prompt: `An item costs ${cents(price)}. You pay ${cents(payment)}. How much change?`, choices: moneyChoices(change, max, random), answer: cents(change), explanation: `${cents(payment)} − ${cents(price)} = ${cents(change)} change.`, hint: `Count up from ${cents(price)} to ${cents(payment)}.` };
}

const timeText = (hour: number, minute: number) => `${hour}:${minute === 0 ? "00" : "30"}`;
export function makeTime(difficulty: Difficulty, random: Random = Math.random): TimeQuestion {
  const hour = 1 + integer(11, random), minute: 0 | 30 = difficulty === "next" && random() >= .5 ? 30 : 0;
  const answer = timeText(hour, minute); const choices = new Set([answer]);
  for (const candidate of [timeText(hour % 12 + 1, minute), timeText(hour, minute === 0 ? 30 : 0), timeText((hour + 10) % 12 + 1, minute)]) choices.add(candidate);
  for (let h = 1; choices.size < 4; h++) choices.add(timeText(h, minute));
  return { id: id("time", random), topic: "time", hour, minute, prompt: "What time does the clock show?", choices: shuffle([...choices].slice(0,4), random), answer, explanation: `The clock shows ${answer}.`, hint: minute === 0 ? `The long hand points to 12, so it is :00. The short hand points to ${hour}.` : `The long hand points to 6, so it is :30. The short hand sits halfway past ${hour}.` };
}

export function createRound(setting: TopicSetting, difficulty: Difficulty, random: Random = Math.random): MathQuestion[] {
  if (setting === "money") return shuffle((["identify","identify","count","count","afford","afford","change","change"] as MoneyKind[]).map(k => makeMoney(difficulty, k, random)), random);
  const make = (topic: Topic, index: number) => topic === "money" ? makeMoney(difficulty, (["identify","count","afford","change"] as MoneyKind[])[index % 4], random) : topic === "time" ? makeTime(difficulty, random) : makeArithmetic(topic, difficulty, random);
  if (setting === "mixed") return shuffle((["addition","addition","subtraction","subtraction","money","money","time","time"] as Topic[]).map((t,i)=>make(t,i)), random);
  return Array.from({length: 8}, (_,i) => make(setting, i));
}

export const clockHands = (hour: number, minute: 0 | 30) => ({ minuteDegrees: minute * 6, hourDegrees: (hour % 12) * 30 + minute * .5 });
export const formatCoins = (coins: number[]) => coins.map(c => `a coin marked ${c} cents`).join(", ");
