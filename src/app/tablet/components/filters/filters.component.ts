import { WINDOW } from '@ng-toolkit/universal';
import {Component, EventEmitter, OnInit, Output, Inject} from '@angular/core';
import ymaps from 'ymaps';
import {Item} from '../../../item';
import {ActivatedRoute} from '@angular/router';
import {OfferService} from '../../../services/offer.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  public map: any;
  maps: any;
  city = 'ХАБАРОВСК';
  openNews = false;
  manager = false;
  realtor = false;
  additional = false;
  offer = false;
  typeOfObject = false;
  countOfRooms = false;
  cityButton = false;
  cost = false;
  sort = false;
  lat = 48.4862268;
  lng = 135.0826369;
  polygons: any[] = [];
  yellowCol: any;
  items: Item[] = [];
  itemsToday: Item[] = [];
  itemsYesterday: Item[] = [];
  itemsBeforeYesterday: Item[] = [];
  itemsOldest: Item[] = [];
  canvas: any;
  clearActive = false;
  drawActive: boolean;
  filters = {
    "city": String,
    "commission": String,                      // тип предложения (комиссия, без комиссии, все)
    "typeCode": String,                        // квартира, комната
    "roomsCount": Number,
  };

  width = document.documentElement.clientWidth;
  sortArray = {
    "type": String
  };
  @Output() sendSort = new EventEmitter();
  @Output() sendFilters = new EventEmitter();

  constructor(@Inject(WINDOW) private window: Window, route: ActivatedRoute,
              private _offer_service: OfferService) { }

  ngOnInit() {
    this.get_list();
    ymaps.load('https://api-maps.yandex.ru/2.1/?apikey=ADRpG1wBAAAAtIMIVgMAmOY9C0gOo4fhnAstjIg7y39Ls-0AAAAAAAAAAAAbBvdv4mKDz9rc97s4oi4IuoAq6g==&lang=ru_RU&amp;load=package.full').then( maps => {this.initMap(maps); }).catch(error => console.log('Failed to load Yandex Maps', error));
  }
  get_list() {
    console.log("get_list");
    // this.items = [];
    this.itemsToday = [];
    this.itemsYesterday = [];
    this.itemsBeforeYesterday = [];
    this.itemsOldest = [];
    this._offer_service.list(1, 1, this.filters, this.sort, '', '','').subscribe(offers => {
      //  console.log(typeof offers);
      //  console.log(offers);
      for (let offer of offers.list) {
        //  console.log(offer);
        this.items.push(offer);
      }
      // console.log('items: ' + this.items);
      //   console.log(this.items.length);
      for ( let i = 0; i < this.items.length; i++) {
        let date = this.items[i].addDate;
        //     console.log(date);
        let curDate = new Date();
        let secs = curDate.getTime() / 1000;
        let timeHasCome = secs - date;
        //     console.log('time: ' + timeHasCome);
        if (timeHasCome < 86400) {
          this.itemsToday.push(this.items[i]);
        } else if (timeHasCome > 86400 && timeHasCome < 86400 * 2) {
          this.itemsYesterday.push(this.items[i]);
        } else if (timeHasCome > 86400 * 2 && timeHasCome < 86400 * 3) {
          this.itemsBeforeYesterday.push(this.items[i]);
        } else {
          this.itemsOldest.push(this.items[i]);
        }
      }
    });

  }
  initCanvas(map) {

    let style = {
      strokeColor: '#252f32',
      strokeOpacity: 0.7,
      strokeWidth: 3,
      fillColor: '#252f32',
      fillOpacity: 0.4
    };
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    let ctx2d = canvas.getContext('2d');
    let rect = map.container.getParentElement().getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx2d.globalAlpha = style.strokeOpacity;
    ctx2d.strokeStyle = style.strokeColor;
    ctx2d.lineWidth = style.strokeWidth;

    let ymaps1 = document.documentElement.getElementsByTagName('ymaps');
    this.window.addEventListener("mousemove", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
        e.stopPropagation();
        e.returnValue = false;
        return false;
      }
    }, false);
    this.window.addEventListener("mousedown", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
        e.stopPropagation();
        e.returnValue = false;
        return false;
      }
    }, false);
    this.window.addEventListener("touchmove", function (e) {
      let canv = document.documentElement.getElementsByTagName('canvas');
      if (e.target == ymaps1.item(0) || e.target == ymaps1.item(1) || e.target == ymaps1.item(2)
        || e.target == ymaps1.item(3) || e.target == canvas || e.target == canv.item(0) ) {
        console.log('toychmove work');
        e.preventDefault();
        e.stopPropagation();
        e.returnValue = false;
        document.body.style.setProperty('overflow', 'hidden');
      } else {console.log('thmove not work because: ' + e.target);
      }
    }, false);
    this.window.addEventListener("touchstart", function (e) {
      let canv = document.documentElement.getElementsByTagName('canvas');
      if (e.target == ymaps1.item(0) || e.target == ymaps1.item(1) || e.target == ymaps1.item(2)
        || e.target == ymaps1.item(3) || e.target == canvas || e.target == canv.item(0)) {
        e.preventDefault();
        e.stopPropagation();
        e.returnValue = false;
        document.body.style.setProperty('overflow', 'hidden');
      } else {
        console.log('thmove not work because: ' + e.target);
      }
    }, false);
    this.window.addEventListener("touchend", function (e) {
      document.body.style.setProperty('overflow', 'unset');
    });

    let coordinates: any[] = [];
    let coordinatesReduced: any[] = [];
    let arrayCoordsOne: any[] = [];
    let arrayCoordsTwo: any[] = [];
    let q = 0;
    canvas.addEventListener('touchstart', e => {
      document.body.style.setProperty('overflow', 'hidden');
      coordinates = [];
      coordinatesReduced = [];
      arrayCoordsTwo = [];
      arrayCoordsOne = [];
      this.map.geoObjects.removeAll();
      this.map.geoObjects.add(this.yellowCol);
      this.polygons = [];
    }, { passive: false });

    canvas.ontouchmove = function (e) {
      coordinates.push([e.changedTouches[0].pageX, rect.height - (document.documentElement.offsetHeight - e.changedTouches[0].pageY)]);
      let height = document.documentElement.clientHeight - 55;
      let width = document.documentElement.clientWidth;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      ctx2d.beginPath();
      ctx2d.moveTo(coordinates[0][0], coordinates[0][1]);
      for (let i = 1; i < coordinates.length; i++) {
        ctx2d.lineTo(coordinates[i][0], coordinates[i][1]);
      }
      ctx2d.stroke();
    }.bind(this);


    canvas.addEventListener('touchend', e => {
      let calc = Math.floor(coordinates.length / 15);

      // map.panes.remove(pane);
      let bounds = this.map.getBounds();
      let latDiff = bounds[1][0] - bounds[0][0];
      let lonDiff = bounds[1][1] - bounds[0][1];
      let coords: any[] = [];
      for (let i = 0; i < coordinates.length; i++) {
        if ( i % calc == 0 ) {
          let lon = bounds[0][1] + (coordinates[i][0] / canvas.width) * lonDiff;
          let lat = bounds[0][0] + (1 - coordinates[i][1] / canvas.height) * latDiff;
          coords.push([lat, lon]);
        }
      }

      let geoObject = new this.maps.Polygon([coords], {}, style);
      //   this.polygons.push(geoObject, polyOne, polyTwo, polyThree);

      this.map.geoObjects.add(geoObject);
      this.drawActive = false;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.setProperty('display', 'none');
      this.map.behaviors.enable('drag');

    }, { passive: false });



  }
  draw() {
    let canvas = document.getElementById('canvas');
    canvas.style.setProperty('display', 'block');
    document.body.style.setProperty('overflow', 'hidden');
  }
  initMap(maps) {
    console.log('map work');
    console.log(document.getElementById('ymapsContainer'));
    this.maps = maps;
    this.map = new maps.Map('ymapsContainer', {
        center: [48.4862268, 135.0826369],
        zoom: 15,
        controls: ['geolocationControl']
      }, {suppressMapOpenBlock: true}
    );
    this.initCanvas(this.map);
    let mapdiv = document.getElementById('ymapsContainer');
    document.body.addEventListener("touchstart", function (e) {
      if (e.target == mapdiv) {
        e.preventDefault();
      }
    }, false);
    document.body.addEventListener("touchend", function (e) {
      if (e.target == mapdiv) {
        e.preventDefault();
      }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
      if (e.target == mapdiv) {
        e.preventDefault();
      }
    }, false);
    // Подпишемся на событие нажатия кнопки мыши.
    this.map.events.add('mousedown', e => {
      if (this.drawActive) {

        // this.clearMap();
        this.draw();
      } else {
        //     this.clearMap();
      }
    });

    this.map.events.add('mouseup', e => {
      // if (this.paintingprocess) {
      //   //    console.log(this.paintProcess);
      //
      //   // Получаем координаты отрисованного контура.
      //   let coordinates = this.paintingprocess.finishPaintingAt(e);
      //   console.log('paint');
      //    console.log(coordinates);
      //   this.paintingprocess = null;
      //   // В зависимости от состояния кнопки добавляем на карту многоугольник или линию с полученными координатами.
      //   let geoObject: any;
      //   let style = {
      //     strokeColor: '#252f32',
      //     strokeOpacity: 0.7,
      //     strokeWidth: 3,
      //     fillColor: '#252f32',
      //     fillOpacity: 0.4
      //   };
      //   if (this.drawActive) {
      //     geoObject = new this.maps.Polygon([coordinates], {}, style);
      //     geoObject.events.add('click', eq => {
      //       if (!this.drawActive) {
      //         this.map.geoObjects.remove(geoObject);
      //       }
      //     });
      //   }
      //   //    console.log(geoObject);
      //
      //   this.polygons.push(geoObject);
      //
      //
      //
      //   this.map.geoObjects.add(geoObject);
      //   this.map.behaviors.enable('drag');
      // }
    });

    this.yellowCol = new maps.GeoObjectCollection(null, {
      preset: 'islands#yellowIcon',
      iconColor: '#252f32'
    });
    for (let i = 0; i < this.items.length; i++) {
      let myGeocoder = maps.geocode(this.items[i].city + ',' + this.items[i].address + ',' + this.items[i].house_num);
      let coords = [48.4862268, 135.0826369];
      myGeocoder.then(
        res => {
          let firstGeoObject = res.geoObjects.get(0);
          // Координаты геообъекта.
          coords = firstGeoObject.geometry.getCoordinates();
          // this.map.geoObjects.add(res.geoObjects);
          this.yellowCol.add(new maps.Placemark(coords));
        }
      );

    }
    this.map.geoObjects.add(this.yellowCol);
  }
  clearMap() {
    this.clearActive = false;
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    let ctx2d = canvas.getContext('2d');
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.setProperty('display', 'none');
    this.map.behaviors.enable('drag');
    this.map.geoObjects.removeAll();
    this.map.geoObjects.add(this.yellowCol);
    document.body.style.setProperty('overflow', 'unset');

  }
  changeNameButton(id, name, varToChange) {
    let button = document.getElementsByClassName('filterButton') as HTMLCollectionOf<HTMLElement>;
    console.log(button);
    button.item(id).innerHTML = name;

    switch (varToChange) {
      case 'cityButton': {
        this.filters.city = name;
        this.sendFiltersFunc();
        this.cityButton = !this.cityButton;
        break;
      }
      case 'offer': {
        this.filters.commission = name;
        this.sendFiltersFunc();
        this.offer = !this.offer;
        break;
      }
      case 'typeOfObject': {
        this.filters.typeCode = name;
        this.sendFiltersFunc();
        this.typeOfObject = !this.typeOfObject;
        break;
      }
      case 'countOfRooms': {
        this.filters.roomsCount = name;
        this.sendFiltersFunc();
        this.countOfRooms = !this.countOfRooms;
        break;
      }
      case 'cost': {
        this.cost = !this.cost;
        break;
      }
      case 'sort': {
        this.sortArray.type = name;
        this.sendSortFunc();
        this.sort = !this.sort;
        break;
      }
    }
  }
  sendFiltersFunc() {
    this.sendFilters.emit(this.filters);
  }
  sendSortFunc() {
    this.sendSort.emit(this.sortArray);
  }
  selected(el: MouseEvent, name) {
    const items = document.getElementsByClassName(name) as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < items.length; i++) {
      (<HTMLElement>items.item(i)).style.removeProperty('background-color');
      (<HTMLElement>items.item(i)).style.removeProperty('color');
    }
    (<HTMLElement>el.currentTarget).style.setProperty('background-color', '#5E5E5E');
    (<HTMLElement>el.currentTarget).style.setProperty('color', 'white');
  }
  onResize() {
    this.width = document.documentElement.clientWidth;
  }
  clear() {
    const offer = document.getElementsByClassName('offer') as HTMLCollectionOf<HTMLElement>;
    const typeOfObject = document.getElementsByClassName('typeOfObject') as HTMLCollectionOf<HTMLElement>;
    const countOfRooms = document.getElementsByClassName('countOfRooms') as HTMLCollectionOf<HTMLElement>;
    const cost = document.getElementsByClassName('cost') as HTMLCollectionOf<HTMLElement>;
    const sort = document.getElementsByClassName('sort') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < offer.length; i++) {
      offer.item(i).style.setProperty('background-color', 'white');
      offer.item(i).style.setProperty('color', '#5E5E5E');
    }
    for (let i = 0; i < typeOfObject.length; i++) {
      typeOfObject.item(i).style.setProperty('background-color', 'white');
      typeOfObject.item(i).style.setProperty('color', '#5E5E5E');
    }
    for (let i = 0; i < countOfRooms.length; i++) {
      countOfRooms.item(i).style.setProperty('background-color', 'white');
      countOfRooms.item(i).style.setProperty('color', '#5E5E5E');
    }
    for (let i = 0; i < cost.length; i++) {
      cost.item(i).style.setProperty('background-color', 'white');
      cost.item(i).style.setProperty('color', '#5E5E5E');
    }
    for (let i = 0; i < sort.length; i++) {
      sort.item(i).style.setProperty('background-color', 'white');
      sort.item(i).style.setProperty('color', '#5E5E5E');
    }
  }

}
