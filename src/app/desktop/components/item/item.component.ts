import {LOCAL_STORAGE} from '@ng-toolkit/universal';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {
    ContentChildren,
    Directive,
    ElementRef,
    HostListener,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import {
    animate,
    AnimationBuilder,
    AnimationFactory,
    AnimationPlayer,
    style,
} from '@angular/animations';
import {Item} from '../../../item';
import {ActivatedRoute} from '@angular/router';
import {AccountService} from '../../../services/account.service';
import * as moment from 'moment';
import {Title} from '@angular/platform-browser';
import 'moment/locale/ru.js';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../../services/config.service';
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./item.component.css']
})


export class ItemComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() item: Item;
    @Input() mode: string;
    @Input() similarOpen: any;
    @Input() watched: boolean;
    @Input() historyOpen: boolean;
    @Input() historyId: number;
    @Input() compare: boolean;
    @Input() compareItem: boolean;
    @Input() loggingMode: any;
    @Input() payingMode: any;
    @ViewChild('carousel', {static: false}) private carousel: ElementRef;

    offItem = Item;
    private player: AnimationPlayer;
    private currentSlide = 0;
    carouselWrapperStyle = {};
    itemWidth: any;

    photoBlockOpen = false;
    photos: any[] = [];
    positionPhoto = 0;
    favHovered = false;
    countPhoto = 1;
    number = 1;
    src: any;
    width = 585; // ширина изображения
    widthDocument: number;
    count = 1; // количество изображений
    position = 0;
    positionImg = 0;
    items: Item[] = [];
    nearButton = 'near';
    contact = true;
    mapname: any;
    addDate: any;
    conveniencesShort = '';
    conveniences = '';
    conditions = '';
    nearObjects: any[] = [];
    nrObjs: any[] = [];
    map: any;
    objStop: any;
    timeToBusStop: any;
    time: any;
    imgLen = 0;
    formattedPrice: any;
    roomC: any;
    squareC = false;
    photo_no_title = '';
    cur_id: any;
    cur_href: any;
    servUrl: any;
    formdata: any;
    file: any;
    siteUrl: any;
    pricefields: any;
    paymentType: any;

    constructor(private ym: NgxMetrikaService,@Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute, private _http: HttpClient,private config: ConfigService,
                private _account_service: AccountService, private titleService: Title,private builder: AnimationBuilder) {
        this.servUrl = config.getConfig('servUrl');
        this.siteUrl = config.getConfig('siteUrl');
    }

    @Output() similarItem = new EventEmitter<Item>();
    @Output() closeItem = new EventEmitter();
    @Output() comparison = new EventEmitter();
    @Output() favItemMode = new EventEmitter();

    ngOnInit() {
        this.cur_href = document.location.href;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.item) {
            this.titleService.setTitle('');
            this.checkParams();
        }
    }

    ngAfterViewInit() {
        this.reSizeCarousel();
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.reSizeCarousel();
    }
    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }
    reSizeCarousel(): void {
        // re-size the container
        let photo = document.getElementsByClassName('photoBlock') as HTMLCollectionOf<HTMLElement>;
        this.itemWidth  = photo.item(0).clientWidth;
        this.carouselWrapperStyle = {
            width: `${this.itemWidth}px`,
        };
    }
    private buildAnimation(offset, time: any) {
        return this.builder.build([
            animate(time == null ? '250ms ease-in' : 0, style({ transform: `translateX(-${offset}px)` }))
        ]);
    }

    /**
     * Progresses the carousel forward by 1 slide.
     */
    next() {
        if (this.currentSlide + 1 == this.item.photos.length) {
            let arr = this.item.photos;
            let first = arr.shift();
            arr = arr.concat([first]);
            this.item.photos = arr;
            this.currentSlide--;
            this.transitionCarousel(0);
        }
        this.currentSlide = (this.currentSlide + 1) % this.item.photos.length;
        this.transitionCarousel(null);
    }

    /**
     * Regresses the carousel backwards by 1 slide.
     */
    prev() {
        // if (this.currentSlide === 0) return;
        if (this.currentSlide  == 0) {
            let arr = this.item.photos;
            let last = arr.pop();
            arr = [last].concat(arr);
            this.item.photos = arr;
            this.currentSlide++;
            this.transitionCarousel(0);
        }

        this.currentSlide =
            (this.currentSlide - 1 + this.item.photos.length) % this.item.photos.length;
        this.transitionCarousel(null);
    }

    transitionCarousel(time: any) {
        const offset = this.currentSlide * this.itemWidth;
        const myAnimation: AnimationFactory = this.buildAnimation(offset, time);
        this.player = myAnimation.create(this.carousel.nativeElement);
        this.player.play();
    }
    checkParams() {
        this.conveniencesShort = '';
        this.conditions = '';
        this.conveniences = '';
        this.pricefields = '';
        if (this.item != undefined) {
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
            if (this.item.paymentType != undefined) {
                switch (this.item.paymentType) {
                   case 'all':  {this.paymentType = 'Все'; break; }
                   case 'cashless':  {this.paymentType = 'Безналичный'; break; }
                   case 'cash': {this.paymentType = 'Наличный'; break; }
                }
            }
            if (this.item.address != undefined) {
                if (this.item.address.includes('ул.')) {
                    // console.log('ind: ', this.item.address.indexOf('ул.'));
                    this.item.address = this.item.address.slice(this.item.address.indexOf('ул.') + 3, this.item.address.length);
                }
            }

            if (this.item.conditions.bedding && this.item.conditions.kitchen_furniture && this.item.conditions.living_room_furniture) {
                this.conveniencesShort += 'Мебель да\n';
            } else if (this.item.conditions.bedding || this.item.conditions.kitchen_furniture || this.item.conditions.living_room_furniture) {
                this.conveniencesShort += 'Мебель частично\n';
            } else {
                this.conveniencesShort += 'Мебель нет\n';
            }

            if (this.item.conditions.refrigerator && this.item.conditions.washer &&
                this.item.conditions.dishwasher && this.item.conditions.microwave_oven &&
                this.item.conditions.air_conditioning && this.item.conditions.tv) {
                this.conveniencesShort += 'Бытовая техника да\n';
            } else if (this.item.conditions.refrigerator || this.item.conditions.washer ||
                this.item.conditions.dishwasher || this.item.conditions.microwave_oven ||
                this.item.conditions.air_conditioning || this.item.conditions.tv) {
                this.conveniencesShort += 'Бытовая техника частично\n';
            } else {
                this.conveniencesShort += 'Бытовая техника нет\n';
            }
            if (this.item.conditions.dishes != null && this.item.conditions.dishes) {
                this.conveniences += 'Посуда, ';
            }
            if (this.item.conditions.bedding != null && this.item.conditions.bedding) {
                this.conveniences += 'Постельные принадлежности, ';
            }
            if (this.item.conditions.couchette != null && this.item.conditions.couchette) {
                this.conveniences += 'Спальная мебель, ';
            }
            if (this.item.conditions.kitchen_furniture != null && this.item.conditions.kitchen_furniture) {
                this.conveniences += 'Кухонная мебель, ';
            }
            if (this.item.conditions.living_room_furniture != null && this.item.conditions.living_room_furniture) {
                this.conveniences += 'Гостиная мебель, ';
            }
            if (this.item.conditions.tv != null && this.item.conditions.tv) {
                this.conveniences += 'Телевизор, ';
            }
            if (this.item.conditions.refrigerator != null && this.item.conditions.refrigerator) {
                this.conveniences += 'Холодильник, ';
            }
            if (this.item.conditions.washer != null && this.item.conditions.washer) {
                this.conveniences += 'Стиральная машина, ';
            }
            if (this.item.conditions.dishwasher != null && this.item.conditions.dishwasher) {
                this.conveniences += 'Посудомоечная машина, ';
            }
            if (this.item.conditions.microwave_oven != null && this.item.conditions.microwave_oven) {
                this.conveniences += 'СВЧ-печь, ';
            }
            if (this.item.conditions.air_conditioning != null && this.item.conditions.air_conditioning) {
                this.conveniences += 'Кондиционер, ';
            }
            if (this.item.conditions.with_animals != null && this.item.conditions.with_animals) {
                this.conditions += 'Можно с животными, ';
            }
            if (this.item.conditions.with_children != null && this.item.conditions.with_children) {
                this.conditions += 'Можно с детьми, ';
            }
            if (this.item.prepayment != null && this.item.prepayment) {
                this.conditions += 'Залог да, ';
                this.conveniencesShort += 'Залог да\n';
            } else {
                this.conditions += 'Залог нет, ';
                this.conveniencesShort += 'Залог нет\n';
            }
            if (this.item.deposit != null && this.item.deposit) {
                this.conditions += 'Депозит да, ';
                this.conveniencesShort += 'Депозит да\n';
            } else {
                this.conditions += 'Депозит нет, ';
                this.conveniencesShort += 'Депозит нет\n';
            }
            if (this.item.gasPay != null && this.item.gasPay) {
                this.pricefields += 'Счетчик на газ, ';
            }
            if (this.item.electrificPay != null && this.item.electrificPay) {
                this.pricefields += 'Счетчик на электроэнергию, ';
            }
            if (this.item.waterPay != null && this.item.waterPay) {
                this.pricefields += 'Счетчик на воду, ';
            }
            if (this.item.heatingPay != null && this.item.heatingPay) {
                this.pricefields += 'Отопление, ';
            }
            if (this.item.utilityBills != null && this.item.utilityBills) {
                this.pricefields += 'Коммунальные платежи, ';
            }
            this.conditions = this.conditions.substring(0, this.conditions.length - 2);
            this.conveniences = this.conveniences.substring(0, this.conveniences.length - 2);
            this.pricefields = this.pricefields.substring(0, this.pricefields.length - 2);

            if (this.item.photos == undefined) {
                this.imgLen = 0;
            } else {
                this.imgLen = this.item.photos.length;
            }
            this.roomC = this.item.roomsCount != undefined;
            this.squareC = this.item.squareTotal != undefined;
            this.widthDocument = document.documentElement.clientWidth;

        }
        this.getNumWithDellimet();


        if (this.compareItem && this.similarOpen) {
            this.nearButton = 'compare';
        }

        if (this.mode == 'full' && this.item != undefined) {
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
            this.checklogin();
            this.time = this.localStorage.getItem('timeAdd');
            if (!this.compare && !this.similarOpen) {
                this.mapname = 'filters-item' + this.item.id;
            } else if (this.similarOpen) {
                this.mapname = 'filters-item' + this.item.id + this.item.price;
            } else {
                this.mapname = 'filters-item' + this.item.id + this.item.squareTotal + this.item.price;
            }
            let date = this.item.addDate;
            let day = moment.unix(this.item.addDate);
            let curDate = new Date();
            let secs = curDate.getTime() / 1000;
            let timeHasCome = secs - date;
            if (timeHasCome < 86400) {
                this.addDate = 'Сегодня в ' + day.hours() + ':' + day.minutes();
            } else if (timeHasCome > 86400 && timeHasCome < 86400 * 2) {
                this.addDate = 'Вчера в ' + day.hours() + ':' + day.minutes();
            } else if (timeHasCome > 86400 * 2 && timeHasCome < 86400 * 3) {
                this.addDate = 'Позавчера в ' + day.hours() + ':' + day.minutes();
            } else {
                let hour = '';
                if (Math.floor(timeHasCome / 60 / 60 / 24) < 4) {
                    hour = Math.floor(timeHasCome / 60 / 60 / 24) + ' дня ';
                } else {
                    hour = Math.floor(timeHasCome / 60 / 60 / 24) + ' дней ';
                }
                this.addDate = hour + 'назад в ' + day.hours() + ':' + day.minutes();
            }
        }
    }

    getNumWithDellimet() {
        if (this.item != undefined) {
            this.formattedPrice = this.item.price != undefined ? this.item.price.toString() : '';
            this.formattedPrice = this.formattedPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        }
    }

    openBlock(page) {
        let slide = document.getElementsByClassName('right-slide-box') as HTMLCollectionOf<HTMLElement>;
        let useless = document.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
        let header = document.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
        switch (page) {
            case 'login':
                slide.item(0).classList.add('open');
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
                        slide.item(0).style.setProperty('top', '60px');
                        slide.item(0).style.setProperty('height', 'calc(100vh - 60px)');
                    } else {
                        slide.item(0).style.setProperty('top', '190px');
                        slide.item(0).style.setProperty('height', 'calc(100vh - 190px)');
                    }
                }
                break;
            case 'pay':
                slide.item(1).classList.add('open');
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
                        slide.item(1).style.setProperty('top', '60px');
                        slide.item(1).style.setProperty('height', 'calc(100vh - 60px)');
                    } else {
                        slide.item(1).style.setProperty('top', '190px');
                        slide.item(1).style.setProperty('height', 'calc(100vh - 190px)');
                    }
                }
                break;
        }
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

    log_out() {
        this._account_service.logout();
    }

    checkblock() {
        if (this.loggingMode == false || this.loggingMode == 'false' ) {
            this.openBlock('login');
        }
        if ((this.loggingMode == true || this.loggingMode == 'true') && (this.payingMode == false || this.payingMode == 'false')) {
            this.openBlock('pay');
        }
    }

    checklogin() {
        this.time = this.localStorage.getItem('timeAdd');
        this._account_service.checklogin().subscribe(res => {
            // console.log(res);
            if (res != undefined) {
                let data = JSON.parse(JSON.stringify(res));
                if (data.result == 'success') {
                    this.loggingMode = true;
                } else {
                    this.loggingMode = false;
                    this.log_out();
                }
            } else {
                this.loggingMode = false;
                this.log_out();
            }
        });
    }

    addFavObject() {
        this.checklogin();
        if (this.loggingMode) {
            this._account_service.addFavObject(this.item.id).subscribe(res => {
                console.log(res);
                this.item.is_fav = true;
                this.favItemMode.emit('add');
            });
        }
    }

    delFavObject() {
        this.checklogin();
        if (this.loggingMode) {
            this._account_service.delFavObject(this.item.id).subscribe(res => {
                console.log(res);
                this.item.is_fav = false;
                this.favItemMode.emit('del');
            });
        }
    }

    getPlaces(x, y) {
        this._account_service.getObjects(x, y, 'Остановка', '0.01').subscribe(res => {
            this.nearObjects = res;
            console.log(res);
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
            }
            console.log(places);
            let index = 0;
            for (let i = 1; i < places.length; i++) {
                if (places[index].distance > places[i].distance) {
                    index = i;
                }
            }
            if (places.length != 0) {
                let time1 = places[index].distance / 83;
                if (Math.round(time1) == 0) {
                    this.timeToBusStop = '1 мин';
                } else {
                    this.timeToBusStop = Math.round(time1) + ' мин';
                }

                this.objStop = places[index].name;

                document.getElementById('busStop').innerHTML = this.objStop;
                document.getElementById('timeToBus').innerHTML = this.timeToBusStop;
                //    this.getRouteStopTime(coords, coor1);

            }
        });
    }

    changeSize() {
        this.widthDocument = document.documentElement.clientWidth;
        let objects = document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        this.width = objects.item(objects.length - 1).offsetWidth;
    }

    close(name) {
        this.closeItem.emit(name);
    }

    prevImg(block) {
        let photo = document.getElementsByClassName('carousel-li-img' + block + '' + this.item.id) as HTMLCollectionOf<HTMLElement>;
        let widthImg = photo.item(0).clientWidth;
        const list = document.getElementById('carousel-ul-img' + block + '' + this.item.id) as HTMLElement;
        this.positionImg = Math.min(this.positionImg + widthImg, 0);
        list.style.setProperty('margin-left', this.positionImg + 'px');
    }

    nextImg(block) {
        let photo = document.getElementsByClassName('carousel-li-img' + block + '' + this.item.id) as HTMLCollectionOf<HTMLElement>;
        let widthImg = photo.item(0).clientWidth;
        // console.log('widthimg: ' + widthImg);
        const list = document.getElementById('carousel-ul-img' + block + '' + this.item.id) as HTMLElement;
        this.positionImg = Math.max(this.positionImg - widthImg, -widthImg * (this.item.photos.length - 1));
        list.style.setProperty('margin-left', this.positionImg + 'px');
    }
}
