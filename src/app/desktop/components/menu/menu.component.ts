import {LOCAL_STORAGE} from '@ng-toolkit/universal';
import {Component, EventEmitter, OnInit, Output, Inject, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';
import {ConfigService} from "../../../services/config.service";
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    userEmail = "email";
    days = "00дн.";
    time = "00ч.00мин.";
    loggedIn = false;
    redirect = false;
    text: any;
    agreement: any;
    subscription: any;
    siteUrl: any;
    token: any;
    timer: any;
    mode = '';
    timeT: any;
    resTime: any;
    resDay: any;
    logging_var: any;
    countOfItems: any;
    @Output() updateItems = new EventEmitter();
    @Output() Logging = new EventEmitter();
    @Output() Paying = new EventEmitter();
    @Input() homePage: boolean;

    constructor(private ym: NgxMetrikaService,@Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute, config: ConfigService,
                private _offer_service: OfferService,
                private _account_service: AccountService) {
        this.siteUrl = config.getConfig('siteUrl');
        if (sessionStorage.getItem('useremail') != undefined) {
            this.userEmail = sessionStorage.getItem('useremail');
            if (sessionStorage.getItem('days') != undefined && sessionStorage.getItem('time') != undefined) {
                this.days = sessionStorage.getItem('days');
                this.time = sessionStorage.getItem('time');
            }
        }
    }

    ngOnInit() {
        clearInterval(this.timer);
        this.checklogin();
        this.redirect = false;
        this._offer_service.list(0, 10000, '', '', '', '', '').subscribe(dataOffers => {
            this.countOfItems = dataOffers.hitsCount;
        });
    }

    update() {
        if (document.getElementById('filters-map-map1') != undefined) {
            this.updateItems.emit();
        }
    }

    checklogin() {
        // console.log("checkloginmenu");
        this.loggedIn = false;
        this._account_service.checklogin().subscribe(res => {
            // console.log(res);
            if (res != undefined) {
                let data = JSON.parse(JSON.stringify(res));
                if (data.result == 'success') {
                    if (data.email != "") {
                        this.userEmail = data.email;
                    } else {
                        this.userEmail = "email";
                    }
                    sessionStorage.setItem('useremail', this.userEmail);
                    this.days = sessionStorage.getItem('days');
                    this.time = sessionStorage.getItem('time');
                    this.resDay = sessionStorage.getItem('resDay');
                    this.resTime = sessionStorage.getItem('resTime');
                    localStorage.setItem('cur_id', data.user_id);
                    this.loggedIn = true;
                    this.Logging.emit("true");

                    this._account_service.checkBalance().subscribe(res => {
                        console.log("checkbalance");
                        let result = JSON.parse(JSON.stringify(res));
                        console.log(result);
                        this.timeT = parseInt(result.time, 10);
                        clearInterval(this.timer);
                        this.timer = setInterval(e => this.updateTime(), 1000);
                    });
                } else {
                    this.log_out();
                    this.Logging.emit("false");
                }
            } else {
                this.log_out();
                this.Logging.emit("false");
                console.log('not athorized!');
                return false;
            }
        });
    }

    updateTime() {
        if (this.redirect) {
            clearInterval(this.timer);
        }
        if (this.loggedIn == true) {
            if (this.timeT > 0) {
                this.timeT = this.timeT - 1;
                let min = this.timeT / 60;
                let hour = min / 60;
                let resDay = Math.floor(hour / 24);
                this.days = resDay + "дн.";
                this.time = Math.floor(hour % 24) + "ч." + Math.floor(min % 60) + "мин.";
                this.resDay = Math.floor(hour / 24);
                this.resTime = Math.floor(hour % 24) + ":" + Math.floor(min % 60) + ":" + Math.floor(this.timeT % 60);
                sessionStorage.setItem('days', this.days);
                sessionStorage.setItem('time', this.time);
                sessionStorage.setItem('resDay', this.resDay);
                sessionStorage.setItem('resTime', this.resTime);
                sessionStorage.setItem('con_data', 'true');
                this.Paying.emit('true');
            } else {
                clearInterval(this.timer);
                this.days = "00дн.";
                this.time = "00ч.00мин.";
                this.resDay = 0;
                this.resTime = "00:00:00";
                sessionStorage.setItem('days', this.days);
                sessionStorage.setItem('time', this.time);
                sessionStorage.setItem('resDay', this.resDay);
                sessionStorage.setItem('resTime', this.resTime);
                sessionStorage.setItem('con_data', 'false');
                this.Paying.emit('false');
                clearInterval(this.timer);
            }
        } else {
            this.days = "00дн.";
            this.time = "00ч.00мин.";
            this.resDay = 0;
            this.resTime = "00:00:00";
            sessionStorage.setItem('days', this.days);
            sessionStorage.setItem('time', this.time);
            sessionStorage.setItem('resDay', this.resDay);
            sessionStorage.setItem('resTime', this.resTime);
            sessionStorage.setItem('con_data', 'false');
            this.Paying.emit('false');
            this.log_out();
            clearInterval(this.timer);
        }
        if (this.timeT > 0) {
            if (this.localStorage.getItem('timeAdd') != 'true') {
                this.localStorage.setItem("timeAdd", 'true');
            }
        } else {
            if (this.localStorage.getItem('timeAdd') != 'false') {
                this.localStorage.setItem("timeAdd", 'false');
            }
        }
    }

    log_out() {
        console.log("logout");
        clearInterval(this.timer);
        this.userEmail = "email";
        this.loggedIn = false;
        this.days = "00дн.";
        this.time = "00ч.00мин.";
        this.resDay = 0;
        this.resTime = "00:00:00";
        sessionStorage.removeItem('days');
        sessionStorage.removeItem('time');
        sessionStorage.removeItem('resDay');
        sessionStorage.removeItem('resTime');
        sessionStorage.removeItem('useremail');
        sessionStorage.removeItem('con_data');

        sessionStorage.setItem('days', "00дн.");
        sessionStorage.setItem('time', "00ч.00мин.");
        sessionStorage.setItem('resDay', this.resDay);
        sessionStorage.setItem('resTime', this.resTime);
        sessionStorage.setItem('useremail', 'email');
        sessionStorage.setItem('con_data', 'false');
        this.Paying.emit('false');
        this.Logging.emit('false');
        this._account_service.logout();
    }

    timeUpdate() {
        this.redirect = true;
    }
    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }
    openBlock(page) {
        let slide = document.getElementsByClassName('right-slide-box') as HTMLCollectionOf<HTMLElement>;
        let items = document.getElementsByClassName('menuBlock') as HTMLCollectionOf<HTMLElement>;
        switch (page) {
            case 'login':
                items.item(3).style.setProperty('border-top', '5px solid #821529');
                items.item(3).style.setProperty('font-weight', 'bold');
                slide.item(0).classList.add('open');
                break;
            case 'pay':
                if (this.loggedIn) {
                    this.mode = 'pay';
                    items.item(2).style.setProperty('border-top', '5px solid #821529');
                    items.item(2).style.setProperty('font-weight', 'bold');
                    slide.item(1).classList.add('open');
                } else {
                    this.openBlock('login');
                }

                break;
        }
    }

    closeBlock(name) {
        let slide = document.getElementsByClassName('right-slide-box') as HTMLCollectionOf<HTMLElement>;
        let items = document.getElementsByClassName('menuBlock') as HTMLCollectionOf<HTMLElement>;
        switch (name) {
            case 'login':
                items.item(3).style.setProperty('border-top', 'none');
                items.item(3).style.setProperty('font-weight', 'normal');
                slide.item(0).classList.remove('open');
                break;
            case 'pay':
                items.item(2).style.setProperty('border-top', 'none');
                items.item(2).style.setProperty('font-weight', 'normal');
                slide.item(1).classList.remove('open');
                break;
            case 'agreement':
                slide.item(2).classList.remove('open');
                break;
            case 'addition':
                slide.item(3).classList.remove('open');
                break;
            case 'access_token':
                slide.item(4).classList.remove('open');
                break;
        }
    }
}
