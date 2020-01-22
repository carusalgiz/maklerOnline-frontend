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
    inputs: ['item', 'loggingMode', 'payingMode'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="catalog-item hovered itemBlock" id="{{item?.id}}">
<!--            <div class="top-card">-->
<!--                <div class="top-block" style="flex-grow: 1">-->
<!--                    <div class="street special">-->
<!--                        <span *ngIf="!item.address.includes('ул.')">ул.</span>-->
<!--                        <span class="special">-->
<!--                             {{item?.address}}-->
<!--                            <span style="font-weight: bold; margin-left: 5px"> {{item?.house_num}}</span>-->
<!--                        </span>-->
<!--                    </div>-->
<!--                    <div class="commission">{{item?.city}}, {{item?.admArea}}</div>-->
<!--                </div>-->
<!--&lt;!&ndash;                <div class="topRightBlock">&ndash;&gt;-->
<!--&lt;!&ndash;                    <div class="flex-col">&ndash;&gt;-->
<!--&lt;!&ndash;                        &ndash;&gt;-->
<!--&lt;!&ndash;                        <div class="commission">Без комиссии</div>&ndash;&gt;-->
<!--&lt;!&ndash;                    </div>&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--            </div>-->
            <div class="photoBlock" *ngIf="imgLen == 0" [class.watched]="item?.watched">
                <img class="img"
                     [src]="src">
                <div class="no-photo">{{photo_no_title}}</div>
            </div>
            <div class="carousel open" *ngIf="imgLen > 0">
                <div class="arrow left img" (click)="prev()">
                    <div class="arrowFull">
                        <div class="barArrow1-left"></div>
                        <div class="barArrow2-left"></div>
                    </div>
                </div>
                <div class="objects hovered" [class.watched]="item?.watched">
                    <ul id="carousel-ul-img1{{item?.id}}" #carousel>
                        <li class="carousel-li-img1{{item?.id}}" *ngFor="let img of item?.photos, let i = index">
                            <div class="photoBlock" [class.watched]="item?.watched">
                                <img class="img" [class.avito]="img.href.indexOf('avito') != -1"
                                     [src]="img.hrefMini != undefined ? img.hrefMini : img.href">
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="arrow right img" (click)="next()">
                    <div class="arrowFull">
                        <div class="barArrow1-right"></div>
                        <div class="barArrow2-right"></div>
                    </div>
                </div>
            </div>
            <div class="bottom-block">
                    <div class="info">
                        <div class="apart-type" *ngIf="item?.typeCode == 'room'"><span class="one">КОМНАТА</span></div>
                        <div class="apart-type" *ngIf="item?.typeCode == 'apartment'"><span class="one">КВАРТИРА</span></div>
                        <div class="apart-type" *ngIf="item?.typeCode == 'house'"><span class="one">ДОМ</span></div>
                        <div class="apart-type" *ngIf="item?.typeCode == 'dacha'"><span class="one">ДАЧА</span></div>
                        <div class="apart-type" *ngIf="item?.typeCode == 'cottage'"><span class="one">КОТТЕДЖ</span></div>
                        <div class="price" style="    margin-bottom: 5px;">{{formattedPrice}}<span style="margin-left: 8px">₽</span></div>
                        <div class="address">
                            <span *ngIf="!item.address.includes('ул.')">ул.</span><span class="special">{{item?.address}}<span style="font-weight: bold; text-transform: lowercase"> {{item?.house_num}}</span></span>
                        </div>
                        <div class="bus">Остановка {{item?.busStop}}</div>
                        <div class="bottom-desc">
                            <div class="flex-col" style="    align-items: center;">
                                <span class="typename">{{item?.roomsCount}}</span>
                                <span class="type">Комнат</span>
                            </div>
                            <div class="desc-divider"></div>
                            <div class="flex-col" style="    align-items: center;">
                                <span class="typename">{{item?.floor}}/{{item?.floorsCount}}</span>
                                <span class="type">Этаж</span>
                            </div>
                            <div class="desc-divider"></div>
                            <div class="flex-col" style="    align-items: center;">
                                <span  class="typename" *ngIf="(item?.typeCode == 'apartment' || item?.typeCode == 'house' || item?.typeCode == 'dacha' || item?.typeCode == 'cottage')">{{item?.squareTotal}}</span>
                                <span  class="typename" *ngIf="item?.typeCode == 'room'">{{item?.squareLiving}}</span>
                                <span class="type">Площадь</span>
                            </div>
                        </div>
                    </div>
                    <div class="starFav" *ngIf="item != undefined" (mouseenter)="favHovered = true"
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
                    <div class="phone-block flex-col">
                        <div class="contact-photo full" [ngStyle]="{'background-image': (payingMode == true || payingMode == 'true') && (loggingMode == true || loggingMode == 'true') && item?.photo != undefined ? 'url('+item?.photo+')' : 'url(../../../../assets/user-icon.png)', 'background-size': (payingMode == true || payingMode == 'true') && (loggingMode == true || loggingMode == 'true')  && item?.photo != undefined  ? 'cover':'125% 125%' }"></div>
                        <div class="flex-col contact-info">
                            <div class="name">{{item.name}}</div>
                            <div class="middleman">{{item.IsMiddleman ? 'Посредник' : 'Частное лицо'}}</div>
                        </div>
                        <div class="lineFull contact" *ngIf="(payingMode == true || payingMode == 'true') && (loggingMode == true || loggingMode == 'true')"></div>
                        <div style="display: flex;align-items: center;">
<!--                            *ngIf="(payingMode == true || payingMode == 'true') && (loggingMode == true || loggingMode == 'true')"-->
                            <div class="phone-photo" *ngIf="(payingMode == true || payingMode == 'true') && (loggingMode == true || loggingMode == 'true')"></div>
                            <div class="flex-col" style="justify-content: center;" *ngIf="(payingMode == true || payingMode == 'true') && (loggingMode == true || loggingMode == 'true')">
                                <div class="phone" *ngIf="item?.phoneBlock?.main != null">{{item.phoneBlock != null ? '+7':''}}{{item?.phoneBlock?.main | mask: ' (000) 000-0000'}}</div>
                                <div class="phone" *ngIf="item?.phoneBlock?.other != null">{{item.phoneBlock != null ? '+7':''}}{{item?.phoneBlock?.other | mask: ' (000) 000-0000'}}</div>
                                <div class="phone" *ngIf="item?.phoneBlock?.home != null">{{item.phoneBlock != null ? '+7':''}}{{item?.phoneBlock?.home | mask: ' (000) 000-0000'}}</div>
                                <div class="phone" *ngIf="item?.phoneBlock?.cellphone != null">{{item.phoneBlock != null ? '+7':''}}{{item?.phoneBlock?.cellphone | mask: ' (000) 000-0000'}}</div>
                                <div class="phone" *ngIf="item?.phoneBlock?.fax != null">{{item.phoneBlock != null ? '+7':''}}{{item?.phoneBlock?.fax | mask: ' (000) 000-0000'}}</div>
                                <div class="phone" *ngIf="item?.phoneBlock?.ip != null">{{item.phoneBlock != null ? '+7':''}}{{item?.phoneBlock?.ip | mask: ' (000) 000-0000'}}</div>
                            </div>
                            <ng-container *ngIf="(payingMode != true && payingMode != 'true') || (loggingMode != true && loggingMode != 'true')">
                                <div class="button-contact" (click)="checklogin();">Контакты</div>
                            </ng-container>
                        </div>
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

    private player: AnimationPlayer;
    private currentSlide = 0;
    carouselWrapperStyle = {};
    itemWidth: any;

    @Output() favItemMode = new EventEmitter();
    @Output() showBlock = new EventEmitter();

    constructor(private _account_service: AccountService,private builder: AnimationBuilder) {

    }

    ngAfterViewInit() {
        this.reSizeCarousel();
        // this.getPlaces(this.item.lon, this.item.lat);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.reSizeCarousel();
    }

    reSizeCarousel(): void {
        // re-size the container
        let photo = document.getElementsByClassName('photoBlock') as HTMLCollectionOf<HTMLElement>;
        this.itemWidth  = photo.item(0).clientWidth;
        this.carouselWrapperStyle = {
            width: `${this.itemWidth}px`,
        };

        // trigger a fresh transition to the current slide to reset the position of the children
        this.transitionCarousel(null);
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
        console.log('checkparams');
        this.conveniencesShort = '';
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
