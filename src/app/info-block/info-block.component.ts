import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-info-block',
  templateUrl: './info-block.component.html',
  styleUrls: ['./info-block.component.css']
})
export class InfoBlockComponent implements OnInit {

  constructor(private calendar: CalendarService) { }

  tableData = {
    mNames: this.calendar.names.months,
    mLengths: [
      '31', '28<br />(29 in leap years)', '31', '30', '31', '30',
      '31', '31', '30', '31', '30', '31'
    ]
  };

  @Output() toggleInfo = new EventEmitter<void>();

  ngOnInit(): void {
  }

}
