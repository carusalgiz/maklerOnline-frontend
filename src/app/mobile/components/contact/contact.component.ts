import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit, Inject} from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit {

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, ) { }

  @Input() size;
  @Input() fullItem: boolean;
  @Input() itemOpen: boolean;
  @Output() checkPay = new EventEmitter();
  @Output() blockClose = new EventEmitter();
  check = false;
  width: number;
  checkNews = false;
  ngOnInit() {
    this.width = document.documentElement.clientWidth;
  }
  ngAfterViewInit() {
    if (this.itemOpen === true) {
      let main = document.getElementsByClassName('main-objects')   as HTMLCollectionOf<HTMLElement>;
      main.item(0).style.setProperty('margin-top', '0');
    }
  }
  blockCloseFunc(name) {
    this.blockClose.emit(name);
  }
  checkFunc() {
    let add_block = document.documentElement.getElementsByClassName('add-block-menu') as HTMLCollectionOf<HTMLElement>;
    let objects = document.documentElement.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
    let header = document.documentElement.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
    let bottomButtons = document.documentElement.getElementsByClassName('bottom-buttons') as HTMLCollectionOf<HTMLElement>;
    let mobileTopMenu = document.documentElement.getElementsByClassName('mobileTopMenu') as HTMLCollectionOf<HTMLElement>;
    if (mobileTopMenu.length != 0) {
      mobileTopMenu.item(0).style.setProperty('display', 'none');
    }
    let showItems =  document.documentElement.getElementsByClassName('show-items') as HTMLCollectionOf<HTMLElement>;
    if (showItems.length != 0) {
      showItems.item(0).style.setProperty('display', 'none');
    }
    if (this.localStorage.getItem("logged_in") != null && this.localStorage.getItem("logged_in") == "true") {
      add_block.item(1).classList.remove('close');
      objects.item(0).style.setProperty('display', 'none');
      header.item(0).style.setProperty('display', 'none');
      if (bottomButtons.length != 0) {
        for (let i = 0; i < bottomButtons.length; i++) {
          bottomButtons.item(i).style.setProperty('display', 'none');
        }
      }
      header.item(0).classList.add('output');
    } else {
      add_block.item(0).classList.remove('close');
      objects.item(0).style.setProperty('display', 'none');
      header.item(0).style.setProperty('display', 'none');
      header.item(0).classList.add('output');
      if (bottomButtons.length != 0) {
        for (let i = 0; i < bottomButtons.length; i++) {
          bottomButtons.item(i).style.setProperty('display', 'none');
        }
      }
    }
    // } else {
    //   this.showContact();
    // }
  }
}
