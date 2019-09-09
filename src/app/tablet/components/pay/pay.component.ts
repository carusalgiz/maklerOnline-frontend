import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() otherComponent: boolean;
  @Input() itemOpen: boolean;
  @Output() blockClose = new EventEmitter();
  height: number;
  openBlock = true;
  manager = false;
  access = false;
  publish = false;
  makler = false;
  width: number;
  ngOnInit() {
    let itemsMenu = document.getElementsByClassName('menuBlock')   as HTMLCollectionOf<HTMLElement>;
    itemsMenu.item(5).style.setProperty('border-top', '5px solid #821529');
    itemsMenu.item(5).style.setProperty('font-weight', 'bold');
    this.onResize();
    this.width = document.documentElement.clientWidth;
    if (this.otherComponent === false) {
      this.openBlock = false;
    } else {
      this.openBlock = true;
    }
    console.log(this.openBlock);
  }
  ngAfterViewInit() {
    if (this.itemOpen !== true) {
      let buttons1 = document.getElementsByClassName('button1')   as HTMLCollectionOf<HTMLElement>;
      let buttons2 = document.getElementsByClassName('button2')   as HTMLCollectionOf<HTMLElement>;
      if (buttons1.length !== 0) {
        buttons1.item(0).classList.remove('open');
      }
      if (buttons2.length !== 0) {
        buttons2.item(0).classList.remove('open');
        buttons2.item(1).classList.remove('open');
      }
      let mobileMenu = document.getElementsByClassName('mobileTopMenu')   as HTMLCollectionOf<HTMLElement>;
      mobileMenu.item(0).style.setProperty('display', 'none');
    }
    if (this.itemOpen === true && this.width < 1050) {
      let header = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
      header.item(0).style.setProperty('display', 'none');
      let mapbuttons = document.getElementsByClassName('map-buttons-tablet')   as HTMLCollectionOf<HTMLElement>;
      mapbuttons.item(0).style.setProperty('display', 'none');
      let uselessLine = document.documentElement.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
      uselessLine.item(0).style.setProperty('display', 'none');
      //   header.item(0).style.setProperty('top', '0');
      let arrows = document.documentElement.getElementsByClassName('arrows-mobile ') as HTMLCollectionOf<HTMLElement>;
      arrows.item(0).style.setProperty('display', 'none');
      let filter = document.getElementsByClassName('filters')   as HTMLCollectionOf<HTMLElement>;
      let main = document.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
      filter.item(0).style.setProperty('height', '100vh');
      main.item(0).style.setProperty('height', 'auto');
      main.item(0).style.setProperty('margin-top', '0');
    }
  }
  blockCloseFunc(name) {
    this.blockClose.emit(name);
  }
  onResize() {
    let hei = document.getElementsByClassName('left-block')  as HTMLCollectionOf<HTMLElement>;
    let blocks = document.getElementsByClassName('two-text-blocks')  as HTMLCollectionOf<HTMLElement>;
    let logo = document.getElementsByClassName('logo') as HTMLCollectionOf<HTMLElement>;
    let dark = document.getElementsByClassName('dark-layer') as HTMLCollectionOf<HTMLElement>;
    let height;
    if (blocks.length !== 0 && logo.length > 2) {
      height = -blocks.item(0).offsetHeight - blocks.item(1).offsetHeight - logo.item(2).offsetHeight;
      dark.item(0).style.setProperty('top', height + 'px');
    }
    this.height = hei.item(0).offsetHeight;
  }

}
