import type { VocabularyEntry, VocabularyList } from "../data/vocabulary";

export type CharacterVariant = "simplified" | "traditional";

export interface AnswerResult {
  entry: VocabularyEntry;
  correct: boolean;
}

export function getCharacters(entry: VocabularyEntry, variant: CharacterVariant) {
  return entry[variant].trim();
}

export function validateVocabularyList(list: VocabularyList): string[] {
  const errors: string[] = [];

  if (list.entries.length < 10) {
    errors.push("Add at least 10 words so every question can have 10 choices.");
  }

  list.entries.forEach((entry, index) => {
    if (!entry.simplified.trim() || !entry.traditional.trim()) {
      errors.push(`Word ${index + 1} needs both simplified and traditional characters.`);
    }
  });

  (["simplified", "traditional"] as const).forEach((variant) => {
    const seen = new Set<string>();
    list.entries.forEach((entry) => {
      const value = getCharacters(entry, variant);
      if (value && seen.has(value)) {
        errors.push(`The ${variant} word “${value}” appears more than once.`);
      }
      seen.add(value);
    });
  });

  return [...new Set(errors)];
}

export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function createChoices(
  correct: VocabularyEntry,
  entries: readonly VocabularyEntry[],
  random: () => number = Math.random,
): VocabularyEntry[] {
  const distractors = shuffle(entries.filter((entry) => entry !== correct), random).slice(0, 9);
  return shuffle([correct, ...distractors], random);
}

export function calculateScore(results: readonly AnswerResult[]) {
  const correct = results.filter((result) => result.correct).length;
  return {
    correct,
    total: results.length,
    percentage: results.length === 0 ? 0 : Math.round((correct / results.length) * 100),
  };
}
