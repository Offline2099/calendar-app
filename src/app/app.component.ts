import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  year: number = new Date().getFullYear();

  infoOverlayShown: boolean = false;
  yearPickerShown: boolean = false;

  pickYear(y: number): void {
    this.year = y;
  }

  toggleInfoOverlay(): void {
    this.infoOverlayShown = !this.infoOverlayShown;
  }

  toggleYearPicker(): void {
    this.yearPickerShown = !this.yearPickerShown;
  }

}
