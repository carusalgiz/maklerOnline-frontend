import {LOCAL_STORAGE, WINDOW} from '@ng-toolkit/universal';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    OnChanges,
    AfterViewInit,
    Inject,
    SimpleChanges
} from '@angular/core';
import {Item} from '../../../class/item';
import ymaps from 'ymaps';
import * as moment from 'moment';
import 'moment/locale/ru.js';
import {ActivatedRoute} from '@angular/router';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';
import {ConfigService} from "../../../services/config.service";
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
import {Person} from '../../../class/person';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, AfterViewInit, OnChanges {
    constructor(private ym: NgxMetrikaService,@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute,config: ConfigService,
                private _offer_service: OfferService,
                private _account_service: AccountService) {
        this.siteUrl = config.getConfig('siteUrl');
    }

    @Input() item: Item;
    @Input() mode: string;
    @Input() watched: boolean;
    @Input() historyOpen: boolean;
    @Input() id: number;
    @Input() historyId: number;
    @Input() currentPage: string;
    @Input() loggingMode: any;
    @Input() payingMode: any;

    siteUrl: any;
    loggedIn = false;
    objStop: any;
    timeToBusStop: any;
    addDate: any;
    photoBlockOpen = false;
    photos: any[] = [];
    widthPhotoBlock: number;
    positionPhoto = 0;
    countPhoto = 1;
    number = 1;
    nearButton = true;
    contact: any;
    width = 450; // ширина изображения
    widthDocument: number;
    count = 1; // количество изображений
    position = 0;
    items: Item[] = [];
    nearObjects: any[] = [];
    nrObjs: any[] = [];
    conveniencesShort = '';
    conveniences = '';
    conditions = '';
    formattedPrice = '0';
    imgLen = 0;
    imgSrc: any;
    time: any;
    length = false;
    src = 'https://makleronline.net/assets/noph.png';
    photo_no_title: any;
    commission = 0;
    name_first = '';
    name_second = '';
    person: Person = new Person();

    @Output() closeItem = new EventEmitter();
    @Output() changePhone = new EventEmitter();

    ngOnInit() {
        if (this.item.photos == undefined) {
            this.imgLen = 0;
        } else {
            this.imgLen = this.item.photos.length;
            this.src = this.item.photos[0] != undefined ? this.item.photos[0].href : 'https://makleronline.net/assets/noph.png';
        }
        this.getNumWithDellimet();
        this.widthPhotoBlock = document.documentElement.clientWidth;
        this.widthDocument = document.documentElement.clientWidth;
        if (this.widthDocument < 450) {
            this.width = this.widthDocument;
        }
        let desk = document.getElementsByClassName('desk') as HTMLCollectionOf<HTMLElement>;
        this.length = desk.length !== 0;
        if (this.mode == 'item' || this.mode == 'item_request') {
            // this.checklogin();
            this.time = this.localStorage.getItem("timeAdd");
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.checkParams();
        // if (changes.item != undefined) {
        //     if (changes.item.currentValue != undefined && changes.item.previousValue != undefined) {
        //         if (changes.item.currentValue != changes.item.previousValue) {
        //             this.checkParams();
        //         }
        //     }
        // }
        // if (changes.mode != undefined) {
        //     if (changes.mode.currentValue != changes.mode.previousValue && changes.mode.currentValue == 'contact') {
        //         this.checkParams();
        //     }
        // }
    }
    ngAfterViewInit() {
        if (this.mode == "item" || this.mode == 'item_request') {
            document.getElementById('filters-map-map').style.setProperty('height', '300px');

            ymaps.load('https://api-maps.yandex.ru/2.1/?apikey=<ADRpG1wBAAAAtIMIVgMAmOY9C0gOo4fhnAstjIg7y39Ls-0AAAAAAAAAAAAbBvdv4mKDz9rc97s4oi4IuoAq6g==>&lang=ru_RU&amp;load=package.full').then(maps => {
                const map = new maps.Map('filters-map-map', {
                        center: [48.4862268, 135.0826369],
                        zoom: 17,
                        controls: ["geolocationControl"]
                    }, {suppressMapOpenBlock: true}
                );
                map.behaviors.disable('drag');

                let baloon = new maps.Placemark([this.item.lat, this.item.lon], {}, {
                    preset: 'islands#icon',
                    iconColor: '#c50101',
                });
                map.geoObjects.add(baloon);
                map.setCenter([this.item.lat, this.item.lon], 17);
                let mapStyle = document.getElementsByClassName('ymaps-2-1-75-ground-pane') as HTMLCollectionOf<HTMLElement>;
                mapStyle.item(0).style.setProperty('filter', 'grayscale(.9)');
            }).catch(error => console.log('Failed to load Yandex Maps', error));
            // let date = this.item.addDate;
            // let day = moment.unix(this.item.addDate);
            // let curDate = new Date();
            // let secs = curDate.getTime() / 1000;
            // let timeHasCome = secs - date;
            // if (timeHasCome < 86400) {
            //     if (day.minutes() < 10) {
            //         this.addDate = 'сегодня, ' + day.format("dddd") + ' в ' + day.hours() + ':0' + day.minutes();
            //     } else {
            //         this.addDate = 'сегодня, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
            //     }
            // } else if (timeHasCome > 86400 && timeHasCome < 86400 * 2) {
            //     if (day.minutes() < 10) {
            //         this.addDate = 'вчера, ' + day.format("dddd") + ' в ' + day.hours() + ':0' + day.minutes();
            //     } else {
            //         this.addDate = 'вчера, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
            //     }
            // } else if (timeHasCome > 86400 * 2 && timeHasCome < 86400 * 3) {
            //     if (day.minutes() < 10) {
            //         this.addDate = 'позавчера, ' + day.format("dddd") + ' в ' + day.hours() + ':0' + day.minutes();
            //     } else {
            //         this.addDate = 'позавчера, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
            //     }
            // } else {
            //     let hour = '';
            //     if (Math.floor(timeHasCome / 60 / 60 / 24) < 4) {
            //         hour = Math.floor(timeHasCome / 60 / 60 / 24) + ' дня ';
            //     } else {
            //         hour = Math.floor(timeHasCome / 60 / 60 / 24) + ' дней ';
            //     }
            //     if (day.minutes() < 10) {
            //         this.addDate = hour + 'назад, ' + day.format("dddd") + ' в ' + day.hours() + ':0' + day.minutes();
            //     } else {
            //         this.addDate = hour + 'назад, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
            //     }
            // }
            // this.getPlaces(this.item.lon, this.item.lat, [this.item.lon, this.item.lat]);
            this.window.scrollTo(0, 0);
        }
        // this.changeSize();
    }
    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }
    checkParams() {
        this.conveniencesShort = '';
        this.conditions = '';
        this.conveniences = '';
        if (this.item != undefined) {
            if (this.item.conditions.bedding && this.item.conditions.kitchen_furniture && this.item.conditions.living_room_furniture) {
                this.conveniencesShort += "Мебель да\n";
            } else if (this.item.conditions.bedding || this.item.conditions.kitchen_furniture || this.item.conditions.living_room_furniture) {
                this.conveniencesShort += "Мебель частично\n";
            } else {
                this.conveniencesShort += "Мебель нет\n";
            }

            if (this.item.conditions.refrigerator && this.item.conditions.washer &&
                this.item.conditions.dishwasher && this.item.conditions.microwave_oven &&
                this.item.conditions.air_conditioning && this.item.conditions.tv) {
                this.conveniencesShort += "Бытовая техника да\n";
            } else if (this.item.conditions.refrigerator || this.item.conditions.washer ||
                this.item.conditions.dishwasher || this.item.conditions.microwave_oven ||
                this.item.conditions.air_conditioning || this.item.conditions.tv) {
                this.conveniencesShort += "Бытовая техника частично\n";
            } else {
                this.conveniencesShort += "Бытовая техника нет\n";
            }
            if (this.item.conditions.dishes != null && this.item.conditions.dishes) {
                this.conveniences += "Посуда, ";
            }
            if (this.item.conditions.bedding != null && this.item.conditions.bedding) {
                this.conveniences += "Постельные принадлежности, ";
            }
            if (this.item.conditions.couchette != null && this.item.conditions.couchette) {
                this.conveniences += "Спальная мебель, ";
            }
            if (this.item.conditions.kitchen_furniture != null && this.item.conditions.kitchen_furniture) {
                this.conveniences += "Кухонная мебель, ";
            }
            if (this.item.conditions.living_room_furniture != null && this.item.conditions.living_room_furniture) {
                this.conveniences += "Гостиная мебель, ";
            }
            if (this.item.conditions.tv != null && this.item.conditions.tv) {
                this.conveniences += "Телевизор, ";
            }
            if (this.item.conditions.refrigerator != null && this.item.conditions.refrigerator) {
                this.conveniences += "Холодильник, ";
            }
            if (this.item.conditions.washer != null && this.item.conditions.washer) {
                this.conveniences += "Стиральная машина, ";
            }
            if (this.item.conditions.dishwasher != null && this.item.conditions.dishwasher) {
                this.conveniences += "Посудомоечная машина, ";
            }
            if (this.item.conditions.microwave_oven != null && this.item.conditions.microwave_oven) {
                this.conveniences += "СВЧ-печь, ";
            }
            if (this.item.conditions.air_conditioning != null && this.item.conditions.air_conditioning) {
                this.conveniences += "Кондиционер, ";
            }
            if (this.item.conditions.with_animals != null && this.item.conditions.with_animals) {
                this.conditions += "Можно с животными, ";
            }
            if (this.item.conditions.with_children != null && this.item.conditions.with_children) {
                this.conditions += "Можно с детьми, ";
            }
            if (this.item.prepayment != null && this.item.prepayment) {
                this.conditions += "Депозит да, ";
                this.conveniencesShort += "Депозит да\n";
            } else {
                this.conditions += "Депозит нет, ";
                this.conveniencesShort += "Депозит нет\n";
            }
            if (this.item.name != undefined) {
                let spArray = this.item.name.split(" ");
                let ret = spArray[0].toUpperCase();
                if (spArray.length > 1) {
                    for (let i = 1; i < spArray.length; i++) {
                        ret += " " + spArray[i];
                    }
                }
                this.item.name = ret;
            }
            console.log(this.item);
            this._account_service.contactInfo(this.item.person.id).subscribe(res1 => {
                let result = JSON.parse(JSON.stringify(res1));
                if (result.person){
                    this.person = result.person;
                    if (this.person.name != undefined) {
                        let spArray = this.item.name.split(" ");
                        this.name_first = spArray[0].toUpperCase();
                        if (spArray.length > 1) {
                            for (let i = 1; i < spArray.length; i++) {
                                this.name_second += spArray[i] + " " ;
                            }
                        }
                    }
                }
            });

            this.conditions = this.conditions.substring(0, this.conditions.length - 2);
            this.conveniences = this.conveniences.substring(0, this.conveniences.length - 2);

            if (this.item.photos == undefined) {
                this.imgLen = 0;
            } else {
                this.imgLen = this.item.photos.length;
            }
            if (this.item.photos != undefined) {
                this.src = this.item.photos[0] != undefined ? this.item.photos[0].href : 'https://makleronline.net/assets/noph.png';
            }
            this.widthDocument = document.documentElement.clientWidth;

        }
        this.getNumWithDellimet();
        // this.checklogin();

        if ((this.mode == 'item' || this.mode == 'request_item') && this.item != undefined) {
            this.time = this.localStorage.getItem("timeAdd");

            let date = this.item.addDate;
            let day = moment.unix(this.item.addDate);
            let curDate = new Date();
            let secs = curDate.getTime() / 1000;
            let timeHasCome = secs - date;
            if (timeHasCome < 86400) {
                if (day.minutes() < 10) {
                    this.addDate = 'сегодня, ' + day.format("dddd") + ' в ' + day.hours() + ':0' + day.minutes();
                } else {
                    this.addDate = 'сегодня, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
                }
            } else if (timeHasCome > 86400 && timeHasCome < 86400 * 2) {
                if (day.minutes() < 10) {
                    this.addDate = 'вчера, ' + day.format("dddd") + ' в ' + day.hours() + ':0' + day.minutes();
                } else {
                    this.addDate = 'вчера, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
                }
            } else if (timeHasCome > 86400 * 2 && timeHasCome < 86400 * 3) {
                if (day.minutes() < 10) {
                    this.addDate = 'позавчера, ' + day.format("dddd") + ' в ' + day.hours() + ':0' + day.minutes();
                } else {
                    this.addDate = 'позавчера, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
                }
            } else {
                let hour = '';
                if (Math.floor(timeHasCome / 60 / 60 / 24) < 4) {
                    hour = Math.floor(timeHasCome / 60 / 60 / 24) + ' дня ';
                } else {
                    hour = Math.floor(timeHasCome / 60 / 60 / 24) + ' дней ';
                }
                if (day.minutes() < 10) {
                    this.addDate = hour + 'назад, ' + day.format("dddd") + ' в ' + day.hours() + ':0' + day.minutes();
                } else {
                    this.addDate = hour + 'назад, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
                }
            }

            // this.getPlaces(this.item.lon, this.item.lat, [this.item.lon, this.item.lat]);
        }
        setTimeout( () => {

            if (this.item.photos != undefined) {
                if (this.item.photos[0] != undefined) {
                    this.src = this.item.photos[0].href;
                } else {
                    this.src = '../../../../assets/noph.png';
                    this.photo_no_title = 'ФОТО НЕТ';
                }
            } else {
                this.src = '../../../../assets/noph.png';
                this.photo_no_title = 'ФОТО НЕТ';

            }
        }, 200);
    }

    closeItemBlock() {
        this.closeItem.emit();
    }

    log_out() {
        this.loggedIn = false;
        this._account_service.logout();
    }

    checklogin() {
        this.time = this.localStorage.getItem("timeAdd");
        this._account_service.checklogin().subscribe(res => {
            // console.log(res);
            if (res != undefined) {
                let data = JSON.parse(JSON.stringify(res));
                if (data.result == 'success') {
                    this.loggedIn = true;
                    this.loggingMode = true;
                } else {
                    this.loggingMode = false;
                    this.log_out();
                }
            } else {
                this.loggingMode = false;
                this.log_out();
                console.log('not athorized!');
            }
        });
    }
    addFavObject() {
        console.log(sessionStorage.getItem('useremail'));
        if (sessionStorage.getItem('useremail')!= undefined && sessionStorage.getItem('useremail') != 'email') {
            console.log(this.item.id);
            this._account_service.addFavObject(this.item.id).subscribe(res => {
                // console.log(res);
                this.item.is_fav = true;
            });
        }
    }

    delFavObject() {
        if (sessionStorage.getItem('useremail')!= undefined && sessionStorage.getItem('useremail') != 'email') {
            this._account_service.delFavObject(this.item.id).subscribe(res => {
                console.log(res);
                this.item.is_fav = false;
            });
        }
    }
    getNumWithDellimet() {
        this.formattedPrice = this.item.price.toString();
        this.formattedPrice = this.formattedPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        if (this.item.commisionType != undefined) {
            if (this.item.commisionType == 'percent') {
                let one_percent = this.item.price / 100;
                if (this.item.commission != undefined) {
                    this.commission = this.item.commission;
                } else {
                    this.commission = 0;
                }
            }
            if (this.item.commisionType == 'fix') {
                if (this.item.commission != undefined) {
                    this.commission = this.item.commission;
                } else {
                    this.commission = 0;
                }
            }
        } else {
            this.commission = 0;
        }
    }

    galleryOpen() {
        if (this.mode == 'item' || this.mode == 'item_request') {
            console.log('work gal!');
            this.photoBlockOpen = true;
            this.positionPhoto = 0;
            this.countPhoto = 1;
            this.number = 1;
            // setTimeout(() => {
            //     let listElems = document.getElementsByClassName('galPhoto') as HTMLCollectionOf<HTMLElement>;
            //     for (let i = 0; i < listElems.length; i++) {
            //         if (listElems.item(i).classList.value.indexOf('avito') != -1) {
            //             listElems.item(i).style.setProperty('height', (listElems.item(i).offsetHeight - 50) + 'px');
            //         }
            //         listElems.item(i).style.setProperty('opacity', '1');
            //     }
            // },600);

        }
    }
    changePhotoBlock(event, index) {
        let listElems = document.getElementsByClassName('galPhoto') as HTMLCollectionOf<HTMLElement>;
        if (listElems.item(index).classList.value.indexOf('avito') != -1) {
            listElems.item(index).style.setProperty('height', (listElems.item(index).offsetHeight - 50) + 'px');
        }
        listElems.item(index).style.setProperty('opacity', '1');
    }
    galleryClose() {
            this.photoBlockOpen = false;
    }

    prev() {
        const list = document.getElementById('carousel-ul') as HTMLElement;
        this.position = Math.min(this.position + this.width * this.count, 0);
        list.style.setProperty('margin-left', this.position + 'px');
    }

    next() {
        const listElems = document.getElementsByClassName('carousel-li') as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('carousel-ul') as HTMLElement;
        this.position = Math.max(this.position - this.width * this.count, -this.width * (listElems.length - this.count));
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

    selected(el: MouseEvent) {
        let items = document.getElementsByClassName('map-button-mobile') as HTMLCollectionOf<HTMLElement>;
        let items1 = document.getElementsByClassName('map-button-word-mobile') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < items.length; i++) {
            items.item(i).style.removeProperty('background-color');
            items1.item(i).style.removeProperty('border-bottom');
        }
        (<HTMLElement>el.currentTarget).style.setProperty('background-color', 'rgba(38,47,50,1)');
        (<HTMLElement>(<HTMLElement>el.currentTarget).firstChild).style.setProperty('border-bottom', '1px solid white');
    }
    onResize() {
        this.widthPhotoBlock = document.documentElement.clientWidth;
        let bottomButtons = document.getElementsByClassName('bottom-buttons') as HTMLCollectionOf<HTMLElement>;
        if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
            if (bottomButtons.length !== 0) {
                bottomButtons.item(0).style.setProperty('display', 'none');
            }
        } else {
            if (bottomButtons.length !== 0) {
                bottomButtons.item(0).style.setProperty('display', 'block');
            }
        }
        this.positionPhoto = -this.widthPhotoBlock * (this.number - 1);
    }

    degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
        let earthRadiusKm = 6371;

        let dLat = this.degreesToRadians(lat2 - lat1);
        let dLon = this.degreesToRadians(lon2 - lon1);

        lat1 = this.degreesToRadians(lat1);
        lat2 = this.degreesToRadians(lat2);

        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }

    getPlaces(x, y, coords) {
        this._account_service.getObjects(x, y, "Остановка", '0.01').subscribe(res => {
            this.nearObjects = res;
            let places = [];
            for (let i = 0; i < this.nearObjects.length; i++) {
                let obj = JSON.parse(JSON.stringify(this.nearObjects[i]));
                let coord = JSON.parse(JSON.stringify(obj.geometry));
                let properties = JSON.parse(JSON.stringify(obj.properties));
                let dist = this.distanceInKmBetweenEarthCoordinates(x, y, coord.coordinates[0], coord.coordinates[1]);
                dist = Math.floor(dist * 1000);
                places.push({
                    coordinates: coord.coordinates,
                    name: properties.name,
                    distance: Math.floor(dist)
                });
                // console.log(places);
            }
            let index = 0;
            for (let i = 1; i < places.length; i++) {
                if (places[index].distance > places[i].distance) {
                    index = i;
                }
            }
            if (places.length != 0) {
                let time1 = places[index].distance / 83;
                if (Math.round(time1) == 0) {
                    this.timeToBusStop = "1 мин";
                } else {
                    this.timeToBusStop = Math.round(time1) + " мин";
                }

                this.objStop = places[index].name;

                document.getElementById('busStop').innerHTML = "Остановка " + this.objStop;
                document.getElementById('timeToBus').innerHTML = "Время в пути: " + this.timeToBusStop;
                //    this.getRouteStopTime(coords, coor1);

            }
        });
        this.requestMaps(x, y, 'Магазин', '0.007', coords);
        this.requestMaps(x, y, 'Образование', '0.007', coords);
        this.requestMaps(x, y, 'Развлечения', '0.007', coords);
        this.requestMaps(x, y, 'Здоровье', '0.007', coords);
        this.requestMaps(x, y, 'Фитнес', '0.007', coords);
        this.requestMaps(x, y, 'Банкомат', '0.007', coords);
    }

    calculateTheDistance(a1, a2, b1, b2) {
        // перевести координаты в радианы
        let lat1 = a1 * Math.PI / 180;
        let lat2 = b1 * Math.PI / 180;
        let long1 = a2 * Math.PI / 180;
        let long2 = b2 * Math.PI / 180;

// косинусы и синусы широт и разницы долгот
        let cl1 = Math.cos(lat1);
        let cl2 = Math.cos(lat2);
        let sl1 = Math.sin(lat1);
        let sl2 = Math.sin(lat2);
        let delta = long2 - long1;
        let cdelta = Math.cos(delta);
        let sdelta = Math.sin(delta);

// вычисления длины большого круга
        let y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
        let x = sl1 * sl2 + cl1 * cl2 * cdelta;

//
        let ad = Math.atan2(y, x);
        return ad * 6378137;
    }

    requestMaps(x, y, type, radius, coords) {
        this._account_service.getObjects(x, y, type, radius).subscribe(res => {
            this.nearObjects = res;
            let places = [];
            for (let i = 0; i < this.nearObjects.length; i++) {
                let obj = JSON.parse(JSON.stringify(this.nearObjects[i]));
                //   console.log(obj);
                let coord = JSON.parse(JSON.stringify(obj.geometry));
                let properties = JSON.parse(JSON.stringify(obj.properties));
                let comp = JSON.parse(JSON.stringify(properties.CompanyMetaData.Categories));
                let comp1 = JSON.parse(JSON.stringify(comp[0]));
                let cat = JSON.parse(JSON.stringify(comp1.name));
                // console.log(comp);
                // console.log(comp1);
                // console.log(cat);

                let dist = this.calculateTheDistance(x, y, coord.coordinates[0], coord.coordinates[1]);

                //    console.log(Math.floor(dist));
                places.push({
                    coordinates: coord.coordinates,
                    type: cat,
                    description: properties.description,
                    name: properties.name,
                    distance: Math.floor(dist)
                });
            }
            let index = 0;
            for (let i = 1; i < places.length; i++) {
                if (places[index].distance > places[i].distance) {
                    index = i;
                }
            }
            if (places.length != 0) {
                this.nrObjs.push({
                    coordinates: places[index].coordinates,
                    type: places[index].type,
                    description: places[index].description,
                    name: places[index].name,
                    distance: places[index].distance
                });
            }
        });
    }
}
