import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import confetti from 'canvas-confetti';
import { VERB_PAIRS_A1, VERB_PAIRS_A2, VERB_PAIRS_B1, VERB_PAIRS_B2, VERB_PAIRS_C1, WORD_PAIRS_A1, WORD_PAIRS_A2, WORD_PAIRS_B1, WORD_PAIRS_B2, WORD_PAIRS_C1, WordPair } from '../../data/word-pairs';
import { FormsModule } from '@angular/forms';




function shuffle<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

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
  selectedType: 'noun' | 'verb' = 'noun';
  allPairs: WordPair[] = [];
  wordPairs: WordPair[] = [];
  germanWords: string[] = [];
  turkishWords: string[] = [];
  wrongMatchGerman: string | null = null;
  wrongMatchTurkish: string | null = null;
  selectedSide: 'german' | 'turkish' | null = null;
  showCongrats: boolean = false;
  selectedGerman: string | null = null;
  selectedTurkish: string | null = null;

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
    }
  }

  pickNewWords() {
    const shuffled = shuffle(this.allPairs.filter(w => !w.matched));
    this.wordPairs = shuffled.slice(0, 7);
    this.germanWords = shuffle(this.wordPairs.map(w => w.german));
    this.turkishWords = shuffle(this.wordPairs.map(w => w.turkish));
    this.selectedGerman = null;
    this.selectedTurkish = null;
    this.selectedSide = null;
    this.showCongrats = false;
  }

   onTypeChange() {
    this.loadPairs();
    this.allPairs.forEach(w => w.matched = false);
    this.pickNewWords();
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

  selectGerman(word: string) {
    if (this.isMatchedGerman(word)) return;
    if (!this.selectedSide) {
      this.selectedGerman = word;
      this.selectedSide = 'german';
      return;
    }
    if (this.selectedSide === 'turkish' && this.selectedTurkish) {
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
    if (this.selectedSide === 'german' && this.selectedGerman) {
      this.selectedTurkish = word;
      this.checkMatch();
    }
  }

  launchConfetti() {
  confetti();
}

checkMatch() {
    const pair = this.wordPairs.find(w => w.german === this.selectedGerman && w.turkish === this.selectedTurkish);
    if (pair) {
      pair.matched = true;
      if (this.matchedCount === this.wordPairs.length) {
        this.showCongrats = true;
        this.launchConfetti();
        setTimeout(() => {
          this.pickNewWords();
        }, 1500); // 1.5 saniye sonra yeni kelimeler gelsin
      }
      this.selectedGerman = null;
      this.selectedTurkish = null;
      this.selectedSide = null;
    } else {
      this.wrongMatchGerman = this.selectedGerman;
      this.wrongMatchTurkish = this.selectedTurkish;
      setTimeout(() => {
        this.wrongMatchGerman = null;
        this.wrongMatchTurkish = null;
        this.selectedGerman = null;
        this.selectedTurkish = null;
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

}
