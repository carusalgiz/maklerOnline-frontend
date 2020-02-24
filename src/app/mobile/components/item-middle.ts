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
import {Item} from '../../item';
import {AccountService} from '../../services/account.service';
import * as moment from 'moment';

@Component({
    selector: 'item-middle',
    inputs: ['item', 'loggingMode', 'payingMode', 'index', 'mode'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="catalog-item" [class.main-page]="mode=='main_page'" id="{{item.id}}" [style.margin-top.px]="index == 0 || index == '0' ? 0 : 20">
            <ng-container >
                <div>
                    <div *ngIf="imgLen == 0" class="photoBlock"
                         style="background-size: 100% 100%;background-image: url('../../../assets/noph.png')"  [class.main-page]="mode=='main_page'"
                         [class.watched]="watched == true">
                        <img class="img"
                             [title]="'makleronline снять ' + item?.roomsCount + ' комнатную квартиру в хабаровске без посредников'"
                             [alt]="'makleronline аренда ' + item?.roomsCount + ' комнатной квартиры в хабаровске без посредников'"
                             [src]="src" [class.avito]="src.indexOf('avito') != -1">
                        <div class="no-photo">{{photo_no_title}}</div>
                    </div>
                    <div *ngIf="imgLen != 0" class="photoBlock" [class.watched]="watched == true" [class.main-page]="mode=='main_page'"
                         style="    background-size: 100% 100%;">
                        <img class="img"
                             [title]="'makleronline снять ' + item?.roomsCount + ' комнатную квартиру в хабаровске без посредников'"
                             [alt]="'makleronline аренда ' + item?.roomsCount + ' комнатной квартиры в хабаровске без посредников'"
                             [src]="src" [class.avito]="src.indexOf('avito') != -1">
                        <div class="no-photo">{{photo_no_title}}</div>
                    </div>
                    <div class="contact-line">
                        <div class="contact-photo" [ngStyle]="{'background-image': (payingMode == true || payingMode == 'true') && (loggingMode == true || loggingMode == 'true') && item?.photo != undefined ? 'url('+item?.photo+')' : 'url(../../../../assets/user-icon.png)', 'background-size': (payingMode == true || payingMode == 'true') && (loggingMode == true || loggingMode == 'true')  && item?.photo != undefined  ? 'cover':'125% 125%' }"></div>
                        <div class="name" >{{item.name}}</div>
                    </div>
                    <div class="starFav" *ngIf="item != undefined">
                        <img (click)="addFavObject()" class="starImg {{item.id}}"
                             [class.open]="!item.is_fav"
                             src="../../../../assets/4-4.png" width="24px">
                        <img (click)="delFavObject()" class="starImg {{item.id}}"
                             [class.open]="item.is_fav"
                             src="../../../../assets/4-4%20watched.png" width="24px">
                    </div>
                    <div class="bottom-block">
                        <div class="info"  [class.main-page]="mode=='main_page'">
                            <div class="apart-type" *ngIf="item?.typeCode == 'room'"><span class="one">КОМНАТА</span></div>
                            <div class="apart-type" *ngIf="item?.typeCode == 'apartment'"><span class="one">КВАРТИРА</span></div>
                            <div class="apart-type" *ngIf="item?.typeCode == 'house'"><span class="one">ДОМ</span></div>
                            <div class="apart-type" *ngIf="item?.typeCode == 'dacha'"><span class="one">ДАЧА</span></div>
                            <div class="apart-type" *ngIf="item?.typeCode == 'cottage'"><span class="one">КОТТЕДЖ</span></div>
                            <div class="price" style="    margin-bottom: 5px;">{{formattedPrice}}<span style="margin-left: 8px">₽</span><span style="font-size: 12px;margin-left: 20px;;color:#62626D;font-weight: normal" *ngIf="commission != 0">Комиссия {{commission}}%</span></div>
                            <div class="address">
                                <span *ngIf="!item.address.includes('ул.')">ул.</span><span class="special">{{item?.address}}<span style="font-weight: bold; text-transform: lowercase"> {{item?.house_num}}</span></span>
                            </div>
                            <div class="bus">{{item?.admArea}}</div>
                            <div class="bus"  style="margin-bottom: 15px;">Остановка {{item?.busStop}}</div>
                            <div class="bottom-desc">
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
                    <div class="addDate">Добавлено: {{addDate}}</div>
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
    commission = 0;
    imgLen = 0;
    photo_no_title: any;
    src = 'https://makleronline.net/assets/noph.png';
    addDate: any;

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
            this.addDate = 'сегодня, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
        } else if (dayDiff == 1) {
            this.addDate = 'вчера, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
        } else if (dayDiff == 2) {
            this.addDate = 'позавчера, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
        } else {
            let hour = '';
            if (Math.floor(timeHasCome / 60 / 60 / 24) < 4) {
                hour = Math.floor(timeHasCome / 60 / 60 / 24) + ' дня ';
            } else {
                hour = Math.floor(timeHasCome / 60 / 60 / 24) + ' дней ';
            }
            this.addDate = hour + 'назад, ' + day.format("dddd") + ' в ' + day.hours() + ':' + day.minutes();
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
        let one_percent = this.item.price / 100;
        if (this.item.commission != undefined) {
            this.commission = this.item.commission / one_percent;
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
            let one_percent = this.item.price / 100;
            this.commission = this.item.commission / one_percent;
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
