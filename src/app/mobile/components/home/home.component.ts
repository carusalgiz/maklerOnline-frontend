import { Component, OnInit, AfterViewInit } from '@angular/core';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private _offer_service: OfferService,
              private _account_service: AccountService) { }

  width: number;
  countObjects = 0;
  countTodayObjects = 0;
  facebook = false;
  vk = false;
    count = 1; // количество отзывов
    position = 0;
  odnokl = false;
  menuOpen = false;
    touchStartPos: any;
    headerPos:any;
    mainMargin: any;
  blockOpen = 'open_menu';
    reviews = [ {
        photo: "../../../../assets/АвторОтзыва3.jpg",
        job: "Домохозяйка",
        name: "Катерина",
        text: "Добрый день! Хочу выразить благодарность создателю сайта-Станиславу за столько " +
            "полезный и нужный ресурс в наше время агентов и прочих мошенников.В кратчайшие сроки удалось" +
            " найти квартиру,были небольшие проблемы с оплатой, но мы со Станиславом всё благополучно решили" +
            " буквально за 10-15 мин.Процветания,удачи и продолжайте в том же духе. С благодарностью и уважением, Катерина"
    },{
        photo: "../../../../assets/Parfenova.jpg",
        job: "Специалист банковского дела",
        name: "Юлия Парфенова",
        text: "...Уже много знакомых и знакомые моих знакомых нашли через вас то, что искали!)))"
    }, {
        photo: "../../../../assets/Karol.jpg",
        job: "Ветеринар",
        name: "Григорий Кароль",
        text: "От души! Приехал позвонил, заехал)))"
    }, {
        photo: "../../../../assets/Curnosov.jpg",
        job: "DJ - звукооператор",
        name: "Дмитрий Курносов",
        text: "Отличный сайт, хоть еще и не снял квартиру, но все же... обзвонил несколько объявлений, договорился на встречи," +
            "даже не спросили :\"А вас какая квартира интересует?\". Ура!!! Наконец то, появился такой сайт...у меня эмоция)) " +
            "Буду рекомендовать)."
    }, {
        photo: "../../../../assets/АвторОтзыва1.png",
        job: "",
        name: "",
        text: "Хороший сайт, вроде все честно, борется с паразитами в виде риелторов !)"
    }, {
        photo: "../../../../assets/АвторОтзыва2.png",
        job: "",
        name: "",
        text: "Огромное спасибо сайту и его создателям за то, что смог найти квартиру быстро без затрат и комиссий."
    }];
  ngOnInit() {
    this.width = document.documentElement.clientWidth;
    this.get_list();
  }
  ngAfterViewInit() {
      // document.getElementById('title').scrollIntoView(false);
      window.scrollTo(0,0);
    let picture = document.getElementsByClassName('picture')   as HTMLCollectionOf<HTMLElement>;
    let mainHome = document.getElementsByClassName('mainHome')   as HTMLCollectionOf<HTMLElement>;
    let logotitle2 = document.getElementsByClassName('logoTitle2')   as HTMLCollectionOf<HTMLElement>;
      picture.item(0).style.setProperty('height', (document.documentElement.clientHeight - 10) + 'px');
      logotitle2.item(0).style.setProperty('top', (document.documentElement.clientHeight * 0.6) + 25 + 'px');
      mainHome.item(0).style.setProperty('background-size', 'auto ' + (document.documentElement.clientHeight + 100) + 'px');
      let header = document.documentElement.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
      header.item(0).style.setProperty('top', '0');
  }
  openMobileMenu() {
    let mobileMenu = document.getElementsByClassName('menuMobile')   as HTMLCollectionOf<HTMLElement>;
    mobileMenu.item(0).classList.add('open');
    let mainHome = document.getElementsByClassName('mainHome')   as HTMLCollectionOf<HTMLElement>;
    mainHome.item(0).style.setProperty('display', 'none');
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
    if (mode == 'open') {
      this.menuOpen = true;
    }
    if (mode == 'close') {
      this.menuOpen = false;
    }
  }
    touchstart(event:TouchEvent) {
        this.touchStartPos = event.changedTouches[0].clientY;
    }
    touchend(event:TouchEvent) {
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
  get_list() {
    this.countObjects = 0;
    this._offer_service.list(0, 10000, '', '', '', '','').subscribe(dataOffers => {
        this.countObjects = dataOffers.hitsCount;
        let data = new Date();
        for (let offer of dataOffers.list) {
            let time = new Date(offer.addDate * 1000);
            if ( Math.floor((new Date()).getTime() / 1000) - offer.addDate < 84600) {
                // console.log('time: ' + time + ' cur: ' + data);
                if (data.getDay() == time.getDay()) {
                    this.countTodayObjects++;
                }
            }
        }
    });
  }
}
