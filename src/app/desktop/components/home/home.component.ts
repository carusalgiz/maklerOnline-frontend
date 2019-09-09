import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit, AfterViewInit , Inject} from '@angular/core';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';
import { NgxMetrikaService } from '@kolkov/ngx-metrika';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private ym: NgxMetrikaService, @Inject(LOCAL_STORAGE) private localStorage: any, private _offer_service: OfferService,
              private _account_service: AccountService) { }
  loggedIn = false;
  widthReview = 585; // ширина отзыва
  count = 1; // количество отзывов
  position = 0;
  width: number;
  countObjects = 0;
  countTodayObjects = 0;
  agreement: any;
  facebook = false; vk = false; odnokl = false;
  reviews = [{
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
    photo: "../../../../assets/АвторОтзыва3.jpg",
    job: "Домохозяйка",
    name: "Катерина",
    text: "Добрый день! Хочу выразить благодарность создателю сайта-Станиславу за столько " +
      "полезный и нужный ресурс в наше время агентов и прочих мошенников.В кратчайшие сроки удалось" +
      " найти квартиру,были небольшие проблемы с оплатой, но мы со Станиславом всё благополучно решили" +
      " буквально за 10-15 мин.Процветания,удачи и продолжайте в том же духе. С благодарностью и уважением, Катерина"
  }, {
    photo: "../../../../assets/АвторОтзыва2.png",
    job: "",
    name: "",
    text: "Огромное спасибо сайту и его создателям за то, что смог найти квартиру быстро без затрат и комиссий."
  }];
  ngOnInit() {
    this.checklogin();
    this.width = document.documentElement.clientWidth;
    this.widthReview = (document.documentElement.clientWidth / 100) * 33.33;
    this.get_list();
  }
  ngAfterViewInit() {
    this.resize();
      let items = document.getElementsByClassName('menuBlock')   as HTMLCollectionOf<HTMLElement>;
      items.item(0).style.setProperty('border-top', '5px solid #821529');
      items.item(0).style.setProperty('font-weight', 'bold');
    let line = document.documentElement.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
    line.item(0).classList.add('homePage');
  }
    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }
  checklogin() {
    this._account_service.checklogin().subscribe(res => {
      console.log(res);
      if (res != undefined) {
        let data = JSON.parse(JSON.stringify(res));
        if (data.result == 'success' ) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      } else {
        this.loggedIn = false;
        console.log('not athorized!');
        return false;
      }
    });
  }
  log_out() {
    this.localStorage.removeItem("days");
    this.localStorage.removeItem('time');
    this.loggedIn = false;
    this._account_service.logout();
  }
  resize() {
    let footer = document.getElementsByClassName('footer')   as HTMLCollectionOf<HTMLElement>;
    this.widthReview = (document.documentElement.clientWidth / 100) * 33.33;
    let size = (document.documentElement.clientWidth - 4 * 65 - 420 * 3) / 2;
    if (document.documentElement.clientWidth < 1600) {
      size = (document.documentElement.clientWidth - 4 * 25 - 370 * 3) / 2;
    }
    footer.item(0).style.setProperty('width', 'calc(100% - ' + size * 2 + 'px)');
    footer.item(0).style.setProperty('padding', '30px ' + size + 'px 0');

  }
  prev() {
    const list = document.getElementById('carousel-ul') as HTMLElement;
    this.position = Math.min(this.position + this.widthReview * this.count, 0);
    list.style.setProperty('margin-left', this.position + 'px');
  }
  next() {
    const listElems = document.getElementsByClassName('carousel-li') as HTMLCollectionOf<HTMLElement>;
    const list = document.getElementById('carousel-ul') as HTMLElement;
    this.position = Math.max(this.position - this.widthReview * this.count, -this.widthReview * (listElems.length - this.count - 2));
    list.style.setProperty('margin-left', this.position + 'px');
  }
  openLogin(name) {
    let slide = document.getElementsByClassName('right-slide-box')   as HTMLCollectionOf<HTMLElement>;
    let useless = document.getElementsByClassName('uselessLine')   as HTMLCollectionOf<HTMLElement>;
    let header = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
    let index = 0;
    this.checklogin();
    if (this.loggedIn == true) {
      index = 1;
    }
    if (name == 'login') { index = 0; }
    if (name == 'pay') { index = 1; }
    if (name == 'agreement') { index = 2; }
    if (name == 'addition') { index = 3; }
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
    this._offer_service.list(1, 1, '', '', '', '').subscribe(offers => {
      this.countObjects = offers.length;
      let data = Math.floor((new Date()).getTime() / 1000);
      for (let offer of offers) {
          let time = offer.addDate;
          // console.log('time: ' + time + ' cur: ' + mil);
          if (data - time < 86400) {
            this.countTodayObjects++;
          }
      }
    });
  }
}
