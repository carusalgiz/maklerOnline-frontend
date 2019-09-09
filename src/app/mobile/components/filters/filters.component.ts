import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import {Component, EventEmitter, OnInit, Output, AfterViewInit, Inject, Input} from '@angular/core';
import {Item} from '../../../item';
import ymaps from 'ymaps';
import {ActivatedRoute} from '@angular/router';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';


@Component({
  selector: 'app-filters-mobile',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit, AfterViewInit {
  filtersNum = 0;
  public map: any;
  maps: any;
  city = 'Хабаровск';
  manager = false;
  additional = false;
  offer = false;
  typeOfObject = false;
  countOfRooms = false;
  cityButton = false;
  cost = false;
  sort = false;
  drawActive: boolean;
  polygons: any[] = [];
  nearObjects: any[] = [];
  coordsPolygon: any[] = [];
  yellowCol: any;
  items: Item[] = [];
  canvas: any;
  clearActive = false;
  period = false;
  equipment = false;
  conditions = false;
  parking = false;
  parkingArr: any[] = [];
  costChosen = false;
  food = false; education = false; fitness = false; medicine = false; entertainment = false;
  khv: any;
  vld: any;  geoObject: any;
  kna: any; paintProcess: any;
  cafe: any; procukty: any; supermarket:any; market: any; restaurant: any; canteen: any;
  // type == 'Детские сады' || type == 'Школы' || type == 'Гимназии' || type == 'Техникумы' || type == 'Институты' || type == 'Университеты'
  kindergarten: any; school: any; gymnasy: any; technikum: any; institute: any; univer: any;
  // type == 'Тренажерные залы' || type == 'Фитнес клубы'
  trenazher: any; fitnessClubs: any;
  //type == 'Аптеки' || type == 'Поликлиники' || type == 'Больницы' || type == 'Ветеринарные аптеки' || type == 'Ветеринарные клиники'
  apteka: any; poliklinika: any; hospital: any; vetapteka: any; vetklinika: any;
  //  type == 'Кинотеатры' || type == 'Театры' || type == 'Ночной клубы'
  kino: any; theater: any; nightclub: any; circus: any; park: any;
  // парковки
  free_parking: any; paid_parking: any; all_parking: any;
  public clusterer: any;
  filters = {
    'city': 'Хабаровск',
    'contactType': 'private',                      // тип предложения (комиссия, без комиссии, все)
    'typeCode': String,                        // квартира, комната
    'roomsCount': String,
    'price': String,
    'isMiddleman': String,
    'addDate': undefined
  };
  equipmentFilters = {
    'complete': undefined,
    'living_room_furniture': undefined,
    'kitchen_furniture': undefined,
    'couchette': undefined,
    'bedding': undefined,
    'dishes': undefined,
    'refrigerator': undefined,
    'washer': undefined,
    'microwave_oven': undefined,
    'air_conditioning': undefined,
    'dishwasher': undefined,
    'tv': undefined,
    'with_animals': undefined,
    'with_children': undefined,
    'can_smoke': undefined,
    'activities': undefined
  };
  sortArray = {
    'addDate': String,
    'finalRaiting': String,
    'ownerPrice': String
  };
  width = document.documentElement.clientWidth;
    @Input() initCoords: any;
    @Input() initZoom: Number;


    @Output() sendFilters = new EventEmitter();
  @Output() sendEquipment = new EventEmitter();
  @Output() sendSort = new EventEmitter();
  @Output() sendMainButtonActive = new EventEmitter();
  @Output() showItemsButtonActive = new EventEmitter();
  @Output() coordsPol = new EventEmitter();
  @Output() countOfItems = new EventEmitter();

    @Output() changedCenter = new EventEmitter();
    @Output() changedZoom = new EventEmitter();
  lat = 48.4862268;
  lng = 135.0826369;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute,
              private _offer_service: OfferService,
              private _account_service: AccountService) {
  }

  ngOnInit() {
    this.drawActive = false;
    // this.get_count_cities('Хабаровск', this.khv);
    // this.get_count_cities('Владивосток', this.vld);
    // this.get_count_cities('Комсомольск-на-Амуре', this.kna);
  }

  ngAfterViewInit() {
    // let showItems = document.getElementsByClassName('show-items') as HTMLCollectionOf<HTMLElement>;
    // showItems.item(0).style.setProperty('top', '55px');
    this.sendSortFunc();
    this.sendFiltersFunc();
    ymaps.load('https://api-maps.yandex.ru/2.1/?apikey=ADRpG1wBAAAAtIMIVgMAmOY9C0gOo4fhnAstjIg7y39Ls-0AAAAAAAAAAAAbBvdv4mKDz9rc97s4oi4IuoAq6g==&lang=ru_RU&amp;load=package.full').then( maps => {this.initMap(maps); }).catch(error => console.log('Failed to load Yandex Maps', error));

  }
  reset() {
    let buttonBox = document.getElementsByClassName('filters-options-box') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < buttonBox.length; i++) {
      for (let j = 0; j < buttonBox.item(i).children.length; j++) {
        if (buttonBox.item(i).children[j].classList.contains('selected')) {
          buttonBox.item(i).children[j].classList.remove('selected');
        }
      }
    }
    this.filters.isMiddleman = undefined;
    this.filters.city = 'Хабаровск';
    this.filters.contactType = 'private';
    this.filters.typeCode = undefined;
    this.filters.roomsCount = undefined;
    this.filters.price = undefined;
    this.filters.addDate = undefined;
    this.equipmentFilters.complete = undefined;
    this.equipmentFilters.living_room_furniture = undefined;
    this.equipmentFilters.kitchen_furniture = undefined;
    this.equipmentFilters.couchette = undefined;
    this.equipmentFilters.bedding = undefined;
    this.equipmentFilters.dishes = undefined;
    this.equipmentFilters.refrigerator = undefined;
    this.equipmentFilters.washer = undefined;
    this.equipmentFilters.microwave_oven = undefined;
    this.equipmentFilters.air_conditioning = undefined;
    this.equipmentFilters.dishwasher = undefined;
    this.equipmentFilters.tv = undefined;
    this.equipmentFilters.with_animals = undefined;
    this.equipmentFilters.with_children = undefined;
    this.equipmentFilters.can_smoke = undefined;
    this.equipmentFilters.activities = undefined;
    this.sortArray.addDate = undefined;
    this.sortArray.ownerPrice = undefined;
    this.sortArray.finalRaiting = undefined;

    this.sendSortFunc();
    this.sendFiltersFunc();
    this.sendEquipmentFunc();
    this.get_list();
  }
  requestMaps(x, y, type, mode) {
    this._account_service.getObjects(x, y, type, '0.3').subscribe(res => {
      this.nearObjects = res;
      console.log(res);
      console.log(this.nearObjects);
      if (mode == 'delete') {
        // 0A145B
        if ( type == 'Бесплатные парковки' || type == 'Платные парковки' || type == 'Автостоянки') {
          if (type == 'Бесплатные парковки') { this.map.geoObjects.remove(this.free_parking); this.free_parking = [];
            this.free_parking = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#0A145B',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Платные парковки') { this.map.geoObjects.remove(this.paid_parking); this. paid_parking = [];
            this.paid_parking = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#0A145B',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Автостоянки') { this.map.geoObjects.remove(this.all_parking); this. all_parking = [];
            this.all_parking = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#0A145B',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
        }
        if ( type == 'Кафе' || type == 'Магазины продуктов' || type == 'Супермаркеты' || type == 'Рынки' || type == 'Рестораны' || type == 'Столовые') {
          if (type == 'Кафе') { this.map.geoObjects.remove(this.cafe); this.cafe = [];
            this.cafe = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#FB8C00',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Рынки') { this.map.geoObjects.remove(this.market); this.market = [];
            this.market = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#FB8C00',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Рестораны') { this.map.geoObjects.remove(this.restaurant); this.restaurant = [];
            this.restaurant = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#FB8C00',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Столовые') { this.map.geoObjects.remove(this.canteen); this.canteen = [];
            this.canteen = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#FB8C00',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Магазины продуктов') { this.map.geoObjects.remove(this.procukty); this.procukty = [];
            this.procukty  = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#FB8C00',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Супермаркеты') { this.map.geoObjects.remove(this.supermarket); this.supermarket = [];
            this.supermarket = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#FB8C00',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
        }
        if ( type == 'Детские сады' || type == 'Школы' || type == 'Гимназии' || type == 'Техникумы' || type == 'Институты' || type == 'Университеты') {
          if (type == 'Детские сады') { this.map.geoObjects.remove(this.kindergarten); this.kindergarten = [];
            this.kindergarten = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#3F51B5',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Школы') { this.map.geoObjects.remove(this.school); this.school = [];
            this.school = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#3F51B5',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Гимназии') { this.map.geoObjects.remove(this.gymnasy); this.gymnasy = [];
            this.gymnasy = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#3F51B5',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Институты') { this.map.geoObjects.remove(this.institute); this. institute = [];
            this.institute = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#3F51B5',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Техникумы') { this.map.geoObjects.remove(this.technikum); this.technikum = [];
            this.technikum = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#3F51B5',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Университеты') { this.map.geoObjects.remove(this.univer); this.univer = [];
            this.univer = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#3F51B5',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
        }
        if ( type == 'Тренажерные залы' || type == 'Фитнес клубы') {
          if (type == 'Тренажерные залы') { this.map.geoObjects.remove(this.trenazher); this.trenazher = [];
            this.trenazher = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#1E88E5',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Фитнес клубы') { this.map.geoObjects.remove(this.fitnessClubs); this. fitnessClubs = [];
            this.fitnessClubs = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#1E88E5',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
        }
        if ( type == 'Аптеки' || type == 'Поликлиники' || type == 'Больницы' || type == 'Ветеринарные аптеки' || type == 'Ветеринарные клиники') {
          if (type == 'Аптеки') { this.map.geoObjects.remove(this.apteka); this.apteka = [];
            this.apteka = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#00897B',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Поликлиники') { this.map.geoObjects.remove(this.poliklinika); this.poliklinika = [];
            this.poliklinika = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#00897B',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Больницы') { this.map.geoObjects.remove(this.hospital); this.hospital = [];
            this.hospital = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#00897B',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Ветеринарные аптеки') { this.map.geoObjects.remove(this.vetapteka); this.vetapteka = [];
            this.vetapteka = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#00897B',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Ветеринарные клиники') { this.map.geoObjects.remove(this.vetklinika); this.vetklinika = [];
            this.vetklinika = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#00897B',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
        }
        if ( type == 'Кинотеатры' || type == 'Театры' || type == 'Ночные клубы' || type == 'Цирки' || type == 'Парки') {
          if (type == 'Кинотеатры') { this.map.geoObjects.remove(this.kino); this.kino = [];
            this.kino = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#8E24AA',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Цирки') { this.map.geoObjects.remove(this.circus); this.circus = [];
            this.circus = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#8E24AA',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Парки') { this.map.geoObjects.remove(this.park); this.park = [];
            this.park = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#8E24AA',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Театры') { this.map.geoObjects.remove(this.theater); this.theater = [];
            this.theater = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#8E24AA',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
          if (type == 'Ночные клубы') { this.map.geoObjects.remove(this.nightclub);  this.nightclub = [];
            this.nightclub = new this.maps.Clusterer({
              preset: 'islands#invertedRedClusterIcons',
              clusterIconColor: '#8E24AA',
              groupByCoordinates: false,
              clusterDisableClickZoom: true,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            });
          }
        }
      }
      if (mode == 'add') {
        for (let i = 0; i < this.nearObjects.length; i++) {
          let obj = JSON.parse(JSON.stringify(this.nearObjects[i]));
          //   console.log(obj);
          let properties = JSON.parse(JSON.stringify(obj.properties));
          let comp = JSON.parse(JSON.stringify(properties.CompanyMetaData.Categories));
          let comp1 = JSON.parse(JSON.stringify(comp[0]));
          let cat = JSON.parse(JSON.stringify(comp1.name));
          let coord = JSON.parse(JSON.stringify(obj.geometry));

          //    0A145B

          if (type == 'Бесплатные парковки' || type == 'Платные парковки' || type == 'Автостоянки') {
            this.parkingArr.push({
              coordinates: coord.coordinates,
              type: cat,
              description: properties.description,
              name: properties.name
            });
            let coor = [coord.coordinates[1], coord.coordinates[0]];
            if (type == 'Бесплатные парковки') {
              this.free_parking.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#0A145B'
              }));
            }
            if (type == 'Платные парковки') {
              this.paid_parking.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#0A145B'
              }));
            }
            if (type == 'Автостоянки') {
              this.all_parking.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#0A145B'
              }));
            }
          }
          if (type == 'Кафе' || type == 'Магазины продуктов' || type == 'Супермаркеты' || type == 'Рынки' || type == 'Рестораны' || type == 'Столовые') {
            // this.food.push({
            //   coordinates: coord.coordinates,
            //   type: cat,
            //   description: properties.description,
            //   name: properties.name
            // });
            let coor = [coord.coordinates[1], coord.coordinates[0]];
            if (type == 'Кафе') {
              this.cafe.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#FB8C00'
              }));
            }
            if (type == 'Рынки') {
              this.market.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#FB8C00'
              }));
            }
            if (type == 'Рестораны') {
              this.restaurant.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#FB8C00'
              }));
            }
            if (type == 'Столовые') {
              this.canteen.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#FB8C00'
              }));
            }
            if (type == 'Магазины продуктов') {
              this.procukty.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#FB8C00'
              }));
            }
            if (type == 'Супермаркеты') {
              this.supermarket.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#FB8C00'
              }));
            }
          }
          if (type == 'Детские сады' || type == 'Школы' || type == 'Гимназии' || type == 'Техникумы' || type == 'Институты' || type == 'Университеты') {
            // this.education.push({
            //   coordinates: coord.coordinates,
            //   type: cat,
            //   description: properties.description,
            //   name: properties.name
            // });
            let coor = [coord.coordinates[1], coord.coordinates[0]];
            if (type == 'Детские сады') {
              this.kindergarten.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#3F51B5'
              }));
            }
            if (type == 'Школы') {
              this.school.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#3F51B5'
              }));
            }
            if (type == 'Гимназии') {
              this.gymnasy.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#3F51B5'
              }));
            }
            if (type == 'Институты') {
              this.institute.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#3F51B5'
              }));
            }
            if (type == 'Техникумы') {
              this.technikum.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#3F51B5'
              }));
            }
            if (type == 'Университеты') {
              this.univer.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#3F51B5'
              }));
            }
          }
          if (type == 'Тренажерные залы' || type == 'Фитнес клубы') {
            // this.fitness.push({
            //   coordinates: coord.coordinates,
            //   type: cat,
            //   description: properties.description,
            //   name: properties.name
            // });
            let coor = [coord.coordinates[1], coord.coordinates[0]];
            if (type == 'Тренажерные залы') {
              this.trenazher.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#1E88E5'
              }));
            }
            if (type == 'Фитнес клубы') {
              this.fitnessClubs.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#1E88E5'
              }));
            }
          }
          if (type == 'Аптеки' || type == 'Поликлиники' || type == 'Больницы' || type == 'Ветеринарные аптеки' || type == 'Ветеринарные клиники') {
            // this.medicine.push({
            //   coordinates: coord.coordinates,
            //   type: cat,
            //   description: properties.description,
            //   name: properties.name
            // });
            let coor = [coord.coordinates[1], coord.coordinates[0]];
            if (type == 'Аптеки') {
              this.apteka.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#00897B'
              }));
            }
            if (type == 'Поликлиники') {
              this.poliklinika.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#00897B'
              }));
            }
            if (type == 'Больницы') {
              this.hospital.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#00897B'
              }));
            }
            if (type == 'Ветеринарные аптеки') {
              this.vetapteka.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#00897B'
              }));
            }
            if (type == 'Ветеринарные клиники') {
              this.vetklinika.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#00897B'
              }));
            }
          }
          if (type == 'Кинотеатры' || type == 'Театры' || type == 'Ночные клубы' || type == 'Цирки' || type == 'Парки') {
            // this.entertainment.push({
            //   coordinates: coord.coordinates,
            //   type: cat,
            //   description: properties.description,
            //   name: properties.name
            // });
            let coor = [coord.coordinates[1], coord.coordinates[0]];
            if (type == 'Кинотеатры') {
              this.kino.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#8E24AA'
              }));
            }
            if (type == 'Цирки') {
              this.circus.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#8E24AA'
              }));
            }
            if (type == 'Парки') {
              this.park.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#8E24AA'
              }));
            }
            if (type == 'Театры') {
              this.theater.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#8E24AA'
              }));
            }
            if (type == 'Ночные клубы') {
              this.nightclub.add(new this.maps.Placemark(coor, {
                balloonContent: properties.name
              }, {
                preset: 'islands#yellowIcon',
                iconColor: '#8E24AA'
              }));
            }
          }
        }
        if ( type == 'Бесплатные парковки' || type == 'Платные парковки' || type == 'Автостоянки') {
          if (type == 'Бесплатные парковки') {
            this.map.geoObjects.add(this.free_parking);
          }
          if (type == 'Платные парковки') {
            this.map.geoObjects.add(this.paid_parking);
          }
          if (type == 'Автостоянки') {
            this.map.geoObjects.add(this.all_parking);
          }
        }
        if ( type == 'Кафе' || type == 'Магазины продуктов' || type == 'Супермаркеты' || type == 'Рынки' || type == 'Рестораны' || type == 'Столовые') {
          if (type == 'Кафе') {
            this.map.geoObjects.add(this.cafe);
          }
          if (type == 'Магазины продуктов') {
            this.map.geoObjects.add(this.procukty);
          }
          if (type == 'Супермаркеты') {
            this.map.geoObjects.add(this.supermarket);
          }
          if (type == 'Рынки') {
            this.map.geoObjects.add(this.market);
          }
          if (type == 'Рестораны') {
            this.map.geoObjects.add(this.restaurant);
          }
          if (type == 'Столовые') {
            this.map.geoObjects.add(this.canteen);
          }
        }
        if ( type == 'Детские сады' || type == 'Школы' || type == 'Гимназии' || type == 'Техникумы' || type == 'Институты' || type == 'Университеты') {
          if (type == 'Детские сады') {
            this.map.geoObjects.add(this.kindergarten);
          }
          if (type == 'Школы') {
            this.map.geoObjects.add(this.school);
          }
          if (type == 'Гимназии') {
            this.map.geoObjects.add(this.gymnasy);
          }
          if (type == 'Институты') {
            this.map.geoObjects.add(this.institute);
          }
          if (type == 'Техникумы') {
            this.map.geoObjects.add(this.technikum);
          }
          if (type == 'Университеты') {
            this.map.geoObjects.add(this.univer);
          }
        }
        if ( type == 'Тренажерные залы' || type == 'Фитнес клубы') {
          if (type == 'Тренажерные залы') {
            this.map.geoObjects.add(this.trenazher);
          }
          if (type == 'Фитнес клубы') {
            this.map.geoObjects.add(this.fitnessClubs);
          }
        }
        if ( type == 'Аптеки' || type == 'Поликлиники' || type == 'Больницы' || type == 'Ветеринарные аптеки' || type == 'Ветеринарные клиники') {
          if (type == 'Аптеки') {
            this.map.geoObjects.add(this.apteka);
          }
          if (type == 'Поликлиники') {
            this.map.geoObjects.add(this.poliklinika);
          }
          if (type == 'Больницы') {
            this.map.geoObjects.add(this.hospital);
          }
          if (type == 'Ветеринарные аптеки') {
            this.map.geoObjects.add(this.vetapteka);
          }
          if (type == 'Ветеринарные клиники') {
            this.map.geoObjects.add(this.vetklinika);
          }
        }
        if ( type == 'Кинотеатры' || type == 'Театры' || type == 'Ночные клубы' || type == 'Цирки' || type == 'Парки') {
          if (type == 'Кинотеатры') {
            this.map.geoObjects.add(this.kino);
          }
          if (type == 'Театры') {
            this.map.geoObjects.add(this.theater);
          }
          if (type == 'Ночные клубы') {
            this.map.geoObjects.add(this.nightclub);
          }
          if (type == 'Цирки') {
            this.map.geoObjects.add(this.circus);
          }
          if (type == 'Парки') {
            this.map.geoObjects.add(this.park);
          }
        }
      }
    });
  }
  get_list() {
    console.log("get_list filters");
      this.map.geoObjects.removeAll();
    this.items = [];
    this._offer_service.list(1, 1, this.filters, this.sort, this.equipmentFilters, this.coordsPolygon).subscribe(offers => {
      for (let offer of offers) {
        //  console.log(offer);
        this.items.push(offer);
      }
      this.countOfItems.emit(this.items.length);
      if (this.clusterer != undefined) {
        this.map.geoObjects.remove(this.clusterer);
      }

      this.clusterer = new this.maps.Clusterer({
        preset: 'islands#invertedRedClusterIcons',
        clusterIconColor: '#c50101',
        groupByCoordinates: true,
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false
      });
      for (let i = 0; i < this.items.length; i++) {
        let baloon = new this.maps.Placemark([this.items[i].lat, this.items[i].lon], {}, {
          preset: 'islands#icon',
          iconColor: '#c50101',
        });
        this.clusterer.add(baloon);
      }
      this.map.geoObjects.add(this.clusterer);
    });

  }
  // initCanvas(map) {
  //
  //   let style = {
  //     strokeColor: '#252f32',
  //     strokeOpacity: 0.7,
  //     strokeWidth: 3,
  //     fillColor: '#252f32',
  //     fillOpacity: 0.4
  //   };
  //   let canvas = <HTMLCanvasElement>document.getElementById('canvas');
  //   let ctx2d = canvas.getContext('2d');
  //   let rect = map.container.getParentElement().getBoundingClientRect();
  //   canvas.width = rect.width;
  //   canvas.height = rect.height;
  //
  //   ctx2d.globalAlpha = style.strokeOpacity;
  //   ctx2d.strokeStyle = style.strokeColor;
  //   ctx2d.lineWidth = style.strokeWidth;
  //
  //   let ymaps1 = document.documentElement.getElementsByTagName('ymaps');
  //
  //
  //   let coordinates: any[] = [];
  //   let coordinatesReduced: any[] = [];
  //   let arrayCoordsOne: any[] = [];
  //   let arrayCoordsTwo: any[] = [];
  //   let q = 0;
  //   canvas.addEventListener('touchstart', e => {
  //     document.body.style.setProperty('overflow', 'hidden');
  //     scrollLock.disablePageScroll();
  //       coordinates = [];
  //       coordinatesReduced = [];
  //       arrayCoordsTwo = [];
  //       arrayCoordsOne = [];
  //     this.map.geoObjects.removeAll();
  //     this.map.geoObjects.add(this.yellowCol);
  //     this.polygons = [];
  //   }, { passive: false });
  //
  //   canvas.ontouchmove = function (e) {
  //     scrollLock.disablePageScroll();
  //      coordinates.push([e.changedTouches[0].pageX, rect.height - (document.documentElement.offsetHeight - e.changedTouches[0].pageY)]);
  //     ctx2d.clearRect(0, 0, canvas.width, canvas.height);
  //     ctx2d.beginPath();
  //     ctx2d.moveTo(coordinates[0][0], coordinates[0][1]);
  //     for (let i = 1; i < coordinates.length; i++) {
  //       ctx2d.lineTo(coordinates[i][0], coordinates[i][1]);
  //     }
  //     ctx2d.stroke();
  //   }.bind(this);
  //
  //
  //   canvas.addEventListener('touchend', e => {
  //     scrollLock.enablePageScroll();
  //     let calc = Math.floor(coordinates.length / 15);
  //
  //     // map.panes.remove(pane);
  //       let bounds = this.map.getBounds();
  //       let latDiff = bounds[1][0] - bounds[0][0];
  //       let lonDiff = bounds[1][1] - bounds[0][1];
  //     let coords: any[] = [];
  //     for (let i = 0; i < coordinates.length; i++) {
  //       if ( i % calc == 0 ) {
  //         let lon = bounds[0][1] + (coordinates[i][0] / canvas.width) * lonDiff;
  //         let lat = bounds[0][0] + (1 - coordinates[i][1] / canvas.height) * latDiff;
  //         coords.push([lat, lon]);
  //       }
  //     }
  //     this.coordsPolygon = coords;
  //     this.coordsPol.emit(coords);
  //     this.geoObject = new this.maps.Polygon([coords], {}, style);
  //  //   this.polygons.push(geoObject, polyOne, polyTwo, polyThree);
  //
  //     this.map.geoObjects.add(this.geoObject);
  //     this.drawActive = false;
  //     ctx2d.clearRect(0, 0, canvas.width, canvas.height);
  //     canvas.style.setProperty('display', 'none');
  //     this.map.behaviors.enable('drag');
  //     document.body.style.setProperty('overflow', 'unset');
  //   }, { passive: false });
  // }
  // draw() {
  //   let canvas = document.getElementById('canvas');
  //   canvas.style.setProperty('display', 'block');
  // }
  initMap(maps) {
    this.maps = maps;
    this.map = new maps.Map('ymapsContainer', {
        center: this.initCoords,
        zoom: this.initZoom,
        controls: ['geolocationControl', 'zoomControl']
      }, {suppressMapOpenBlock: true}
    );
  // this.initCanvas(this.map);
    this.free_parking = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#0A145B',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.paid_parking = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#0A145B',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.all_parking = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#0A145B',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.cafe = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#FB8C00',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.market = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#FB8C00',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.restaurant = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#FB8C00',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.canteen = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#FB8C00',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.procukty = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#FB8C00',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.supermarket = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#FB8C00',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.kindergarten = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#3F51B5',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.school = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#3F51B5',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.gymnasy = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#3F51B5',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.institute = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#3F51B5',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.technikum = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#3F51B5',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.univer = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#3F51B5',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.fitnessClubs = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#1E88E5',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.trenazher = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#1E88E5',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.apteka = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#00897B',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.poliklinika = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#00897B',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.hospital = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#00897B',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.vetapteka = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#00897B',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.vetklinika = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#00897B',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.kino = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#8E24AA',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.circus = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#8E24AA',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.park = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#8E24AA',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.theater = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#8E24AA',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
    this.nightclub = new this.maps.Clusterer({
      preset: 'islands#invertedRedClusterIcons',
      clusterIconColor: '#8E24AA',
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });
      let mapStyle = document.getElementsByClassName('ymaps-2-1-74-ground-pane') as HTMLCollectionOf<HTMLElement>;
      if (mapStyle.length != 0) {
          mapStyle.item(0).style.setProperty('filter', 'grayscale(.9)');
      }

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
    let coordsArray = this.map.getBounds();
    this.coordsPolygon = [{lat: coordsArray[0][0], lon: coordsArray[0][1]}, {lat: coordsArray[0][0], lon: coordsArray[1][1]}, {lat: coordsArray[1][0], lon: coordsArray[1][1]}, { lat: coordsArray[1][0], lon: coordsArray[0][1]}];
    this.coordsPol.emit(this.coordsPolygon);
    // actionend
    this.map.events.add('boundschange', e => {
      coordsArray = this.map.getBounds();
      this.changedCenter.emit(this.map.getCenter());
      this.changedZoom.emit(this.map.getZoom());
      this.coordsPolygon = [{lat: coordsArray[0][0], lon: coordsArray[0][1]}, {lat: coordsArray[0][0], lon: coordsArray[1][1]}, {lat: coordsArray[1][0], lon: coordsArray[1][1]}, { lat: coordsArray[1][0], lon: coordsArray[0][1]}];
      this.coordsPol.emit(this.coordsPolygon);
      this.get_list();
    });
    // this.coordsPolygon = [coordsArray[0], [coordsArray[0][0], coordsArray[1][1]], coordsArray[1], [coordsArray[1][0], coordsArray[0][1]]];
    this.get_list();

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

  }


  selectOption(blockId, optionId, name, varToChange, param) {
    let buttonBox = document.getElementsByClassName('filters-options-box') as HTMLCollectionOf<HTMLElement>;
    if (buttonBox.item(blockId).children[optionId].classList.contains('selected')) {
      buttonBox.item(blockId).children[optionId].classList.remove('selected');
      let selected = [];
      for (let i = 0; i < buttonBox.item(blockId).childNodes.length; i++) {
        if (buttonBox.item(blockId).children[i].classList.contains('selected')) {
          if (buttonBox.item(blockId).children[i].children[0].innerHTML == 'Дом/Коттедж/Дача') {
            selected.push('Дом Коттедж Дача');
          } else {
            selected.push(buttonBox.item(blockId).children[i].children[0].innerHTML);
          }
        }
      }
      if (blockId == 9 || blockId == 10 || blockId == 11 || blockId == 12 || blockId == 13 || blockId == 14) {
        let x, y;
        switch (this.filters.city) {
          case 'Хабаровск':
            y = 48.48272;
            x = 135.08379;
            break;
          case 'Владивосток':
            y = 43.15;
            x = 131.90;
            break;
          case 'Комсомольск-на-Амуре':
            y = 50.549923;
            x = 137.007948;
            break;
        }
        if (x != undefined && y != undefined) {
          this.requestMaps(x, y, name, 'delete');
        }
      }

      if (blockId == 1) {
        this.filters.isMiddleman = undefined;
      } else if (blockId == 3) {
        if (selected.length == 1) {
          name = selected[0];
        }
        if (selected.length > 1) {
          name = 'от ' + selected[0] + ' до ' + selected[selected.length - 1];
        }
        if (selected.length == 0) {
          name = '';
        }
      } else if (blockId == 4) {
        if (selected.length == 1) {
          name = 'до ' + selected[0] + ' рублей';
        }
        if (selected.length > 1) {
          name = 'от ' + selected[0] + ' до ' + selected[selected.length - 1] + ' рублей';
        }
        if (selected.length == 0) {
          name = '';
        }
      } else if (blockId == 5) {
        switch (optionId) {
          case 0:
            this.equipmentFilters.complete = undefined;
            break;
          case 1:
            this.equipmentFilters.living_room_furniture = undefined;
            break;
          case 2:
            this.equipmentFilters.kitchen_furniture = undefined;
            break;
          case 3:
            this.equipmentFilters.couchette = undefined;
            break;
          case 4:
            this.equipmentFilters.bedding = undefined;
            break;
          case 5:
            this.equipmentFilters.dishes = undefined;
            break;
          case 6:
            this.equipmentFilters.refrigerator = undefined;
            break;
          case 7:
            this.equipmentFilters.washer = undefined;
            break;
          case 8:
            this.equipmentFilters.microwave_oven = undefined;
            break;
          case 9:
            this.equipmentFilters.air_conditioning = undefined;
            break;
          case 10:
            this.equipmentFilters.dishwasher = undefined;
            break;
          case 11:
            this.equipmentFilters.tv = undefined;
            break;
        }
      } else if (blockId == 6) {
        switch (optionId) {
          case 0:
            this.equipmentFilters.with_animals = undefined;
            break;
          case 1:
            this.equipmentFilters.with_children = undefined;
            break;
          case 2:
            this.equipmentFilters.can_smoke = undefined;
            break;
          case 3:
            this.equipmentFilters.activities = undefined;
            break;
        }
      } else if (blockId == 7) {
        if (name == 'дате') {
          this.sortArray.addDate = undefined;
        } else if (name == 'цене') {
          this.sortArray.ownerPrice = undefined;
        } else if (name == 'рейтингу') {
          this.sortArray.finalRaiting = undefined;
        }
      } else if (blockId == 8) {
        this.filters.addDate = undefined;
      }  else {
        name = '';
        for (let i = 0; i < selected.length; i++) {
          name += selected[i] + ' ';
        }
      }
      this.changeNameButton(blockId, name, varToChange, '');
    } else {
      buttonBox.item(blockId).children[optionId].classList.add('selected');
      let selected = [];
      if (blockId == 9 || blockId == 10 || blockId == 11 || blockId == 12 || blockId == 13 || blockId == 14) {
        let x, y;
        switch (this.filters.city) {
          case 'Хабаровск':
            y = 48.48272;
            x = 135.08379;
            break;
          case 'Владивосток':
            y = 43.15;
            x = 131.90;
            break;
          case 'Комсомольск-на-Амуре':
            y = 50.549923;
            x = 137.007948;
            break;
        }
        if (x != undefined && y != undefined) {
          this.requestMaps(x, y, name, 'add');
        }
      }

      for (let i = 0; i < buttonBox.item(blockId).childNodes.length; i++) {
        if (buttonBox.item(blockId).children[i].classList.contains('selected')) {
          if (buttonBox.item(blockId).children[i].children[0].innerHTML == 'Дом/Коттедж/Дача') {
            selected.push('Дом Коттедж Дача');
          } else {
            selected.push(buttonBox.item(blockId).children[i].children[0].innerHTML);
          }

        }
      }

      if (blockId == 1) {
        this.filters.isMiddleman = param;
      } else if (blockId == 3) {
        if (selected.length == 1) {
          name = selected[0];
        }
        if (selected.length > 1) {
          name = 'от ' + selected[0] + ' до ' + selected[selected.length - 1];
        }
        if (selected.length == 0) {
          name = '';
        }
      } else if (blockId == 4) {
        if (selected.length == 1) {
          name = 'до ' + selected[0] + ' рублей';
        }
        if (selected.length > 1) {
          name = 'от ' + selected[0] + ' до ' + selected[selected.length - 1] + ' рублей';
        }
        if (selected.length == 0) {
          name = '';
        }
      } else if (blockId == 5) {
        switch (optionId) {
          case 0:
            this.equipmentFilters.complete = 1;
            break;
          case 1:
            this.equipmentFilters.living_room_furniture = 1;
            break;
          case 2:
            this.equipmentFilters.kitchen_furniture = 1;
            break;
          case 3:
            this.equipmentFilters.couchette = 1;
            break;
          case 4:
            this.equipmentFilters.bedding = 1;
            break;
          case 5:
            this.equipmentFilters.dishes = 1;
            break;
          case 6:
            this.equipmentFilters.refrigerator = 1;
            break;
          case 7:
            this.equipmentFilters.washer = 1;
            break;
          case 8:
            this.equipmentFilters.microwave_oven = 1;
            break;
          case 9:
            this.equipmentFilters.air_conditioning = 1;
            break;
          case 10:
            this.equipmentFilters.dishwasher = 1;
            break;
          case 11:
            this.equipmentFilters.tv = 1;
            break;
        }

      } else if (blockId == 6) {
        switch (optionId) {
          case 0:
            this.equipmentFilters.with_animals = 1;
            break;
          case 1:
            this.equipmentFilters.with_children = 1;
            break;
          case 2:
            this.equipmentFilters.can_smoke = 1;
            break;
          case 3:
            this.equipmentFilters.activities = 1;
            break;
        }
      } else if (blockId == 8) {
        switch (name) {
          case '1 день':
            this.filters.addDate = "1";
            break;
          case '3 дня':
            this.filters.addDate = "3";
            break;
          case 'Неделя':
            this.filters.addDate = "7";
            break;
          case '2 недели':
            this.filters.addDate = "14";
            break;
          case 'Месяц':
            this.filters.addDate = "30";
            break;
          case '3 месяца':
            this.filters.addDate = "90";
            break;
        }
      } else {
        name = '';
        for (let i = 0; i < selected.length; i++) {
          if (selected.length > 1) {
            name += selected[i] + ' ';
          } else {
            name += selected[i];
          }
        }
      }
      this.changeNameButton(blockId, name, varToChange, param);
    }
  }
  get_count_cities(city, city_var) {
    let filter = {
      'city': city
    };
    this._offer_service.list(1, 1,  filter, '', '', '').subscribe(offers => {
      city_var = offers.length;
    });
  }
  changeNameButton(id, name, varToChange, param) {
    switch (varToChange) {
      case 'cityButton': {
        this.filters.city = name;
        break;
      }
      case 'offer': {
        this.filters.contactType = param;
        break;
      }
      case 'typeOfObject': {
        this.filters.typeCode = name;
        break;
      }
      case 'countOfRooms': {
        this.filters.roomsCount = name;
        break;
      }
      case 'cost': {
        this.filters.price = name;
        break;
      }
      case 'sort': {
        console.log(param);
        if (name === 'Дате добавления') {
          this.sortArray.addDate = param;
        } else if (name === 'Стоимости') {
          this.sortArray.ownerPrice = param;
        } else if (name === 'Рейтингу') {
          this.sortArray.finalRaiting = param;
        }
        break;
      }
    }
    this.sendSortFunc();
    this.sendFiltersFunc();
    this.sendEquipmentFunc();
    this.get_list();
    // this.get_list();
  }

  sendFiltersFunc() {
    this.sendFilters.emit(this.filters);
  }
  sendEquipmentFunc() {
    this.sendEquipment.emit(this.equipmentFilters);
  }
  sendSortFunc() {
    this.sendSort.emit(this.sortArray);
  }

  check() {
    let add_block = document.documentElement.getElementsByClassName('add-block-menu') as HTMLCollectionOf<HTMLElement>;
    if (this.localStorage.getItem('logged_in') != null && this.localStorage.getItem('logged_in') == 'true') {
      add_block.item(1).classList.remove('close');
    } else {
      add_block.item(0).classList.remove('close');
    }
  }
}
