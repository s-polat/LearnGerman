# LearnGerman Word Match App

This is an interactive word matching application for learning German vocabulary. Users can match German words with their Turkish or English equivalents, practice their mistakes, and track their progress.

## Features

- **Language Modes:** Match German-Turkish, German-English, or English-Turkish word pairs.
- **Levels & Types:** Select word level (A1–C1) and type (noun, verb, adjective, adverb).
- **Progress Tracking:** See your matching progress with a progress bar.
- **Mistake Practice:** Review and practice words you matched incorrectly.
- **Smart Mistake Handling:** Mistake words stay in the practice list until you match them correctly 4 times.
- **Responsive Design:** Works smoothly on mobile, tablet, and desktop.
- **Confetti Celebration:** Get a congratulatory message and confetti when all words are matched correctly.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd LearnGerman
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the app:**
   ```bash
   ng serve
   ```
   or for Vite/React:
   ```bash
   npm start
   ```

## Usage

- Select your desired **language mode**, **level**, and **word type** from the dropdowns.
- Click on words to match them.
- If you make a mistake, use the **Review Mistakes** button to practice only your incorrect words.
- Use **Reset Mistakes** to clear your mistake list.
- Return to all words with **Back to All Words**.

## Technologies

- Angular
- TypeScript
- Bootstrap (for responsive UI)
- LocalStorage (for mistake tracking)
- canvas-confetti (for celebration effect)

## Customization

- Add or edit word pairs in `/src/app/data/word-pairs.ts`.
- Change UI styles in `/src/app/components/word-match/word-match.component.scss`.

## License

MIT

---

**Enjoy learning German! Viel Erfolg beim Deutschlernen!**
