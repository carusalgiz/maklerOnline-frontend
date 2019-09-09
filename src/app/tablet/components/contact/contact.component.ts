import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() size;
  @Input() fullItem: boolean;
  @Input() itemOpen: boolean;
  @Output() checkPay = new EventEmitter();
  @Output() blockClose = new EventEmitter();
  check = false;
  checkNews = false;
  width: number;
  ngOnInit() {
    this.width = document.documentElement.clientWidth;
  }
  ngAfterViewInit() {
    if (this.itemOpen === true && this.width < 1050) {
      let main = document.getElementsByClassName('main-objects')   as HTMLCollectionOf<HTMLElement>;
      main.item(0).style.setProperty('margin-top', '0');
    }
  }
  showInfo(name) {
    this.checkPay.emit(name);
  }
  blockCloseFunc(name) {
    this.blockClose.emit(name);
  }

}
