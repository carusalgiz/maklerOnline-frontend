import {LOCAL_STORAGE} from '@ng-toolkit/universal';
import {AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Item} from '../../../item';
import {ActivatedRoute} from '@angular/router';
import {AccountService} from '../../../services/account.service';
import * as moment from 'moment';
import {Title} from '@angular/platform-browser';
import 'moment/locale/ru.js';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ConfigService} from '../../../services/config.service';
import {AsyncSubject} from 'rxjs';
import {group} from '@angular/animations';
import {Md5} from 'ts-md5/dist/md5';
import {IgApiClient} from 'instagram-private-api';
import {ok} from 'ok.ru';

declare var VK: any;
declare var FB: any;
declare var OKSDK: any;

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})


export class ItemComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() item: Item;
    @Input() mode: string;
    @Input() similarOpen: any;
    @Input() watched: boolean;
    @Input() historyOpen: boolean;
    @Input() historyId: number;
    @Input() compare: boolean;
    @Input() compareItem: boolean;
    @Input() loggingMode: boolean;
    @Input() payingMode: boolean;

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
    is_fav = false;
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
    vk_href: any;
    cur_href: any;
    servUrl: any;
    formdata: any;
    file: any;
    groups: any[] = [];
    groups_choice = false;
    postInfo: any[] = [];

    constructor(@Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute, private _http: HttpClient,private config: ConfigService,
                private _account_service: AccountService, private titleService: Title) {
        this.servUrl = config.getConfig('servUrl');
    }

    @Output() similarItem = new EventEmitter<Item>();
    @Output() closeItem = new EventEmitter();
    @Output() comparison = new EventEmitter();
    @Output() favItemMode = new EventEmitter();

    ngOnInit() {
        // console.log('log: ', this.loggingMode);
        // console.log('pay: ', this.payingMode);

        // VK.Observer.subscribe('auth.login', function(response){
        //     refreshPage(true);
        // });

    }

    ngOnChanges(changes: SimpleChanges): void {

        if (this.item != undefined) {
            this.titleService.setTitle('');
            if (changes.item.currentValue != changes.item.previousValue) {
                this.checkParams();
            }
        }
        if (window.location.href.indexOf('publish') != -1) {
            this.vk_auth();

        }
        // if (this.loggingMode != undefined) {
        //     if (changes.loggingMode.currentValue != changes.loggingMode.previousValue) {
        //         console.log("changed log: ", this.loggingMode);
        //
        //         if (this.loggingMode) {
        //             this.cur_id = localStorage.getItem('cur_id');
        //         //    this.vk_href = "https://oauth.vk.com/authorize?client_id=7138237&display=popup&redirect_uri=https://oauth.vk.com/blank.html&scope=wall&response_type=token&v=5.101&state="+this.cur_id + "_" + this.item.id;
        //         }
        //     }
        // }

    }

    ngAfterViewInit() {

        this.checkParams();
        this.cur_href = document.location.href;
    }

    inst() {
        FB.login((response) => {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
        FB.api(
            '100002163630078/feed',
            'POST',
            {
                'message': 'This is a test message'
            },
            (response) => {
                if (response && !response.error) {
                    /* handle the result */
                } else {
                    console.log(response.error);
                }
            }
        );

    }

    ok_publish() {
        let config = {
            app_id: 512000104776,
            app_key: 'CJEKJGJGDIHBABABA',
            obj_id: this.item.id,
            oauth: {
                url: this.cur_href //+'/d/objects/'+this.item.id
            }
        };
        if (sessionStorage.getItem('access') == undefined || sessionStorage.getItem('access') == '') {
            OKSDK.init(config, () => {
                console.log('ok success!');
            }, (e) => {
                console.log(e);
            });
        }
        window.addEventListener('message', function (widgetMessage) {
            console.log(JSON.stringify(widgetMessage.data));
            // обрабатываете сообщение от виджета здесь
        }, false);

        OKSDK.Widgets.post(
            null,
            {
                "attachment": {
                    "media": [
                        {
                            "type": "text",
                            "text": "Играй и получай бонусы!"
                        },
                        {
                            "type": "app-ref",
                            "appId": 512000104776
                        }
                    ]
                },
                "silent": true
            }
        );
            OKSDK.REST.call('users.getCurrentUser', null, function(status, data, error) {
                if (status == 'ok') {
                    console.log('userdata: ', data);
                } else {
                    alert('Unable to retrieve current user ' + OKSDK.Util.toString(error));
                }
            });

            let obj = this.item;
            let apart_type = '', rooms = '', square = '', conveniencesShort = '', floor = '', price = '';
            switch (obj.typeCode) {
                case 'room':
                    apart_type = 'Комната ';
                    break;
                case 'apartment':
                    apart_type = 'Квартира ';
                    break;
                case 'house':
                    apart_type = 'Дом ';
                    break;
                case 'dacha':
                    apart_type = 'Дача ';
                    break;
                case 'cottage':
                    apart_type = 'Коттедж ';
                    break;
            }
            if (obj.roomsCount != undefined) {
                rooms = obj.roomsCount + ' комнатная';
            }
            if (obj.squareTotal != undefined) {
                square = 'Площадь ' + obj.squareTotal + ' кв.м \n';
            }

            if (obj.conditions.bedding && obj.conditions.kitchen_furniture && obj.conditions.living_room_furniture) {
                conveniencesShort += 'Мебель да\n';
            } else if (obj.conditions.bedding || obj.conditions.kitchen_furniture || obj.conditions.living_room_furniture) {
                conveniencesShort += 'Мебель частично\n';
            } else {
                conveniencesShort += 'Мебель нет\n';
            }

            if (obj.conditions.refrigerator && obj.conditions.washer &&
                obj.conditions.dishwasher && obj.conditions.microwave_oven &&
                obj.conditions.air_conditioning && obj.conditions.tv) {
                conveniencesShort += 'Бытовая техника да\n';
            } else if (obj.conditions.refrigerator || obj.conditions.washer ||
                obj.conditions.dishwasher || obj.conditions.microwave_oven ||
                obj.conditions.air_conditioning || obj.conditions.tv) {
                conveniencesShort += 'Бытовая техника частично\n';
            } else {
                conveniencesShort += 'Бытовая техника нет\n';
            }

            if (obj.floor != undefined && obj.floorsCount == undefined) {
                floor = 'Этаж ' + obj.floor + '\n';
            }
            if (obj.floor != undefined && obj.floorsCount != undefined) {
                floor = 'Этаж ' + obj.floor + '\\' + obj.floorsCount + '\n';
            }
            if (obj.price != undefined) {
                price = obj.price + '/мес ';
            }

            let post_text = obj.address + ' ' + obj.house_num + '\n' +
                obj.city + ', ' + obj.admArea + price + '\n' +
                'ОПИСАНИЕ ПРЕДЛОЖЕНИЯ\n' +
                apart_type + ' ' + rooms + '\n' +
                floor +
                square +
                'УСЛОВИЯ ПРОЖИВАНИЯ\n' +
                conveniencesShort +
                '\n' +
                // "http://dev.makleronline.net/#/d" + "\n" +
                '#арендаквартирХабаровск#сдамквартирувХабаровске#недвижимостьХабаровск#сдамснимуквартируХабаровск#арендаkhv#аренданедвижимости\n'
            ;
            // let method = "users.getCurrentUser";
            // let params = {
            //     "fields": "user.id, user.name"
            // };
            // OKSDK.REST.call(method, params, (status,data,error) => {
            //     console.log("status: ", status);
            //     console.log("data: ", data);
            //     console.log("error: ", error);
            // });
            // let attachment = '{"media":[{"type":"text","text":"hello"}]}';
            // let md5 = Md5.hashStr("st.attachment=" + attachment + '88FD7C038F62AE4C8038B146');
            // console.log(md5);
            // let href = "https://connect.ok.ru/dk" +
            //     "?st.cmd=WidgetMediatopicPost" +
            //     "&st.app=512000104776" +
            //     "&st.attachment=" + attachment +
            //     "&st.signature=" + md5 +
            //     "&st.popup=on" +
            //     "&st.utext=on" ;
            // window.open(href, "Odnoklassniki");


    }

    vk_auth() {

        if (this.loggingMode) {
            this._account_service.sendPost(this.item).subscribe(res => {
                console.log(res);
                if (res != undefined) {
                    let data = JSON.parse(JSON.stringify(res));
                    if (data.result.indexOf('oauth') != -1) {
                        let arr = [];
                        let newwindow = window.open(data.result, '_blank', 'height=300,width=300,scrollbars=1');
                        this.openBlock('save_token');
                        // newwindow.onmousemove
                        // newwindow.postMessage(newwindow.location.origin, window.location.origin );
                        //
                        // window.addEventListener("message", this.receiveMessage, false);
                    } else {
                        window.open(data.result, '_blank');
                        window.location.href = window.location.href.slice(0, window.location.href.indexOf('publish') - 1);
                    }
                }
                //if (type == 'publish') {window.location.href = window.location.href.slice(0, window.location.href.indexOf("publish") - 1);}
            });
            // this._account_service.publish(this.item).subscribe(res => {
            //     console.log(res);
            //     console.log(res);
            // });
            // this.cur_id = localStorage.getItem('cur_id');
            // //
            // this.vk_href = "https://oauth.vk.com/authorize?client_id=7138237&display=popup&redirect_uri=http://dev.makleronline.net&scope=wall&response_type=token&state="+this.cur_id + "_" + this.item.id;
        }
        // alert(this.vk_href);
        //  window.location.href = this.vk_href;
        //  window.location.href = "https://oauth.vk.com/authorize?client_id=7138237&display=popup&redirect_uri=http://dev.makleronline.net&scope=wall&response_type=token&v=5.101&state=123456";
    }

    receiveMessage(event) {
        console.log(event.origin);
        // Do we trust the sender of this message?  (might be
        // different from what we originally opened, for example).
        if (event.origin !== '') {
            return;
        }

        // event.source is popup
        // event.data is "hi there yourself!  the secret response is: rheeeeet!"
    }

    checkParams() {
        this.conveniencesShort = '';
        this.conditions = '';
        this.conveniences = '';
        if (this.item != undefined) {

            if (this.item.address.includes('ул.')) {
                // console.log('ind: ', this.item.address.indexOf('ул.'));
                this.item.address = this.item.address.slice(this.item.address.indexOf('ул.') + 3, this.item.address.length);
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
                this.conditions += 'Депозит да, ';
                this.conveniencesShort += 'Депозит да\n';
            } else {
                this.conditions += 'Депозит нет, ';
                this.conveniencesShort += 'Депозит нет\n';
            }


            this.conditions = this.conditions.substring(0, this.conditions.length - 2);
            this.conveniences = this.conveniences.substring(0, this.conveniences.length - 2);

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
        this.checklogin();

        if (this.compareItem && this.similarOpen) {
            this.nearButton = 'compare';
        }

        if (this.mode == 'full' && this.item != undefined) {

            this.time = this.localStorage.getItem('timeAdd');
            if (this.item.photos != undefined) {
                this.src = this.item.photos[0] != undefined ? this.item.photos[0].href : 'https://makleronline.net/assets/noph.png';
            }


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

            this.getPlaces(this.item.lon, this.item.lat, [this.item.lon, this.item.lat]);
        }
        setTimeout(() => {
            if (this.item != undefined) {
                if (this.item.photos != undefined) {
                    if (this.item.photos[0] != undefined) {
                        this.src = this.item.photos[0].href;
                    } else {
                        this.src = '../../../../assets/noph1.png';
                        this.photo_no_title = 'ФОТО НЕТ';
                    }
                } else {
                    this.src = '../../../../assets/noph1.png';
                    this.photo_no_title = 'ФОТО НЕТ';

                }
            }

        }, 200);
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

    log_out() {
        this._account_service.logout();
    }

    checkblock() {
        if (this.time == 'false' && this.loggingMode) {
            this.openBlock('pay');
        } else if (this.time != 'false' && this.loggingMode) {
            this.openBlock('pay');
        } else {
            this.openBlock('login');
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

    // checkFav() {
    //   this.checklogin();
    //   // this.get_favObjects();
    //   if (this.loggingMode) {
    //     if (this.item.is_fav) {
    //       this.delFavObject();
    //     } else {
    //       this.addFavObject();
    //     }
    //   }
    //
    // }
    // get_favObjects() {
    //   this.is_fav = false;
    //   this._account_service.getFavObjects().subscribe(offers => {
    //     for (let offer of offers) {
    //       if (this.item.id == offer.id) {
    //         this.is_fav = true;
    //       }
    //     }
    //   });
    // }
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

    getPlaces(x, y, coords) {
        this._account_service.getObjects(x, y, 'Остановка', '0.01').subscribe(res => {
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
                    this.timeToBusStop = '1 мин';
                } else {
                    this.timeToBusStop = Math.round(time1) + ' мин';
                }

                this.objStop = places[index].name;

                document.getElementById('busStop').innerHTML = 'Остановка ' + this.objStop + '   \tВремя в пути: ' + this.timeToBusStop;
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

    changeSize() {
        this.widthDocument = document.documentElement.clientWidth;
        let objects = document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        this.width = objects.item(objects.length - 1).offsetWidth;
    }

//   onResize() {
// //    arrowRight
//     let catalog_item = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
//     if ( document.getElementById('arrowRight') != undefined) {
//       document.getElementById('arrowRight').style.setProperty('left', 'calc(100% - ' + (catalog_item.item(0).clientWidth - 40) + 'px)');
//     }
//   }
    close(name) {
        this.closeItem.emit(name);
    }

    prev() {
        const list = document.getElementById('carousel-ul-' + this.mapname) as HTMLElement;
        this.position = Math.min(this.position + this.width * this.count, 0);
        list.style.setProperty('margin-left', this.position + 'px');
    }

    next() {
        const listElems = document.getElementsByClassName('carousel-li-' + this.mapname) as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('carousel-ul-' + this.mapname) as HTMLElement;
        this.position = Math.max(this.position - this.width * this.count, -this.width * (listElems.length - this.count));
        list.style.setProperty('margin-left', this.position + 'px');
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
        console.log('widthimg: ' + widthImg);
        const list = document.getElementById('carousel-ul-img' + block + '' + this.item.id) as HTMLElement;
        this.positionImg = Math.max(this.positionImg - widthImg, -widthImg * (this.item.photos.length - 1));
        list.style.setProperty('margin-left', this.positionImg + 'px');
    }

    showAuthData(data) {
        console.log('expire: ' + data.expire);
        console.log('mid: ' + data.mid);
        console.log('fio: ' + data.user.first_name + ' ' + data.user.last_name);
        console.log('userDomain: ' + data.user.domain);
    }

    downloadFile(url, upload) {
        return this._http.get(url, {responseType: 'blob', reportProgress: false}).subscribe(
            raw => {
                // console.log('You received data', raw);
                this.formdata = new FormData();
                this.file = new File([raw], 'qwerty.txt');
                this.formdata.append('photo', this.file);
                this._http.post(upload, this.formdata, {
                    withCredentials: true,
                    headers: new HttpHeaders({'Content-Type': 'multipart/form-data'})
                }).pipe(
                    map((res: Response) => res)).subscribe(
                    raw => {
                        let data = JSON.parse(JSON.stringify(raw));
                        console.log(data);

                    },
                    err => console.log(err)
                );
            },
            err => console.log(err)
        );
    }

    publishVk(type) {
        console.log(VK);
        // VK.Auth.login(response => {
        //     if (response.session) {
        //         console.log('expire: ' + response.session.expire);
        //         console.log('mid: ' + response.session.mid);
        //         console.log('fio: ' + response.session.user.first_name + ' ' + response.session.user.last_name );
        //         console.log('userDomain: ' + response.session.user.domain);
        //
        //         if (response.settings) {
        //             console.log(response.settings);
        //             // Выбранные настройки доступа пользователя если они были запрошены
        //         }
        //     } else {
        //         // Пользователь нажал кнопку Отмена в окне авторизации
        //     }
        // },  VK.access.FRIENDS | VK.access.PHOTOS | VK.access.WALL | VK.access.ADS | VK.access.GROUPS  );

        setTimeout(() => {
            VK.Auth.getLoginStatus(response => {
                if (response.status != 'connected') {
                    VK.Auth.login(response => {
                        if (response.session) {
                            console.log('expire: ' + response.session.expire);
                            console.log('mid: ' + response.session.mid);
                            console.log('fio: ' + response.session.user.first_name + ' ' + response.session.user.last_name);
                            console.log('userDomain: ' + response.session.user.domain);

                            if (response.settings) {
                                console.log(response.settings);
                                // Выбранные настройки доступа пользователя если они были запрошены
                            }
                        } else {
                            // Пользователь нажал кнопку Отмена в окне авторизации
                        }
                    }, VK.access.FRIENDS | VK.access.PHOTOS | VK.access.WALL | VK.access.ADS | VK.access.GROUPS);
                } else {
                    console.log(response);
                    if (type == 2) {
                        this.groups_choice = true;
                    }
                    if (response.session) {

                        let obj = this.item;
                        let apart_type = '', rooms = '', square = '', conveniencesShort = '', floor = '', price = '';
                        switch (obj.typeCode) {
                            case 'room':
                                apart_type = 'Комната ';
                                break;
                            case 'apartment':
                                apart_type = 'Квартира ';
                                break;
                            case 'house':
                                apart_type = 'Дом ';
                                break;
                            case 'dacha':
                                apart_type = 'Дача ';
                                break;
                            case 'cottage':
                                apart_type = 'Коттедж ';
                                break;
                        }
                        if (obj.roomsCount != undefined) {
                            rooms = obj.roomsCount + ' комнатная';
                        }
                        if (obj.squareTotal != undefined) {
                            square = 'Площадь ' + obj.squareTotal + ' кв.м \n';
                        }

                        if (obj.conditions.bedding && obj.conditions.kitchen_furniture && obj.conditions.living_room_furniture) {
                            conveniencesShort += 'Мебель да\n';
                        } else if (obj.conditions.bedding || obj.conditions.kitchen_furniture || obj.conditions.living_room_furniture) {
                            conveniencesShort += 'Мебель частично\n';
                        } else {
                            conveniencesShort += 'Мебель нет\n';
                        }

                        if (obj.conditions.refrigerator && obj.conditions.washer &&
                            obj.conditions.dishwasher && obj.conditions.microwave_oven &&
                            obj.conditions.air_conditioning && obj.conditions.tv) {
                            conveniencesShort += 'Бытовая техника да\n';
                        } else if (obj.conditions.refrigerator || obj.conditions.washer ||
                            obj.conditions.dishwasher || obj.conditions.microwave_oven ||
                            obj.conditions.air_conditioning || obj.conditions.tv) {
                            conveniencesShort += 'Бытовая техника частично\n';
                        } else {
                            conveniencesShort += 'Бытовая техника нет\n';
                        }

                        if (obj.floor != undefined && obj.floorsCount == undefined) {
                            floor = 'Этаж ' + obj.floor + '\n';
                        }
                        if (obj.floor != undefined && obj.floorsCount != undefined) {
                            floor = 'Этаж ' + obj.floor + '\\' + obj.floorsCount + '\n';
                        }
                        if (obj.price != undefined) {
                            price = obj.price + '/мес ';
                        }

                        let post_text = obj.address + ' ' + obj.house_num + '\n' +
                            obj.city + ', ' + obj.admArea + price + '\n' +
                            'ОПИСАНИЕ ПРЕДЛОЖЕНИЯ\n' +
                            apart_type + ' ' + rooms + '\n' +
                            floor +
                            square +
                            'УСЛОВИЯ ПРОЖИВАНИЯ\n' +
                            conveniencesShort +
                            '\n' +
                            // "http://dev.makleronline.net/#/d" + "\n" +
                            '#арендаквартирХабаровск#сдамквартирувХабаровске#недвижимостьХабаровск#сдамснимуквартируХабаровск#арендаkhv#аренданедвижимости\n'
                        ;


                        console.log('photos: ', obj.photos);
                        if (obj.photos != undefined && obj.photos.length != 0) {
                            VK.Api.call('photos.getWallUploadServer', {uid: response.session.mid, v: '5.101'}, answer => {
                                console.log('get answer: ', answer);
                                let attachs = [];
                                let phlen = 0;
                                if (obj.photos.length < 6) {
                                    phlen = obj.photos.length;
                                } else {
                                    phlen = 6;
                                }
                                for (let i = 0; i < phlen; i++) {
                                    console.log(i, ' photo ', obj.photos[i].href);
                                    this._account_service.publish(obj.photos[i].href, answer.response.upload_url, i).pipe(
                                        map((res: Response) => res)).subscribe(
                                        raw => {
                                            let data = JSON.parse(JSON.stringify(raw));
                                            console.log(data);
                                            if (data.server != undefined) {
                                                let server = JSON.parse(JSON.stringify(data.server));
                                                let photo = JSON.parse(JSON.stringify(data.photo));
                                                let hash = JSON.parse(JSON.stringify(data.hash));
                                                VK.Api.call('photos.saveWallPhoto', {
                                                    server: server,
                                                    photo: photo,
                                                    hash: hash,
                                                    v: '5.101'
                                                }, (d) => {
                                                    console.log(d);
                                                    let data = JSON.parse(JSON.stringify(d));
                                                    attachs.push('photo' + response.session.mid + '_' + data.response[0].id);
                                                    console.log('attachs: ', attachs.length, ' objs: ', phlen);
                                                    if (attachs.length == phlen) {
                                                        let attachsStr = '';
                                                        for (let i = 0; i < attachs.length; i++) {
                                                            if (i < 9) {
                                                                attachsStr += attachs[i] + ',';
                                                            }
                                                        }
                                                        attachsStr += 'http://dev.makleronline.net/#/d';
                                                        console.log(attachsStr);
                                                        attachsStr = attachsStr.slice(0, attachsStr.length - 1);
                                                        if (type == 1) {
                                                            VK.Api.call('wall.post', {
                                                                owner_id: response.session.mid,
                                                                message: post_text,
                                                                v: '5.101',
                                                                attachments: attachsStr
                                                            }, () => {
                                                                // alert("Post ID:" + data.response.post_id);
                                                            });
                                                        }
                                                        if (type == 2) {
                                                            this.postInfo = [];
                                                            this.postInfo.push({
                                                                owner_id: response.session.mid,
                                                                message: post_text,
                                                                v: '5.101',
                                                                attachments: attachsStr
                                                            });
                                                            console.log('postinfo: ', this.postInfo);
                                                            VK.Api.call('groups.get', {
                                                                user_id: response.session.mid,
                                                                extended: 1,
                                                                v: '5.101',
                                                                fields: 'id,name,type,photo_50'
                                                            }, (ans) => {
                                                                let its = JSON.parse(JSON.stringify(ans));
                                                                let dataAns = its.response;
                                                                console.log(dataAns);
                                                                console.log(dataAns.items);
                                                                this.groups = [];
                                                                for (let q = 0; q < dataAns.items.length; q++) {
                                                                    let type = '', closed = '';
                                                                    switch (dataAns.items[q].type) {
                                                                        case 'group':
                                                                            type = 'группа';
                                                                            break;
                                                                        case 'page' :
                                                                            type = 'публичная страница';
                                                                            break;
                                                                        case 'event':
                                                                            type = 'мероприятие';
                                                                            break;
                                                                    }
                                                                    switch (dataAns.items[q].is_closed) {
                                                                        case 0:
                                                                            closed = 'oткрытое';
                                                                            break;
                                                                        case 1:
                                                                            closed = 'закрытое';
                                                                            break;
                                                                        case 2:
                                                                            closed = 'частное';
                                                                            break;
                                                                    }

                                                                    //  if (dataAns.items[q].type == "group") {
                                                                    this.groups.push({
                                                                        id: -dataAns.items[q].id,
                                                                        type: type,
                                                                        name: dataAns.items[q].name,
                                                                        href: dataAns.items[q].photo_50,
                                                                        is_closed: closed
                                                                    });
                                                                    //   }
                                                                }


                                                                console.log(this.groups);
                                                            });
                                                        }

                                                    }

                                                    // console.log(attach);
                                                    // VK.Api.call("wall.post", {owner_id: response.session.mid, message: post_text, v: "5.101", attachments: attach}, () => {
                                                    //     // alert("Post ID:" + data.response.post_id);
                                                    // });
                                                });
                                            }
                                        },
                                        err => console.log(err)
                                    );
                                }
                            }, onerror);
                        } else {
                            VK.Api.call('wall.post', {
                                owner_id: response.session.mid,
                                message: post_text,
                                v: '5.101'
                            }, (data) => {
                                alert('Post ID:' + data.response.post_id);
                            });
                        }
                    } else {
                        alert('Для публикации записи необходимо авторизоваться через вк');
                    }
                }
            });
        }, 1000);

    }

    sendInGroup(id) {
        VK.Api.call('wall.post', {
            owner_id: id,
            message: this.postInfo[0].message,
            v: '5.101',
            attachments: this.postInfo[0].attachments
        }, () => {
            // alert("Post ID:" + data.response.post_id);
        });
    }

    test_vk() {

        console.log(VK);
        VK.Auth.login(response => {
            if (response.session) {
                this.showAuthData(response.session);

                if (response.settings) {
                    console.log(response.settings);
                    // Выбранные настройки доступа пользователя если они были запрошены
                }
            } else {
                // Пользователь нажал кнопку Отмена в окне авторизации
            }
        }, VK.access.WALL || VK.access.FRIENDS);

        VK.Auth.getLoginStatus(function(response) {
            console.log(response);
            if (response.session) {
                VK.Api.call('wall.post', {owner_id: response.session.mid, message: 'Тестовый пост с сайта', v: '5.101'}, (data) => {
                    alert('Post ID:' + data.response.post_id);
                });
            } else {
                alert('Для публикации записи необходимо авторизоваться через вк');
            }
        });

    }
}
