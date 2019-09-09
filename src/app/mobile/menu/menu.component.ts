import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import {Component, OnInit, OnChanges, AfterViewInit, Output, EventEmitter, Input, Inject} from '@angular/core';
import {Item} from '../../item';
import {ActivatedRoute} from '@angular/router';
import {OfferService} from '../../services/offer.service';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnChanges, AfterViewInit {
  checkHome = false;
  mobileMenuActive = false;
  objectMenu = false;
  logged_in = false;
  user: any;
  name: any;
  userEmail = "email";
  days = "00дн.";
  time = "00ч.00мин.";
  redirect = false;
  text: any;
  agreement: any;

  innerBlockOpen = 'menu';
  @Input() blockOpenInput: String;
    @Input() headerPos: number;
  @Output() openMenu = new EventEmitter();
    @Output() blockClosed = new EventEmitter();
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute,
              private _offer_service: OfferService,
              private _account_service: AccountService) {}

  ngOnInit() {
    this.checklogin();
    if (this.localStorage.getItem("days") != null && this.localStorage.getItem("time") != null) {
      this.days = this.localStorage.getItem("days");
      this.time = this.localStorage.getItem("time");
    }

  }
  ngOnChanges() {
   // this.check();
  }
  ngAfterViewInit() {
    // this.checklogin();
  }

  menuOpen(mode) {
    this.openMenu.emit(mode);
  }
  addFunc(name) {
    let closeLogin = document.documentElement.getElementsByClassName('close-login') as HTMLCollectionOf<HTMLElement>;
    let closePay = document.documentElement.getElementsByClassName('close-pay') as HTMLCollectionOf<HTMLElement>;
    switch (name) {
      case 'login':
        closeLogin.item(0).classList.add('output');
        break;
      case 'pay':
        closePay.item(0).classList.add('output');
        break;
    }
  }
  closeFunc(name) {
    let add_block = document.documentElement.getElementsByClassName('add-block-menu') as HTMLCollectionOf<HTMLElement>;
    // let home = document.documentElement.getElementsByClassName('mainHome') as HTMLCollectionOf<HTMLElement>;
    let objects = document.documentElement.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
    // let menuMobile = document.documentElement.getElementsByClassName('menuMobile') as HTMLCollectionOf<HTMLElement>;
    let header = document.documentElement.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
    let bottomButtons = document.documentElement.getElementsByClassName('bottom-buttons1') as HTMLCollectionOf<HTMLElement>;
    let closeLogin = document.documentElement.getElementsByClassName('close-login') as HTMLCollectionOf<HTMLElement>;
    let closePay = document.documentElement.getElementsByClassName('close-pay') as HTMLCollectionOf<HTMLElement>;
    let closeAppl = document.documentElement.getElementsByClassName('proposal') as HTMLCollectionOf<HTMLElement>;
    let showItems = document.documentElement.getElementsByClassName('show-items') as HTMLCollectionOf<HTMLElement>;
    let hideMenu = document.documentElement.getElementsByClassName('hideMenu') as HTMLCollectionOf<HTMLElement>;
    // let mainHome = document.getElementsByClassName('mainHome')   as HTMLCollectionOf<HTMLElement>;
    if (hideMenu.length > 1) {
      hideMenu.item(0).classList.remove('exit-close');
      hideMenu.item(1).classList.add('exit-close');
    }
    if (showItems.length != 0) {
      showItems.item(0).style.setProperty('top', '90px');
    }

    if (closeLogin.length != 0 && closeLogin.item(0).classList.contains('output')) {
      name = 'login';
    } else if (closePay.length != 0  && closePay.item(0).classList.contains('output')) {
      name = 'pay';
    } else if (closeAppl.length != 0 && closeAppl.item(0).classList.contains('output')) {
      name = 'app';
    }
    console.log('func work ' + name);
    switch (name) {
      case 'login': {
        this.blockOpenInput = 'open_menu';
        this.innerBlockOpen = 'menu';
        this.openMenu.emit( "close_login");
        this.blockClosed.emit('close');
        this.menuOpen('close');
        // this.menuOpen('close');
        // mainHome.item(0).style.setProperty('display', 'block');
        // if (localStorage.getItem("logged_in") == null || localStorage.getItem("logged_in") != "true") {
        //   console.log('1');
        //   this.logged_in = false;
        //   this.upd = false;
        // } else {
        //   console.log('2');
        //   this.upd = true;
        // }
        //
        //   this.loginActive = false;
        // add_block.item(0).classList.add('close');
        // if (home.length != 0) {
        //   home.item(0).style.setProperty('display', 'flex');
        //   if (!header.item(0).classList.contains('output')) {
        //     // menuMobile.item(0).classList.add('open');
        //   } else {
        //     header.item(0).classList.remove('output');
        //   }
        //
        //   header.item(0).style.setProperty('display', 'flex');
        // } else if (objects.length != 0) {
        //   let mobileTopMenu = document.documentElement.getElementsByClassName('mobileTopMenu') as HTMLCollectionOf<HTMLElement>;
        //   if (mobileTopMenu.length != 0) {
        //     mobileTopMenu.item(0).style.setProperty('display', 'flex');
        //   }
        //   if (showItems.length != 0) {
        //     showItems.item(0).style.setProperty('display', 'flex');
        //   }
        //   if (bottomButtons.length != 0) {
        //     for (let i = 0; i < bottomButtons.length; i++) {
        //       bottomButtons.item(i).style.removeProperty('display');
        //     }
        //   }
        //   objects.item(0).style.setProperty('display', 'flex');
        //   objects.item(0).style.setProperty('padding-top', '97px');
        //   if (!header.item(0).classList.contains('output') && !closeLogin.item(0).classList.contains('output')) {
        //     // menuMobile.item(0).classList.add('open');
        //   } else {
        //     header.item(0).classList.remove('output');
        //     closeLogin.item(0).classList.remove('output');
        //   }
        //   header.item(0).style.setProperty('display', 'flex');
        // }
        // this.check();
        break;
      }
      case 'pay': {
        this.blockOpenInput = 'open_menu';
        this.innerBlockOpen = 'menu';
        this.openMenu.emit( "close_pay");
        // closePay.item(0).classList.remove('output');
        // this.payActive = false;
        // add_block.item(1).classList.add('close');
        // if (home.length != 0) {
        //   home.item(0).style.setProperty('display', 'flex');
        //   if (!header.item(0).classList.contains('output')) {
        //     menuMobile.item(0).classList.add('open');
        //   } else {
        //     header.item(0).classList.remove('output');
        //   }
        //   header.item(0).style.setProperty('display', 'flex');
        // } else if (objects.length != 0) {
        //   let mobileTopMenu = document.documentElement.getElementsByClassName('mobileTopMenu') as HTMLCollectionOf<HTMLElement>;
        //   if (mobileTopMenu.length != 0) {
        //     mobileTopMenu.item(0).style.setProperty('display', 'flex');
        //   }
        //   if (showItems.length != 0) {
        //     showItems.item(0).style.setProperty('display', 'flex');
        //   }
        //   if (bottomButtons.length != 0) {
        //     for (let i = 0; i < bottomButtons.length; i++) {
        //       bottomButtons.item(i).style.removeProperty('display');
        //     }
        //   }
        //   objects.item(0).style.setProperty('display', 'flex');
        //   objects.item(0).style.setProperty('padding-top', '97px');
        //   if (!header.item(0).classList.contains('output') && !closePay.item(0).classList.contains('output')) {
        //     menuMobile.item(0).classList.add('open');
        //   } else {
        //     header.item(0).classList.remove('output');
        //     closeLogin.item(0).classList.remove('output');
        //   }
        //   header.item(0).style.setProperty('display', 'flex');
        // }
        break;
      }
      case 'app': {
        closeAppl.item(0).classList.remove('output');
        add_block.item(2).classList.add('close');
        if (objects.length != 0) {
          if (showItems.length != 0) {
            showItems.item(0).style.setProperty('display', 'flex');
          }
          if (bottomButtons.length != 0) {
            for (let i = 0; i < bottomButtons.length; i++) {
              bottomButtons.item(i).style.removeProperty('display');
            }
          }
          objects.item(0).style.setProperty('display', 'flex');
          objects.item(0).style.setProperty('padding-top', '97px');
          header.item(0).style.setProperty('display', 'flex');
        }
        break;
      }
      case 'agreement': {
        this.blockOpenInput = 'open_menu';
        this.innerBlockOpen = 'menu';
        this.openMenu.emit( "close_agreement");
        // add_block.item(3).classList.add('close');
        // mainHome.item(0).style.setProperty('display', 'block');
        break;
      }
      default: {
        console.log('default');
        break;
      }
    }
  }
  homePageOpen(check) {
    this.checkHome = check;
  }
  closeButtons() {
    let mapButtons =  document.getElementsByClassName('map-buttons-tablet') as HTMLCollectionOf<HTMLElement>;
    if (mapButtons.length !== 0) {
      mapButtons.item(0).style.setProperty('display', ' none');
    }
  }
  displayMenu(mode) {
    let home = document.documentElement.getElementsByClassName('mainHome') as HTMLCollectionOf<HTMLElement>;
    let objects = document.documentElement.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
    let header = document.documentElement.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
    let mobileMenu = document.getElementsByClassName('menuMobile')   as HTMLCollectionOf<HTMLElement>;
    if (mode === 'show') {
      header.item(0).style.setProperty('display', 'none');
      mobileMenu.item(0).classList.add('open');
      if (home.length != 0) {
        home.item(0).style.setProperty('display', 'none');
      } else if (objects.length != 0) {
        objects.item(0).style.setProperty('display', 'none');
      }
    } else if (mode === 'hide') {
      let add_block = document.documentElement.getElementsByClassName('add-block-menu') as HTMLCollectionOf<HTMLElement>;
      add_block.item(0).classList.add('close');
      add_block.item(1).classList.add('close');
      header.item(0).style.setProperty('display', 'flex');
      mobileMenu.item(0).classList.remove('open');
      if (home.length != 0) {
        home.item(0).style.setProperty('display', 'flex');
      } else if (objects.length != 0) {
        objects.item(0).style.setProperty('display', 'flex');
      }
    }

  }
  // selectedMapButtonTab(el: MouseEvent, param) {
  //   let items =  document.getElementsByClassName('map-button-mobile') as HTMLCollectionOf<HTMLElement>;
  //   let items1 =  document.getElementsByClassName('map-button-word-mobile') as HTMLCollectionOf<HTMLElement>;
  //   for (let i = 0; i < items.length; i++) {
  //     items.item(i).style.removeProperty('background-color');
  //     items1.item(i).style.removeProperty('border-bottom');
  //   }
  //   (<HTMLElement>el.currentTarget).style.setProperty('background-color', 'rgba(38,47,50,1)');
  //   (<HTMLElement>(<HTMLElement>el.currentTarget).firstChild).style.setProperty('border-bottom', '1px solid white');
  //   let map1 = document.getElementsByClassName('filters-map') as HTMLCollectionOf<HTMLElement>;
  //
  //   switch (param) {
  //     case "map":
  //       if (map1.length != 0) {
  //         map1.item(0).classList.add('open');
  //         map1.item(1).classList.remove('open');
  //       }
  //       break;
  //     case 'panorama':
  //       if (map1.length != 0) {
  //         map1.item(0).classList.remove('open');
  //         map1.item(1).classList.add('open');
  //       }
  //       break;
  //   }
  // }
  //
  // exit() {
  //   this.upd = false;
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('name');
  //   localStorage.removeItem('logged_in');
  //   this.logged_in = false;
  //   let exit = document.documentElement.getElementsByClassName('exit') as HTMLCollectionOf<HTMLElement>;
  //   exit.item(0).classList.remove('close');
  //   exit.item(1).classList.add('close');
  //   let contact = document.documentElement.getElementsByClassName('contact-menu-info') as HTMLCollectionOf<HTMLElement>;
  //   contact.item(0).classList.remove('close');
  //   contact.item(1).classList.add('close');
  // }
  log_out() {
    this.userEmail = "email";
    this.logged_in = false;
    this.days = "0дн.";
    this.time = "00ч.00мин.";
    this._account_service.logout();
  }
  checklogin() {
    this._account_service.checklogin().subscribe(res => {
      console.log(res);
      if (res != undefined) {
        let data = JSON.parse(JSON.stringify(res));
        // console.log(data.result);
        // console.log(data.user_id);
        // console.log(data.email);
        if (data.result == 'success' ) {
          this.userEmail = data.email;
          this.logged_in = true;
        } else {
          this.log_out();
        }
      } else {
        this.log_out();
        console.log('not athorized!');
        return false;
      }
    });
  }
  openBlock(pay: string) {
    // let add_block = document.documentElement.getElementsByClassName('add-block-menu') as HTMLCollectionOf<HTMLElement>;
    // let home = document.documentElement.getElementsByClassName('mainHome') as HTMLCollectionOf<HTMLElement>;
    // let objects = document.documentElement.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
    // let menuMobile = document.documentElement.getElementsByClassName('menuMobile') as HTMLCollectionOf<HTMLElement>;
    // let header = document.documentElement.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
    // let bottomButtons = document.documentElement.getElementsByClassName('bottom-buttons1') as HTMLCollectionOf<HTMLElement>;
    //
    // let closeLogin = document.documentElement.getElementsByClassName('close-login') as HTMLCollectionOf<HTMLElement>;
    // let closePay = document.documentElement.getElementsByClassName('close-pay') as HTMLCollectionOf<HTMLElement>;

    let hideMenu = document.documentElement.getElementsByClassName('hideMenu') as HTMLCollectionOf<HTMLElement>;
    if (hideMenu.length > 1) {
      hideMenu.item(1).classList.remove('exit-close');
      hideMenu.item(0).classList.add('exit-close');
    }

    switch (pay) {
      case 'login':
        this.blockOpenInput = 'open_login';
        this.innerBlockOpen = 'login';
        this.menuOpen('open');
      //   let continueButton = document.documentElement.getElementsByClassName('loginButton') as HTMLCollectionOf<HTMLElement>;
      //   if (localStorage.getItem("logged_in") != null && localStorage.getItem("logged_in") == "true") {
      //       continueButton.item(0).classList.add('close');
      //     continueButton.item(1).classList.remove('close');
      //   } else {
      //     continueButton.item(1).classList.add('close');
      //     continueButton.item(0).classList.remove('close');
      //   }
      // //  closeLogin.item(0).classList.add('output');
      //   this.smth = 'login';
      //   this.loginActive = true;
      //   this.payActive = false;
      //  add_block.item(0).classList.remove('close');
      //   add_block.item(1).classList.add('close');
      //   add_block.item(2).classList.add('close');
      //   header.item(0).style.setProperty('display', 'flex');
      //   header.item(0).style.setProperty('top', '0');
      //   if (home.length != 0 && menuMobile.length != 0) {
      //     home.item(0).style.setProperty('display', 'none');
      //     menuMobile.item(0).classList.remove('open');
      //   } else if (objects.length != 0 && menuMobile.length != 0) {
      //     objects.item(0).style.setProperty('display', 'none');
      //     menuMobile.item(0).classList.remove('open');
      //     let mobileTopMenu = document.documentElement.getElementsByClassName('mobileTopMenu') as HTMLCollectionOf<HTMLElement>;
      //     if (mobileTopMenu.length != 0) {
      //       mobileTopMenu.item(0).style.setProperty('display', 'none');
      //     }
      //     let showItems =  document.documentElement.getElementsByClassName('show-items') as HTMLCollectionOf<HTMLElement>;
      //     if (showItems.length != 0) {
      //       showItems.item(0).style.setProperty('display', 'none');
      //     }
      //   }
      //   if (bottomButtons.length != 0) {
      //     for (let i = 0; i < bottomButtons.length; i++) {
      //       bottomButtons.item(i).style.setProperty('display', 'none');
      //     }
      //   }
        break;
      case 'pay':
      //  closePay.item(0).classList.add('output');
        this.blockOpenInput = 'open_pay';
        this.innerBlockOpen = 'pay';
        this.menuOpen('open');
       //  this.smth = 'pay';
       //  this.payActive = true;
       //  this.loginActive = false;
       // add_block.item(1).classList.remove('close');
       //  add_block.item(0).classList.add('close');
       //  add_block.item(2).classList.add('close');
       //  header.item(0).style.setProperty('display', 'flex');
       //  header.item(0).style.setProperty('top', '0');
       //  if (home.length != 0 && menuMobile.length != 0) {
       //    home.item(0).style.setProperty('display', 'none');
       //
       //    menuMobile.item(0).classList.remove('open');
       //  } else if (objects.length != 0 && menuMobile.length != 0) {
       //    objects.item(0).style.setProperty('display', 'none');
       //    menuMobile.item(0).classList.remove('open');
       //    let mobileTopMenu = document.documentElement.getElementsByClassName('mobileTopMenu') as HTMLCollectionOf<HTMLElement>;
       //    if (mobileTopMenu.length != 0) {
       //      mobileTopMenu.item(0).style.setProperty('display', 'none');
       //    }
       //    let showItems =  document.documentElement.getElementsByClassName('show-items') as HTMLCollectionOf<HTMLElement>;
       //    if (showItems.length != 0) {
       //      showItems.item(0).style.setProperty('display', 'none');
       //    }
       //  }
       //  if (bottomButtons.length != 0) {
       //    for (let i = 0; i < bottomButtons.length; i++) {
       //      bottomButtons.item(i).style.setProperty('display', 'none');
       //    }
       //  }
        break;
    }
  }
}
