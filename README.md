# Homework Helpers

A small directory of browser-based practice tools for homework time.

- **Chinese Listening Match** reads a Mandarin word and asks the learner to match its characters, with an optional configurable timer.
- **Math Adventures** offers untimed, eight-question rounds in addition, subtraction, US money, telling time, or a balanced mix. “Starting out” covers numbers to 10, coins to 20¢, and whole hours; “Next step” covers numbers to 20, money to $1.00, and whole or half hours.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. The app uses hash-based routes, so it can be hosted on any static web host without special routing configuration.

## Update the weekly words

Edit `weeklyList.entries` in [`src/data/vocabulary.ts`](src/data/vocabulary.ts). Each word needs simplified and traditional forms:

```ts
{ simplified: "学校", traditional: "學校" }
```

If the characters are the same in both systems, repeat the same text in both fields. Keep at least ten unique entries so the game can always show ten different choices. Changes take effect after rebuilding or redeploying the app.

## Commands

```bash
npm run dev        # start the local development server
npm test           # run the automated tests once
npm run typecheck  # check TypeScript
npm run build      # create a production build in dist/
```

Pronunciation uses the browser's Speech Synthesis API. Voice quality depends on the Chinese voices installed on the device.
