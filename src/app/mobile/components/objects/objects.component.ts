import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { Component, OnInit, AfterViewInit , Inject} from '@angular/core';
import {Subscription} from 'rxjs';
import {Item} from '../../../item';
import {ActivatedRoute, Router} from '@angular/router';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';

@Component({
  selector: 'app-objects',
  templateUrl: './objects.component.html',
  styleUrls: ['./objects.component.css']
})
export class ObjectsComponent implements OnInit, AfterViewInit  {

  private subscription: Subscription;
  initCoords = [48.4862268, 135.0826369];
  initZoom = 15;
  mapBig = false;
  public map: any;
  blockMode = 'items';
  desktopOpen = false;
  items: Item[] = [];
  item: Item;
  filters: any;
  sort: any;
  pages: any[] = [];
  historyItems: any[] = [];
  itemsActive: boolean;
  filtersInnerActive: boolean;
  itemOpen = false;
  watched: boolean;
  filtersMenuActive: boolean;
  timeAdd: any;
  filtersActive = true;
  mapActive = true;
  mobile = false;
  watchedItems: any[] = [];
  time: any[] = [];
  favouriteList: any[] = [];
  loginActive = false;
  contactActive = false;
  payActive = false;
  mapOpen = false;
  historyActive = false;
  ergnActive = false;
  shortversion = false;
  historyPrev: string;
  sendMailButton = false;
  food: any[] = [];
  education: any[] = [];
  fitness: any[] = [];
  medicine: any[] = [];
  entertainment: any[] = [];
  parking: any[] = [];
  equipment: any;
  coordsPolygon: any[] = [];
  countOfItems: any;
  blockInputOpen = 'open_menu';
  current = 0;
  y: number;
  width: number;
  mobileItemOpen = false;
  lat = 48.4862268;
  lng = 135.0826369;
  activeButton: string;
  menuOpen = false;
  logged_in = false;
  bottomPxButton: any;
  headerPos:any;
  touchStartPos: any; mainObjectsPadding: any;
  styles = [
    {
      'featureType': 'landscape',
      'stylers': [
        {
          'color': '#f0f0f0'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#cceab0'
        }
      ]
    },
    {
      'featureType': 'road.local',
      'stylers': [
        {
          'color': '#ffffff'
        }
      ]
    },
    {
      'featureType': 'water',
      'stylers': [
        {
          'color': '#87c2f8'
        }
      ]
    }
  ];
  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute, private router: Router,
              private _offer_service: OfferService,
              private _account_service: AccountService) {
    this.subscription = route.params.subscribe((urlParams) => {
      if (urlParams['mode'] === 'list') {
        this.blockMode = 'items';
        this.activeButton = 'items';
          this.itemOpen = false;
        window.scrollTo(0, 0);
          this.filtersInnerActive = false;
        let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        if (filters.length !== 0) {
            filters.item(0).style.setProperty('display', 'flex');
        }
      } else {
        this.itemsActive = false;
          this.itemOpen = true;
          this.blockMode = 'item';
          this.blockInputOpen = 'close_menu';
          this.activeButton = 'obj';
          let str = ''; str = urlParams['mode'];
          this._offer_service.list(1, 1, '', '', '', '').subscribe(offers => {
              for (let offer of offers) {
                  if (Number.parseInt(str.substring(0, 13)) == offer.id) {
                      this.item = offer;
                  }
              }
          });
      }
    });
  }

  ngOnInit() {
    this.checklogin();
    if ((this.item === undefined || this.item === null) && this.itemOpen === true) {
      this.itemOpen = false;
      this.filtersInnerActive = true;
      this.filtersActive = true;
    }
    this.pages = [];
    this.width = document.documentElement.clientWidth;
    const heightMobile = document.documentElement.clientHeight;
    let scrollItems = document.getElementsByClassName('scroll-items open')  as HTMLCollectionOf<HTMLElement>;
    let filtersBox = document.getElementsByClassName('app-filters-box')  as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < scrollItems.length; i++) {
        scrollItems.item(i).style.setProperty('height', heightMobile - 60 + 'px');
      }
      for (let i = 0; i < filtersBox.length; i++) {
        filtersBox.item(i).style.setProperty('height', heightMobile - 60 + 'px');
      }
  }
  ngAfterViewInit() {

  //  this.items.push(new Item(0,'Байкальская','13',30000,3,5,9,60, '../../../../assets/noph.png'));
  //  this.items.push(new Item(0,'Иртышский переулок','8А',30000,3,5,9,60, '../../../../assets/noph.png'));
  //  this.items.push(new Item(0,'Засыпной переулок','7',30000,3,5,9,60, '../../../../assets/noph.png'));
    // let uselessLine = document.getElementsByClassName('uselessLine')   as HTMLCollectionOf<HTMLElement>;
    this.get_list();
    let header = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
    header.item(0).style.setProperty('z-index', '8');
    if ((this.item === undefined || this.item === null) && this.itemOpen === true) {
      this.filtersInnerActive = true;
      // uselessLine.item(0).classList.remove('homePage');
    }
      // uselessLine.item(0).style.setProperty('top', '90px');
      header.item(0).style.setProperty('top', '0');
    if (this.itemsActive || this.filtersInnerActive) {
      let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
      filters.item(0).style.setProperty('display', 'flex');
    }
    if (this.itemsActive) {
      this.chooseMenuButton(0);
    } else if (this.filtersInnerActive) {
      this.chooseMenuButton(1);
    } else if (this.historyActive) {
      this.chooseMenuButton(2);
    }
    // this.changeSize();
    if (sessionStorage.length !== 0) {
      this.watchedItems = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        this.watchedItems.push(Number(sessionStorage.key(i)));
      }
    }
      // let line = document.documentElement.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
      // line.item(0).classList.remove('homePage');
  }
    touchstart(event:TouchEvent) {
      this.touchStartPos = event.changedTouches[0].clientY;
    }
    touchend(event:TouchEvent) {
        let num = this.touchStartPos - event.changedTouches[0].clientY;
        this.bottomPxButton = num > 0 ? -80 : 30;
        if (num > 0) {
            this.headerPos = -90;
            this.mainObjectsPadding = 55;
        } else {
            this.headerPos = 0;
            this.mainObjectsPadding = 95;
        }
        // console.log(event.changedTouches);
    }
  checkClick(index, obj, event) {
      let  komn = '';
      if (obj.roomsCount != undefined) {
          komn = '-' + obj.roomsCount + '-komn';
      }
      switch (obj.typeCode) {
          case 'room':
              this.router.navigate(['./m/objects', obj.id + '-arenda-komnaty-bez-posrednikov']).
              then( () => { console.log('redirect to ' + obj.id); });
              break;
          case 'apartment':
              this.router.navigate(['./m/objects', obj.id + '-arenda' + komn + '-kvartiry-bez-posrednikov']).
              then( () => { console.log('redirect to ' + obj.id); });
              break;
          case 'house':
              this.router.navigate(['./m/objects', obj.id + '-arenda' + komn + '-doma-bez-posrednikov']).
              then( () => { console.log('redirect to ' + obj.id); });
              break;
          case 'dacha':
              this.router.navigate(['./m/objects', obj.id + '-arenda' + komn + '-dachi-bez-posrednikov']).
              then( () => { console.log('redirect to ' + obj.id); });
              break;
          case 'cottage':
              this.router.navigate(['./m/objects', obj.id + '-arenda' + komn + '-kottedzha-bez-posrednikov']).
              then( () => { console.log('redirect to ' + obj.id); });
              break;
      }

      if (!event.target.classList.contains('starFav') && !event.target.classList.contains('starImg')) {
      this.blockMode = 'item';
      this.checklogin();
      console.log("blockMode:" + this.blockMode + " logged_in:" + this.logged_in + " timeAdd:" + this.timeAdd);
      this.blockInputOpen = 'open_menu';
      this.getObj(index);
      this.item = obj;
      this.mobileItemFunc();
      document.documentElement.scrollTo(0, 0);
    }

  }

  setContactPos(e) {
    this.y = e;
  }
  getFiltersClicked(e) {
    this.sendMailButton = e > 1;
  }
  showContact() {
    console.log('contact ' + this.y);
    this.window.scrollTo(0, this.y - 165);
  }
  mobileItemFunc() {
    this.activeButton = 'item';
    this.shortversion = true;
    this.mapActive = false;
    this.mobileItemOpen = true;
    this.itemOpen = true;
    this.historyActive = false;
      let TopMenuButton =  document.getElementsByClassName('TopMenu-button-tablet') as HTMLCollectionOf<HTMLElement>;
      let TopMenuWord =  document.getElementsByClassName('TopMenu-button-word-tablet') as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < TopMenuButton.length; i++) {
        TopMenuButton.item(i).style.removeProperty('background-color');
        TopMenuButton.item(i).style.removeProperty('color');
        TopMenuButton.item(i).style.removeProperty('border-top');
        TopMenuWord.item(i).style.removeProperty('border-bottom');
      }
  }
  chooseMenuButton(index) {
//    let TopMenuWord =  document.getElementsByClassName('TopMenu-button-word-tablet') as HTMLCollectionOf<HTMLElement>;
//     let iconImg = document.getElementsByClassName('iconImg') as HTMLCollectionOf<HTMLElement>;
//     for (let i = 0; i < iconImg.length; i++) {
      // iconImg.item(i).style.removeProperty('background');
//      TopMenuWord.item(i).style.removeProperty('border-bottom');

    // }
    // iconImg.item(index).style.setProperty('background', 'white');
//    TopMenuWord.item(index).style.setProperty('border-bottom', '1px solid white');
  }
  openHeaderAfterPage() {
    let header = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
    header.item(0).style.setProperty('z-index', '8');
    // let uselessLine = document.documentElement.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
    // uselessLine.item(0).style.setProperty('display', 'block');
    let arrows = document.documentElement.getElementsByClassName('arrows-mobile ') as HTMLCollectionOf<HTMLElement>;
    arrows.item(0).style.setProperty('display', 'flex');
  }
  setFilters(filters) {
    this.filters = filters;
  }
  setSort(sort) {
    this.sort = sort;
  }
  setEquipment(equipment) {
    this.equipment = equipment;
    // this.get_list();
  }
  close(name) {
    console.log('func work ' + name);
    switch (name) {
      case 'login': {
        this.loginActive = false;
        this.mobileItemOpen = true;
        this.itemOpen = true;
        this.desktopOpen = true;
        this.openHeaderAfterPage();
        break;
      }
      case 'contact': {
        this.contactActive = false;
        this.mobileItemOpen = true;
        this.itemOpen = true;
        this.desktopOpen = true;
        this.openHeaderAfterPage();
        break;
      }
      case 'pay': {
        this.payActive = false;
        this.mobileItemOpen = true;
        this.itemOpen = true;
        this.desktopOpen = true;
        this.openHeaderAfterPage();
        break;
      }
      case 'egrn': {
        this.ergnActive = false;
        this.mobileItemOpen = true;
        this.itemOpen = true;
        this.desktopOpen = true;
        this.openHeaderAfterPage();
        break;
      }
      default: {
        console.log('default');
        break;
      }
    }
  }
  // openBlock(pay: string) {
  //   let add_block = document.documentElement.getElementsByClassName('add-block-menu') as HTMLCollectionOf<HTMLElement>;
  //   let home = document.documentElement.getElementsByClassName('mainHome') as HTMLCollectionOf<HTMLElement>;
  //   let objects = document.documentElement.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
  //   let menuMobile = document.documentElement.getElementsByClassName('menuMobile') as HTMLCollectionOf<HTMLElement>;
  //   let header = document.documentElement.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
  //   let bottomButtons = document.documentElement.getElementsByClassName('bottom-buttons1') as HTMLCollectionOf<HTMLElement>;
  //   let closeLogin = document.documentElement.getElementsByClassName('close-login') as HTMLCollectionOf<HTMLElement>;
  //   let closePay = document.documentElement.getElementsByClassName('close-pay') as HTMLCollectionOf<HTMLElement>;
  //   let hideMenu = document.documentElement.getElementsByClassName('hideMenu') as HTMLCollectionOf<HTMLElement>;
  //   let rightmain = document.documentElement.getElementsByClassName('right-main') as HTMLCollectionOf<HTMLElement>;
  //   if (hideMenu.length > 1) {
  //     hideMenu.item(1).classList.remove('exit-close');
  //     hideMenu.item(0).classList.add('exit-close');
  //   }
  //   for (let i = 0; i < rightmain.length ; i++) {
  //     rightmain.item(i).style.setProperty('top', '97px');
  //   }
  //
  //   switch (pay) {
  //     case 'app': {
  //       let closeAppl = document.documentElement.getElementsByClassName('proposal') as HTMLCollectionOf<HTMLElement>;
  //       closeAppl.item(0).classList.add('output');
  //       add_block.item(2).classList.remove('close');
  //       objects.item(0).style.setProperty('display', 'none');
  //       header.item(0).style.setProperty('top', '0');
  //       let showItems =  document.documentElement.getElementsByClassName('show-items') as HTMLCollectionOf<HTMLElement>;
  //       if (showItems.length != 0) {
  //         showItems.item(0).style.setProperty('display', 'none');
  //       }
  //       if (bottomButtons.length != 0) {
  //         for (let i = 0; i < bottomButtons.length; i++) {
  //           bottomButtons.item(i).style.setProperty('display', 'none');
  //         }
  //       }
  //       break;
  //     }
  //     case 'login':
  //       add_block.item(0).classList.remove('close');
  //       add_block.item(1).classList.add('close');
  //       closeLogin.item(0).classList.add('output');
  //       header.item(0).style.setProperty('top', '0');
  //       if (home.length != 0 && menuMobile.length != 0) {
  //         home.item(0).style.setProperty('display', 'none');
  //         menuMobile.item(0).classList.remove('open');
  //         header.item(0).style.setProperty('display', 'flex');
  //       } else if (objects.length != 0 && menuMobile.length != 0) {
  //         objects.item(0).style.setProperty('display', 'none');
  //         menuMobile.item(0).classList.remove('open');
  //         header.item(0).style.setProperty('display', 'flex');
  //         let mobileTopMenu = document.documentElement.getElementsByClassName('mobileTopMenu') as HTMLCollectionOf<HTMLElement>;
  //         if (mobileTopMenu.length != 0) {
  //           mobileTopMenu.item(0).style.setProperty('display', 'none');
  //         }
  //         let showItems =  document.documentElement.getElementsByClassName('show-items') as HTMLCollectionOf<HTMLElement>;
  //         if (showItems.length != 0) {
  //           showItems.item(0).style.setProperty('display', 'none');
  //         }
  //       }
  //       if (bottomButtons.length != 0) {
  //         for (let i = 0; i < bottomButtons.length; i++) {
  //           bottomButtons.item(i).style.setProperty('display', 'none');
  //         }
  //       }
  //       break;
  //     case 'pay':
  //       closePay.item(0).classList.add('output');
  //       add_block.item(1).classList.remove('close');
  //       add_block.item(0).classList.add('close');
  //       header.item(0).style.setProperty('top', '0');
  //       if (home.length != 0 && menuMobile.length != 0) {
  //         home.item(0).style.setProperty('display', 'none');
  //         header.item(0).style.setProperty('display', 'flex');
  //         menuMobile.item(0).classList.remove('open');
  //       } else if (objects.length != 0 && menuMobile.length != 0) {
  //         objects.item(0).style.setProperty('display', 'none');
  //         menuMobile.item(0).classList.remove('open');
  //         header.item(0).style.setProperty('display', 'flex');
  //         let mobileTopMenu = document.documentElement.getElementsByClassName('mobileTopMenu') as HTMLCollectionOf<HTMLElement>;
  //         if (mobileTopMenu.length != 0) {
  //           mobileTopMenu.item(0).style.setProperty('display', 'none');
  //         }
  //         let showItems =  document.documentElement.getElementsByClassName('show-items') as HTMLCollectionOf<HTMLElement>;
  //         if (showItems.length != 0) {
  //           showItems.item(0).style.setProperty('display', 'none');
  //         }
  //       }
  //       if (bottomButtons.length != 0) {
  //         for (let i = 0; i < bottomButtons.length; i++) {
  //           bottomButtons.item(i).style.setProperty('display', 'none');
  //         }
  //       }
  //       break;
  //   }
  // }
  historyOpen() {
    this.chooseMenuButton(2);
    let filter = document.getElementsByClassName('filters')   as HTMLCollectionOf<HTMLElement>;
    filter.item(0).style.setProperty('display', 'flex');
  //  this.historyItems = [];
    this.mapOpen = false;
    this.historyActive = true;
    this.itemOpen = false;
    if (this.itemsActive === true) {
      this.itemsActive = false;
      this.historyPrev = 'items';
    }
    if (this.filtersInnerActive === true) {
      this.filtersInnerActive = false;
      this.historyPrev = 'filters';
    }
    this.time = [];
  }
  onResize() {
    this.width = document.documentElement.clientWidth;
      this.watched = false;
      this.filtersMenuActive = false;
      this.mobile = true;
      this.shortversion = true;
    let map =  document.getElementsByClassName('map') as HTMLCollectionOf<HTMLElement>;
    let mapbuttons =  document.getElementsByClassName('map-buttons') as HTMLCollectionOf<HTMLElement>;
    let widthExt;
    if (map.length > 1) {
      widthExt = map.item(1).offsetWidth - 12;
    }
    if (mapbuttons.length !== 0 ) {
      if (!this.mapActive && widthExt !== undefined && widthExt !== null) {
        mapbuttons.item(0).style.setProperty('width', widthExt + 'px');
      } else {
        mapbuttons.item(0).style.setProperty('width', 'auto');
      }
    }
  }

  getObj(index) {
    this.blockMode = 'item';
    this.item = this.items[index];
    if (this.historyItems.indexOf(this.item) === -1) {
      this.historyItems.push(this.item);
    }
    let data = new Date();
    let hour, minute;
    if (data.getHours() < 10) {
      hour = '0' + data.getHours();
    } else {
      hour = data.getHours();
    }
    if (data.getMinutes() < 10) {
      minute = '0' + data.getMinutes();
    } else {
      minute = data.getMinutes();
    }
    let time = hour + ':' + minute;
    this.time.unshift(hour + ':' + minute);
    //     this.favourite[this.item.id] = { value: false };
    sessionStorage.setItem(JSON.stringify(this.item.id), time);
    if (this.watchedItems.indexOf(index) === -1) {
      this.watchedItems.push(index);
    }
    if (this.current < this.pages.length - 1 && this.pages.length > 1) {
      let num = this.pages.length - this.current - 1;
      this.pages.splice(this.current + 1, num);
      this.pages.push(this.item);
      this.current = this.pages.length - 1;
    } else {
      this.pages.push(this.item);
      this.current = this.pages.length - 1;
    }
    this.mapActive = false;
    let filtersInner = document.getElementsByClassName('filters')   as HTMLCollectionOf<HTMLElement>;
    filtersInner.item(0).style.setProperty('right', '0');
  }
  addFav(index) {
    let item = document.getElementById('img' + index);
    if (this.favouriteList.indexOf(index) === -1) {
      this.favouriteList.push(index);
      item.classList.add('favActive');
    } else {
      let elemIndex = this.favouriteList.indexOf(index);
      this.favouriteList.splice(elemIndex, 1);
      item.classList.remove('favActive');
    }
  }

  info(check) {
    if (this.current < this.pages.length - 1 && this.pages.length > 1) {
      console.log('PAGES');
      let num = this.pages.length - this.current - 1;
      this.pages.splice(this.current + 1, num);
      this.pages.push(check);
      this.current = this.pages.length - 1;
    } else {
      this.pages.push(check);
      this.current = this.pages.length - 1;
    }
    this.checkSwitch(check);
  }

  checkSwitch(check) {
    if (typeof check !== 'string') {
      this.item = <Item>check;
    }
    switch (check) {

      case 'filters': {
        this.mapBig = false;
        this.loginActive = false;
        this.payActive = false;
        this.contactActive = false;
        this.ergnActive = false;
        this.filtersInnerActive = true;
        this.itemOpen = true;
        this.itemsActive = false;
        this.mapOpen = false;
        this.watched = false;
        this.filtersActive = true;
        this.mobileItemOpen = false;
        break;
      }
      case 'objects': {
        this.mapBig = false;
        this.payActive = false;
        this.loginActive = false;
        this.contactActive = false;
        this.mapOpen = false;
        this.ergnActive = false;
        this.filtersInnerActive = false;
        this.itemOpen = true;
        this.itemsActive = true;
        this.watched = true;
        this.filtersActive = true;
        this.mobileItemOpen = false;
        break;
      }
      case 'login': {
        this.mapBig = false;
        this.loginActive = true;
        this.payActive = false;
        this.contactActive = false;
        this.mapOpen = false;
        this.ergnActive = false;
        this.filtersInnerActive = false;
        this.itemOpen = false;
        this.desktopOpen = false;
        let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        filters.item(0).style.setProperty('display', 'flex');
        this.itemsActive = false;
        this.mapActive = false;
        this.mobileItemOpen = false;
        break;
      }
      case 'pay': {
        this.mapBig = false;
        this.loginActive = false;
        this.contactActive = false;
        this.payActive = true;
        this.mapOpen = false;
        this.ergnActive = false;
        this.desktopOpen = false;
        let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        filters.item(0).style.setProperty('display', 'flex');
        this.filtersInnerActive = false;
        this.itemOpen = false;
        this.itemsActive = false;
        this.mapActive = false;
        this.mobileItemOpen = false;
        break;
      }
      case 'contact': {
        this.mapBig = false;
        this.loginActive = false;
        this.payActive = false;
        this.mapOpen = false;
          this.desktopOpen = false;
          let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
          filters.item(0).style.setProperty('display', 'flex');
        this.contactActive = true;
        this.ergnActive = false;
        this.filtersInnerActive = false;
        this.itemOpen = false;
        this.itemsActive = false;
        this.mapActive = false;
        this.mobileItemOpen = false;
        break;
      }
      case 'test': {
        this.mapBig = false;
        this.loginActive = false;
        this.contactActive = false;
        this.payActive = false;
        this.mapOpen = false;
        this.ergnActive = false;
        this.filtersInnerActive = false;
        this.itemOpen = false;
        this.itemsActive = false;
        this.mapActive = false;
        this.mobileItemOpen = false;
        break;
      }
      case 'egrn' : {
        this.mapBig = false;
        this.loginActive = false;
        this.contactActive = false;
        this.mapOpen = false;
        this.payActive = false;
        this.ergnActive = true;
          this.desktopOpen = false;
          let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
          filters.item(0).style.setProperty('display', 'flex');
        this.filtersInnerActive = false;
        this.itemOpen = false;
        this.itemsActive = false;
        this.mapActive = false;
        this.mobileItemOpen = false;
        break;
      }
      case 'map' : {
        this.mapBig = true;
        this.loginActive = false;
        this.contactActive = false;
        this.ergnActive = false;
        this.payActive = false;
        this.filtersInnerActive = false;
        this.itemOpen = false;
        this.itemsActive = false;
        this.mapOpen = true;
        this.watched = false;
        this.mapActive = true;
        this.filtersActive = false;
        break;
      }
      case 'panorama' : {
        this.mapBig = true;
        this.loginActive = false;
        this.contactActive = false;
        this.payActive = false;
        this.ergnActive = false;
        this.filtersInnerActive = false;
        this.itemOpen = false;
        this.itemsActive = false;
        this.watched = false;
        this.mapActive = true;
        this.filtersActive = false;
        break;
      }
      case 'routes' : {
        this.mapBig = true;
        this.loginActive = false;
        this.contactActive = false;
        this.payActive = false;
        this.ergnActive = false;
        this.filtersInnerActive = false;
        this.itemOpen = false;
        this.itemsActive = false;
        this.watched = false;
        this.mapActive = true;
        this.filtersActive = false;
        break;
      }
      default: {
        this.loginActive = false;
        this.contactActive = true;
        this.payActive = false;
        this.ergnActive = false;
        this.filtersInnerActive = false;
        this.itemOpen = true;
        this.itemsActive = false;
        this.mapActive = false;
        this.shortversion = false;
        this.mapBig = false;
        break;
      }
    }
  }
  similarObj(obj: Item) {
    console.log('hello');
    this.item = obj;
    let data = new Date();
    let hour, minute;
    if (data.getHours() < 10) {
      hour = '0' + data.getHours();
    } else {
      hour = data.getHours();
    }
    if (data.getMinutes() < 10) {
      minute = '0' + data.getMinutes();
    } else {
      minute = data.getMinutes();
    }
    this.time.unshift(hour + ':' + minute);
    sessionStorage.setItem(JSON.stringify(obj.id), hour + ':' + minute);
    if (this.watchedItems.indexOf(this.item.id) === -1) {
      this.watchedItems.push(this.item.id);
    }
  }
  // changeSize() {
  //   let photo = document.getElementsByClassName('photoBlock')   as HTMLCollectionOf<HTMLElement>;
  //   let userInfo = document.getElementsByClassName('userInfo')  as HTMLCollectionOf<HTMLElement>;
  //   if (photo.length !== 0 && userInfo.length !== 0) {
  //       for (let i = 0; i < userInfo.length; i++) {
  //         userInfo.item(i).style.setProperty('top', 'auto');
  //       }
  //   }
  //   this.contactActive = false;
  // }

  menuMode(mode) {

    switch (mode) {
      case 'open':
        this.menuOpen = true;
        break;
      case 'close':
        this.menuOpen = false;
        this.blockInputOpen = 'open_menu';
        this.checklogin();
        break;
      case 'close_login':
        this.blockInputOpen = 'open_menu';
        this.checklogin();
        break;
      case  'close_pay':
        this.blockInputOpen = 'open_menu';
        this.checklogin();
        break;
    }
    console.log('mode:' + mode + ' blockMode:' + this.blockMode + ' blockInputOpen:' + this.blockInputOpen);
  }

  getCoords(coords) {
    this.coordsPolygon = coords;
  }
  get_list() {
    console.log("get_list");
    this.items = [];
    console.log(this.filters);
    this._offer_service.list(1, 1, this.filters, this.sort, this.equipment, this.coordsPolygon).subscribe(offers => {
      for (let offer of offers) {
        this.items.push(offer);
      }
      this.countOfItems = this.items.length;
    });
    console.log(this.items);
  }
  checklogin() {
    this.timeAdd = this.localStorage.getItem("timeAdd");
    this._account_service.checklogin().subscribe(res => {
      console.log(res);
      if (res != undefined) {
        let data = JSON.parse(JSON.stringify(res));
        // console.log(data.result);
        // console.log(data.user_id);
        // console.log(data.email);
        if (data.result == 'success' ) {
          this.logged_in = true;
        } else {
          this.logged_in = false;
        }
      } else {
        this.logged_in = false;
      }
    });
  }
  // check() {
  //   let add_block = document.documentElement.getElementsByClassName('add-block-menu') as HTMLCollectionOf<HTMLElement>;
  //   let objects = document.documentElement.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
  //   let header = document.documentElement.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
  //   let bottomButtons = document.documentElement.getElementsByClassName('bottom-buttons') as HTMLCollectionOf<HTMLElement>;
  //   let mobileTopMenu = document.documentElement.getElementsByClassName('mobileTopMenu') as HTMLCollectionOf<HTMLElement>;
  //
  //   let hideMenu = document.documentElement.getElementsByClassName('hideMenu') as HTMLCollectionOf<HTMLElement>;
  //   if (hideMenu.length > 1) {
  //     hideMenu.item(1).classList.remove('exit-close');
  //     hideMenu.item(0).classList.add('exit-close');
  //   }
  //
  //   if (mobileTopMenu.length != 0) {
  //     mobileTopMenu.item(0).style.setProperty('display', 'none');
  //   }
  //   let showItems =  document.documentElement.getElementsByClassName('show-items') as HTMLCollectionOf<HTMLElement>;
  //   if (showItems.length != 0) {
  //     showItems.item(0).style.setProperty('display', 'none');
  //   }
  //
  //     if (localStorage.getItem("logged_in") != null && localStorage.getItem("logged_in") == "true") {
  //       add_block.item(1).classList.remove('close');
  //       objects.item(0).style.setProperty('display', 'none');
  //       if (bottomButtons.length != 0) {
  //         for (let i = 0; i < bottomButtons.length; i++) {
  //           bottomButtons.item(i).style.setProperty('display', 'none');
  //         }
  //       }
  //       header.item(0).classList.add('output');
  //     } else {
  //       add_block.item(0).classList.remove('close');
  //       objects.item(0).style.setProperty('display', 'none');
  //       header.item(0).classList.add('output');
  //       if (bottomButtons.length != 0) {
  //         for (let i = 0; i < bottomButtons.length; i++) {
  //           bottomButtons.item(i).style.setProperty('display', 'none');
  //         }
  //       }
  //     }
  // }
}
