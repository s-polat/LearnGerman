import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import confetti from 'canvas-confetti';
import { ADJEKTIV_PAIRS_A1, ADJEKTIV_PAIRS_A2, ADJEKTIV_PAIRS_B1, ADJEKTIV_PAIRS_B2, ADJEKTIV_PAIRS_C1, ADVERB_PAIRS_A1, ADVERB_PAIRS_A2, ADVERB_PAIRS_B1, ADVERB_PAIRS_B2, ADVERB_PAIRS_C1, VERB_PAIRS_A1, VERB_PAIRS_A2, VERB_PAIRS_B1, VERB_PAIRS_B2, VERB_PAIRS_C1, WORD_PAIRS_A1, WORD_PAIRS_A2, WORD_PAIRS_B1, WORD_PAIRS_B2, WORD_PAIRS_C1, WordPair } from '../../data/word-pairs';
import { FormsModule } from '@angular/forms';




function shuffle<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

type LanguageMode = 'german-turkish' | 'german-english' | 'english-turkish';

@Component({
  selector: 'app-word-match',
  templateUrl: './word-match.component.html',
  styleUrl: './word-match.component.scss',
  imports: [CommonModule, FormsModule],
})
export class WordMatchComponent {


   constructor() {
    this.loadPairs();
    this.pickNewWords();
  }

 selectedLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' = 'A1';
 selectedType: 'noun' | 'verb' | 'adverb' | 'adjektiv' = 'noun';
   selectedLanguageMode: LanguageMode = 'german-turkish';
  allPairs: WordPair[] = [];
  wordPairs: WordPair[] = [];
  germanWords: string[] = [];
  turkishWords: string[] = [];
  englishWords: string[] = [];
  wrongMatchGerman: string | null = null;
  wrongMatchTurkish: string | null = null;
  wrongMatchEnglish: string | null = null;
    selectedSide: 'german' | 'turkish' | 'english' | null = null;
  showCongrats: boolean = false;
  selectedGerman: string | null = null;
  selectedTurkish: string | null = null;
  selectedEnglish: string | null = null;

 loadPairs() {
  if (this.selectedType === 'noun') {
    switch (this.selectedLevel) {
      case 'A1': this.allPairs = [...WORD_PAIRS_A1]; break;
      case 'A2': this.allPairs = [...WORD_PAIRS_A2]; break;
      case 'B1': this.allPairs = [...WORD_PAIRS_B1]; break;
      case 'B2': this.allPairs = [...WORD_PAIRS_B2]; break;
      case 'C1': this.allPairs = [...WORD_PAIRS_C1]; break;
    }
  } else if (this.selectedType === 'verb') {
    switch (this.selectedLevel) {
      case 'A1': this.allPairs = [...VERB_PAIRS_A1]; break;
      case 'A2': this.allPairs = [...VERB_PAIRS_A2]; break;
      case 'B1': this.allPairs = [...VERB_PAIRS_B1]; break;
      case 'B2': this.allPairs = [...VERB_PAIRS_B2]; break;
      case 'C1': this.allPairs = [...VERB_PAIRS_C1]; break;
    }
  } else if (this.selectedType === 'adverb') {
    switch (this.selectedLevel) {
      case 'A1': this.allPairs = [...ADVERB_PAIRS_A1]; break;
      case 'A2': this.allPairs = [...ADVERB_PAIRS_A2]; break;
      case 'B1': this.allPairs = [...ADVERB_PAIRS_B1]; break;
      case 'B2': this.allPairs = [...ADVERB_PAIRS_B2]; break;
      case 'C1': this.allPairs = [...ADVERB_PAIRS_C1]; break;
    }
  } else if (this.selectedType === 'adjektiv') {
    switch (this.selectedLevel) {
      case 'A1': this.allPairs = [...ADJEKTIV_PAIRS_A1]; break;
      case 'A2': this.allPairs = [...ADJEKTIV_PAIRS_A2]; break;
      case 'B1': this.allPairs = [...ADJEKTIV_PAIRS_B1]; break;
      case 'B2': this.allPairs = [...ADJEKTIV_PAIRS_B2]; break;
      case 'C1': this.allPairs = [...ADJEKTIV_PAIRS_C1]; break;
    }
  }
}

  pickNewWords() {
    const shuffled = shuffle(this.allPairs.filter(w => !w.matched));
    this.wordPairs = shuffled.slice(0, 7);

    if (this.selectedLanguageMode === 'german-turkish') {
      this.germanWords = shuffle(this.wordPairs.map(w => w.german));
      this.turkishWords = shuffle(this.wordPairs.map(w => w.turkish));
    } else if (this.selectedLanguageMode === 'german-english') {
      this.germanWords = shuffle(this.wordPairs.map(w => w.german));
      this.englishWords = shuffle(this.wordPairs.map(w => w.english));
    } else if (this.selectedLanguageMode === 'english-turkish') {
      this.englishWords = shuffle(this.wordPairs.map(w => w.english));
      this.turkishWords = shuffle(this.wordPairs.map(w => w.turkish));
    }

    this.selectedGerman = null;
    this.selectedTurkish = null;
    this.selectedEnglish = null;
    this.selectedSide = null;
    this.showCongrats = false;
  }

    onLanguageModeChange() {
    this.pickNewWords();
  }

   onTypeChange() {
    this.loadPairs();
    this.allPairs.forEach(w => w.matched = false);
    this.pickNewWords();
  }

    selectGerman(word: string) {
    if (this.isMatchedGerman(word)) return;
    if (!this.selectedSide) {
      this.selectedGerman = word;
      this.selectedSide = 'german';
      return;
    }
    if (this.selectedLanguageMode === 'german-turkish' && this.selectedSide === 'turkish' && this.selectedTurkish) {
      this.selectedGerman = word;
      this.checkMatch();
    }
    if (this.selectedLanguageMode === 'german-english' && this.selectedSide === 'english' && this.selectedEnglish) {
      this.selectedGerman = word;
      this.checkMatch();
    }
  }

  selectTurkish(word: string) {
    if (this.isMatchedTurkish(word)) return;
    if (!this.selectedSide) {
      this.selectedTurkish = word;
      this.selectedSide = 'turkish';
      return;
    }
    if (this.selectedLanguageMode === 'german-turkish' && this.selectedSide === 'german' && this.selectedGerman) {
      this.selectedTurkish = word;
      this.checkMatch();
    }
    if (this.selectedLanguageMode === 'english-turkish' && this.selectedSide === 'english' && this.selectedEnglish) {
      this.selectedTurkish = word;
      this.checkMatch();
    }
  }

  selectEnglish(word: string) {
    if (this.isMatchedEnglish(word)) return;
    if (!this.selectedSide) {
      this.selectedEnglish = word;
      this.selectedSide = 'english';
      return;
    }
    if (this.selectedLanguageMode === 'german-english' && this.selectedSide === 'german' && this.selectedGerman) {
      this.selectedEnglish = word;
      this.checkMatch();
    }
    if (this.selectedLanguageMode === 'english-turkish' && this.selectedSide === 'turkish' && this.selectedTurkish) {
      this.selectedEnglish = word;
      this.checkMatch();
    }
  }

   onLevelChange() {
    this.loadPairs();
    this.allPairs.forEach(w => w.matched = false); // Tüm kelimeleri sıfırla
    this.pickNewWords();
  }

  get matchedCount(): number {
  return this.wordPairs.filter(w => w.matched).length;
}

get progress(): number {
  return Math.round((this.matchedCount / this.wordPairs.length) * 100);
}

 

  launchConfetti() {
  confetti();
}

checkMatch() {
    let pair: WordPair | undefined;
    if (this.selectedLanguageMode === 'german-turkish') {
      pair = this.wordPairs.find(w => w.german === this.selectedGerman && w.turkish === this.selectedTurkish);
    } else if (this.selectedLanguageMode === 'german-english') {
      pair = this.wordPairs.find(w => w.german === this.selectedGerman && w.english === this.selectedEnglish);
    } else if (this.selectedLanguageMode === 'english-turkish') {
      pair = this.wordPairs.find(w => w.english === this.selectedEnglish && w.turkish === this.selectedTurkish);
    }

    if (pair) {
      pair.matched = true;
      if (this.matchedCount === this.wordPairs.length) {
        this.showCongrats = true;
        this.launchConfetti();
        setTimeout(() => {
          this.pickNewWords();
        }, 1500);
      }
      this.selectedGerman = null;
      this.selectedTurkish = null;
      this.selectedEnglish = null;
      this.selectedSide = null;
    } else {
      this.wrongMatchGerman = this.selectedGerman;
      this.wrongMatchTurkish = this.selectedTurkish;
      this.wrongMatchEnglish = this.selectedEnglish;
      setTimeout(() => {
        this.wrongMatchGerman = null;
        this.wrongMatchTurkish = null;
        this.wrongMatchEnglish = null;
        this.selectedGerman = null;
        this.selectedTurkish = null;
        this.selectedEnglish = null;
        this.selectedSide = null;
      }, 700);
    }
  }

  getArtikel(german: string): string | undefined {
  const pair = this.wordPairs.find(w => w.german === german);
  return pair ? pair.artikel : '';
}

 isMatchedGerman(word: string): boolean {
    return this.wordPairs.find(w => w.german === word)?.matched ?? false;
  }
  isMatchedTurkish(word: string): boolean {
    return this.wordPairs.find(w => w.turkish === word)?.matched ?? false;
  }
  isMatchedEnglish(word: string): boolean {
    return this.wordPairs.find(w => w.english === word)?.matched ?? false;
  }

}
