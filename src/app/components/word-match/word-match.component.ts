import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


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

  selectedGerman: string | null = null;
  selectedTurkish: string | null = null;

   selectGerman(word: string) {
    if (this.selectedGerman || this.wordPairs.find(w => w.german === word)?.matched) return;
    this.selectedGerman = word;
  }

  selectTurkish(word: string) {
    if (!this.selectedGerman || this.wordPairs.find(w => w.turkish === word)?.matched) return;
    this.selectedTurkish = word;
    this.checkMatch();
  }

  checkMatch() {
    const pair = this.wordPairs.find(w => w.german === this.selectedGerman && w.turkish === this.selectedTurkish);
    if (pair) {
      pair.matched = true;
    }
    this.selectedGerman = null;
    this.selectedTurkish = null;
  }

  isMatchedGerman(word: string): boolean {
    return this.wordPairs.find(w => w.german === word)?.matched ?? false;
  }

  isMatchedTurkish(word: string): boolean {
    return this.wordPairs.find(w => w.turkish === word)?.matched ?? false;
  }

}
