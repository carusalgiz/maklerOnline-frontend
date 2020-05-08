import {
    Component,
    OnChanges,
    SimpleChanges,
    AfterViewInit, Output, EventEmitter, ChangeDetectionStrategy, OnInit
} from '@angular/core';
import {
    ContentChildren,
    Directive,
    ElementRef,
    HostListener,
    Input,
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
import {Item} from '../../class/item';
import {AccountService} from '../../services/account.service';
import * as moment from 'moment';

@Component({
    selector: 'item-middle',
    inputs: ['item', 'loggingMode', 'payingMode', 'mode'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="catalog-item hovered itemBlock" id="{{item?.id}}"  [class.main-page]="mode=='main_page'">
            <div *ngIf="imgLen == 0 && mode=='main_page'" class="photoBlock"
                 style="background-size: 100% 100%;background-image: url('../../../assets/noph.png')"
                 [class.main-page]="mode=='main_page'">
                <img class="img"
                     [title]="'makleronline снять ' + item?.roomsCount + ' комнатную квартиру в хабаровске без посредников'"
                     [alt]="'makleronline аренда ' + item?.roomsCount + ' комнатной квартиры в хабаровске без посредников'"
                     [src]="src" [class.avito]="src.indexOf('avito') != -1"  [style.object-fit]="src.indexOf('assets/noph') != -1 ? 'unset' : 'cover'">
                <div class="no-photo">{{photo_no_title}}</div>
            </div>
            <div *ngIf="imgLen != 0 && mode=='main_page'" class="photoBlock" [class.main-page]="mode=='main_page'"
                 style="    background-size: 100% 100%;">
                <img class="img"
                     [title]="'makleronline снять ' + item?.roomsCount + ' комнатную квартиру в хабаровске без посредников'"
                     [alt]="'makleronline аренда ' + item?.roomsCount + ' комнатной квартиры в хабаровске без посредников'"
                     [src]="src" [class.avito]="src.indexOf('avito') != -1" [style.object-fit]="src.indexOf('assets/noph') != -1 ? 'unset' : 'cover'">
                <div class="no-photo">{{photo_no_title}}</div>
            </div>
            <div class="photoBlock" [class.watched]="item?.watched" *ngIf="imgLen > 0 && mode != 'main_page'">
                <div class="magnifier" (click)="openGallery.emit(true)"></div>
                <img class="img"
                     [title]="'makleronline снять ' + item?.roomsCount + ' комнатную квартиру в хабаровске без посредников'"
                     [alt]="'makleronline аренда ' + item?.roomsCount + ' комнатной квартиры в хабаровске без посредников'"
                     [src]="src" [class.avito]="src.indexOf('avito') != -1" [style.object-fit]="src.indexOf('assets/noph') != -1 ? 'unset' : 'cover'">
            </div>
            <div class="photoBlock" *ngIf="imgLen == 0 && mode!='main_page'">
                <img class="img" [src]="'../../../../assets/noph.png'">
                <div class="no-photo">{{photo_no_title}}</div>
            </div>
            <div class="bottom-block main-page" *ngIf="mode=='main_page'">
                <div class="info main-page">
                    <div style="display: flex">
                        <div class="price-block-main-page">
                            <div class="apart-type main-page"><span>{{ itemType }}</span></div>
                            <div class="apart-type main-page"><span class="one">{{item?.city}}</span></div>
                            <!--                                <div class="price" style="margin-bottom: 5px;    font-size: 16px;">{{formattedPrice}}<span style="margin-left: 8px">₽</span></div>-->
                        </div>
                        <div class="price main-page" style="font-size: 18px;">
                            <span style="letter-spacing: unset">{{formattedPrice}}<span style="margin-left: 4px">Р</span></span>
                            <span style="font-size: 12px;    color: #72727D;font-weight: normal;line-height: 18px;" *ngIf="commission != 0">Комиссия {{commission}} {{item?.commisionType == 'fix' ? 'Р' : '%'}}</span>
                            <span style="font-size: 12px;    color: #72727D;font-weight: normal;line-height: 18px;" *ngIf="commission == 0">Без комиссии</span>
                        </div>
                    </div>
                   
                    <div class="address main-page">
                        <span *ngIf="!item.address.includes('ул.')">ул.</span><span class="special">{{item?.address}}<span style="font-weight: bold; text-transform: lowercase"> {{item?.house_num}}</span></span>
                    </div>
                    <div class="bottom-desc main-page">
                        <div class="flex-col" style="    align-items: center;">
                            <div class="type">Комнат {{item?.roomsCount}}</div>
                        </div>
                        <div class="flex-col" style="    align-items: center;">
                            <div class="type">Этаж {{item?.floor}} / {{item?.floorsCount}}</div>
                        </div>
                        <div class="flex-col" style="    align-items: center;">
                            <div class="type">Залог {{item?.prepayment ? 'Да' : 'Нет'}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dark-line"  *ngIf="mode!='main_page'">
                <div class="img" [ngStyle]="{'background-image': item?.photo != undefined ? 'url('+item?.photo+')' : 'url(../../../../assets/user-icon.png)', 'background-size': item?.photo != undefined  ? 'cover':'107% 107%' }"></div>
                <div class="name"><span style="margin-right: 4px;font-weight: bold">{{firstName}}</span><span style="font-family: OpenSans, sans-serif;">{{lastName}}</span></div>
            </div>
            <div class="flex-col list-bottom-block" *ngIf="mode!='main_page'">
                <div class="starFav-list" *ngIf="item != undefined" (mouseenter)="favHovered = true"
                     (mouseleave)="favHovered = false">
                    <img class="starImg" [class.open]="!favHovered && !item?.is_fav"
                         src="../../../../assets/4-4.png" width="24px">
                    <img class="starImg" (click)="delFavObject()"
                         [class.open]="favHovered && item.is_fav" src="../../../../assets/4-4.png"
                         width="24px">
                    <img (click)="addFavObject()" class="starImg"
                         [class.open]="favHovered  && !item.is_fav"
                         src="../../../../assets/4-4%20watched.png" width="24px">
                    <img (click)="delFavObject()" class="starImg"
                         [class.open]="item.is_fav && !favHovered"
                         src="../../../../assets/4-4%20watched.png" width="24px">
                </div>
                <div class="flex-col">
                    <div><div style="color: #72727D; font-size: 10px;line-height: 10px;">{{ itemType }}</div></div>
                    <div class="price" style="margin-bottom: 12px;margin-top: 8px;">
                        <div style="letter-spacing: unset; font-size: 20px; margin-right: 15px;font-family: OpenSansBold;line-height: 15px;">{{formattedPrice}}<span style="font-size: 20px;margin-left: 5px;">Р</span></div>
                        <div style="font-size: 12px;    color: #72727D;font-weight: normal;line-height: 15px;" *ngIf="commission != 0">Комиссия {{commission}} {{item?.commisionType == 'fix' ? 'Р' : '%'}}</div>
                        <div style="font-size: 12px;    color: #72727D;font-weight: normal;line-height: 15px;" *ngIf="commission == 0">Без комиссии</div>
                    </div>
                    <div style="color: #72727D;line-height: 14px;">{{item?.city}}</div>
                    <div class="address" style="line-height: 14px;margin: 4px 0 8px;">
                        <span style="font-size: 14px;" *ngIf="!item.address.includes('ул.')">ул.</span><span  style="font-size: 14px;" class="special">{{item?.address}}<span style="font-weight: bold; text-transform: lowercase;font-family: OpenSansBold; font-size: 14px"> {{item?.house_num}}</span></span>
                    </div>
                    <div style="color: #72727D;line-height: 14px;">{{item?.admArea}}</div>
                    <div style="color: #72727D;line-height: 14px;margin-top: 4px;">ост. {{item?.busStop}}</div>
                    <div class="item-info">
                        <div style="line-height: 14px;">Комнат {{item?.roomsCount}}</div>
                        <div style="line-height: 14px;">Площадь {{item?.squareTotal}} / {{item?.squareLiving}} / {{item?.squareKitchen}}</div>
                        <div style="line-height: 14px;">Этаж {{item?.floor}} / {{item?.floorsCount}}</div>
                    </div>
                    <div style="color: #72727D; font-size: 10px;line-height: 11px;">Добавлено: {{addDate}}</div>
                </div>                
            </div>
        </div>
    `,
    styleUrls: ['./item/item.component.css']
})

export class ItemMiddle implements AfterViewInit, OnChanges {
    public item: Item;
    public payingMode: any;
    public loggingMode: any;
    itemType: any;
    @Input() mode: any;
    @ViewChild('carousel', {static: false}) private carousel: ElementRef;
    objStop: any;
    favHovered = false;
    conveniencesShort = '';
    roomC: any;
    squareC = false;
    imgLen = 0;
    photo_no_title = '';
    src: any;
    formattedPrice: any;
    positionImg = 0;
    time: any;
    offItem = Item;
    commission = 0;

    private player: AnimationPlayer;
    private currentSlide = 0;
    itemWidth: any;
    addDate: any;

    firstName = '';
    lastName = '';


    @Output() favItemMode = new EventEmitter();
    @Output() showBlock = new EventEmitter();
    @Output() openGallery = new EventEmitter();

    constructor(private _account_service: AccountService,private builder: AnimationBuilder) {

    }

    ngAfterViewInit() {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.item) {
            this.checkParams();
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
    getPlaces(x, y) {
        this._account_service.getObjects(x, y, 'Остановка', '0.01').subscribe(res => {
            // console.log(res);
            let places = [];
            for (let i = 0; i < res.length; i++) {
                let obj = JSON.parse(JSON.stringify(res[i]));
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
                this.objStop = places[index].name;
                this.item.bus_stop = this.objStop;
                // document.getElementById('busStop').innerHTML = this.objStop;

            }
        });
    }
    checkParams() {
        this.conveniencesShort = '';
        if (this.item != undefined) {
            if (this.item.typeCode != undefined) {
                switch (this.item.typeCode) {
                    case 'room':
                        if (this.item.buildingClass == 'dormitory') {
                            this.itemType = 'КОМНАТА В ОБЩЕЖИТИИ';
                        }
                        if (this.item.buildingClass == 'single_house') {
                            this.itemType = 'КОМНАТА В ДОМЕ';
                        }
                        if (this.item.buildingClass == 'cottage') {
                            this.itemType = 'КОМНАТА В КОТТЕДЖЕ';
                        }
                        if (this.item.buildingClass == 'dacha') {
                            this.itemType = 'КОМНАТА НА ДАЧЕ';
                        }
                        if (this.item.buildingClass == 'duplex') {
                            this.itemType = 'КОМНАТА В ДУПЛЕКСЕ';
                        }
                        if (this.item.buildingClass == 'townhouse') {
                            this.itemType = 'КОМНАТА В ТАУНХАУСЕ';
                        }
                        if (this.item.buildingClass == 'barrack') {
                            this.itemType = 'КОМНАТА В БАРАКЕ';
                        }
                        // "business", "elite", "economy", "new", "improved", "khrushchev", "brezhnev", "stalin", "old_fund"
                        if (this.item.buildingClass == 'business' || this.item.buildingClass == 'elite'|| this.item.buildingClass == 'economy' || this.item.buildingClass == 'new'
                            || this.item.buildingClass == 'improved' || this.item.buildingClass == 'khrushchev' || this.item.buildingClass == 'brezhnev' || this.item.buildingClass == 'stalin'
                            || this.item.buildingClass == 'old_fund') {
                            this.itemType = 'КОМНАТА В КВАРТИРЕ';
                        }
                        break;
                    case 'apartment':
                        this.itemType = 'КВАРТИРА';
                        break;
                    case 'house':
                        this.itemType = 'ДОМ';
                        break;
                    case 'cottage':
                        this.itemType = 'КОТТЕДЖ';
                        break;
                    case 'dacha':
                        this.itemType = 'ДАЧА';
                        break;
                }
            }
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
            if (this.item.name != undefined) {
                let spArray = this.item.name.split(" ");
                let ret = spArray[0].toUpperCase();
                this.firstName = spArray[0].toUpperCase();
                if (spArray.length > 1) {
                    for (let i = 1; i < spArray.length; i++) {
                        ret += " " + spArray[i];
                        this.lastName += " " + spArray[i];
                    }
                }
                this.item.name = ret;

            }

            if (this.item.commisionType != undefined) {
                if (this.item.commisionType == 'percent') {
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
            if (this.item.address != undefined) {
                if (this.item.address.includes('ул.')) {
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
            if (this.item.deposit != null && this.item.deposit) {
                this.conveniencesShort += 'Депозит да\n';
            } else {
                this.conveniencesShort += 'Депозит нет\n';
            }
            if (this.item.photos == undefined) {
                this.imgLen = 0;
            } else {
                this.imgLen = this.item.photos.length;
            }
            this.roomC = this.item.roomsCount != undefined;
            this.squareC = this.item.squareTotal != undefined;

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
        }
        this.getNumWithDellimet();
    }
    getNumWithDellimet() {
        if (this.item != undefined) {
            this.formattedPrice = this.item.price != undefined ? this.item.price.toString() : '';
            this.formattedPrice = this.formattedPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        }
    }
    addFavObject() {
        console.log(sessionStorage.getItem('useremail'));
        if (sessionStorage.getItem('useremail')!= undefined && sessionStorage.getItem('useremail') != 'email') {
            console.log(this.item.id);
            this._account_service.addFavObject(this.item.id).subscribe(res => {
                // console.log(res);
                this.item.is_fav = true;
                this.favItemMode.emit('add');
            });
        }
    }

    delFavObject() {
        if (sessionStorage.getItem('useremail')!= undefined && sessionStorage.getItem('useremail') != 'email') {
            this._account_service.delFavObject(this.item.id).subscribe(res => {
                console.log(res);
                this.item.is_fav = false;
                this.favItemMode.emit('del');
            });
        }
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
        const list = document.getElementById('carousel-ul-img' + block + '' + this.item.id) as HTMLElement;
        this.positionImg = Math.max(this.positionImg - widthImg, -widthImg * (this.item.photos.length - 1));
        list.style.setProperty('margin-left', this.positionImg + 'px');
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
        if (this.carousel != undefined) {
            const offset = this.currentSlide * this.itemWidth;
            const myAnimation: AnimationFactory = this.buildAnimation(offset, time);
            this.player = myAnimation.create(this.carousel.nativeElement);
            this.player.play();
        }
    }
    checklogin() {
        console.log('logging: ', this.loggingMode, 'payng: ', this.payingMode);
        if (this.loggingMode == false || this.loggingMode == 'false' ) {
            this.showBlock.emit('login')
        }
        if ((this.loggingMode == true || this.loggingMode == 'true') && (this.payingMode == false || this.payingMode == 'false')) {
            this.showBlock.emit('pay')
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
                        slide.item(0).style.setProperty('top', '65px');
                        slide.item(0).style.setProperty('height', 'calc(100vh - 65px)');
                    } else {
                        slide.item(0).style.setProperty('top', '195px');
                        slide.item(0).style.setProperty('height', 'calc(100vh - 195px)');
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
                        slide.item(1).style.setProperty('top', '65px');
                        slide.item(1).style.setProperty('height', 'calc(100vh - 65px)');
                    } else {
                        slide.item(1).style.setProperty('top', '195px');
                        slide.item(1).style.setProperty('height', 'calc(100vh - 195px)');
                    }
                }
                break;
            case 'save_token':
                localStorage.setItem('obj_id', this.item.id.toString(10));
                slide.item(4).classList.add('open');
                if (useless.item(0).classList.contains('homePage')) {
                    if (header.item(0).classList.contains('scroll')) {
                        slide.item(4).style.setProperty('top', '0');
                        slide.item(4).style.setProperty('height', '100vh');
                    } else {
                        slide.item(4).style.setProperty('top', '130px');
                        slide.item(4).style.setProperty('height', 'calc(100vh - 130px)');
                    }
                } else {
                    if (useless.item(0).classList.contains('scroll')) {
                        slide.item(4).style.setProperty('top', '65px');
                        slide.item(4).style.setProperty('height', 'calc(100vh - 65px)');
                    } else {
                        slide.item(4).style.setProperty('top', '195px');
                        slide.item(4).style.setProperty('height', 'calc(100vh - 195px)');
                    }
                }
                break;
        }
    }
}
