import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  inputs: ["mode"],
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css']
})
export class AgreementComponent implements OnInit {
  @Output() blockClose = new EventEmitter();
   mode = 'agreement';
  ngOnInit(): void {
  }
  blockCloseFunc(name) {
    this.blockClose.emit(name);
  }
}
