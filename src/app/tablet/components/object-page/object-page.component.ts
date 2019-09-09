import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit, OnChanges} from '@angular/core';
import {Item} from '../../../item';

@Component({
  selector: 'app-object-page',
  templateUrl: './object-page.component.html',
  styleUrls: ['./object-page.component.css']
})
export class ObjectPageComponent implements OnInit, AfterViewInit, OnChanges {

  constructor() { }

  @Input() item: Item;
  @Input() favourite: boolean;
  public map: any;
  similar: Item;
  items: Item[] = [];
  photos: any[] = [];
  watchedItems: any[] = [];
  width: number;
  widthPhotoBlock = 500;
  positionPhoto = 0;
  countPhoto = 1;
  widthImg = 350; // ширина изображения
  count = 1; // количество изображений
  position = 0;
  pay = false;
  contact = false;
  number = 1;
  mapActive = true;
  test = false;
  nearButton = true;
  lat = 48.4862268;
  lng = 135.0826369;
  styles = [
    {
      "featureType": "landscape",
      "stylers": [
        {
          "color": "#f0f0f0"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#cceab0"
        }
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "water",
      "stylers": [
        {
          "color": "#87c2f8"
        }
      ]
    }
  ];
  @Output() showInfoEvent = new EventEmitter();
  @Output() similarClicked = new EventEmitter();
  @Output() favouriteClicked = new EventEmitter();
  ngOnInit() {
    if (sessionStorage.length !== 0) {
      this.watchedItems = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        this.watchedItems.push(Number(sessionStorage.key(i)));
      }
    }
    let itemsMenu = document.getElementsByClassName('menuBlock')   as HTMLCollectionOf<HTMLElement>;
    if (itemsMenu.length !== 0) {
      itemsMenu.item(1).style.setProperty('border-top', '5px solid #821529');
      itemsMenu.item(1).style.setProperty('font-weight', 'bold');
    }
    // this.items.push(new Item(0, 'Калинина', '71А', 26000, 3, 7, 10, 45, '../assets/image1.png'));
    // this.items.push(new Item(1, 'Ленина', '5', 20000, 5, 5, 10, 40.3, '../assets/image2.png'));
    // this.items.push(new Item(2, 'Руднева', '79', 23500, 3, 6, 9, 48, '../assets/image3.png'));
    // this.items.push(new Item(3, 'Станционная', '13', 17000, 2, 4, 5, 33, '../assets/image4.png'));
    // this.items.push(new Item(4, 'Калинина', '2', 14000, 2, 4, 5, 33, '../assets/image5.png'));
    // this.items.push(new Item(5, 'Ленина', '5', 7700, 2, 4, 5, 33, '../assets/image6.png'));
    // this.items.push(new Item(6, 'Руднева', '68', 25000, 2, 4, 5, 33, '../assets/image7.png'));


    this.width = document.documentElement.clientWidth;

    let height = 0;
    let test = document.getElementsByClassName('test')  as HTMLCollectionOf<HTMLElement>;
    let inner = document.getElementsByClassName('inner-additional')  as HTMLCollectionOf<HTMLElement>;

    let items =  document.getElementsByClassName('selectedButton')   as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < items.length; i++) {
      items.item(i).style.removeProperty('bottom');
      items.item(i).style.removeProperty('padding-bottom');
      items.item(i).style.removeProperty('border-bottom');
    }
    if (this.width > 1200) {
      for (let i = 0; i < test.length; i++) {
        let h = test[i].offsetHeight;
        if (h > height) {
          height = h;
        }
      }
      for (let i = 0; i < test.length; i++) {

        test.item(i).style.setProperty('height', height + 'px');
      }
    }

    for (let i = 0; i < inner.length; i++) {
      if ((i % 2) === 0) {
        inner.item(i).style.setProperty('background-color', '#f5f6f6');
      }
    }
  }
  ngAfterViewInit() {
    this.onResize();
    let filter = document.getElementsByClassName('filters')   as HTMLCollectionOf<HTMLElement>;
    let one = document.getElementsByClassName('photo-map-block') as HTMLCollectionOf<HTMLElement>;
    let two = document.getElementsByClassName('additional') as HTMLCollectionOf<HTMLElement>;
    let three = document.getElementsByClassName('similar-objects') as HTMLCollectionOf<HTMLElement>;
    let height = one.item(0).offsetHeight + two.item(0).offsetHeight + three.item(0).offsetHeight + 65 + 70;
    if (filter.length !== 0) {
      if ( this.width > 1050) {
        filter.item(0).style.setProperty('height', height + 'px');
      }  else {
        filter.item(0).style.setProperty('height', 'calc(100% - 65px)');
      }
    }
    let map =  document.getElementsByClassName('map') as HTMLCollectionOf<HTMLElement>;
    //   console.log(map);
    let mapbuttons =  document.getElementsByClassName('map-buttons') as HTMLCollectionOf<HTMLElement>;
    let width = map.item(1).offsetWidth - 12;
    if (mapbuttons.length !== 0) {
      mapbuttons.item(0).style.setProperty('width', width + 'px');
    }
    let item = document.getElementById('img' + this.item.id);
    if (item !== undefined && item !== null) {
      if (this.favourite === true) {
        item.style.setProperty('background-position', '50% -30px');
      } else {
        item.style.setProperty('background-position', '50% 0');
      }
    }
  }
  ngOnChanges() {
    this.onResize();
  }
  onResize() {
    let filter = document.getElementsByClassName('filters')   as HTMLCollectionOf<HTMLElement>;
    let one = document.getElementsByClassName('photo-map-block') as HTMLCollectionOf<HTMLElement>;
    let two = document.getElementsByClassName('additional') as HTMLCollectionOf<HTMLElement>;
    let three = document.getElementsByClassName('similar-objects') as HTMLCollectionOf<HTMLElement>;
    let height = one.item(0).offsetHeight + two.item(0).offsetHeight + three.item(0).offsetHeight + 65 + 70;
    if (filter.length !== 0) {
      if ( this.width > 1050) {
        filter.item(0).style.setProperty('height', height + 'px');
      }  else {
        filter.item(0).style.setProperty('height', 'calc(100% - 65px)');
      }
    }
    this.width = document.documentElement.clientWidth;
    let map =  document.getElementsByClassName('map') as HTMLCollectionOf<HTMLElement>;
    let mapbuttons =  document.getElementsByClassName('map-buttons') as HTMLCollectionOf<HTMLElement>;
    if (map.length !== 0) {
      let widthMap = map.item(0).offsetWidth - 12;
      if (mapbuttons.length !== 0) {
        mapbuttons.item(0).style.setProperty('width', widthMap + 'px');
      }
    }
    let blocks = document.getElementsByClassName('photo-block')  as HTMLCollectionOf<HTMLElement>;
    let photomap = document.getElementsByClassName('objects')  as HTMLCollectionOf<HTMLElement>;
    let mapWidth = photomap.item(0).offsetWidth;
    const list = document.getElementById('photoGallery-ul') as HTMLElement;
    list.style.setProperty('margin-left',  '0');
    if ((this.width < 1520) && (this.width > 1050)) {
      this.widthPhotoBlock = document.documentElement.clientWidth - 350;
    } else if (this.width < 1050) {
      this.widthPhotoBlock = document.documentElement.clientWidth;
    } else {
      this.widthPhotoBlock = blocks.item(0).offsetWidth;
    }
    if (((mapWidth - 79) / 4) >= 350 ) {
      let li = document.getElementsByClassName('carousel-li')  as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < li.length; i++) {
        let item = li.item(i).getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
        let appItem = li.item(i).getElementsByClassName('app-item') as HTMLCollectionOf<HTMLElement>;
        for (let j = 0; j < item.length; j++) {
          appItem.item(j).style.setProperty('width', '18vw');
          appItem.item(j).style.setProperty('margin-left', '7px');
          item.item(j).style.setProperty('width', '18vw');
          let photo = item.item(j).getElementsByClassName('photoBlock') as HTMLCollectionOf<HTMLElement>;
          let phone = item.item(j).getElementsByClassName('phone') as HTMLCollectionOf<HTMLElement>;
          let price = item.item(j).getElementsByClassName('price') as HTMLCollectionOf<HTMLElement>;
          for (let k = 0; k < photo.length; k++) {
            photo.item(k).style.setProperty('width', '18vw');
          }
          for (let k = 0; k < phone.length; k++) {
            phone.item(k).style.setProperty('width', '7vw');
            phone.item(k).style.setProperty('min-width', '135px');
          }
          for (let k = 0; k < price.length; k++) {
            price.item(k).style.setProperty('font-size', '18px');
          }
        }
      }
    } else if ((((mapWidth - 28) / 3) >= 350) && (((mapWidth - 79) / 4) < 350 ) ) {
      let widthInner = (mapWidth - 28) / 3;
      this.widthImg = widthInner + 7;
      let li = document.getElementsByClassName('carousel-li')  as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < li.length; i++) {
        let item = li.item(i).getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
        let appItem = li.item(i).getElementsByClassName('app-item') as HTMLCollectionOf<HTMLElement>;
        for (let j = 0; j < item.length; j++) {
          appItem.item(j).style.setProperty('width', widthInner + 'px');
          appItem.item(j).style.setProperty('max-width', 'none');
          appItem.item(j).style.setProperty('margin-left', '7px');
          item.item(j).style.setProperty('width', widthInner + 'px');
          item.item(j).style.setProperty('max-width', 'none');
          let photo = item.item(j).getElementsByClassName('photoBlock') as HTMLCollectionOf<HTMLElement>;
          let phone = item.item(j).getElementsByClassName('phone') as HTMLCollectionOf<HTMLElement>;
          let price = item.item(j).getElementsByClassName('price') as HTMLCollectionOf<HTMLElement>;
          for (let k = 0; k < photo.length; k++) {
            photo.item(k).style.setProperty('width', widthInner + 'px');
            photo.item(k).style.setProperty('max-width', 'none');
          }
          for (let k = 0; k < phone.length; k++) {
            phone.item(k).style.setProperty('width', '7vw');
            phone.item(k).style.setProperty('min-width', '135px');
          }
          for (let k = 0; k < price.length; k++) {
            price.item(k).style.setProperty('font-size', '18px');
          }
        }
      }
    } else {
      let widthInner = (mapWidth - 21) / 2;
      this.widthImg = widthInner + 7;
      let li = document.getElementsByClassName('carousel-li')  as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < li.length; i++) {
        let item = li.item(i).getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
        let appItem = li.item(i).getElementsByClassName('app-item') as HTMLCollectionOf<HTMLElement>;
        for (let j = 0; j < item.length; j++) {
          appItem.item(j).style.setProperty('width', widthInner + 'px');
          appItem.item(j).style.setProperty('max-width', 'none');
          appItem.item(j).style.setProperty('margin-left', '7px');
          item.item(j).style.setProperty('width', widthInner + 'px');
          item.item(j).style.setProperty('max-width', 'none');
          let photo = item.item(j).getElementsByClassName('photoBlock') as HTMLCollectionOf<HTMLElement>;
          let phone = item.item(j).getElementsByClassName('phone') as HTMLCollectionOf<HTMLElement>;
          let price = item.item(j).getElementsByClassName('price') as HTMLCollectionOf<HTMLElement>;
          for (let k = 0; k < photo.length; k++) {
            photo.item(k).style.setProperty('width', widthInner + 'px');
            photo.item(k).style.setProperty('max-width', 'none');
          }
          for (let k = 0; k < phone.length; k++) {
            phone.item(k).style.setProperty('width', '7vw');
            phone.item(k).style.setProperty('min-width', '135px');
          }
          for (let k = 0; k < price.length; k++) {
            price.item(k).style.setProperty('font-size', '18px');
          }
        }
      }
    }

  }
  selected(el: MouseEvent) {
    this.mapActive = false;
    let items =  document.getElementsByClassName('map-button') as HTMLCollectionOf<HTMLElement>;
    let items1 =  document.getElementsByClassName('map-button-word') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < items.length; i++) {
      items.item(i).style.removeProperty('background-color');
      items1.item(i).style.removeProperty('border-bottom');
    }
    (<HTMLElement>el.currentTarget).style.setProperty('background-color', 'rgba(38,47,50,1)');
    (<HTMLElement>(<HTMLElement>el.currentTarget).firstChild).style.setProperty('border-bottom', '1px solid white');
  }
  addFav(index) {
    let item = document.getElementById('imgdesk' + index);
    this.favourite = !this.favourite;
    if (this.favourite === true) {
      item.style.setProperty('background-position', '50% -30px');
    } else {
      item.style.setProperty('background-position', '50% 0');
    }
    this.favouriteClicked.emit(index);
  }
  getSimilarObject(item: Item) {
    this.similar = item;
    this.similarClicked.emit(this.similar);
    let buttons = document.getElementsByClassName('map-buttons') as HTMLCollectionOf<HTMLElement>;
    buttons.item(0).style.setProperty('display', 'flex');
    document.getElementById('anchor').scrollIntoView({ behavior: 'smooth' });
  }
  showInfo(name) {
    this.showInfoEvent.emit(name);
  }
  prev() {
    const list = document.getElementById('carousel-ul') as HTMLElement;
    this.position = Math.min(this.position + this.widthImg * this.count, 0);
    list.style.setProperty('margin-left', this.position + 'px');
  }
  next() {
    const listElems = document.getElementsByClassName('carousel-li') as HTMLCollectionOf<HTMLElement>;
    const list = document.getElementById('carousel-ul') as HTMLElement;
    this.position = Math.max(this.position - this.widthImg * this.count, -this.widthImg * (listElems.length - this.count));
    list.style.setProperty('margin-left', this.position + 'px');
  }
  prevImg() {
    const list = document.getElementById('photoGallery-ul') as HTMLElement;
    this.positionPhoto = Math.min(this.positionPhoto + this.widthPhotoBlock * this.countPhoto, 0);
    list.style.setProperty('margin-left', this.positionPhoto + 'px');
    if (this.number > 1) {
      this.number--;
    }

  }
  nextImg() {
    const listElems = document.getElementsByClassName('photoGallery-li') as HTMLCollectionOf<HTMLElement>;
    const list = document.getElementById('photoGallery-ul') as HTMLElement;
    this.positionPhoto = Math.max(this.positionPhoto - this.widthPhotoBlock * this.countPhoto, -this.widthPhotoBlock * (listElems.length - this.countPhoto));
    list.style.setProperty('margin-left', this.positionPhoto + 'px');
    if (this.number < this.photos.length) {
      this.number++;
    }
  }

}
