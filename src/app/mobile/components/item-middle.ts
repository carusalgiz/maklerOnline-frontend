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
import {Person} from '../../class/person';

@Component({
    selector: 'item-middle',
    inputs: ['item', 'loggingMode', 'payingMode', 'index', 'mode'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="catalog-item" [class.main-page]="mode=='main_page'" id="{{item.id}}" [style.margin-top.px]="index == 0 || index == '0' ? 0 : 20">
            <ng-container >
                <div>
                    <div *ngIf="imgLen == 0" class="photoBlock"
                         style="background-size: 100% 100%;background-image: url('../../../assets/noph.png')"  
                         [class.main-page]="mode=='main_page'"
                         [class.watched]="watched == true">
                        <img class="img"
                             [title]="'makleronline снять ' + item?.roomsCount + ' комнатную квартиру в хабаровске без посредников'"
                             [alt]="'makleronline аренда ' + item?.roomsCount + ' комнатной квартиры в хабаровске без посредников'"
                             [src]="src" [class.avito]="src.indexOf('avito') != -1"  [style.object-fit]="src.indexOf('assets/noph') != -1 ? 'unset' : 'cover'">
                        <div class="no-photo">{{photo_no_title}}</div>
                    </div>
                    <div *ngIf="imgLen != 0" class="photoBlock" [class.watched]="watched == true" [class.main-page]="mode=='main_page'"
                         style="    background-size: 100% 100%;">
                        <img class="img"
                             [title]="'makleronline снять ' + item?.roomsCount + ' комнатную квартиру в хабаровске без посредников'"
                             [alt]="'makleronline аренда ' + item?.roomsCount + ' комнатной квартиры в хабаровске без посредников'"
                             [src]="src" [class.avito]="src.indexOf('avito') != -1" [style.object-fit]="src.indexOf('assets/noph') != -1 ? 'unset' : 'cover'">
                        <div class="no-photo">{{photo_no_title}}</div>
                    </div>
                    <div class="contact-line" *ngIf="mode != 'main_page'">
                        <div class="contact-photo" [ngStyle]="{'background-image': item?.person?.photoMini != undefined ? 'url('+item?.person?.photoMini+')' : 'url(../../../../assets/user-icon.png)', 'background-size': item?.person?.photoMini != undefined  ? 'cover':'125% 125%' }"></div>
                        <div class="name" >{{item.name}}</div>
                    </div>
                    <div class="starFav" *ngIf="item != undefined && mode != 'main_page'">
                        <img (click)="addFavObject()" class="starImg {{item.id}}"
                             [class.open]="!item.is_fav"
                             src="../../../../assets/4-4.png" width="24px">
                        <img (click)="delFavObject()" class="starImg {{item.id}}"
                             [class.open]="item.is_fav"
                             src="../../../../assets/4-4%20watched.png" width="24px">
                    </div>
                    <div class="bottom-block">
                        <div class="info"  [class.main-page]="mode=='main_page'">
                            <div class="apart-type" *ngIf="mode != 'main_page'"><span class="one">{{ itemType }}</span></div>
                            <div class="price" *ngIf="mode != 'main_page'" style="margin-bottom: 5px;"><span>{{formattedPrice}}<span style="margin-left: 8px">₽</span></span>
                                <span style="font-size: 14px;color:#62626D;font-weight: normal;line-height: 18px;" *ngIf="commission != 0">Комиссия {{commission}} {{item?.commisionType == 'fix' ? 'Р' : '%'}}</span>
                                <span style="font-size: 14px;color:#62626D;font-weight: normal;line-height: 18px;" *ngIf="commission == 0">Без комиссии</span></div>
                            <div class="price-block-main-page" *ngIf="mode == 'main_page'">
                                <div class="apart-type" [class.main-page]="mode=='main_page'"><span class="one">{{ itemType }}</span></div>
<!--                                <div class="apart-type" [class.main-page]="mode=='main_page'" *ngIf="item?.typeCode == 'apartment'"><span class="one">КВАРТИРА</span></div>-->
<!--                                <div class="apart-type" [class.main-page]="mode=='main_page'" *ngIf="item?.typeCode == 'house'"><span class="one">ДОМ</span></div>-->
<!--                                <div class="apart-type" [class.main-page]="mode=='main_page'" *ngIf="item?.typeCode == 'dacha'"><span class="one">ДАЧА</span></div>-->
<!--                                <div class="apart-type" [class.main-page]="mode=='main_page'" *ngIf="item?.typeCode == 'cottage'"><span class="one">КОТТЕДЖ</span></div>-->
<!--                                <div class="price" style="margin-bottom: 5px;    font-size: 16px;">{{formattedPrice}}<span style="margin-left: 8px">₽</span></div>-->
                            </div>
                            <div class="price" *ngIf="mode == 'main_page'" style="font-size: 16px;"><span>{{formattedPrice}}<span style="margin-left: 4px">₽</span></span>
                                <span style="font-size: 14px;color:#62626D;font-weight: normal;line-height: 18px;" *ngIf="commission != 0">Комиссия {{commission}} {{item?.commisionType == 'fix' ? 'Р' : '%'}}</span>
                                <span style="font-size: 14px;color:#62626D;font-weight: normal;line-height: 18px;" *ngIf="commission == 0">Без комиссии</span>
                            </div>
                            <div class="bus" *ngIf="mode != 'main_page'">{{item?.city}}</div>
                            <div class="address"  style="margin-bottom: 5px;font-size: 15px;" [class.main-page]="mode=='main_page'">
                                <span class="special"><span style="text-transform: lowercase" *ngIf="!item.address.includes('ул.')">ул.</span>{{item?.address}}<span style="font-weight: bold; text-transform: lowercase"> {{item?.house_num}}</span></span>
                            </div>
                            <div class="bus" *ngIf="mode != 'main_page'">{{item?.admArea}}</div>
                            <div class="bus" *ngIf="mode != 'main_page'" style="margin-bottom: 15px;">Остановка {{item?.busStop}}</div>
                            <div class="bottom-desc" *ngIf="mode == 'main_page'" [class.main-page]="mode=='main_page'" >
                                <div class="flex-col" style="    align-items: center;">
                                    <span class="type">Комнат {{item?.roomsCount}}</span>
                                </div>
                                <div class="flex-col" style="    align-items: center;">
                                    <span class="type">Этаж {{item?.floor}}/{{item?.floorsCount}}</span>
                                </div>
                                <div class="flex-col" style="    align-items: center;">
                                    <span class="type">Залог {{item?.prepayment ? 'Да' : 'Нет'}}</span>
                                </div>
                            </div>
                            <div class="bottom-desc" *ngIf="mode != 'main_page'">
                                <div class="flex-col" style="    align-items: center;">
                                    <span class="typename">{{item?.roomsCount}}</span>
                                    <span class="type">Комнат</span>
                                </div>
                                <div class="desc-divider full"  [class.main-page]="mode=='main_page'"></div>
                                <div class="flex-col" style="    align-items: center;flex-grow: 1;">
                                    <span class="typename">{{item?.floor}}/{{item?.floorsCount}}</span>
                                    <span class="type">Этаж</span>
                                </div>
                                <div class="desc-divider full"  [class.main-page]="mode=='main_page'"></div>
                                <div class="flex-col" style="    align-items: center;flex-grow: 1;">
                                <span class="typename"
                            *ngIf="(item?.typeCode == 'apartment' || item?.typeCode == 'house' || item?.typeCode == 'dacha' || item?.typeCode == 'cottage')">{{item?.squareTotal}}</span>
                                    <span class="typename" *ngIf="item?.typeCode == 'room'">{{item?.squareLiving}}</span>
                                    <span class="type">Площадь</span>
                                </div>
                                <div class="desc-divider full" [class.main-page]="mode=='main_page'"></div>
                                <div class="flex-col" style="    align-items: center;flex-grow: 1;">
                                    <span class="typename">Балкон</span>
                                    <span class="type">{{ item.loggia || item.balcony ? 'Да' : 'Нет'}}</span>
                                </div>
                                <div class="desc-divider full" [class.main-page]="mode=='main_page'"></div>
                                <div class="flex-col" style="    align-items: center;">
                                    <span class="typename">Залог</span>
                                    <span class="type">{{item?.prepayment ? 'Да' : 'Нет'}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="addDate" *ngIf="mode != 'main_page'">Добавлено: {{addDate}}</div>
                </div>
            </ng-container>
        </div>
    `,
    styleUrls: ['./item/item.component.css']
})

export class ItemMiddle implements AfterViewInit, OnChanges, OnInit {
    @Input() item: Item;
    @Input() watched: boolean;
    @Input() loggingMode: any;
    @Input() payingMode: any;
    @Input() index: any;
    @Input() mode: any;

    formattedPrice = '0';
    itemType: any;
    commission = 0;
    imgLen = 0;
    photo_no_title: any;
    src = 'https://makleronline.net/assets/noph.png';
    addDate: any;
    person: Person = new Person();

    @Output() favItemMode = new EventEmitter();

    constructor(private _account_service: AccountService) {  }

    ngOnInit(): void {

        let date = this.item.addDate;
        let day = moment.unix(this.item.addDate);
        let curDate = new Date();
        let secs = curDate.getTime() / 1000;
        let timeHasCome = secs - date;
        let dayDiff = moment.unix(curDate.getTime() / 1000).day() - moment.unix(this.item.addDate).day();
        if (dayDiff == 0) {
            if (day.minutes() < 10) {
                this.addDate = 'сегодня, ' + day.format("dddd") + ' в ' + day.hours() + ':0' + day.minutes();
            } else {
                this.addDate = 'сегодня, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
            }
        } else if (dayDiff == 1) {
            if (day.minutes() < 10) {
                this.addDate = 'вчера, ' + day.format("dddd") + ' в ' + day.hours() + ':0' + day.minutes();
            } else {
                this.addDate = 'вчера, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
            }
        } else if (dayDiff == 2) {
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
        if (this.item.photos == undefined) {
            this.imgLen = 0;
            this.photo_no_title = 'ФОТО НЕТ';
        } else {
            this.imgLen = this.item.photos.length;
            this.src = this.item.photos[0] != undefined ? this.item.photos[0].href : 'https://makleronline.net/assets/noph.png';
            if (this.item.photos[0] == undefined) {
                this.photo_no_title = 'ФОТО НЕТ';
            }
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
        this.formattedPrice = this.item.price.toString();
        this.formattedPrice = this.formattedPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
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

        let its = document.documentElement.getElementsByClassName(this.item.id.toString()) as HTMLCollectionOf<HTMLElement>;
        if (this.item.is_fav == true) {
            if (its.length != 0) {
                its.item(1).classList.add('open');
                its.item(0).classList.remove('open');
            }
        } else {
            if (its.length != 0) {
                its.item(1).classList.remove('open');
                its.item(0).classList.add('open');
            }
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

    ngAfterViewInit() {

    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.item) {
            let its = document.documentElement.getElementsByClassName(this.item.id.toString()) as HTMLCollectionOf<HTMLElement>;
            if (this.item.is_fav == true) {
                if (its.length != 0) {
                    its.item(1).classList.add('open');
                    its.item(0).classList.remove('open');
                }
            } else {
                if (its.length != 0) {
                    its.item(1).classList.remove('open');
                    its.item(0).classList.add('open');
                }
            }
            this.checkParams();
        }
    }
    checkParams() {
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
                if (spArray.length > 1) {
                    ret += " " + spArray[1];
                }
                this.item.name = ret;
            }
            if (this.item.address != undefined) {
                if (this.item.address.includes('ул.')) {
                    this.item.address = this.item.address.slice(this.item.address.indexOf('ул.') + 3, this.item.address.length);
                }
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
            if (this.item.photos == undefined) {
                this.imgLen = 0;
            } else {
                this.imgLen = this.item.photos.length;
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
}
