import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() otherComponent: boolean;
  @Input() itemOpen: boolean;
  @Output() blockClose = new EventEmitter();
  openBlock = true;
  height: number;
  width: number;
  check = false;
  checkNews = false;
  ngOnInit() {
    if (this.width > 1050) {
      let itemsMenu = document.getElementsByClassName('menuBlock')   as HTMLCollectionOf<HTMLElement>;
      itemsMenu.item(6).style.setProperty('border-top', '5px solid #821529');
      itemsMenu.item(6).style.setProperty('font-weight', 'bold');
    }
    this.onResize();
    this.width = document.documentElement.clientWidth;
    this.openBlock = this.otherComponent !== false;
    console.log(this.openBlock);
  }
  ngAfterViewInit() {
    this.onResize();
    if (document.documentElement.clientWidth < 650) {
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
      if (this.itemOpen === true) {
        let header = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
        header.item(0).style.setProperty('display', 'none');
        let mapbuttons = document.getElementsByClassName('map-buttons-tablet')   as HTMLCollectionOf<HTMLElement>;
        mapbuttons.item(0).style.setProperty('display', 'none');
        let uselessLine = document.documentElement.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
        uselessLine.item(0).style.setProperty('display', 'none');
        let arrows = document.documentElement.getElementsByClassName('arrows-mobile ') as HTMLCollectionOf<HTMLElement>;
        arrows.item(0).style.setProperty('display', 'none');
        let filter = document.getElementsByClassName('filters')   as HTMLCollectionOf<HTMLElement>;
        let main = document.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
        filter.item(0).style.setProperty('height', '100vh');
        main.item(0).style.setProperty('margin-top', '0');
        main.item(0).style.setProperty('height', 'auto');
      }
    }
  }
  blockCloseFunc(name) {
    this.blockClose.emit(name);
  }
  onResize() {
    let hei = document.getElementsByClassName('left-block')  as HTMLCollectionOf<HTMLElement>;
    let logo = document.getElementsByClassName('logo') as HTMLCollectionOf<HTMLElement>;
    let text = document.getElementsByClassName('text-block') as HTMLCollectionOf<HTMLElement>;
    let dark = document.getElementsByClassName('dark-layer') as HTMLCollectionOf<HTMLElement>;
    let height;
    if (document.documentElement.clientWidth > 650) {
      //   console.log('work ' + text.item(0).clientHeight + ' ' + logo.item(2).offsetHeight);
      //   console.log(logo);
      //  console.log(text);
      if (document.documentElement.clientWidth > 1050) {
        height = -text.item(0).clientHeight - logo.item(2).offsetHeight;
        logo.item(2).style.setProperty('top', '50px');
      } else {
        height = -text.item(0).clientHeight - logo.item(1).offsetHeight;
        logo.item(1).style.setProperty('top', '50px');
      }

      dark.item(0).style.setProperty('top', height + 'px');
      //  logo.item(2).style.setProperty('top', '50px');
      text.item(0).style.setProperty('top', '300px');
      this.height = hei.item(0).offsetHeight;
      this.width = hei.item(0).offsetWidth;
    }
  }

}
