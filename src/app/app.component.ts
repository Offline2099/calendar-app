import { Component } from '@angular/core';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private settings: SettingsService) { }

  year: number = new Date().getFullYear();
  yearHue: number = this.settings.getYearColor(this.year);

  infoOverlayShown: boolean = false;
  yearPickerShown: boolean = false;

  pickYear(y: number): void {
    this.year = y;
    this.yearHue = this.settings.getYearColor(y);
  }

  toggleInfoOverlay(): void {
    this.infoOverlayShown = !this.infoOverlayShown;
  }

  toggleYearPicker(): void {
    this.yearPickerShown = !this.yearPickerShown;
  }

}
