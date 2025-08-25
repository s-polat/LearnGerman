import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import confetti from 'canvas-confetti';


interface WordPair {
  german: string;
  turkish: string;
  matched: boolean;
}

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
  imports: [CommonModule]
})
export class WordMatchComponent {

  wordPairs: WordPair[] = [
    { german: 'Haus', turkish: 'Ev', matched: false },
    { german: 'Baum', turkish: 'Ağaç', matched: false },
    { german: 'Buch', turkish: 'Kitap', matched: false },
    { german: 'Auto', turkish: 'Araba', matched: false },
    { german: 'Hund', turkish: 'Köpek', matched: false },
    { german: 'Katze', turkish: 'Kedi', matched: false },
    { german: 'Stuhl', turkish: 'Sandalye', matched: false }
  ];

   constructor() {
    this.germanWords = shuffle(this.wordPairs.map(w => w.german));
    this.turkishWords = shuffle(this.wordPairs.map(w => w.turkish));
  }


  germanWords: string[];
  turkishWords: string[]; 
  selectedSide: 'german' | 'turkish' | null = null;
  showCongrats: boolean = false;

  selectedGerman: string | null = null;
  selectedTurkish: string | null = null;

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
  }
  this.selectedGerman = null;
  this.selectedTurkish = null;
  this.selectedSide = null;

  if (this.matchedCount === this.wordPairs.length) {
    this.showCongrats = true;
    this.launchConfetti();
  }
}

   isMatchedGerman(word: string): boolean {
    return this.wordPairs.find(w => w.german === word)?.matched ?? false;
  }

  isMatchedTurkish(word: string): boolean {
    return this.wordPairs.find(w => w.turkish === word)?.matched ?? false;
  }

}
