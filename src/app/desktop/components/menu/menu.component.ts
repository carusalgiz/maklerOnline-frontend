import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import {Component, EventEmitter, OnInit, Output, Inject, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';
import { NgxMetrikaService } from '@kolkov/ngx-metrika';
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  userEmail = "email";
  days = "00дн.";
  time = "00ч.00мин.";
  loggedIn = false;
  redirect = false;
  text: any;
  agreement: any;
    subscription: any;
    siteUrl: any;

  @Output() updateItems = new EventEmitter();
    @Output() Logging = new EventEmitter();
    @Output() Paying = new EventEmitter();

  constructor(private ym: NgxMetrikaService, @Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute, config: ConfigService,
              private _offer_service: OfferService,
              private _account_service: AccountService) {
      this.siteUrl = config.getConfig('siteUrl');
  }

  ngOnInit() {
    this.checklogin();
    if (this.localStorage.getItem("days") != null && this.localStorage.getItem("time") != null) {
      this.days = this.localStorage.getItem("days");
      this.time = this.localStorage.getItem("time");
    }
    this.redirect = false;

    // document.addEventListener('mousewheel', function (event: WheelEvent) {
    //   let mapbuttons =  document.getElementsByClassName('map-buttons') as HTMLCollectionOf<HTMLElement>;
    //   let addobject =  document.getElementsByClassName('add-obj-ext') as HTMLCollectionOf<HTMLElement>;
    //   let history =  document.getElementsByClassName('history') as HTMLCollectionOf<HTMLElement>;
    //   let addr = document.getElementsByClassName('address-block') as HTMLCollectionOf<HTMLElement>;
    //   let mapbuttonstab =  document.getElementsByClassName('map-buttons-tablet') as HTMLCollectionOf<HTMLElement>;
    //   let items = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
    //   let uselessLine = document.getElementsByClassName('uselessLine')   as HTMLCollectionOf<HTMLElement>;
    //   let filters = document.getElementsByClassName('filters-menu-desktop')   as HTMLCollectionOf<HTMLElement>;
    //   let filter = document.getElementsByClassName('filters')   as HTMLCollectionOf<HTMLElement>;
    //   let scrollItems = document.getElementsByClassName('scroll-items open')   as HTMLCollectionOf<HTMLElement>;
    //   let filtersbox = document.getElementsByClassName('filters-box open')   as HTMLCollectionOf<HTMLElement>;
    //   let mainHome =  document.getElementsByClassName('mainHome')   as HTMLCollectionOf<HTMLElement>;
    //   let main = document.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
    //   let desk = document.getElementsByClassName('desk') as HTMLCollectionOf<HTMLElement>;
    //
    //   if ((event.deltaY  < 0)) {
    //     items.item(0).style.setProperty('top', '-130px');
    //     if (mainHome.length !== 0) {
    //       mainHome.item(0).style.setProperty('margin-top', '0');
    //     }
    //     uselessLine.item(0).style.setProperty('top', '0');
    //     uselessLine.item(0).style.setProperty('margin-bottom', '0');
    //     if (filters.length !== 0) {
    //       filters.item(0).style.setProperty('top', '0');
    //     }
    //     if (mapbuttons.length !== 0) {
    //       mapbuttons.item(0).style.setProperty('top', '0');
    //     }
    //     if (addobject.length !== 0) {
    //       addobject.item(0).style.setProperty('top', '0');
    //     }
    //     if (history.length !== 0) {
    //       history.item(0).style.setProperty('top', '0');
    //     }
    //     if (addr.length !== 0) {
    //       addr.item(0).style.setProperty('top', '0');
    //     }
    //     if (mapbuttonstab.length !== 0) {
    //       mapbuttonstab.item(0).style.setProperty('top', '0');
    //     }
    //     if (desk.length === 0 && filter.length !== 0) {
    //       filter.item(0).style.setProperty('height', 'calc(100vh - 65px)');
    //     }
    //     if (scrollItems.length !== 0) {
    //       scrollItems.item(0).style.setProperty('height', '100%');
    //     }
    //     if (filtersbox.length !== 0) {
    //       filtersbox.item(0).style.setProperty('height', 'calc(100% - 65px)');
    //     }
    //     if (main.length !== 0) {
    //       main.item(0).style.setProperty('height', 'calc(100vh - 65px)');
    //     }
    //   } else {
    //     items.item(0).style.setProperty('top', '0');
    //     if (uselessLine.length !== 0) {
    //       uselessLine.item(0).style.setProperty('top', '130px');
    //       uselessLine.item(0).style.setProperty('margin-bottom', '130px');
    //     }
    //     if (mainHome.length !== 0) {
    //       mainHome.item(0).style.setProperty('margin-top', '130px');
    //     }
    //     if (filters.length !== 0) {
    //       filters.item(0).style.setProperty('top', '130px');
    //     }
    //     if (mapbuttons.length !== 0) {
    //       mapbuttons.item(0).style.setProperty('top', '130px');
    //     }
    //     if (addobject.length !== 0) {
    //       addobject.item(0).style.setProperty('top', '130px');
    //     }
    //     if (history.length !== 0) {
    //       history.item(0).style.setProperty('top', '195px');
    //     }
    //     if (addr.length !== 0) {
    //       addr.item(0).style.setProperty('top', '130px');
    //     }
    //     if (mapbuttonstab.length !== 0) {
    //       mapbuttonstab.item(0).style.setProperty('top', '130px');
    //     }
    //     if (desk.length === 0 && filter.length !== 0) {
    //       filter.item(0).style.setProperty('height', 'calc(100vh - 195px)');
    //     }
    //     if (scrollItems.length !== 0) {
    //       scrollItems.item(0).style.setProperty('height', 'calc(100% - 130px)');
    //     }
    //     if (filtersbox.length !== 0) {
    //       filtersbox.item(0).style.setProperty('height', 'calc(100% - 130px)');
    //     }
    //     if (main.length !== 0) {
    //       main.item(0).style.setProperty('height', 'calc(100vh - 195px)');
    //     }
    //   }
    // });
  }
  update() {
    if (document.getElementById('filters-map-map1') != undefined) {
      this.updateItems.emit();
    }
  }
    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }
  checklogin() {
    this._account_service.checklogin().subscribe(res => {
      console.log(res);
      if (res != undefined) {
        let data = JSON.parse(JSON.stringify(res));
        if (data.result == 'success' ) {
          this.userEmail = data.email;
          this.loggedIn = true;
          this.Logging.emit("true");
        } else {
          this.log_out();
            this.Logging.emit("false");
        }
      } else {
        this.log_out();
          this.Logging.emit("false");
        console.log('not athorized!');
        return false;
      }
    });
  }
  log_out() {
    this.userEmail = "email";
    this.loggedIn = false;
    this.days = "0дн.";
    this.time = "00ч.00мин.";
    this._account_service.logout();
  }
  timeUpdate() {
    this.localStorage.setItem("days", this.days);
    this.localStorage.setItem("time", this.time);
    this.redirect = true;
  }
  openBlock(page) {
    let slide = document.getElementsByClassName('right-slide-box')   as HTMLCollectionOf<HTMLElement>;
    let useless = document.getElementsByClassName('uselessLine')   as HTMLCollectionOf<HTMLElement>;
    let header = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < slide.length; i++) {
      slide.item(i).style.setProperty('z-index', '100');
    }
    let items = document.getElementsByClassName('menuBlock')   as HTMLCollectionOf<HTMLElement>;
    switch (page) {
      case 'login':
        items.item(3).style.setProperty('border-top', '5px solid #821529');
        items.item(3).style.setProperty('font-weight', 'bold');
        slide.item(0).classList.add('open');
        slide.item(0).style.setProperty('z-index', '1500');
        if (useless.item(0).classList.contains('homePage')) {
          if (header.item(0).classList.contains('scroll')) {
            slide.item(0).style.setProperty('top', '0');
            slide.item(0).style.setProperty('height', '100vh');
          } else {
            slide.item(0).style.setProperty('top', '130px');
            slide.item(0).style.setProperty('height', 'calc(100vh - 130px)');
          }
        } else {
          if (useless.item(0).classList.contains('scroll')) {
            slide.item(0).style.setProperty('top', '65px');
            slide.item(0).style.setProperty('height', 'calc(100vh - 65px)');
          } else {
            slide.item(0).style.setProperty('top', '195px');
            slide.item(0).style.setProperty('height', 'calc(100vh - 195px)');
          }
        }
        break;
      case 'pay':
        items.item(2).style.setProperty('border-top', '5px solid #821529');
        items.item(2).style.setProperty('font-weight', 'bold');
        slide.item(1).classList.add('open');
        slide.item(1).style.setProperty('z-index', '1500');
        if (useless.item(0).classList.contains('homePage')) {
          if (header.item(0).classList.contains('scroll')) {
            slide.item(1).style.setProperty('top', '0');
            slide.item(1).style.setProperty('height', '100vh');
          } else {
            slide.item(1).style.setProperty('top', '130px');
            slide.item(1).style.setProperty('height', 'calc(100vh - 130px)');
          }
        } else {
          if (useless.item(0).classList.contains('scroll')) {
            slide.item(1).style.setProperty('top', '65px');
            slide.item(1).style.setProperty('height', 'calc(100vh - 65px)');
          } else {
            slide.item(1).style.setProperty('top', '195px');
            slide.item(1).style.setProperty('height', 'calc(100vh - 195px)');
          }
        }
        break;
    }
  }
  closeBlock(name) {
    let slide = document.getElementsByClassName('right-slide-box')   as HTMLCollectionOf<HTMLElement>;
    let items = document.getElementsByClassName('menuBlock')   as HTMLCollectionOf<HTMLElement>;
    switch (name) {
      case 'login':
        items.item(3).style.setProperty('border-top', 'none');
        items.item(3).style.setProperty('font-weight', 'normal');
        slide.item(0).classList.remove('open');
        break;
      case 'pay':
        items.item(2).style.setProperty('border-top', 'none');
        items.item(2).style.setProperty('font-weight', 'normal');
        slide.item(1).classList.remove('open');
        break;
      case 'agreement':
        slide.item(2).classList.remove('open');
        break;
      case 'addition':
        slide.item(3).classList.remove('open');
        break;
    }
  }
}
