# Typing Speed Test

A browser-based typing speed test with timed and passage modes, multiple difficulty levels, and personal best tracking.

## Features

- **Timed Mode (60s)** — type as many words as you can in 60 seconds
- **Passage Mode** — complete a full passage and see your time
- **3 Difficulty Levels** — Easy, Medium, Hard passages
- **Real-time Stats** — live WPM, accuracy, and countdown timer
- **Personal Best** — best WPM is saved to localStorage
- **Results Screen** — view WPM, accuracy, and error count after each test

## Built With

- Semantic HTML5
- CSS custom properties (style-guide color palette)
- Vanilla JavaScript (ES modules)

## How to Use

1. Open `index.html` in a browser (requires a local server due to ES modules and `fetch`)
2. Select difficulty (Easy / Medium / Hard) and mode (Timed / Passage)
3. Click **Start Typing Test**
4. Type the passage as it appears — correct characters turn green, incorrect turn red
5. Press **Reset** to restart, or change difficulty/mode to load new passages

### Running locally

```bash
npx serve .
# or any static file server
```
