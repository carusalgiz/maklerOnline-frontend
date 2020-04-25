import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Item} from '../../item';
import * as moment from 'moment';
import ymaps from 'ymaps';
import {AccountService} from '../../services/account.service';
import {UploadFile} from '../../class/UploadFile';

@Component({
    inputs: ['item', 'logged', 'payed'],
    selector: 'item-desktop',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .scroll-container{
            height: 100%;
            overflow-y: auto;
            position: fixed;
            transition: .3s;
            z-index: 100;
            top: 190px;
        }
        .item-main{
            width: 100vw;      
            background-color: #f5f5f5;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-bottom: 70px;
            min-height: calc(100% - 70px);
        }
        .item-main.gallery{
            position: fixed;
            top: 0;
            height: 100vh;
            z-index: 9999;
        }
        *{
            font-family: OpenSans, sans-serif;
            color: #32323D;
            font-size: 12px;
            letter-spacing: 0;
        }
        hr{
            border: 0;
            border-top: 1px solid #BDC0C1;
            margin: 0;
        }
        .flex-col{
            display: flex;
            flex-direction: column;
        }
        .item-photo{
            width: 1600px;
            height: 540px;
            background-size: 100% auto;
            background-position: center;
        }
        .item-photo.gallery{
            width: 1200px;
            height: 600px;
        }
        .item-header{
            display: flex;
            padding: 0 50px 0 70px;
            width: 1480px;
        }
        .item-header > div:first-child{
            width: 975px;
        }
        .item-header > div:nth-child(2){
            width: 330px;
        }
        .price{
            display: flex;
            align-items: flex-end;
            height: 56px;
            padding-bottom: 14px;
        }
        .price > span:first-child, .price > span:nth-child(2){
            font-size: 30px;
            font-family: OpenSansBold, sans-serif;
            line-height: 24px;
            margin-right: 20px;
        }
        .price > span:last-child{
            font-size: 14px;
        }
        .add-date{
            color: #72727D;
            font-size: 12px;
            margin-top: 5px;
        }
        .contact-block{
            width: 400px;
            box-shadow: 0 3px 4px #d3d5d6;
            padding: 20px 35px;
            position: relative;
            top: -60px;
            margin: 0 20px -60px;
            background-color: #FAFAFA;
        }
        .contact-block .title{
            font-family: OpenSansBold, sans-serif;
            font-size: 14px;
        }
        .contact-block > div:first-child{
            height: 105px;
            justify-content: space-between;
            padding-bottom: 5px;
        }
        .social-icons{
            display: flex;
            margin-top: 15px;
            justify-content: space-between;
        }
        .social-icons.gallery{
            margin-right: 20px;
            width: 310px;
        }
        .social-icons > .flex-col{
            align-items: center;
            width: 60px;
            text-decoration: unset;
        }
        .social-icons > .flex-col:hover{
            cursor: pointer;
        }
        .social-icons > .flex-col:active, .social-icons > .flex-col:focus{
            outline: none;
        }
        .social-icons .icon{
            width: 42px;
            height: 42px;
            margin-bottom: 4px;
            background-size: contain;
        }
        .contact-photo{
            width: 80px;
            height: 80px;
            margin-right: 15px;
            background-size: cover;
            background-position: center;
        }
        .contact{
            display: flex;
        }
        .contact-name > div:first-child{
            font-size: 14px;
            font-family: OpenSansBold, sans-serif;
        }
        .contact-name > div:nth-child(2){
            font-size: 14px;
        }
        .contact-name > div:last-child{
            font-style: italic;
            color: #72727D;
        }
        .item-description{
            display: flex;
            font-size: 14px;
            padding: 45px 50px 0 70px;
            width: 1480px;
        }
        .item-description .flex-col > div{
            font-size: 14px;
            line-height: 21px;
        }
        .item-description > .flex-col{
            margin-top: -25px;
        }
        .item-description > .flex-col:first-child{
            width: 30%;
            margin-top: -180px;
        }
        .item-description > .flex-col:nth-child(2){
            margin-right: 65px;
            width: 30%;
            margin-top: -180px;
        }
        .item-description > .flex-col:last-child{
            margin-top: -10px;
        }
        .item-description .title, .item-description .address > span, .item-description .address > span > span, .gallery-bottom > .flex-col > .address > span,
        .gallery-bottom > .flex-col > .address > span > span{
            font-family: OpenSansBold, sans-serif;
            font-size: 16px !important;
            line-height: 22px !important;
        }
        .item-description .address, .gallery-bottom > .flex-col > .address{
            display: flex;
        }
        .address > .special, .gallery-bottom > .flex-col > .address > .special{
            text-transform: uppercase;
        }
        .item-description > .flex-col > .title:not(:nth-child(1)) {
            margin-top: 30px;
        }
        
        .item-params{
            display: flex;
            height: 25px;
            align-items: center;
        }
        .item-params > div{
            font-size: 14px;
        }
        .item-params > div:first-child{
            width: 180px;
        }
        .map{
            width: 546px;
            height: 196px;
        }
        .starFav {
            height: fit-content;
            width: fit-content;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 17px;
            transition: .3s background-color;
            position: relative;
        }
        .starImg {
            display: none;
            position: relative;
            top: -1px;
        }
        .starImg.open {
            display: block;
        }
        .similar-title{
            font-family: OpenSansBold, sans-serif;
            font-size: 20px;
        }
        .carousel {
            display: none;
            transform-origin: 0 0;
            width: 1600px;
            height: auto;
        }
        .carousel.open {
            display: flex;
            justify-content: center;
            -webkit-animation: fade ease-in 0.3s;
            animation: fade ease-in 0.3s;
            border-top: 1px solid #eaebec;
            border-bottom: 1px solid #eaebec;
        }
        .carousel ul {
            width: 9999px;
            margin: 0;
            padding: 0;
            list-style: none;
            transition: margin-left 250ms;
            font-size: 0;
        }
        .items ul{
            position: relative;
            left: -382px;
        }
        .photos{
            width: 1200px;
        }
        .photos ul{
            position: relative;
            left: -1200px;
        }
        .carousel li {
            display: inline-block;
        }
        .arrow {
            min-width: 50px;
            width: 50px;
            height: 160px;
            padding: 0;
            position: relative;
            z-index: 1;
            top: calc(50% - 80px);
            opacity: 0;
            align-items: center;
            display: flex;
            transition: opacity .1s;
        }
        .arrow.gallery{
            opacity: 1;
        }
        .arrow.left{
            width: 70px ;
        }
        .arrow.left.gallery{
            width: 130px;
            justify-content: flex-end;
        }
        .arrow.right.gallery{
            width: 130px;
        }
        .arrow:hover{
            cursor: pointer;
        }
        .carousel:hover > .arrow{
            opacity: 1;
        }
        .carousel:hover > .arrow{
            visibility: visible;
        }
        .arrow:focus {
            outline: none;
        }
        
        .barArrow1-left, .barArrow2-left, .barArrow1-right, .barArrow2-right{
            width: 40px;
            height: 2px;
            border-radius: 5px;
            background-color: #252f32;
            margin: 3px 0;
        }
        .barArrow1-left.gallery, .barArrow2-left.gallery, .barArrow1-right.gallery, .barArrow2-right.gallery {
            background-color: #BDC0C1;
            width: 55px;
        }
        .barArrow1-left{
            transform: rotate(-60deg) translate(-10px,10px);
        }
        .barArrow1-left.gallery{
            transform: rotate(-66deg) translate(-5px,41px);
        }
        .barArrow2-left{
            transform: rotate(60deg) translate(39px,19px);
        }
        .barArrow2-left.gallery{
            transform: rotate(66deg) translate(75px,-5px);
        }
        .barArrow1-right{
            transform: rotate(60deg) translate(19px,6px);
        }
        .barArrow1-right.gallery{
            transform: rotate(66deg) translate(35px,-24px)
        }
        .barArrow2-right{
            transform: rotate(-60deg) translate(-40px,28px);
        }
        .barArrow2-right.gallery{
            transform: rotate(-66deg) translate(-46px,61px);
        }
        .arrowFull{
            height: 73px;
            width: 50px;
        }
        .arrowFull.gallery{
            width: 130px;
            height: 100px;
        }
        .button-contact{
            width: 100%;
            height: 46px;
            background-color: #307742;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .gallery-header{
            display: flex;
            width: 1600px;
            align-items: center;
            height: 96px;
        }
        .returnBack {
            display: flex;
            width: 185px;
            padding-left: 15px;
            align-items: center;
            text-decoration: none;
        }
        .returnBack > a{
            font-size: 16px;
        }
        .returnBack:focus{
            outline: none;
        }

        .returnBack:hover div, .returnBack:hover a {
            color: #677578;
            cursor: pointer;
        }
        .return {
            width: 30px;
            height: 25px;
            position: relative;
            top: -3px;
        }

        .barReturn1, .barReturn2 {
            width: 15px;
            height: 2px;
            background-color: #252f32;
            margin: 3px 0;
        }

        .barReturn1 {
            transform: rotate(-45deg) translate(-1px, 5px);
        }

        .barReturn2 {
            transform: rotate(45deg) translate(9px, 5px);
        }

        .returnBack:hover .barReturn1, .returnBack:hover .barReturn2 {
            background-color: #677578;
            cursor: pointer;
        }
        .gallery-address{
            height: calc(100% - 3px);
            display: flex;
            width: 1200px;
            justify-content: space-between;
            align-items: flex-end;
            padding-bottom: 3px;
        }
        .gallery-address > div:first-child > span:last-child{
            font-size: 24px;
        }
        .gallery-address > .gallery-price > span:first-child, .gallery-address > div:first-child > span:first-child{
            font-family: OpenSansBold, sans-serif;
            margin-right: 15px;
        }
        .gallery-address > .gallery-price > span:first-child, .gallery-address > div:first-child > span:first-child{
            font-size: 30px;
        }
        .gallery-address > .gallery-price > span:last-child{
            font-size: 14px;
        }
        .gallery-bottom{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 200px;
            width: 1200px;
        }
        .gallery-bottom > .flex-col > span:nth-child(1){
            font-size: 14px;
        }
        
        .gallery-bottom > .button-contact{
            width: 330px;
        }
        .exit{
            position: relative;
            margin-bottom: -56px;
            top: 50px;
            left: 723px;
            width: 56px;
            height: 56px;
            background-image: url("../../../assets/exit.png");
            background-size: 100% 100%;
            background-position: center;
            border-radius: 27px;
            background-color: rgba(255,255,255,0.5);
        }
        .exit:hover{
            background-color: rgba(255,255,255,1);
            cursor: pointer;
        }
    `],
    template: `
        <div class="scroll-container" [style.top.px]="scrollTop">
            <div class="item-main">
                <div class="exit" (click)="closeItem.emit()"></div>
                <div class="item-photo" (click)="item.photos.length != 0 ? galleryOpen = true : false;this.galleryMode.emit(galleryOpen);" 
                     [ngStyle]="{'background-image': item?.photos[0]?.href != undefined ? 'url('+item?.photos[0].href+')' : 'url(../../../../assets/noph.png)', 'background-size': item?.photos[0]?.href != undefined  ? 'cover':'125% 125%' }"></div>
                <div class="item-header">
                    <div class="flex-col">
                        <div class="price">
                            <span>{{itemType}}</span>
                            <span>{{formattedPrice}} Р</span>
                            <span *ngIf="commission != 0">Комиссия {{commission}} {{item?.commisionType == 'fix' ? 'Р' : '%'}}</span>
                            <span *ngIf="commission == 0">Без комиссии</span>
                        </div>
                        <hr>
                        <div class="add-date">Предложение добавлено {{addDate}}</div>
                    </div>
                    <div class="flex-col contact-block">
                        <div class="flex-col">
                            <div class="contact">
                                <div class="contact-photo" [ngStyle]="{'background-image': item?.photo != undefined ? 'url('+item?.photo+')' : 'url(../../../../assets/social/user.jpg)'}"></div>
                                <div class="contact-name">
                                    <div>{{firstName}}</div>
                                    <div>{{lastName}}</div>
                                    <div>{{item.IsMiddleman ? 'Посредник' : 'Частное лицо'}}</div>
                                </div>
                            </div>
                            <div class="title">Быстро связаться по:</div>
                        </div>
                        <hr>
                        <div class="social-icons">
                            <a class="flex-col" (click)="checkData(item.person.messengerBlock.whatsapp, $event)" [href]="(payed == true || payed == 'true') && (logged == true || logged == 'true')  && item.person.messengerBlock.whatsapp ? 'https://wa.me/' + item?.person?.messengerBlock?.whatsapp : ''">
                                <div class="icon" [ngStyle]="{'background-image': 'url(../../../../assets/social/whatsapp.png)'}"></div>
                                <div class="name">WhatsApp</div>
                            </a>
                            <a class="flex-col" (click)="checkData(item.person.phoneBlock.main, $event)" [href]="(payed == true || payed == 'true') && (logged == true || logged == 'true')  && item.person.phoneBlock.main ? 'tel:' + item?.person?.phoneBlock?.main : ''">
                                <div class="icon" [ngStyle]="{'background-image': 'url(../../../../assets/social/call.png)'}"></div>
                                <div class="name">Позвонить</div>
                            </a>
                            <a class="flex-col" (click)="checkData(item.person.emailBlock.main, $event)" [href]="(payed == true || payed == 'true') && (logged == true || logged == 'true') && item.person.emailBlock.main ? 'mailto:' + item?.person?.emailBlock?.main : ''">
                                <div class="icon" [ngStyle]="{'background-image': 'url(../../../../assets/social/mail.png)'}"></div>
                                <div class="name">Email</div>
                            </a>
                            <a class="flex-col">
                                <div class="icon" [ngStyle]="{'background-image': 'url(../../../../assets/social/message.png)'}"></div>
                                <div class="name">Чат</div>
                            </a>
                        </div>
                        <hr style="margin: 13px 0;">
                        <div class="flex-col"  *ngIf="(payed == true || payed == 'true') && (logged == true || logged == 'true')">
                            <div class="title" style="margin-bottom: 3px;">Контакты</div>
                            <div>Сайт визитка:</div>
                            <div>Email: <span style="margin-left: 20px" *ngIf="(payed == true || payed == 'true') && (logged == true || logged == 'true')">{{item?.person?.emailBlock?.main}}</span></div>
                            <div>Тел. <span style="margin-left: 20px" *ngIf="(payed == true || payed == 'true') && (logged == true || logged == 'true') && item.person.phoneBlock.main">{{ "+7" + item?.person?.phoneBlock?.main | mask: "+0 (000) 000-00-00"}}</span></div>
                            <div>WhatsApp <span style="margin-left: 20px" *ngIf="(payed == true || payed == 'true') && (logged == true || logged == 'true') && item.person.messengerBlock.whatsapp">
                            {{ "+7" + item?.person?.messengerBlock?.whatsapp | mask: "+0 (000) 000-00-00"}}</span></div>
                        </div>
                        <ng-container *ngIf="(payed != true && payed != 'true') || (logged != true && logged != 'true')">
                            <div class="button-contact" (click)="checkBlock();">Показать контакты</div>
                        </ng-container>
                    </div>
                    <hr [style.width.px]="74" [style.margin-top.px]="70">
                </div>
                <div class="item-description">
                    <div class="flex-col">
                        <div class="title">Адрес объекта</div>
                        <div>{{item?.city}}</div>
                        <div class="address"><span *ngIf="!item.address.includes('ул.')">ул.</span><span class="special">{{item?.address}}<span style="text-transform: lowercase;"> {{item?.house_num}}</span></span></div>
                        <div>{{item?.admArea}}</div>
                        <div>Ост. {{item?.busStop}}</div>
                        <div class="title">Описание объекта</div>
                        <div class="flex-col" style="flex-grow: 1;">
                            <div class="item-params"><div>Комнат</div><div>{{item?.roomsCount}}</div></div>
                            <div class="item-params"><div>Площадь</div><div>{{item?.squareLiving}} кв.м</div></div>
                            <div class="item-params"><div>Балкон</div><div>{{ item.balcony ? 'Да' : 'Нет'}}</div></div>
                            <div class="item-params"><div>Лоджия</div><div>{{ item.loggia ? 'Да' : 'Нет'}}</div></div>
                            <div class="item-params"><div>Этаж</div><div>{{item?.floor}}</div></div>
                            <div class="item-params"><div>Этажность</div><div>{{item?.floorsCount}}</div></div>
                            <div class="item-params"><div>Санузел</div><div>{{item?.bathroom ? 'Да' : 'Нет'}}</div></div>
                        </div>
                        <div class="starFav" *ngIf="item != undefined" (mouseenter)="favHovered = true"
                             (mouseleave)="favHovered = false">
                            <img class="starImg" [class.open]="!favHovered && !item?.is_fav"
                                 src="../../../../assets/4-4.png" width="40px">
                            <img class="starImg" (click)="delFavObject()"
                                 [class.open]="favHovered && item.is_fav" src="../../../../assets/4-4.png"
                                 width="40px">
                            <img (click)="addFavObject()" class="starImg"
                                 [class.open]="favHovered  && !item.is_fav"
                                 src="../../../../assets/4-4%20watched.png" width="40px">
                            <img (click)="delFavObject()" class="starImg"
                                 [class.open]="item.is_fav && !favHovered"
                                 src="../../../../assets/4-4%20watched.png" width="40px">
                        </div>
                    </div>
                    <div class="flex-col">
                        <div class="title">Комплектация объекта</div>
                        <div style="min-height: 40px;">{{conveniences}}</div>
                        <div class="title">Условия найма</div>
                        <div>{{conditions}}</div>
                        <div class="title">Дополнительное описание</div>
                        <div>{{item?.description}}</div>
                    </div>
                    <div class="flex-col">
                        <div class="title">Предложение на карте</div>
                        <hr style="margin: 5px 0 20px">
                        <div class="map" id="item-map"></div>
                    </div>
                </div>
                <div class="item-description" style="flex-direction: column;">
                    <div class="similar-title">ПОХОЖИЕ ОБЪЯВЛЕНИЯ</div>
                    <hr style="margin: 10px 0">                    
                </div>
                <div class="carousel open" *ngIf="items.length != 0">
                    <div class="arrow left img" (click)="prev()" style="top: 95px;">
                        <div class="arrowFull">
                            <div class="barArrow1-left"></div>
                            <div class="barArrow2-left"></div>
                        </div>
                    </div>
                    <div class="items" style="overflow: hidden;width: 1480px;">
                        <ul id="items_carousel-ul" style="width: max-content;" [style.left.px]="items.length < 5 ? 0 : -382">
                            <li class="items_carousel-li" *ngFor="let item of items; let i = index">
                                <item-middle [mode]="'main_page'" [item]="item" [loggingMode]="false"
                                             [payingMode]="false"></item-middle>
                            </li>
                        </ul>
                    </div>
                    <div class="arrow right img" (click)="next()" style="top: 95px;">
                        <div class="arrowFull">
                            <div class="barArrow1-right"></div>
                            <div class="barArrow2-right"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item-main gallery" *ngIf="galleryOpen">
                <div class="gallery-header">
                    <a class="returnBack" (click)="galleryClose()">
                        <div class="return">
                            <div class="barReturn1"></div>
                            <div class="barReturn2"></div>
                        </div>
                        <a>назад</a>
                    </a>
                    <div class="gallery-address">                       
                        <div><span>{{itemType}}</span><span *ngIf="item.roomsCount">{{item.roomsCount}} комнатная</span></div>
                        <div class="gallery-price">
                            <span>{{formattedPrice}} Р</span>
                            <span *ngIf="commission != 0">Комиссия {{commission}} {{item?.commisionType == 'fix' ? 'Р' : '%'}}</span>
                            <span *ngIf="commission == 0">Без комиссии</span>
                        </div>
                    </div>
                </div>
                <div class="carousel gallery open" *ngIf="item.photos.length != 0">
                    <div class="arrow left gallery" (click)="prevPhoto()" style="top: 220px;">
                        <div class="arrowFull gallery">
                            <div class="barArrow1-left gallery"></div>
                            <div class="barArrow2-left gallery"></div>
                        </div>
                    </div>
                    <div class="photos" style="overflow: hidden;">
                        <ul id="gallery_carousel-ul" style="width: max-content;">
                            <li class="gallery_carousel-li" *ngFor="let photo of photos">
                                <div class="item-photo gallery" [ngStyle]="{'background-image': 'url('+photo.href+')', 'background-size': 'cover' }"></div>
                            </li>
                        </ul>
                    </div>
                    <div class="arrow right gallery" (click)="nextPhoto()" style="top: 220px">
                        <div class="arrowFull gallery">
                            <div class="barArrow1-right gallery"></div>
                            <div class="barArrow2-right gallery"></div>
                        </div>
                    </div>
                </div>
                <div class="gallery-bottom">
                    <div class="flex-col">
                        <div>{{item?.city}}</div>
                        <div class="address"><span *ngIf="!item.address.includes('ул.')">ул.</span><span class="special">{{item?.address}}<span style="text-transform: lowercase;"> {{item?.house_num}}</span></span></div>
                        <div>{{item?.admArea}}</div>
                        <div>Ост. {{item?.busStop}}</div>
                    </div>
                    <div class="social-icons gallery" *ngIf="(payed == true || payed == 'true') && (logged == true || logged == 'true')">
                        <a class="flex-col" (click)="checkData(item.person.messengerBlock.whatsapp, $event)" [href]="(payed == true || payed == 'true') && (logged == true || logged == 'true')  && item.person.messengerBlock.whatsapp ? 'https://wa.me/' + item?.person?.messengerBlock?.whatsapp : ''">
                            <div class="icon" [ngStyle]="{'background-image': 'url(../../../../assets/social/whatsapp.png)'}"></div>
                            <div class="name">WhatsApp</div>
                        </a>
                        <a class="flex-col" (click)="checkData(item.person.phoneBlock.main, $event)" [href]="(payed == true || payed == 'true') && (logged == true || logged == 'true')  && item.person.phoneBlock.main ? 'tel:' + item?.person?.phoneBlock?.main : ''">
                            <div class="icon" [ngStyle]="{'background-image': 'url(../../../../assets/social/call.png)'}"></div>
                            <div class="name">Позвонить</div>
                        </a>
                        <a class="flex-col" (click)="checkData(item.person.emailBlock.main, $event)" [href]="(payed == true || payed == 'true') && (logged == true || logged == 'true') && item.person.emailBlock.main ? 'mailto:' + item?.person?.emailBlock?.main : ''">
                            <div class="icon" [ngStyle]="{'background-image': 'url(../../../../assets/social/mail.png)'}"></div>
                            <div class="name">Email</div>
                        </a>
                        <a class="flex-col">
                            <div class="icon" [ngStyle]="{'background-image': 'url(../../../../assets/social/message.png)'}"></div>
                            <div class="name">Чат</div>
                        </a>
                    </div>
                    <ng-container *ngIf="(payed != true && payed != 'true') || (logged != true && logged != 'true')">
                        <div class="button-contact" (click)="checkBlock();">Показать контакты</div>
                    </ng-container>
                </div>
            </div>
        </div>
        
    `
})

export class ItemDesktop implements AfterViewInit, OnInit {
    @Input() item: Item;
    @Input() logged: any;
    @Input() payed: any;
    @Input() gallery: any;
    @Input() galleryType: any;

    items: Item[] = [];
    photos: UploadFile[] = [];
    public map: any;
    maps: any;
    itemType: any;
    formattedPrice: any;
    commission = 0;
    addDate: any;
    firstName = '';
    lastName = '';
    conveniences='';
    conditions = '';
    favHovered = false;
    position = 0;
    positionGallery = 0;
    scrollTop = 60;
    galleryOpen: any;

    @Output() favItemMode = new EventEmitter();
    @Output() galleryMode = new EventEmitter();
    @Output() closeItem = new EventEmitter();

    constructor(private _account_service: AccountService) {
    }
    ngOnInit(): void {
        this.photos = this.item.photos;

        this.photos.unshift(this.item.photos[this.item.photos.length-1]);
        this.photos.pop();

        let obj = new Item();
        let upload = new UploadFile();
        upload.href = 'https://avatars.mds.yandex.net/get-pdb/1931145/fc277421-43fd-46a0-9d61-cf36444f2c7a/s1200';
        obj.photos.push(upload);
        this.items.push(obj);
        this.items.push(obj);
        this.items.push(obj);
        this.items.push(obj);
        this.items.push(obj);
        let useless = document.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
        if (useless.item(0).classList.contains('scroll')) {
            this.scrollTop = 60;
        } else {
            this.scrollTop = 190;
        }
        this.galleryOpen = this.gallery;
    }

    ngAfterViewInit(): void {
        ymaps.load('https://api-maps.yandex.ru/2.1/?apikey=c9d5cf84-277c-4432-a839-2e371a6f2e21&lang=ru_RU&amp;load=package.full').then(maps => {
            this.initMap(maps);
            setTimeout(() => {
                if (this.item != undefined) {
                    this.openMarker();
                }
                let mapContainer = document.getElementsByClassName('ymaps-2-1-76-map') as HTMLCollectionOf<HTMLElement>;
                for (let i = 0; i < mapContainer.length; i++) {
                    mapContainer.item(i).style.setProperty('width', '100% !important');
                    mapContainer.item(i).style.setProperty('height', '100% !important');
                }
                this.map.container.fitToViewport();
            }, 300);
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.item) {
            this.checkParams();
        }
        if (changes.gallery) {
            console.log('changes', this.gallery);
            this.galleryOpen = this.gallery;
            this.galleryMode.emit(this.galleryOpen);
        }
    }
    galleryClose(){
        this.galleryOpen = false;
        this.galleryMode.emit(false);
        if (this.galleryType == 'list') {
            this.closeItem.emit();
        }
    }
    checkData(type, ev) {
        if (!type) {
            ev.preventDefault();
        }
    }
    checkBlock() {
        if (this.logged == false || this.logged == 'false' ) {
            this.openBlock('login');
        }
        if ((this.logged == true || this.logged == 'true') && (this.payed == false || this.payed == 'false')) {
            this.openBlock('pay');
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
    addFavObject() {
        if (sessionStorage.getItem('useremail')!= undefined && sessionStorage.getItem('useremail') != 'email') {
            console.log(this.item.id);
            this._account_service.addFavObject(this.item.id).subscribe(res => {
                this.item.is_fav = true;
                this.favItemMode.emit('add');
            });
        }
    }

    delFavObject() {
        if (sessionStorage.getItem('useremail')!= undefined && sessionStorage.getItem('useremail') != 'email') {
            this._account_service.delFavObject(this.item.id).subscribe(res => {
                this.item.is_fav = false;
                this.favItemMode.emit('del');
            });
        }
    }

    prev() {
        const listElems = document.getElementsByClassName('items_carousel-li') as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('items_carousel-ul') as HTMLElement;
        let last = listElems.item(listElems.length - 1);
        listElems.item(listElems.length - 1).remove();
        list.insertBefore(last, listElems.item(0));
        list.style.setProperty('transition', 'unset');
        this.position = -382;
        list.style.setProperty('margin-left', this.position + 'px');
        setTimeout(() => {
            list.style.setProperty('transition', 'margin-left .4s');
            this.position = 0;
            list.style.setProperty('margin-left', this.position + 'px');
        }, 0);
    }

    next() {
        const listElems = document.getElementsByClassName('items_carousel-li') as HTMLCollectionOf<HTMLElement>;
        let first = listElems.item(0);
        let clone = first.cloneNode(true);
        listElems.item(0).remove();
        const list = document.getElementById('items_carousel-ul') as HTMLElement;
        list.appendChild(clone);
        list.style.setProperty('transition', 'unset');
        this.position = 382;

        list.style.setProperty('margin-left', this.position + 'px');
        setTimeout(() => {
            list.style.setProperty('transition', 'margin-left .4s');
            this.position = 0;
            list.style.setProperty('margin-left', this.position + 'px');
        }, 0);
    }
    prevPhoto() {
        const listElems = document.getElementsByClassName('gallery_carousel-li') as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('gallery_carousel-ul') as HTMLElement;
        let last = listElems.item(listElems.length - 1);
        listElems.item(listElems.length - 1).remove();
        list.insertBefore(last, listElems.item(0));
        list.style.setProperty('transition', 'unset');
        this.positionGallery = -1200;
        list.style.setProperty('margin-left', this.positionGallery + 'px');
        setTimeout(() => {
            list.style.setProperty('transition', 'margin-left .4s');
            this.positionGallery = 0;
            list.style.setProperty('margin-left', this.positionGallery + 'px');
        }, 0);
    }

    nextPhoto() {
        const listElems = document.getElementsByClassName('gallery_carousel-li') as HTMLCollectionOf<HTMLElement>;
        let first = listElems.item(0);
        let clone = first.cloneNode(true);
        listElems.item(0).remove();
        const list = document.getElementById('gallery_carousel-ul') as HTMLElement;
        list.appendChild(clone);
        list.style.setProperty('transition', 'unset');
        this.positionGallery = 1200;

        list.style.setProperty('margin-left', this.positionGallery + 'px');
        setTimeout(() => {
            list.style.setProperty('transition', 'margin-left .4s');
            this.positionGallery = 0;
            list.style.setProperty('margin-left', this.positionGallery + 'px');
        }, 0);
    }
    initMap(map) {
        this.maps = map;
        this.map = new map.Map('item-map', {
                center: [48.4862268, 135.0826369],
                zoom: 15,
                controls: ['geolocationControl']
            }, {suppressMapOpenBlock: true}
        );
        let mapStyle = document.getElementsByClassName('ymaps-2-1-76-ground-pane') as HTMLCollectionOf<HTMLElement>;
        if (mapStyle.length != 0) {
            mapStyle.item(0).style.setProperty('filter', 'grayscale(.9)');
        }
    }

    openMarker() {
        let photo, rooms, floor, floorsCount, square: any;
        if (this.item.roomsCount != undefined) {
            rooms = this.item.roomsCount;
        } else {
            rooms = '';
        }
        if (this.item.floor != undefined) {
            floor = this.item.floor;
        } else {
            floor = '';
        }
        if (this.item.floorsCount != undefined) {
            floorsCount = this.item.floorsCount;
        } else {
            floorsCount = '';
        }
        if (this.item.squareTotal != undefined) {
            square = this.item.squareTotal;
        } else {
            square = '';
        }
        if (this.item.photos == undefined) {
            photo = 'url(https://makleronline.net/assets/noph.png)';
        } else {

            if (this.item.photos[0] != undefined) {
                photo = 'url(' + this.item.photos[0].href + ')';
            } else {
                photo = 'url(https://makleronline.net/assets/noph.png)';
            }
        }
        let formattedPrice = this.item.price.toString();
        formattedPrice = formattedPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        let obj_type = '';
        switch (this.item.typeCode) {
            case 'apartment': obj_type = 'Квартира'; break;
            case 'house': obj_type = 'Дом'; break;
            case 'dacha': obj_type = 'Дача'; break;
            case 'cottage': obj_type = 'Коттедж'; break;
            case 'room': obj_type = 'Комната'; break;
        }
        let addr = this.item.address;
        if (!this.item.address.includes('ул.')) {
            addr = 'ул. ' + this.item.address.toUpperCase() + ' ' + this.item.house_num.toUpperCase();
        } else {
            addr = this.item.address.toUpperCase() + ' ' + this.item.house_num.toUpperCase();
        }
        let balloon = new this.maps.Placemark([this.item.lat, this.item.lon], {
            name: this.item.id,
            balloonContentHeader: '<span style="font-family: OpenSansBold, sans-serif;margin-top: 13px; font-size: 12px;letter-spacing: 0;">' + addr + '</span>',
            balloonContentBody: '<div style="display: flex;height: 100%;width: fit-content">' +
                ' <div style="margin-right: 15px; height: 80px; width: 110px;    background-position-x: center;background-position-y: center;background-repeat: no-repeat; background-size: 140% auto; background-image:' + photo + '"></div> <div style="display: flex; flex-direction: column;font-family: Cadillac, sans-serif;' +
                'font-size: 14px;">' +
                // '<span style="font-family: OpenSansBold;margin-top: 7px; font-size: 12px">' + item.address + ' ' + item.house_num + '</span>' +
                '<div style="display: flex;font-family: OpenSans; font-size: 12px;padding: 0 30px 0 0 ;height: 15px;letter-spacing: 0;"><div style="width: 75px">' + obj_type +'</div><div style="min-width: 85px;">' + rooms + ' комнатная</div></div>' +
                '<div style="display: flex;font-family: OpenSans; font-size: 12px;padding: 0;height: 15px;letter-spacing: 0;"><div style="width: 75px">Этаж</div><div>' + floor + '/' + floorsCount + '</div></div>' +
                '<div style="display: flex;font-family: OpenSans; font-size: 12px; padding-bottom: 5px;height: 15px;letter-spacing: 0;"><div style="width: 75px">Площадь</div><div>' + square + ' кв. м</div></div>' +
                '<div style="display: flex;font-family: OpenSans; font-size: 12px"><div style="width: 75px;letter-spacing: 0;">Стоимость</div><span style="font-family: OpenSansBold">' + formattedPrice + ' Р/МЕС</span></div></div>'
        }, {
            preset: 'islands#icon',
            iconColor: '#c50101',
        });
        balloon.events.add("balloonopen", () => {
            let baloonlayout = document.getElementsByClassName('ymaps-2-1-76-balloon__layout') as HTMLCollectionOf<HTMLElement>;
            let baloon_content = document.getElementsByClassName('ymaps-2-1-76-balloon__content') as HTMLCollectionOf<HTMLElement>;
            let mainBaloon = document.getElementsByClassName('ymaps-2-1-76-balloon') as HTMLCollectionOf<HTMLElement>;

            for (let k = 0; k < mainBaloon.length; k++) {
                mainBaloon.item(k).style.setProperty('top', '-150px');
            }
            for (let k = 0; k < baloon_content.length; k++) {
                baloon_content.item(k).style.setProperty('padding-top', '5px');
                baloon_content.item(k).style.setProperty('height', '100%');
                let inner = baloon_content[k].children[0] as HTMLElement;
                inner.style.setProperty('height', '100%');
            }
            for (let k = 0; k < baloonlayout.length; k++) {
                baloonlayout.item(k).style.setProperty('height', '120px');
            }
            let cross =  document.getElementsByClassName('ymaps-2-1-76-balloon__close-button') as HTMLCollectionOf<HTMLElement>;
            for (let k = 0; k < cross.length; k++) {
                cross.item(k).style.setProperty('width', '16px');
                cross.item(k).style.setProperty('height', '16px');
                cross.item(k).style.setProperty('margin-right', '12px');
                cross.item(k).style.setProperty('margin-top', '12px');
            }
        });
        balloon.events.add("mouseup", () => {
            this.map.setCenter([this.item.lat, this.item.lon], 15, {
                duration: 500
            });
        });
        this.map.geoObjects.add(balloon);
        this.map.setCenter([this.item.lat, this.item.lon]);
    }
    checkParams() {
        this.conditions = '';
        this.conveniences = '';
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
                        if (this.item.buildingClass == 'business' || this.item.buildingClass == 'elite' || this.item.buildingClass == 'economy' || this.item.buildingClass == 'new'
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
            if (this.item.name != undefined) {
                let spArray = this.item.name.split(" ");
                this.firstName = spArray[0].toUpperCase();
                if (spArray.length > 1) {
                    for (let i = 1; i < spArray.length; i++) {
                        this.lastName += " " + spArray[i];
                    }
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
            } else {
                this.conditions += 'Залог нет, ';
            }
            if (this.item.deposit != null && this.item.deposit) {
                this.conditions += 'Депозит да, ';
            } else {
                this.conditions += 'Депозит нет, ';
            }
            this.conveniences = this.conveniences.substring(0, this.conveniences.length - 2);
            this.conditions = this.conditions.substring(0, this.conditions.length - 2);
            this.formattedPrice = this.item.price != undefined ? this.item.price.toString() : '';
            this.formattedPrice = this.formattedPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        }
    }
}
