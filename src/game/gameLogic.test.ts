import { describe, expect, it } from "vitest";
import { demoList, type VocabularyList } from "../data/vocabulary";
import { calculateScore, createChoices, getCharacters, shuffle, validateVocabularyList } from "./gameLogic";

describe("vocabulary validation", () => {
  it("accepts the built-in demo list", () => {
    expect(validateVocabularyList(demoList)).toEqual([]);
  });

  it("reports short, incomplete, and duplicate lists", () => {
    const invalid: VocabularyList = {
      id: "bad",
      name: "Bad list",
      description: "",
      entries: [
        { simplified: "书", traditional: "書" },
        { simplified: "书", traditional: "" },
      ],
    };

    const errors = validateVocabularyList(invalid);
    expect(errors).toContain("Add at least 10 words so every question can have 10 choices.");
    expect(errors).toContain("Word 2 needs both simplified and traditional characters.");
    expect(errors).toContain("The simplified word “书” appears more than once.");
  });
});

describe("game helpers", () => {
  it("reads the chosen character variant", () => {
    expect(getCharacters({ simplified: "学校", traditional: "學校" }, "simplified")).toBe("学校");
    expect(getCharacters({ simplified: "学校", traditional: "學校" }, "traditional")).toBe("學校");
  });

  it("shuffles without changing the source", () => {
    const source = [1, 2, 3, 4];
    expect(shuffle(source, () => 0)).toEqual([2, 3, 4, 1]);
    expect(source).toEqual([1, 2, 3, 4]);
  });

  it("creates ten unique choices containing the answer", () => {
    const correct = demoList.entries[3];
    const choices = createChoices(correct, demoList.entries, () => 0.42);
    expect(choices).toHaveLength(10);
    expect(new Set(choices)).toHaveLength(10);
    expect(choices).toContain(correct);
  });

  it("calculates session results", () => {
    const entry = demoList.entries[0];
    expect(calculateScore([
      { entry, correct: true },
      { entry, correct: true },
      { entry, correct: false },
    ])).toEqual({ correct: 2, total: 3, percentage: 67 });
  });
});
