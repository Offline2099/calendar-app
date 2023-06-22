import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-info-block',
  templateUrl: './info-block.component.html',
  styleUrls: ['./info-block.component.css']
})
export class InfoBlockComponent implements OnInit {

  constructor() { }

  @Output() toggleInfo = new EventEmitter<void>();

  ngOnInit(): void {
  }

}
