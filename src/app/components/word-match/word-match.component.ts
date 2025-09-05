import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import confetti from 'canvas-confetti';
import { ADJEKTIV_PAIRS_A1, ADJEKTIV_PAIRS_A2, ADJEKTIV_PAIRS_B1, ADJEKTIV_PAIRS_B2, ADJEKTIV_PAIRS_C1, ADVERB_PAIRS_A1, ADVERB_PAIRS_A2, ADVERB_PAIRS_B1, ADVERB_PAIRS_B2, ADVERB_PAIRS_C1, VERB_PAIRS_A1, VERB_PAIRS_A2, VERB_PAIRS_B1, VERB_PAIRS_B2, VERB_PAIRS_C1, WORD_PAIRS_A1, WORD_PAIRS_A2, WORD_PAIRS_B1, WORD_PAIRS_B2, WORD_PAIRS_C1, WordPair } from '../../data/word-pairs';
import { FormsModule } from '@angular/forms';
import { log } from 'node:console';


interface WrongWordPair extends WordPair {
  correctCount?: number;
}

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
    this.loadWrongWordsFromLS();
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
  wrongWords: WrongWordPair[] = [];
  repeatWrongMode: boolean = false;
  showWrongButton: boolean = false;

   // Yanlış kelimeyi kaydet
  saveWrongWordToLS(pair: WordPair) {
    if (typeof window !== 'undefined' && window.localStorage) {
      let wrongs: WordPair[] = JSON.parse(localStorage.getItem('wrongWords') || '[]');
      if (!wrongs.some(w => w.german === pair.german && w.turkish === pair.turkish && w.english === pair.english)) {
        wrongs.push({ ...pair, matched: false });
        localStorage.setItem('wrongWords', JSON.stringify(wrongs));
      }
    }
  }

  // Yanlış kelimeyi sil
  removeWrongWordFromLS(pair: WordPair) {
    if (typeof window !== 'undefined' && window.localStorage) {
      let wrongs: WordPair[] = JSON.parse(localStorage.getItem('wrongWords') || '[]');
      wrongs = wrongs.filter(w => !(w.german === pair.german && w.turkish === pair.turkish && w.english === pair.english));
      localStorage.setItem('wrongWords', JSON.stringify(wrongs));
    }
  }

  // Yanlış kelimeleri yükle
  loadWrongWordsFromLS() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.wrongWords = JSON.parse(localStorage.getItem('wrongWords') || '[]');
      this.showWrongButton = this.wrongWords.length > 0;
    } else {
      this.wrongWords = [];
      this.showWrongButton = false;
    }
  }

  returnToNormalWords() {
  this.repeatWrongMode = false;
  this.pickNewWords();
}

  // Yanlışları tekrar çalıştır
repeatWrongWords() {
  this.repeatWrongMode = true;
  // wrongWords listesinden rastgele 7 kelime seç, wrong özelliğini sıfırla!
 const shuffled = shuffle(this.wrongWords);
 this.wordPairs = shuffled.slice(0, 7).map(w => ({ ...w, wrong: false, matched: false, correctCount: w.correctCount || 0 }));

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

  // Yanlışları temizle
  clearWrongWords() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('wrongWords');
    }
    this.loadWrongWordsFromLS();
    this.repeatWrongMode = false;
    this.pickNewWords();
  }

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
  if (this.repeatWrongMode) {
    // Sadece yanlış kelimelerden yeni grup getir
    const shuffled = shuffle(this.wrongWords);
    this.wordPairs = shuffled.slice(0, 7).map(w => ({ ...w, wrong: false, matched: false, correctCount: w.correctCount || 0 }));

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
    return;
  }

  // Normal modda eski mantık devam etsin
  const shuffled = shuffle(this.allPairs.filter(w => !w.matched && !(w as any).wrong));
  this.wordPairs = shuffled.slice(0, 7);

  if (this.wordPairs.length === 0) {
    const allCorrect = this.allPairs.length > 0 && this.allPairs.every(w => w.matched);
    if (allCorrect) {
      this.showCongrats = true;
      this.launchConfetti();
    } else {
      this.showCongrats = false;
    }
    return;
  }

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

isWrongGerman(word: string): boolean {
  return this.wordPairs.some(w => w.german === word && (w as any).wrong);
}
isWrongEnglish(word: string): boolean {
  return this.wordPairs.some(w => w.english === word && (w as any).wrong);
}
isWrongTurkish(word: string): boolean {
  return this.wordPairs.some(w => w.turkish === word && (w as any).wrong);
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
    if (this.repeatWrongMode) {
      // repeatWrongMode'da doğru bilinen kelimenin sayaç değerini artır
      let wrongs: any[] = JSON.parse(localStorage.getItem('wrongWords') || '[]');
      const idx = wrongs.findIndex(w => w.german === pair.german && w.turkish === pair.turkish && w.english === pair.english);
      if (idx !== -1) {
        wrongs[idx].correctCount = (wrongs[idx].correctCount || 0) + 1;
        // Sayaç 4 olduysa arrayden sil
        if (wrongs[idx].correctCount >= 4) {
          wrongs.splice(idx, 1);
        }
        localStorage.setItem('wrongWords', JSON.stringify(wrongs));
        this.loadWrongWordsFromLS();
      }
    } else {
      this.removeWrongWordFromLS(pair);
      this.loadWrongWordsFromLS();
    }
  } else {
    let wrongPair: WordPair | undefined;
    if (this.selectedLanguageMode === 'german-turkish') {
      wrongPair = this.wordPairs.find(w => w.german === this.selectedGerman);
    } else if (this.selectedLanguageMode === 'german-english') {
      wrongPair = this.wordPairs.find(w => w.german === this.selectedGerman);
    } else if (this.selectedLanguageMode === 'english-turkish') {
      wrongPair = this.wordPairs.find(w => w.english === this.selectedEnglish);
    }
    if (wrongPair) {
      (wrongPair as any).wrong = true;
      this.saveWrongWordToLS(wrongPair);
      this.loadWrongWordsFromLS();
    }
  }

  // Seçimleri sıfırla
  this.selectedGerman = null;
  this.selectedTurkish = null;
  this.selectedEnglish = null;
  this.selectedSide = null;

  // Ekrandaki tüm kelimeler matched veya wrong ise yeni kelimelere geç
  const allScreenDone = this.wordPairs.every(w => w.matched || (w as any).wrong);
  if (allScreenDone) {
    setTimeout(() => {
      this.pickNewWords();
    }, 1000); // Geçişi biraz yavaşlatmak için 1 saniye beklet
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
