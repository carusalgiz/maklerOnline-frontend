import { Component, OnInit, AfterViewInit } from '@angular/core';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private _offer_service: OfferService,
              private _account_service: AccountService) { }

  width: number;
  countObjects = 0;
  countTodayObjects = 0;
  facebook = false;
  vk = false;
  odnokl = false;
  menuOpen = false;
    touchStartPos: any;
    headerPos:any;
  blockOpen = 'open_menu';
  ngOnInit() {
    this.width = document.documentElement.clientWidth;
    this.get_list();
  }
  ngAfterViewInit() {
    let picture = document.getElementsByClassName('picture')   as HTMLCollectionOf<HTMLElement>;
    let mainHome = document.getElementsByClassName('mainHome')   as HTMLCollectionOf<HTMLElement>;
    let logotitle2 = document.getElementsByClassName('logoTitle2')   as HTMLCollectionOf<HTMLElement>;
      picture.item(0).style.setProperty('height', (document.documentElement.clientHeight - 10) + 'px');
      logotitle2.item(0).style.setProperty('top', (document.documentElement.clientHeight * 0.6) + 25 + 'px');
      mainHome.item(0).style.setProperty('background-size', 'auto ' + (document.documentElement.clientHeight + 100) + 'px');
      let header = document.documentElement.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
      header.item(0).style.setProperty('top', '0');
  }
  openMobileMenu() {
    let mobileMenu = document.getElementsByClassName('menuMobile')   as HTMLCollectionOf<HTMLElement>;
    mobileMenu.item(0).classList.add('open');
    let mainHome = document.getElementsByClassName('mainHome')   as HTMLCollectionOf<HTMLElement>;
    mainHome.item(0).style.setProperty('display', 'none');
  }
  openBlock(name) {
    let add_block = document.documentElement.getElementsByClassName('add-block-menu') as HTMLCollectionOf<HTMLElement>;
    let mainHome = document.getElementsByClassName('mainHome')   as HTMLCollectionOf<HTMLElement>;
    switch (name) {
      case 'agreement':
        this.blockOpen = 'open_agreement';
        break;
      case 'login':
        this.blockOpen = 'open_login';
        this.menuOpen = true;
        break;
    }
  }
  menuMode(mode) {
    if (mode == 'open') {
      this.menuOpen = true;
    }
    if (mode == 'close') {
      this.menuOpen = false;
    }
  }
    touchstart(event:TouchEvent) {
        this.touchStartPos = event.changedTouches[0].clientY;
    }
    touchend(event:TouchEvent) {
        let num = this.touchStartPos - event.changedTouches[0].clientY;
        if (num > 0) {
            this.headerPos = -90;
        } else {
            this.headerPos = 0;
        }
        // console.log(event.changedTouches);
    }
  get_list() {
    this.countObjects = 0;
    this._offer_service.list(1, 1, '', '', '', '').subscribe(offers => {
      this.countObjects = offers.length;
      let data = Math.floor((new Date()).getTime() / 1000);
      for (let offer of offers) {
        let time = offer.addDate;
        // console.log('time: ' + time + ' cur: ' + mil);
        if (data - time < 86400) {
          this.countTodayObjects++;
        }
      }
    });
  }
}
