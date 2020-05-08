import {LOCAL_STORAGE} from '@ng-toolkit/universal';
import {Component, OnInit, AfterViewInit, Inject} from '@angular/core';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
import {ConfigService} from '../../../services/config.service';
import {Item} from '../../../class/item';
import {HubService} from '../../../services/hub.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

    constructor(private ym: NgxMetrikaService, @Inject(LOCAL_STORAGE) private localStorage: any, private _offer_service: OfferService, config: ConfigService,
                private _account_service: AccountService, private _hub_service: HubService, private router: Router) {
        this.siteUrl = config.getConfig('siteUrl');
    }

    items: Item[] = [];
    loggedIn = false;
    widthReview = 450; // ширина отзыва
    widthItem = 370;
    count = 1; // количество отзывов
    position = 0;
    positionReview = 0;
    width: number;
    countObjects = 0;
    countTodayObjects = 0;
    agreement: any;
    siteUrl: any;
    facebook = false;
    vk = false;
    odnokl = false;
    reviews = [{
        photo: '../../../../assets/Parfenova.jpg',
        job: 'Специалист банковского дела',
        name: 'Юлия Парфенова',
        text: '...Уже много знакомых и знакомые моих знакомых нашли через вас то, что искали!)))'
    }, {
        photo: '../../../../assets/Karol.jpg',
        job: 'Ветеринар',
        name: 'Григорий Кароль',
        text: 'От души! Приехал позвонил, заехал)))'
    }, {
        photo: '../../../../assets/Curnosov.jpg',
        job: 'DJ - звукооператор',
        name: 'Дмитрий Курносов',
        text: 'Отличный сайт, хоть еще и не снял квартиру, но все же... обзвонил несколько объявлений, договорился на встречи,' +
            'даже не спросили :"А вас какая квартира интересует?". Ура!!! Наконец то, появился такой сайт...у меня эмоция)) ' +
            'Буду рекомендовать).'
    }, {
        photo: '../../../../assets/АвторОтзыва1.png',
        job: '',
        name: 'Пользователь',
        text: 'Хороший сайт, вроде все честно, борется с паразитами в виде риелторов !)'
    }, {
        photo: '../../../../assets/АвторОтзыва3.jpg',
        job: 'Домохозяйка',
        name: 'Катерина',
        text: 'Добрый день! Хочу выразить благодарность создателю сайта-Станиславу за столько ' +
            'полезный и нужный ресурс в наше время агентов и прочих мошенников.В кратчайшие сроки удалось' +
            ' найти квартиру,были небольшие проблемы с оплатой, но мы со Станиславом всё благополучно решили' +
            ' буквально за 10-15 мин.Процветания,удачи и продолжайте в том же духе. С благодарностью и уважением, Катерина'
    }, {
        photo: '../../../../assets/АвторОтзыва2.png',
        job: '',
        name: 'Александр Кузин',
        text: 'Огромное спасибо сайту и его создателям за то, что смог найти квартиру быстро без затрат и комиссий.'
    }];
    slideAction: any;
    itemSlideAction: any;

    ngOnInit() {
        this.checklogin();
        this.width = document.documentElement.clientWidth;
        this.get_list();
    }

    ngAfterViewInit() {
        this.resize();
        let itemsMenu = document.getElementsByClassName('menuBlock') as HTMLCollectionOf<HTMLElement>;
        if (itemsMenu.length != 0) {
            for (let i = 0; i < itemsMenu.length; i++) {
                if (i != 0 && i != 4) {
                    itemsMenu.item(i).style.removeProperty('border-top');
                    itemsMenu.item(i).style.removeProperty('font-weight');
                } else {
                    itemsMenu.item(i).style.setProperty('border-top', '5px solid #821529');
                    itemsMenu.item(i).style.setProperty('font-weight', 'bold');
                }
            }
        }
        let line = document.documentElement.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
        line.item(0).classList.add('homePage');
    }

    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }

    openItem(item) {
        this._hub_service.setMode('home');
        this._hub_service.setTransferItem(item);
        this.router.navigate(['d/objects/list']);
    }

    redirectFunc(href) {
        let hostname = window.location.href.substr(0, window.location.href.indexOf('#/') + 2);
        let newhref = hostname + href;
        console.log(newhref, window.location.href);
        if (newhref != window.location.href) {
            document.location.href = newhref;
        }
    }

    checklogin() {
        this._account_service.checklogin().subscribe(res => {
            console.log(res);
            if (res != undefined) {
                let data = JSON.parse(JSON.stringify(res));
                this.loggedIn = data.result == 'success';
            } else {
                this.loggedIn = false;
                console.log('not athorized!');
                return false;
            }
        });
    }

    log_out() {
        this.localStorage.removeItem('days');
        this.localStorage.removeItem('time');
        this.loggedIn = false;
        this._account_service.logout();
    }

    resize() {
        let footer = document.getElementsByClassName('footer') as HTMLCollectionOf<HTMLElement>;
        let size = (document.documentElement.clientWidth - 4 * 65 - 420 * 3) / 2;
        if (document.documentElement.clientWidth < 1600) {
            size = (document.documentElement.clientWidth - 4 * 25 - 370 * 3) / 2;
        }
        footer.item(0).style.setProperty('width', 'calc(100% - ' + size * 2 + 'px)');
        footer.item(0).style.setProperty('padding', '30px ' + size + 'px 0');

    }

    prev() {
        const listElems = document.getElementsByClassName('items_carousel-li') as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('items_carousel-ul') as HTMLElement;
        let last = listElems.item(listElems.length - 1);
        listElems.item(listElems.length - 1).remove();
        list.insertBefore(last, listElems.item(0));
        list.style.setProperty('transition', 'unset');
        this.position = -370;
        list.style.setProperty('margin-left', this.position + 'px');
        setTimeout(() => {
            list.style.setProperty('transition', 'margin-left .4s');
            this.position = 0;

            list.style.setProperty('margin-left', this.position + 'px');
            this.itemSlideAction = 'prev';
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

        this.position = 370;


        list.style.setProperty('margin-left', this.position + 'px');

        setTimeout(() => {
            list.style.setProperty('transition', 'margin-left .4s');

            this.position = 0;

            // this.positionReview = -450;
            list.style.setProperty('margin-left', this.position + 'px');
            this.itemSlideAction = 'next';

        }, 0);
    }

    prevReview() {
        const listElems = document.getElementsByClassName('carousel-li') as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('carousel-ul') as HTMLElement;
        let last = listElems.item(listElems.length - 1);
        listElems.item(listElems.length - 1).remove();
        list.insertBefore(last, listElems.item(0));


        list.style.setProperty('transition', 'unset');
        this.positionReview = -475;

        list.style.setProperty('margin-left', this.positionReview + 'px');
        setTimeout(() => {
            list.style.setProperty('transition', 'margin-left .4s');

            this.positionReview = 0;

            list.style.setProperty('margin-left', this.positionReview + 'px');
            this.slideAction = 'prev';
        }, 0);
    }

    nextReview() {
        const listElems = document.getElementsByClassName('carousel-li') as HTMLCollectionOf<HTMLElement>;
        let first = listElems.item(0);
        let clone = first.cloneNode(true);
        listElems.item(0).remove();
        const list = document.getElementById('carousel-ul') as HTMLElement;
        list.appendChild(clone);
        list.style.setProperty('transition', 'unset');

        this.positionReview = 475;

        list.style.setProperty('margin-left', this.positionReview + 'px');

        setTimeout(() => {
            list.style.setProperty('transition', 'margin-left .4s');

            this.positionReview = 0;

            // this.positionReview = -450;
            list.style.setProperty('margin-left', this.positionReview + 'px');
            this.slideAction = 'next';

        }, 0);
    }

    openLogin(name) {
        let slide = document.getElementsByClassName('right-slide-box') as HTMLCollectionOf<HTMLElement>;
        let useless = document.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
        let header = document.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
        let index = 0;
        this.checklogin();
        if (this.loggedIn == true) {
            index = 1;
        }
        if (name == 'login') {
            index = 0;
        }
        if (name == 'pay') {
            index = 1;
        }
        if (name == 'agreement') {
            index = 2;
        }
        if (name == 'addition') {
            index = 3;
        }
        for (let i = 0; i < slide.length; i++) {
            slide.item(i).style.setProperty('z-index', '100');
        }
        slide.item(index).style.setProperty('z-index', '1500');
        slide.item(index).classList.add('open');
        if (useless.item(0).classList.contains('homePage')) {
            if (header.item(0).classList.contains('scroll')) {
                slide.item(index).style.setProperty('top', '0');
                slide.item(index).style.setProperty('height', '100vh');
            } else {
                slide.item(index).style.setProperty('top', '130px');
                slide.item(index).style.setProperty('height', 'calc(100vh - 130px)');
            }
        } else {
            if (useless.item(0).classList.contains('scroll')) {
                slide.item(index).style.setProperty('top', '65px');
                slide.item(index).style.setProperty('height', 'calc(100vh - 65px)');
            } else {
                slide.item(index).style.setProperty('top', '195px');
                slide.item(index).style.setProperty('height', 'calc(100vh - 195px)');
            }
        }
    }

    get_list() {
        this.countObjects = 0;
        this._offer_service.list(0, 10000, '', '', '', '', '').subscribe(dataOffers => {
            this.countObjects = dataOffers.hitsCount;
            let data = new Date();
            for (let offer of dataOffers.list) {
                let time = new Date(offer.changeDate * 1000);
                if (Math.floor((new Date()).getTime() / 1000) - offer.changeDate < 84600) {
                    // console.log('time: ' + time + ' cur: ' + data);
                    if (data.getDay() == time.getDay() && this.items.indexOf(offer) == -1) {
                        this.countTodayObjects++;
                        this.items.push(offer);
                    }
                }
            }
        });
    }
}
