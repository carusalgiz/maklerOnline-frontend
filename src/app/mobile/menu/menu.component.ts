import {LOCAL_STORAGE} from '@ng-toolkit/universal';
import {Component, OnInit, OnChanges, AfterViewInit, Output, EventEmitter, Input, Inject} from '@angular/core';
import {Item} from '../../item';
import {ActivatedRoute} from '@angular/router';
import {OfferService} from '../../services/offer.service';
import {AccountService} from '../../services/account.service';
import {ConfigService} from '../../services/config.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnChanges, AfterViewInit {
    checkHome = false;
    mobileMenuActive = false;
    objectMenu = false;
    logged_in = false;
    user: any;
    name: any;
    userEmail = 'email';
    days = '00дн.';
    time = '00ч.00мин.';
    redirect = false;
    text: any;
    agreement: any;
    siteUrl: any;
    innerBlockOpen = 'menu';
    timer: any;
    mode = '';
    timeT: any;
    resTime: any;
    resDay: any;
    @Output() Logging = new EventEmitter();
    @Output() Paying = new EventEmitter();
    @Input() blockOpenInput: String;
    @Input() headerPos: number;
    @Output() openMenu = new EventEmitter();
    @Output() blockClosed = new EventEmitter();

    constructor(@Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute, config: ConfigService,
                private _offer_service: OfferService,
                private _account_service: AccountService) {
        this.siteUrl = config.getConfig('siteUrl');
    }

    ngOnInit() {
        clearInterval(this.timer);
        this.checklogin();
        if (this.localStorage.getItem('days') != null && this.localStorage.getItem('time') != null) {
            this.days = this.localStorage.getItem('days');
            this.time = this.localStorage.getItem('time');
        }

    }

    ngOnChanges() {
        // this.check();
    }

    ngAfterViewInit() {
        window.scrollTo(0, 0);
        document.body.style.removeProperty('overflow-y');
        // document.getElementById('header').scrollIntoView(false);
        // this.checklogin();
    }

    menuOpen(mode) {
        this.openMenu.emit(mode);
    }

    addFunc(name) {
        let closeLogin = document.documentElement.getElementsByClassName('close-login') as HTMLCollectionOf<HTMLElement>;
        let closePay = document.documentElement.getElementsByClassName('close-pay') as HTMLCollectionOf<HTMLElement>;
        switch (name) {
            case 'login':
                closeLogin.item(0).classList.add('output');
                break;
            case 'pay':
                closePay.item(0).classList.add('output');
                break;
        }
    }

    closeFunc(name) {
        let add_block = document.documentElement.getElementsByClassName('add-block-menu') as HTMLCollectionOf<HTMLElement>;
        // let home = document.documentElement.getElementsByClassName('mainHome') as HTMLCollectionOf<HTMLElement>;
        let objects = document.documentElement.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
        // let menuMobile = document.documentElement.getElementsByClassName('menuMobile') as HTMLCollectionOf<HTMLElement>;
        let header = document.documentElement.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
        let bottomButtons = document.documentElement.getElementsByClassName('bottom-buttons1') as HTMLCollectionOf<HTMLElement>;
        let closeLogin = document.documentElement.getElementsByClassName('close-login') as HTMLCollectionOf<HTMLElement>;
        let closePay = document.documentElement.getElementsByClassName('close-pay') as HTMLCollectionOf<HTMLElement>;
        let closeAppl = document.documentElement.getElementsByClassName('proposal') as HTMLCollectionOf<HTMLElement>;
        let showItems = document.documentElement.getElementsByClassName('show-items') as HTMLCollectionOf<HTMLElement>;
        let hideMenu = document.documentElement.getElementsByClassName('hideMenu') as HTMLCollectionOf<HTMLElement>;
        // let mainHome = document.getElementsByClassName('mainHome')   as HTMLCollectionOf<HTMLElement>;
        if (hideMenu.length > 1) {
            hideMenu.item(0).classList.remove('exit-close');
            hideMenu.item(1).classList.add('exit-close');
        }
        if (showItems.length != 0) {
            showItems.item(0).style.setProperty('top', '90px');
        }

        if (closeLogin.length != 0 && closeLogin.item(0).classList.contains('output')) {
            name = 'login';
        } else if (closePay.length != 0 && closePay.item(0).classList.contains('output')) {
            name = 'pay';
        } else if (closeAppl.length != 0 && closeAppl.item(0).classList.contains('output')) {
            name = 'app';
        }
        console.log('func work ' + name);
        switch (name) {
            case 'login': {
                this.blockOpenInput = 'open_menu';
                this.innerBlockOpen = 'menu';
                this.openMenu.emit('close_login');
                this.blockClosed.emit('close');
                this.menuOpen('close');
                break;
            }
            case 'pay': {
                this.blockOpenInput = 'open_menu';
                this.innerBlockOpen = 'menu';
                this.openMenu.emit('close_pay');
                break;
            }
            case 'app': {
                closeAppl.item(0).classList.remove('output');
                add_block.item(2).classList.add('close');
                if (objects.length != 0) {
                    if (showItems.length != 0) {
                        showItems.item(0).style.setProperty('display', 'flex');
                    }
                    if (bottomButtons.length != 0) {
                        for (let i = 0; i < bottomButtons.length; i++) {
                            bottomButtons.item(i).style.removeProperty('display');
                        }
                    }
                    objects.item(0).style.setProperty('display', 'flex');
                    objects.item(0).style.setProperty('padding-top', '97px');
                    header.item(0).style.setProperty('display', 'flex');
                }
                break;
            }
            case 'agreement': {
                this.blockOpenInput = 'open_menu';
                this.innerBlockOpen = 'menu';
                this.openMenu.emit('close_agreement');
                // add_block.item(3).classList.add('close');
                // mainHome.item(0).style.setProperty('display', 'block');
                break;
            }
            default: {
                console.log('default');
                break;
            }
        }
    }

    homePageOpen(check) {
        this.checkHome = check;
    }

    closeButtons() {
        let mapButtons = document.getElementsByClassName('map-buttons-tablet') as HTMLCollectionOf<HTMLElement>;
        if (mapButtons.length !== 0) {
            mapButtons.item(0).style.setProperty('display', ' none');
        }
    }

    displayMenu(mode) {
        let home = document.documentElement.getElementsByClassName('mainHome') as HTMLCollectionOf<HTMLElement>;
        let objects = document.documentElement.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
        let header = document.documentElement.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
        let mobileMenu = document.getElementsByClassName('menuMobile') as HTMLCollectionOf<HTMLElement>;
        if (mode === 'show') {
            document.body.style.setProperty('overflow-y', 'hidden');
            header.item(0).style.setProperty('display', 'none');
            mobileMenu.item(0).classList.add('open');
            if (home.length != 0) {
                // home.item(0).style.setProperty('display', 'none');
            } else if (objects.length != 0) {
                // objects.item(0).style.setProperty('display', 'none');
            }
        } else if (mode === 'hide') {
            document.body.style.removeProperty('overflow-y');
            let add_block = document.documentElement.getElementsByClassName('add-block-menu') as HTMLCollectionOf<HTMLElement>;
            add_block.item(0).classList.add('close');
            add_block.item(1).classList.add('close');
            header.item(0).style.setProperty('display', 'flex');
            mobileMenu.item(0).classList.remove('open');
            if (home.length != 0) {
                // home.item(0).style.setProperty('display', 'block');
            } else if (objects.length != 0) {
                // objects.item(0).style.setProperty('display', 'flex');
            }
        }

    }

    log_out() {
        this.userEmail = 'email';
        this.logged_in = false;
        this.days = '0дн.';
        this.time = '00ч.00мин.';
        this.localStorage.removeItem('logged_in');
        sessionStorage.removeItem('days');
        sessionStorage.removeItem('time');
        sessionStorage.removeItem('resDay');
        sessionStorage.removeItem('resTime');
        sessionStorage.removeItem('useremail');
        sessionStorage.removeItem('con_data');
        this.Paying.emit('false');
        this.Logging.emit('false');
        this._account_service.logout();
    }

    checklogin() {
        console.log('checkloginmenu');
        this.logged_in = false;
        this._account_service.checklogin().subscribe(res => {
            console.log(res);
            if (res != undefined) {
                let data = JSON.parse(JSON.stringify(res));
                if (data.result == 'success') {
                    if (data.email != '') {
                        this.userEmail = data.email;
                    } else {
                        this.userEmail = 'email';
                    }
                    sessionStorage.setItem('useremail', this.userEmail);
                    this.days = sessionStorage.getItem('days');
                    this.time = sessionStorage.getItem('time');
                    this.resDay = sessionStorage.getItem('resDay');
                    this.resTime = sessionStorage.getItem('resTime');
                    localStorage.setItem('cur_id', data.user_id);
                    this.logged_in = true;
                    this.Logging.emit('true');

                    this._account_service.checkBalance().subscribe(res => {
                        // console.log("checkbalance");
                        let result = JSON.parse(JSON.stringify(res));
                        // console.log(result);
                        this.timeT = parseInt(result.time, 10);
                        clearInterval(this.timer);
                        this.timer = setInterval(e => this.updateTime(), 1000);
                    });
                } else {
                    this.log_out();
                    this.Logging.emit('false');
                }
            } else {
                this.log_out();
                this.Logging.emit('false');
                console.log('not athorized!');
                return false;
            }
        });
    }

    updateTime() {
        if (this.logged_in == true) {
            if (this.timeT > 0) {
                this.timeT = this.timeT - 1;
                let min = this.timeT / 60;
                let hour = min / 60;
                let resDay = Math.floor(hour / 24);
                this.days = resDay + 'дн.';
                this.time = Math.floor(hour % 24) + 'ч.' + Math.floor(min % 60) + 'мин.';
                this.resDay = Math.floor(hour / 24);
                this.resTime = Math.floor(hour % 24) + ':' + Math.floor(min % 60) + ':' + Math.floor(this.timeT % 60);
                sessionStorage.setItem('days', this.days);
                sessionStorage.setItem('time', this.time);
                sessionStorage.setItem('resDay', this.resDay);
                sessionStorage.setItem('resTime', this.resTime);
                sessionStorage.setItem('con_data', 'true');
                this.Paying.emit('true');
            } else {
                clearInterval(this.timer);
                this.days = '00дн.';
                this.time = '00ч.00мин.';
                this.resDay = 0;
                this.resTime = '00:00:00';
                sessionStorage.setItem('days', this.days);
                sessionStorage.setItem('time', this.time);
                sessionStorage.setItem('resDay', this.resDay);
                sessionStorage.setItem('resTime', this.resTime);
                sessionStorage.setItem('con_data', 'false');
                this.Paying.emit('false');
                clearInterval(this.timer);
            }
        } else {
            this.days = '00дн.';
            this.time = '00ч.00мин.';
            this.resDay = 0;
            this.resTime = '00:00:00';
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
                this.localStorage.setItem('timeAdd', 'true');
            }
        } else {
            if (this.localStorage.getItem('timeAdd') != 'false') {
                this.localStorage.setItem('timeAdd', 'false');
            }
        }
    }

    redirectFunc(href, home: boolean){
        let hostname = window.location.href.substr(0, window.location.href.indexOf('#/')+2);
        let newhref = hostname + href;
        console.log(newhref, window.location.href);
        if (newhref != window.location.href) {
            document.location.href = newhref;
        } else {
            this.displayMenu('hide');
            this.closeButtons();
            this.homePageOpen(home);
            this.menuOpen('close')
        }
    }
    openBlock(pay: string) {
        let hideMenu = document.documentElement.getElementsByClassName('hideMenu') as HTMLCollectionOf<HTMLElement>;
        if (hideMenu.length > 1) {
            hideMenu.item(1).classList.remove('exit-close');
            hideMenu.item(0).classList.add('exit-close');
        }
        if (this.logged_in == false) {
            pay = 'login';
        }

        switch (pay) {
            case 'login':
                this.blockOpenInput = 'open_login';
                this.innerBlockOpen = 'login';
                this.menuOpen('open');
                break;
            case 'pay':
                //  closePay.item(0).classList.add('output');
                this.blockOpenInput = 'open_pay';
                this.innerBlockOpen = 'pay';
                this.menuOpen('open');
                break;
        }
    }
}
