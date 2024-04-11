import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-block',
  templateUrl: './header-block.component.html',
  styleUrls: ['./header-block.component.css']
})
export class HeaderBlockComponent {

  @Input() yearPickerShown: boolean = false;

  @Output() toggleInfo = new EventEmitter<void>();
  @Output() toggleYearPicker = new EventEmitter<void>();

  buttons = [
    {
      id: 'info',
      hint: {
        header: 'View Info',
        text: 'Basic information about the Gregorian calendar and its structure.'
      }
    },
    {
      id: 'year-picker',
      hint: {
        header: 'Pick Year',
        text: 'Select any year from the last ice age to the distant future to view the calendar.'
      }
    }
  ];
  
  headerBlockButtonClick(id: string) {
    if (id == 'info') this.toggleInfo.emit();
    if (id == 'year-picker') this.toggleYearPicker.emit();
  }

}
