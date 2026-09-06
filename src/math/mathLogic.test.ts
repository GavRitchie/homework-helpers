import { describe, expect, it } from "vitest";
import { clockHands, createRound, makeArithmetic, makeMoney, makeTime, type Difficulty, type MathQuestion } from "./mathLogic";

const sequence = (...values:number[]) => { let i=0; return () => values[i++ % values.length]; };
const valid = (questions:MathQuestion[]) => questions.forEach(q=>{expect(q.choices).toHaveLength(4);expect(new Set(q.choices).size).toBe(4);expect(q.choices).toContain(q.answer)});
describe("math question generation",()=>{
  it.each(["starting","next"] as Difficulty[])("creates valid arithmetic within %s bounds",difficulty=>{for(const topic of ["addition","subtraction"] as const)for(let i=0;i<30;i++){const q=makeArithmetic(topic,difficulty);expect(q.left).toBeLessThanOrEqual(difficulty==="starting"?10:20);expect(Number(q.answer)).toBeGreaterThanOrEqual(0);expect(Number(q.answer)).toBeLessThanOrEqual(difficulty==="starting"?10:20);valid([q])}});
  it("balances mixed rounds",()=>{const round=createRound("mixed","next");expect(round).toHaveLength(8);for(const topic of ["addition","subtraction","money","time"])expect(round.filter(q=>q.topic===topic)).toHaveLength(2);valid(round)});
  it("balances money-only question types and computes change",()=>{const round=createRound("money","starting");for(const kind of ["identify","count","afford","change"])expect(round.filter(q=>q.topic==="money"&&q.kind===kind)).toHaveLength(2);valid(round);round.filter((q):q is Extract<MathQuestion,{topic:"money"}>=>q.topic==="money"&&q.kind==="change").forEach(q=>expect(q.payment!-q.price!).toBe(Number.parseInt(q.answer)))});
  it("keeps money totals in level bounds",()=>{for(const d of ["starting","next"] as Difficulty[])for(const kind of ["count","change"] as const)for(let i=0;i<20;i++){const q=makeMoney(d,kind);expect(q.coins.reduce((a,b)=>a+b,0)).toBeLessThanOrEqual(d==="starting"?20:100)}});
  it("uses whole hours at starting level and valid half hours next",()=>{for(let i=0;i<20;i++){expect(makeTime("starting").minute).toBe(0);valid([makeTime("next")])}});
  it("positions clock hands at 12:00 and 12:30",()=>{expect(clockHands(12,0)).toEqual({hourDegrees:0,minuteDegrees:0});expect(clockHands(12,30)).toEqual({hourDegrees:15,minuteDegrees:180})});
  it("supports injectable randomness",()=>{const q=makeArithmetic("addition","starting",()=>0);expect(q.left).toBe(0);expect(q.right).toBe(0)});
});
