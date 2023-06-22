import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-block',
  templateUrl: './header-block.component.html',
  styleUrls: ['./header-block.component.css']
})
export class HeaderBlockComponent implements OnInit {

  @Output() toggleInfo = new EventEmitter<void>();
  @Output() toggleYearPicker = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
