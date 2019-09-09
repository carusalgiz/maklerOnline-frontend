import {Component, EventEmitter, OnInit, Output, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit, AfterViewInit {
  constructor() {}
  
  @Output() blockClose = new EventEmitter();
  @Output() checkOutput = new EventEmitter();
  
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  blockCloseFunc(name) {
    this.blockClose.emit(name);
  }

  checkOutFunc() {
    let name = 'login';
    this.checkOutput.emit(name);
  }
}
