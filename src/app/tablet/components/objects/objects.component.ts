import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, AfterViewInit , Inject} from '@angular/core';
import {Subscription} from 'rxjs';
import {Item} from '../../../item';
import {ActivatedRoute} from '@angular/router';
import {OfferService} from '../../../services/offer.service';

@Component({
  selector: 'app-objects',
  templateUrl: './objects.component.html',
  styleUrls: ['./objects.component.css']
})
export class ObjectsComponent implements OnInit, AfterViewInit {

  private subscription: Subscription;
  mapBig = false;
  public map: any;
  desktopOpen = false;
  items: Item[] = [];
  item: Item;
  pages: any[] = [];
  historyItems: any[] = [];
  itemsActive: boolean;
  filtersInnerActive: boolean;
  itemOpen = false;
  watched: boolean;
  filtersMenuActive: boolean;
  filtersActive = true;
  mapActive = true;
  mobile = false;
  watchedItems: any[] = [];
  time: any[] = [];
  favouriteList: any[] = [];
  loginActive = false;
  contactActive = false;
  payActive = false;
  filters: any;
  sort: any;
  mapOpen = false;
  historyActive = false;
  test = false;
  ergnActive = false;
  shortversion = false;
  historyPrev: string;
  current = 0;
  y: number;
  width: number;
  //  historyMenu = false;
  shows: any;
  mobileItemOpen = false;
  lat = 48.4862268;
  lng = 135.0826369;
  activeButton: string;
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
  constructor(@Inject(WINDOW) private window: Window, route: ActivatedRoute,
              private _offer_service: OfferService) {
    this.subscription = route.params.subscribe((urlParams) => {
      if (urlParams['mode'] === 'list') {
        this.mapActive = true;
        this.itemsActive = true;
        this.ergnActive = false;
        this.historyActive = false;
        this.mobileItemOpen = false;
        this.filtersActive = true;
        this.desktopOpen = false;
        this.itemOpen = false;
        this.activeButton = 'items';
        let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        if (filters.length !== 0) {
          filters.item(0).style.setProperty('display', 'flex');
        }
      } else {
        this.itemsActive = false;
      }
      if (urlParams['mode'] === 'filters') {
        this.mapActive = true;
        this.filtersActive = true;
        this.filtersInnerActive = true;
        this.itemOpen = false;
        this.desktopOpen = false;
        this.historyActive = false;
        this.ergnActive = false;
        this.mobileItemOpen = false;
        this.activeButton = 'filters';
        let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        if (filters.length !== 0) {
          filters.item(0).style.setProperty('display', 'flex');
        }
      } else {
        this.filtersInnerActive = false;
      }
      if (urlParams['mode'] === 'item') {
        this.itemOpen = true;
        this.desktopOpen = true;
        this.filtersActive = false;
      } else {
        this.itemOpen = false;
      }
      if (urlParams['mode'] === 'history') {
        this.watched = true;
        this.historyActive = true;
        this.filtersActive = true;
        this.filtersInnerActive = false;
        this.itemsActive = false;
        this.itemOpen = false;
        this.desktopOpen = false;
        this.ergnActive = false;
        this.mobileItemOpen = false;
      }
      if (urlParams['mode'] === 'map') {
        this.itemsActive = false;
        this.filtersInnerActive = false;
        this.itemOpen = false;
        this.watched = false;
        this.mapOpen = true;
      }
    });
  }

  ngOnInit() {
    if ((this.item === undefined || this.item === null) && this.itemOpen === true) {
      this.itemOpen = false;
      this.filtersInnerActive = true;
      this.filtersActive = true;
    }
    const widthMobile = document.documentElement.clientWidth;
    this.pages = [];
    this.width = document.documentElement.clientWidth;
      this.info('filters');
      this.mobile = false;
      this.shortversion = false;
    const heightMobile = document.documentElement.clientHeight;
    let scrollItems = document.getElementsByClassName('scroll-items open')  as HTMLCollectionOf<HTMLElement>;
    let filtersBox = document.getElementsByClassName('app-filters-box')  as HTMLCollectionOf<HTMLElement>;
    if (widthMobile < 1050) {
      for (let i = 0; i < scrollItems.length; i++) {
        scrollItems.item(i).style.setProperty('height', heightMobile - 60 + 'px');
      }
      for (let i = 0; i < filtersBox.length; i++) {
        filtersBox.item(i).style.setProperty('height', heightMobile - 60 + 'px');
      }
    }
    if (widthMobile > 650) {
      let itemsMenu = document.getElementsByClassName('menuBlock')   as HTMLCollectionOf<HTMLElement>;
      if (itemsMenu.length !== 0) {
        itemsMenu.item(1).style.setProperty('border-top', '5px solid #821529');
        itemsMenu.item(1).style.setProperty('font-weight', 'bold');
      }
    }
  }
  ngAfterViewInit() {
    let uselessLine = document.getElementsByClassName('uselessLine')   as HTMLCollectionOf<HTMLElement>;
    let header = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
    header.item(0).style.setProperty('z-index', '8');
    if ((this.item === undefined || this.item === null) && this.itemOpen === true) {
      this.filtersInnerActive = true;
      uselessLine.item(0).classList.remove('homePage');
    }
    if (this.itemsActive || this.filtersInnerActive) {
      let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
      filters.item(0).style.setProperty('display', 'flex');
    }
    console.log(this.itemsActive + ' ' + this.filtersInnerActive + ' ' + this.historyActive);
    if (this.itemsActive) {
      this.get_list();
      this.chooseMenuButton(0);
    } else if (this.filtersInnerActive) {
      this.chooseMenuButton(1);
    } else if (this.historyActive) {
      this.chooseMenuButton(2);
    }
    this.changeSize();
    if (sessionStorage.length !== 0) {
      this.watchedItems = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        this.watchedItems.push(Number(sessionStorage.key(i)));
      }
    }
    let items =  document.getElementsByClassName('selectedButton')   as HTMLCollectionOf<HTMLElement>;
    let itemsMenu = document.getElementsByClassName('menuBlock')   as HTMLCollectionOf<HTMLElement>;
    if (itemsMenu.length !== 0) {
      for (let i = 0; i < itemsMenu.length; i++) {
        if ( i !== 1) {
          itemsMenu.item(i).style.removeProperty('border-top');
          itemsMenu.item(i).style.removeProperty('font-weight');
        } else {
          itemsMenu.item(i).style.setProperty('border-top', '5px solid #821529');
          itemsMenu.item(i).style.setProperty('font-weight', 'bold');
        }
      }
    }

    for (let i = 0; i < items.length; i++) {
      items.item(i).style.removeProperty('bottom');
      items.item(i).style.removeProperty('padding-bottom');
      items.item(i).style.removeProperty('border-bottom');
    }
    if (items.item(4) !== (undefined || null)) {
      items.item(4).style.setProperty('padding-bottom', '3px');
      items.item(4).style.setProperty('border-bottom', '2px solid #dcdcdc');
      items.item(4).style.setProperty('bottom', '-3px');
    }
  }
  setContactPos(e) {
    this.y = e;
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
  }
  chooseMenuButton(index) {
    let TopMenuWord =  document.getElementsByClassName('TopMenu-button-word-tablet') as HTMLCollectionOf<HTMLElement>;
    let iconImg = document.getElementsByClassName('iconImg') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < TopMenuWord.length; i++) {
      iconImg.item(i).style.removeProperty('background');
      TopMenuWord.item(i).style.removeProperty('border-bottom');

    }
    iconImg.item(index).style.setProperty('background', 'white');
    TopMenuWord.item(index).style.setProperty('border-bottom', '1px solid white');
  }
  openHeaderAfterPage() {
    let header = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
    header.item(0).style.setProperty('z-index', '8');
    let uselessLine = document.documentElement.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
    uselessLine.item(0).style.setProperty('display', 'block');
    let arrows = document.documentElement.getElementsByClassName('arrows-mobile ') as HTMLCollectionOf<HTMLElement>;
    arrows.item(0).style.setProperty('display', 'flex');
  }
  close(name) {
    console.log('func work ' + name);
    switch (name) {
      case 'login': {
        this.loginActive = false;
        this.mobileItemOpen = true;
        this.itemOpen = true;
        if (this.width > 1050) {
          this.contactActive = true;
        }
        if (this.width < 1050) {
          this.desktopOpen = true;
          let desk = document.getElementsByClassName('desk')   as HTMLCollectionOf<HTMLElement>;
          if (desk.length !== 0) {
            desk.item(0).classList.add('open');
          }
        }
        this.openHeaderAfterPage();
        break;
      }
      case 'contact': {
        this.contactActive = false;
        this.mobileItemOpen = true;
        this.itemOpen = true;
        if (this.width < 1050) {
          this.desktopOpen = true;
          let desk = document.getElementsByClassName('desk')   as HTMLCollectionOf<HTMLElement>;
          if (desk.length !== 0) {
            desk.item(0).classList.add('open');
          }
        }
        this.openHeaderAfterPage();
        break;
      }
      case 'pay': {
        this.payActive = false;
        this.mobileItemOpen = true;
        this.itemOpen = true;
        if (this.width < 1050) {
          this.desktopOpen = true;
          let desk = document.getElementsByClassName('desk')   as HTMLCollectionOf<HTMLElement>;
          if (desk.length !== 0) {
            desk.item(0).classList.add('open');
          }
        }
        if (this.width > 1050) {
          this.contactActive = true;
        }
        this.openHeaderAfterPage();
        break;
      }
      case 'egrn': {
        this.ergnActive = false;
        this.mobileItemOpen = true;
        this.itemOpen = true;
        if (this.width < 1050) {
          this.desktopOpen = true;
          let desk = document.getElementsByClassName('desk')   as HTMLCollectionOf<HTMLElement>;
          if (desk.length !== 0) {
            desk.item(0).classList.add('open');
          }
        }
        if (this.width > 1050) {
          this.contactActive = true;
        }
        this.openHeaderAfterPage();
        break;
      }
      default: {
        console.log('default');
        break;
      }
    }
  }
  deskOpen(value: boolean) {
    if (value === true) {
      let mobileMenu = document.documentElement.getElementsByClassName('mobileTopMenu') as HTMLCollectionOf<HTMLElement>;
      let tabletMenu = document.documentElement.getElementsByClassName('filters-menu-desktop') as HTMLCollectionOf<HTMLElement>;
      if (mobileMenu.length !== 0 && this.width < 1050) {
        mobileMenu.item(0).style.setProperty('display', 'none');
      }
      if (tabletMenu.length !== 0 && this.width < 1050) {
        tabletMenu.item(0).style.setProperty('display', 'flex');
      }
    } else {
      let mobileMenu = document.documentElement.getElementsByClassName('mobileTopMenu') as HTMLCollectionOf<HTMLElement>;
      let tabletMenu = document.documentElement.getElementsByClassName('filters-menu-desktop') as HTMLCollectionOf<HTMLElement>;
      if (mobileMenu.length !== 0 && this.width < 1050) {
        mobileMenu.item(0).style.setProperty('display', 'flex');
      }
      if (tabletMenu.length !== 0 && this.width < 1050) {
        tabletMenu.item(0).style.setProperty('display', 'none');
      }
    }

  }
  historyOpen() {
    let filter = document.getElementsByClassName('filters')   as HTMLCollectionOf<HTMLElement>;
    filter.item(0).style.setProperty('display', 'flex');
  //  this.historyItems = [];
    this.mapOpen = false;
    this.historyActive = true;
    if (this.width < 1050 && this.itemsActive === true) {
      this.itemsActive = false;
      this.historyPrev = 'items';
    }
    if (this.width < 1050 && this.filtersInnerActive === true) {
      this.filtersInnerActive = false;
      this.historyPrev = 'filters';
    }
    // this.time = [];
    // for (let i = this.watchedItems.length; i >= 0; i--) {
    //   for (let j = 0; j < this.items.length; j++) {
    //     if (this.watchedItems[i] === this.items[j].id) {
    //       this.historyItems.push(this.items[j]);
    //       this.time.push(sessionStorage.getItem(this.watchedItems[i]));
    //     }
    //   }
    // }
  }
  historyClose() {
    let filter = document.getElementsByClassName('filters')   as HTMLCollectionOf<HTMLElement>;
    filter.item(0).style.setProperty('display', 'flex');
    this.historyActive = false;
    let header = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
    header.item(0).style.setProperty('z-index', '8');
    if (this.width < 1050 && this.historyPrev === 'items') {
      this.itemsActive = true;
    } else if (this.width < 1050 && this.historyPrev === 'filters') {
      this.filtersInnerActive = true;
    }
    this.historyPrev = '';
    if (this.activeButton === 'items') {
      this.chooseMenuButton(0);
    } else if (this.activeButton === 'filters') {
      this.chooseMenuButton(1);
    } else {
      let TopMenuButton =  document.getElementsByClassName('TopMenu-button-tablet') as HTMLCollectionOf<HTMLElement>;
      let TopMenuWord =  document.getElementsByClassName('TopMenu-button-word-tablet') as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < TopMenuButton.length; i++) {
        TopMenuButton.item(i).style.removeProperty('background-color');
        TopMenuButton.item(i).style.removeProperty('color');
        TopMenuButton.item(i).style.removeProperty('border-top');
        TopMenuWord.item(i).style.removeProperty('border-bottom');
      }
    }
  }
  changeTime(item, index) {
    this.item = item;
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
    this.time[index] = hour + ':' + minute;
    let key = sessionStorage.key(index);
    sessionStorage.setItem(key, hour + ':' + minute);
    this.loginActive = false;
    this.contactActive = this.width > 650;
    this.test = false;
    this.ergnActive = false;
    this.filtersInnerActive = false;
    this.itemOpen = true;
    this.itemsActive = false;
    this.mapActive = false;
    if (this.width < 650) {
      this.shortversion = true;
      this.mobileItemOpen = true;
    } else {
      this.shortversion = false;
      this.mobileItemOpen = false;
    }
    this.mapBig = false;
  }
  onResize() {
    this.width = document.documentElement.clientWidth;
    if (document.documentElement.clientWidth < 1050) {
      this.watched = false;
      this.filtersMenuActive = false;
      // this.contactActive = false;
    }
    if (this.width < 650) {
      this.mobile = true;
      this.shortversion = true;
    } else {
      this.mobile = false;
      this.shortversion = false;
    }

    let map =  document.getElementsByClassName('map') as HTMLCollectionOf<HTMLElement>;
    let mapbuttons =  document.getElementsByClassName('map-buttons') as HTMLCollectionOf<HTMLElement>;
    let widthExt;
    if (map.length > 1) {
      widthExt = map.item(1).offsetWidth - 12;
    }

    console.log('width: ' + widthExt);
    if (mapbuttons.length !== 0 ) {
      if (!this.mapActive && widthExt !== undefined && widthExt !== null) {
        mapbuttons.item(0).style.setProperty('width', widthExt + 'px');
      } else {
        mapbuttons.item(0).style.setProperty('width', 'auto');
      }
    }
  }
  getObj(index) {
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
    sessionStorage.setItem(JSON.stringify(this.item.id), time);
    if (this.watchedItems.indexOf(this.item.id) === -1) {
      this.watchedItems.push(this.item.id);
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

  selected(el: MouseEvent) {
    // let items =  document.getElementsByClassName('selectedButton')   as HTMLCollectionOf<HTMLElement>;
    // for (let i = 0; i < items.length; i++) {
    //     items.item(i).style.removeProperty('bottom');
    //     items.item(i).style.removeProperty('padding-bottom');
    //     items.item(i).style.removeProperty('border-bottom');
    // }
    // (<HTMLElement>(<HTMLElement>el.currentTarget).firstChild).style.setProperty('padding-bottom', '3px');
    // (<HTMLElement>(<HTMLElement>el.currentTarget).firstChild).style.setProperty('border-bottom', '2px solid #dcdcdc');
    // if ((<HTMLElement>el.currentTarget).className === 'map-button') {
    //     (<HTMLElement>(<HTMLElement>el.currentTarget).firstChild).style.setProperty('bottom', '-2px');
    // } else {
    //     (<HTMLElement>(<HTMLElement>el.currentTarget).firstChild).style.setProperty('bottom', '-3px');
    // }


    //
    // let items1 =  document.getElementsByClassName('TopMenu-button-word-tablet') as HTMLCollectionOf<HTMLElement>;
    // let iconImg = document.getElementsByClassName('iconImg') as HTMLCollectionOf<HTMLElement>;
    // for (let i = 0; i < items1.length; i++) {
    //   iconImg.item(i).style.removeProperty('background');
    //   items1.item(i).style.removeProperty('border-bottom');
    // }
    // (<HTMLElement>(<HTMLElement>el.currentTarget).firstChild.firstChild).style.setProperty('background', 'white');
    // (<HTMLElement>(<HTMLElement>el.currentTarget).firstChild).style.setProperty('border-bottom', '1px solid white');

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
        this.test = false;
        this.ergnActive = false;
        this.filtersInnerActive = true;
        this.itemOpen = true;
        this.itemsActive = false;
        this.mapOpen = false;
        this.watched = false;
        if (this.width > 650) {
          this.mapActive = true;
        }
        this.filtersActive = true;
        this.mobileItemOpen = false;
        break;
      }
      case 'objects': {
        this.mapBig = false;
        this.payActive = false;
        this.loginActive = false;
        this.contactActive = false;
        this.test = false;
        this.mapOpen = false;
        this.ergnActive = false;
        this.filtersInnerActive = false;
        this.itemOpen = true;
        this.itemsActive = true;
        this.watched = true;
        if (this.width > 650) {
          this.mapActive = true;
        }
        this.filtersActive = true;
        this.mobileItemOpen = false;
        break;
      }
      case 'login': {
        this.mapBig = false;
        this.loginActive = true;
        this.payActive = false;
        this.contactActive = false;
        this.test = false;
        this.mapOpen = false;
        this.ergnActive = false;
        this.filtersInnerActive = false;
        this.itemOpen = false;
        if (this.width < 1050) {
          this.desktopOpen = false;
          let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
          filters.item(0).style.setProperty('display', 'flex');
        }
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
        this.test = false;
        this.mapOpen = false;
        this.ergnActive = false;
        if (this.width < 1050) {
          this.desktopOpen = false;
          let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
          filters.item(0).style.setProperty('display', 'flex');
        }
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
        if (this.width < 1050) {
          this.desktopOpen = false;
          let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
          filters.item(0).style.setProperty('display', 'flex');
        }
        this.contactActive = true;
        this.test = false;
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
        this.test = true;
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
        this.test = false;
        this.payActive = false;
        this.ergnActive = true;
        if (this.width < 1050) {
          this.desktopOpen = false;
          let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
          filters.item(0).style.setProperty('display', 'flex');
        }
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
        this.test = false;
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
        this.test = false;
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
        this.test = false;
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
        this.test = false;
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
  contact() {
    this.contactActive = this.width >= 1050;
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
  changeSize() {
    let photo = document.getElementsByClassName('photoBlock')   as HTMLCollectionOf<HTMLElement>;
    let userInfo = document.getElementsByClassName('userInfo')  as HTMLCollectionOf<HTMLElement>;
    if (photo.length !== 0 && userInfo.length !== 0) {
      let top = photo.item(0).clientHeight - userInfo.item(0).clientHeight;
      if (document.documentElement.clientWidth > 650) {
        for (let i = 0; i < userInfo.length; i++) {
          userInfo.item(i).style.setProperty('top', top + 'px');
        }
      } else {
        for (let i = 0; i < userInfo.length; i++) {
          userInfo.item(i).style.setProperty('top', 'auto');
        }
      }
    }
  }
  setFilters(filters) {
    this.filters = filters;
  }
  setSort(sort) {
    this.sort = sort;
  }
  get_list() {
    console.log("get_list");
    this.items = [];
    this._offer_service.list(1, 5, this.filters, this.sort, '', '').subscribe(offers => {
      for (let offer of offers) {
        this.items.push(offer);
      }
    });
    console.log(this.items);
  }

}
