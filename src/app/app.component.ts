import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordMatchComponent } from "./components/word-match/word-match.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WordMatchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'temp-app';
}
