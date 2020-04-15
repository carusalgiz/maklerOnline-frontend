import {Component, OnInit, AfterViewInit} from '@angular/core';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
import {Item} from '../../../item';
import {ConfigService} from '../../../services/config.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
    siteUrl: any;

    constructor(private ym: NgxMetrikaService, private _offer_service: OfferService, config: ConfigService,
                private _account_service: AccountService) {
        this.siteUrl = config.getConfig('siteUrl');
    }

    width: number;
    width_items: number;
    countObjects = 0;
    countTodayObjects = 0;
    facebook = false;
    vk = false;
    items: Item[] = [];
    count = 1; // количество отзывов
    position = 0;
    position_items = 0;
    odnokl = false;
    menuOpen = false;
    touchStartPos: any;
    headerPos: any;
    mainMargin: any;
    blockOpen = 'close_menu';
    reviews = [{
        photo: '../../../../assets/АвторОтзыва3.jpg',
        job: 'Домохозяйка',
        name: 'Катерина',
        text: 'Добрый день! Хочу выразить благодарность создателю сайта-Станиславу за столько ' +
            'полезный и нужный ресурс в наше время агентов и прочих мошенников.В кратчайшие сроки удалось' +
            ' найти квартиру,были небольшие проблемы с оплатой, но мы со Станиславом всё благополучно решили' +
            ' буквально за 10-15 мин.Процветания,удачи и продолжайте в том же духе. С благодарностью и уважением, Катерина'
    }, {
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
        name: '',
        text: 'Хороший сайт, вроде все честно, борется с паразитами в виде риелторов !)'
    }, {
        photo: '../../../../assets/АвторОтзыва2.png',
        job: '',
        name: '',
        text: 'Огромное спасибо сайту и его создателям за то, что смог найти квартиру быстро без затрат и комиссий.'
    }];

    ngOnInit() {
        this.width = document.documentElement.clientWidth;
        this.width_items = document.documentElement.clientWidth - 38;
        console.log('items_width: ',this.width_items);
        this.get_list();
    }

    ngAfterViewInit() {
        // document.getElementById('title').scrollIntoView(false);
        window.scrollTo(0, 0);
        let picture = document.getElementsByClassName('picture') as HTMLCollectionOf<HTMLElement>;
        let mainHome = document.getElementsByClassName('mainHome') as HTMLCollectionOf<HTMLElement>;
        let logotitle2 = document.getElementsByClassName('logoTitle2') as HTMLCollectionOf<HTMLElement>;
        // picture.item(0).style.setProperty('height', (document.documentElement.clientHeight - 10) + 'px');
        // logotitle2.item(0).style.setProperty('top', (document.documentElement.clientHeight * 0.6) + 25 + 'px');
        // mainHome.item(0).style.setProperty('background-size', 'auto ' + (document.documentElement.clientHeight + 100) + 'px');
        let header = document.documentElement.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
        header.item(0).style.setProperty('top', '0');
    }

    openMobileMenu() {
        this.blockOpen = 'open_menu';
        // let home = document.documentElement.getElementsByClassName('mainHome') as HTMLCollectionOf<HTMLElement>;
        // let objects = document.documentElement.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
        // // let header = document.documentElement.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
        // let mobileMenu = document.getElementById('menuMobile') as HTMLElement;
        //
        //     document.body.style.setProperty('overflow-y', 'hidden');
        //     // header.item(0).style.setProperty('display', 'none');
        //     mobileMenu.classList.add('open');
        //     document.body.style.setProperty('height', '100vh');
        //     document.body.style.setProperty('background-color', '#1c2628');
        //     setTimeout(ev => {
        //         document.getElementById('menuTop').scrollIntoView({'block': 'center', 'behavior':'smooth'});
        //     },200);
        //
        //     if (home.length != 0) {
        //         // home.item(0).style.setProperty('display', 'none');
        //     } else if (objects.length != 0) {
        //         // objects.item(0).style.setProperty('display', 'none');
        //     }

    }

    openBlock(name) {
        switch (name) {
            case 'agreement':
                this.blockOpen = 'open_agreement';
                break;
            case 'login':
                this.blockOpen = 'open_login';
                this.menuOpen = true;
                break;
        }
    }

    menuMode(mode) {
        this.blockOpen = mode;
    }
    redirSocial(href){
        document.location.href = href;
    }
    redirectFunc(href){
        let hostname = window.location.href.substr(0, window.location.href.indexOf('#/')+2);
        let newhref = hostname + href;
        console.log(newhref, window.location.href);
        if (newhref != window.location.href) {
            document.location.href = newhref;
        }
    }
    touchstart(event: TouchEvent) {
        this.touchStartPos = event.changedTouches[0].clientY;
    }

    touchend(event: TouchEvent) {
        let num = this.touchStartPos - event.changedTouches[0].clientY;
        if (num > 0) {
            // this.headerPos = -90;
            // this.mainMargin = 0;
        } else {
            // this.headerPos = 0;
            // this.mainMargin = 90;
        }
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

    prev_items() {
        const list = document.getElementById('items_carousel-ul') as HTMLElement;
        this.position_items = Math.min(this.position_items + this.width_items * this.count, 0);
        list.style.setProperty('margin-left', this.position_items + 'px');
    }

    next_items() {
        const listElems = document.getElementsByClassName('items_carousel-li') as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('items_carousel-ul') as HTMLElement;
        this.position_items = Math.max(this.position_items - this.width_items * this.count, -this.width_items * (listElems.length - this.count));
        list.style.setProperty('margin-left', this.position_items + 'px');
    }

    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
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
