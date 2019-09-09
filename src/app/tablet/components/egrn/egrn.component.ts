import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {Item} from '../../../item';

@Component({
  selector: 'app-egrn',
  templateUrl: './egrn.component.html',
  styleUrls: ['./egrn.component.css']
})
export class EgrnComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() item: Item;
  @Input() itemOpen: boolean;
  @Output() blockClose = new EventEmitter();
  check = false;
  checkNews = false;
  width: number;
  ngOnInit() {
    console.log('egrn showed');
    this.width = document.documentElement.clientWidth;
  }
  ngAfterViewInit() {
    if (this.itemOpen === true && this.width < 1050) {
      let mapbuttons = document.getElementsByClassName('map-buttons-tablet')   as HTMLCollectionOf<HTMLElement>;
      mapbuttons.item(0).style.setProperty('display', 'none');
      let header = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
      header.item(0).style.setProperty('display', 'none');
      let uselessLine = document.documentElement.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
      uselessLine.item(0).style.setProperty('display', 'none');
      let arrows = document.documentElement.getElementsByClassName('arrows-mobile ') as HTMLCollectionOf<HTMLElement>;
      arrows.item(0).style.setProperty('display', 'none');
      let main = document.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
      main.item(0).style.setProperty('height', 'auto');
      main.item(0).style.setProperty('padding-top', '0');
    }
  }
  blockCloseFunc(name) {
    this.blockClose.emit(name);
  }
  selectedERGNButton(el: MouseEvent) {
    let items =  document.getElementsByClassName('button-choose') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < items.length; i++) {
      items.item(i).style.removeProperty('background-color');
    }
    (<HTMLElement>el.currentTarget).style.setProperty('background-color', '#ced0d1');
  }

}
