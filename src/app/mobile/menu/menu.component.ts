import {LOCAL_STORAGE} from '@ng-toolkit/universal';
import {Component, OnInit, OnChanges, AfterViewInit, Output, EventEmitter, Input, Inject, SimpleChanges, NgZone, ViewChild} from '@angular/core';
import {Item} from '../../item';
import {ActivatedRoute} from '@angular/router';
import {OfferService} from '../../services/offer.service';
import {AccountService} from '../../services/account.service';
import {ConfigService} from '../../services/config.service';
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
import {Person} from '../../class/person';
import * as $ from 'jquery';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';

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
    resDay = '0';
    resTime = '01:00:00';
    balance = 0;
    payCarouselMargin = 0;
    payCarouselBlock = 124;
    blocked = false;

    //login vars
    phone = '+7';
    phone1 = '+7';
    recoverPhone = '+7';
    pass: any;
    pass_reg: any;
    recover = false;
    result: any;
    log_in = false;
    register = false;
    update = false;
    login: any;
    regVar = true;
    check = false;
    person_name = '';
    model_name: any;
    model_company: any;
    model_whatsapp: any;
    model_vk: any;
    model_ok: any;
    model_instagram: any;
    model_description: any;
    person: Person = new Person();
    progressWidth: number = 0;
    freeAccess = false;
    // pay vars
    payblock = false;
    payitem = 1;
    pay_button = 0;
    requestMenu = false;

    modal_title: any;
    modal_text: any;
    modal_action: any;
    modal_action_text: any;
    modal_active = false;
    modal_cancel = true;

    public customPatterns = {
        '0': {pattern: new RegExp('([\\d])')},
        '1': {pattern: new RegExp('[\+]?')}
    };
    @Output() Logging = new EventEmitter();
    @Output() Paying = new EventEmitter();
    @Input() blockOpenInput: String;
    @Input() headerPos: number;
    @Output() openMenu = new EventEmitter();
    @Output() blockClosed = new EventEmitter();
    @Output() personInfo = new EventEmitter();

    @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;
    constructor(private _ngZone: NgZone, private ym: NgxMetrikaService,@Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute, config: ConfigService,
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

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.blockOpenInput) {
            this.menuOpen(this.blockOpenInput);
        }
    }

    ngAfterViewInit() {
        window.scrollTo(0, 0);
        document.body.style.removeProperty('overflow-y');
    }
    modal_info(title, text, action_text, action, cancel) {
        this.modal_title = title;
        this.modal_text = text;
        this.modal_action_text = action_text;
        this.modal_action = action;
        this.modal_active = true;
        this.modal_cancel = cancel;
    }
    triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this._ngZone.onStable.pipe(take(1))
            .subscribe(() => this.autosize.resizeToFitContent(true));
    }
    scrollXCarousel(size, event){
        let itPay = document.getElementsByClassName('pay-item')[0] as HTMLElement;
        this.payCarouselBlock = itPay.offsetWidth;// + ((document.documentElement.offsetWidth - itPay.offsetWidth) / 2);
        let sub_size = size * document.documentElement.offsetWidth;
        console.log(sub_size);
        size = (this.payCarouselBlock * size) - (this.payCarouselBlock / 2);

        $(document).ready(function(){
            var outerContent = $('#outerPay');
            var outerSub = $('#paySubBlocks');
            outerContent.animate({scrollLeft: size}, 300);
            outerSub.animate({scrollLeft: sub_size}, 300);
        });
    }
    inputToCenter(ev){
        setTimeout(() => {
            ev.target.scrollIntoView({block: 'center', behavior: 'smooth'});
        },300);

    }
    clearInfo(){
        if (document.getElementById('res') != undefined)
            document.getElementById('res').innerHTML = '';
        if (document.getElementById('res1') != undefined)
            document.getElementById('res1').innerHTML = 'После регистрации доступен Бесплатный период';
        if (document.getElementById('res2') != undefined)
            document.getElementById('res2').innerHTML = '';
    }
    updatePerson(){
        this._account_service.updateUser(this.person).subscribe(res => {
            let result = JSON.parse(JSON.stringify(res));
            if (result.person){
                this.person = result.person;
                this.personInfo.emit(this.person);
                if (this.person.name != undefined) {
                    let spArray = this.person.name.split(" ");
                    let ret = spArray[0].toUpperCase();
                    if (spArray.length > 1) {
                        for (let i = 1; i < spArray.length; i++) {
                            ret += " " + spArray[i];
                        }
                    }
                    this.person_name = ret;
                }
                sessionStorage.setItem('useremail', this.person.emailBlock.main);
                this.modal_info('Сообщение','Информация успешно обновлена','Продолжить','continue',true);
            }
        });
    }
    addFile(event){
        this.person.photoMini = event[0].href;
        this.updatePerson();
    }
    displayProgress(event) {
        this.progressWidth = event;
        if (event == 100) setTimeout(() => {
            this.progressWidth = 0;
        }, 1300);
    }
    enterMode(name) {
        this.mode = name;
        if (name == 'login') {
            document.getElementById('res').innerHTML = '';
        } else if (name == 'register') {
            document.getElementById('res1').innerHTML = '';
        } else if (name == 'recoverPass') {
            document.getElementById('resRecover').innerHTML = this.result;
        }
    }
    get_users() {
        if (!this.recover && this.log_in) {
            document.getElementById('res').style.setProperty('display', 'block');
        }

        this.result = '';
        let recoverMethod = '';

        if (this.mode == 'login') {
            if ((this.phone1 == '' || this.phone1 == undefined || this.phone1.length < 3) && (this.pass == '' || this.pass == undefined))                {
                this.modal_info('Предупреждение','Для входа в систему, пожалуйста введите номер вашего телефона и пароль','Продолжить','continue',true);
            }  else if ((this.phone1.length == 12) && (this.pass == '' || this.pass == undefined)) {
                this.modal_info('Предупреждение','Для входа в систему, пожалуйста введите номер вашего телефона и пароль','Продолжить','continue',false);
            } else if (this.phone1.length > 2 && this.phone1.length < 11) {
                this.modal_info('Предупреждение','Некорректно введен номер телефона, пожалуйста проверьте правильность написания','Продолжить','continue',true);
            } else if (this.pass != undefined && (this.pass.length > 0 && this.pass.length < 5)) {
                this.modal_info('Предупреждение','Некорректно введен пароль, пожалуйста проверьте правильность написания','Продолжить','continue',false);
            } else {
                this._account_service.login(this.phone1, this.pass).subscribe(res => {
                    let i = 0;
                    console.log(res);
                    for (let str of Object.values(res)) {
                        i++;
                        this.result = str.toString();
                        if (i == 1) {
                            this.modal_title = 'Сообщение';
                            this.modal_text = this.result;
                            this.modal_action_text = 'Продолжить';
                            this.modal_action = 'continue';
                            this.modal_cancel = false;
                            if (this.result == 'Успешный вход') {
                                this.modal_action = 'login_continue';
                            }
                            this.modal_active = true;
                        } else if (i == 2) {
                            this.person.name = this.result;
                        } else if (i == 3) {
                            this.person.emailBlock.main = this.result;
                        }
                    }
                });
            }
        }

        if (this.mode === 'register') {
            if (((this.login == '' || this.login == undefined ) && (this.phone == '' || this.phone == undefined || this.phone.length < 3))
                || (this.phone.length == 11 && (this.login == '' || this.login == undefined)) ){
                this.modal_info('Предупреждение','Для регистрации в системе, пожалуйста введите номер вашего телефона и почтовый адрес','Продолжить','continue',false);
            } else if (this.phone.length > 2 && this.phone.length < 11) {
                this.modal_info('Предупреждение','Некорректно введен номер телефона, пожалуйста проверьте правильность написания','Продолжить','continue',true);
            } else if (this.login.indexOf('@') == -1) {
                this.modal_info('Предупреждение','Некорректно введен почтовый адрес, пожалуйста проверьте правильность написания','Продолжить','continue',true);
            } else if (this.pass_reg != undefined && (this.pass_reg.length > 0 && this.pass_reg.length < 5)) {
                this.modal_info('Предупреждение','Некорректно введен код доступа, пожалуйста проверьте правильность написания','Продолжить','continue',true);
            } else {
                this._account_service.data(this.login.replace(' ', ''), this.pass_reg, this.phone, this.mode, recoverMethod).subscribe(res => {
                    let i = 0;
                    for (let str of Object.values(res)) {
                        if (str.toString() == 'ok') {

                            this.phone1 = '+' + this.phone;
                            setTimeout(() => {
                                this.pass = this.pass_reg;
                                this.enterMode('login');
                                this.get_users();
                            }, 300);
                        }
                        i++;
                    }
                });
            }

        } else if (this.mode === 'recoverPass') {
            recoverMethod = 'phone';
            if (this.recoverPhone == '') {
                this.modal_info('Предупреждение','Поле телефона для восстановления не заполнено','Продолжить','continue',true);
            } else {
                this._account_service.data(this.login.replace(' ',''), this.pass, this.recoverPhone, this.mode, recoverMethod).subscribe(res => {
                    for (let str of Object.values(res)) {
                        if (str != 'ok')
                            this.result += str.toString();
                        document.getElementById('resRecover').innerHTML = this.result;
                    }
                });
            }
        } else if (this.mode === 'sendKey') {
            recoverMethod = 'phone';
            let regexp = new RegExp('@');
            let test = regexp.test(this.login);
            if (this.recover == true) {
                if (this.phone1 == '' || this.phone1 == undefined || this.phone1.length < 11) {
                    this.modal_info('Сообщение','Для восстановления пароля пожалуйста введите номер Вашего телефона','Продолжить','continue',false);
                } else {
                    this._account_service.data(this.login, this.pass, this.phone1, 'recoverPass', recoverMethod).subscribe(res => {
                        let i = 0;
                        for (let str of Object.values(res)) {
                            if (i == 0) {
                                this.result += str.toString();
                                this.modal_info('Сообщение',this.result,'Продолжить','continue',false);
                            }
                            i++;
                        }
                    });
                }
            } else {
                console.log(this.phone.length, this.login);
                if (((this.login == '' || this.login == undefined || !test) && (this.phone == '' || this.phone == undefined || this.phone.length < 3))
                    || (this.phone.length == 11 && (this.login == '' || this.login == undefined)) ){
                    this.modal_info('Предупреждение','Для регистрации в системе, пожалуйста введите номер вашего телефона и почтовый адрес','Продолжить','continue',true);
                } else if (this.phone.length > 2 && this.phone.length < 11) {
                    this.modal_info('Предупреждение','Некорректно введен номер телефона, пожалуйста проверьте правильность написания','Продолжить','continue',true);
                } else if (this.login.indexOf('@') == -1) {
                    this.modal_info('Предупреждение','Некорректно введен почтовый адрес, пожалуйста проверьте правильность написания','Продолжить','continue',true);
                }  else {
                    this._account_service.data(this.login, this.pass, this.phone, this.mode, recoverMethod).subscribe(res => {
                        document.getElementById('res1').style.setProperty('display', 'block');
                        let i = 0;
                        for (let str of Object.values(res)) {
                            if (i == 0) {
                                this.result = str.toString();
                                this.modal_info('Сообщение',str.toString(),'Продолжить','continue',false);
                            }
                            i++;
                        }
                    });
                }
            }
        } else if (this.mode === 'checkAccessKey' && this.regVar == true) {
                let i = 0;
            if (((this.login == '' || this.login == undefined ) && (this.phone == '' || this.phone == undefined || this.phone.length < 3))
                || (this.phone.length == 11 && (this.login == '' || this.login == undefined)) ){
                this.modal_info('Предупреждение','Для регистрации в системе, пожалуйста введите номер вашего телефона и почтовый адрес','Продолжить','continue',false);
            } else if (this.phone.length > 2 && this.phone.length < 11) {
                this.modal_info('Предупреждение','Некорректно введен номер телефона, пожалуйста проверьте правильность написания','Продолжить','continue',true);
            } else if (this.login.indexOf('@') == -1) {
                this.modal_info('Предупреждение','Некорректно введен почтовый адрес, пожалуйста проверьте правильность написания','Продолжить','continue',true);
            } else if (this.pass_reg != undefined && (this.pass_reg.length > 0 && this.pass_reg.length < 5)) {
                this.modal_info('Предупреждение','Некорректно введен код доступа, пожалуйста проверьте правильность написания','Продолжить','continue',true);
            }  else if (this.pass_reg == undefined || this.pass_reg == '') {
                this.modal_info('Предупреждение','Необходимо получить и ввести код доступа','Продолжить','continue',false);
            } else if (!this.check && this.phone.length == 11 && this.login.indexOf('@') != -1 && this.pass_reg.length == 5) {
                this.modal_info('Предупреждение', 'Для регистрации в системе необходимо дать согласие на условия использования и политику конфиденциальности', 'Продолжить', 'continue', false);
            } else {
                this._account_service.data(this.login.replace(' ', ''), this.pass_reg, this.phone, this.mode, recoverMethod).subscribe(res => {
                    for (let str of Object.values(res)) {
                        if (i == 0) {
                            i++;
                            this.result = str.toString();
                            if (str.toString() == 'ok') {
                                this.save_user();
                            } else {
                                this.modal_info('Предупреждение',str.toString(),'Продолжить','continue',true);
                            }
                        }
                    }
                });
            }
        } else if (this.mode === 'savePassRecover') {
            recoverMethod = 'phone';
            let access_code1 = (<HTMLInputElement> document.getElementById('recoverKey')).value;
            this._account_service.data(this.login.replace(' ',''), access_code1, this.recoverPhone, this.mode, recoverMethod).subscribe(res => {
                console.log(res);
                for (let str of Object.values(res)) {
                    if (str != 'ok')
                        this.result += str.toString();
                    this.modal_info('Сообщение',this.result,'Продолжить','continue',true);
                }
            });
        }
    }
    modalFunc(name) {
        switch (name) {
            case 'cancel':
                this.modal_active = false;
                break;
            case 'action':
                this.modal_active = false;
                switch (this.modal_action) {
                    case 'login':
                        this.log_in = true;
                        this.clearInfo();
                        document.getElementById('login_block').scrollIntoView({'block': 'center', 'behavior': 'smooth'});
                        break;
                    case 'continue':
                        break;
                    case 'login_continue':
                        this.register = false;
                        this.user = this.phone1;
                        this.logged_in = true;
                        this.phone1 = '+7';
                        this.pass = '';
                        this.register = false;
                        this.log_in = false;
                        this.checklogin();
                        this.Logging.emit(true);
                        break;
                }
                break;
        }
        this.pay_button = 0;
    }
    payment(type, cost) {
        if (sessionStorage.getItem('useremail')!= undefined && sessionStorage.getItem('useremail') != 'email') {
            this._account_service.payment(type, cost).subscribe((res) => {
                console.log(res);
                if (res == "Такого пользователя не существует, либо вход не был произведен") {
                    this.modal_info('Сообщение',res,'Продолжить','continue',false);
                } else if (res.indexOf("http") != -1) {
                    window.location.href = res;
                } else {
                    this.modal_info('Предупреждение',res,'Продолжить','continue',false);
                }
            });
        } else {
            this.modal_info('Предупреждение','Вход не был произведен, войдите пожалуйста в систему перед совершением оплаты','Войти','login',false);
        }
    }
    save_user() {
        this.regVar = false;
        let phones = {
            'main': this.phone.slice(1, this.phone.length)
        };
        let emails = {
            'main': this.login.replace(' ','')
        };
        let messengers = {
            'whatsapp': this.model_whatsapp
        };
        let socials = {
            'vk': this.model_vk,
            'ok': this.model_ok,
            'instagram': this.model_instagram
        };
        let organisation = {
            'name' : this.model_company
        };
        this._account_service.saveUser(emails, phones, messengers, socials, undefined, this.model_name, this.model_description, false).subscribe(res => {
            if (res != undefined) {
                this.enterMode('register');
                this.get_users();
            } else {
                this.modal_info('Предупреждение','Произошла ошибка в системе. Регистрация на данный момент невозможна','Продолжить','continue',true);
            }
        });
    }

    checkKey(key) {
        if (document.getElementById('res') != null) {
            document.getElementById('res').innerHTML = '';
        }
        if (document.getElementById('res1') != null) {
            document.getElementById('res1').innerHTML = '';
        }
        if (key == 'phone') {
            if ((this.phone.charAt(0) == '7' || this.phone[0] == '7') && this.phone.length < 2) {
                this.phone = '+7';
            } else if (this.phone.charAt(0) != '7' && this.phone[0] != '7' && this.phone.charAt(0) != '8' && this.phone[0] != '8'
                && this.phone.charAt(0) != '+' && this.phone[0] != '+' && this.phone.length < 2) {
                this.phone = '+7';
            }
        } else if (key == 'phone1') {
            console.log(this.phone1.charAt(0) + ' ' + this.phone1[0]);
            if ((this.phone1.charAt(0) == '7' || this.phone1[0] == '7') && this.phone1.length < 2) {
                this.phone1 = '+7';
            } else if (this.phone1.charAt(0) != '7' && this.phone1[0] != '7' && this.phone1.charAt(0) != '8' && this.phone1[0] != '8'
                && this.phone1.charAt(0) != '+' && this.phone1[0] != '+' && this.phone1.length < 2) {
                this.phone1 = '+7';
            }
        } else if (key == 'recoverPhone') {
            console.log(this.recoverPhone.charAt(0) + ' ' + this.recoverPhone[0]);
            if ((this.recoverPhone.charAt(0) == '7' || this.recoverPhone[0] == '7') && this.recoverPhone.length < 2) {
                this.recoverPhone = '+7';
            } else if (this.recoverPhone.charAt(0) != '7' && this.recoverPhone[0] != '7' && this.recoverPhone.charAt(0) != '8' && this.recoverPhone[0] != '8'
                && this.recoverPhone.charAt(0) != '+' && this.recoverPhone[0] != '+' && this.recoverPhone.length < 2) {
                this.recoverPhone = '+7';
            }
        }
    }
    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }
    setFocus(name){
        document.getElementById(name).focus();
    }

    menuOpen(mode) {
        this.log_in = false;
        this.register = false;
        this.payblock = false;
        this.blockOpenInput = mode;
        if (mode == 'open_menu' || mode == 'open_login' || mode == 'open_pay') {
            this.blocked = false;
            // document.body.style.setProperty('height', '100vh');
            document.body.style.setProperty('background-color', '#12181A');
        } else {
            document.body.style.removeProperty('height');
            document.body.style.removeProperty( 'background-color');
        }

        if( mode == 'open_menu') {
            setTimeout(ev => {
                document.getElementById('menuTop').scrollIntoView({'block': 'center', 'behavior':'smooth'});
            },100);
        }
        if (mode == 'open_login') {
            this.log_in = true;
            setTimeout( () => {
                document.getElementById('login_block').scrollIntoView({'block': 'center', 'behavior': 'smooth'});
            },100);
        }
        if (mode == 'open_pay') {
            this.payblock = true;
            setTimeout( () => {
                document.getElementById('pay_block').scrollIntoView({'block': 'center', 'behavior': 'smooth'});
            },100);
        }
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

    log_out() {
        this.person = new Person();
        this.person_name = '';
        // this.user_email = '';
        // this.userEmail = 'email';
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
        this.logged_in = false;
        this._account_service.checklogin().subscribe(res => {
            if (res != undefined) {
                let data = JSON.parse(JSON.stringify(res));
                if (data.result == 'success') {
                    this._account_service.personInfo().subscribe(res1 => {
                        // console.log("checkbalance");
                        // console.log('pesronInfo:', res1);
                        let result = JSON.parse(JSON.stringify(res1));
                        if (result.person){
                            this.person = result.person;
                            this.personInfo.emit(this.person);
                            if (this.person.name != undefined) {
                                let spArray = this.person.name.split(" ");
                                let ret = spArray[0].toUpperCase();
                                if (spArray.length > 1) {
                                    for (let i = 1; i < spArray.length; i++) {
                                        ret += " " + spArray[i];
                                    }
                                }
                                this.person_name = ret;
                            }
                            sessionStorage.setItem('useremail', this.person.emailBlock.main);
                        }
                    });
                    this.days = sessionStorage.getItem('days');
                    this.time = sessionStorage.getItem('time');
                    this.resDay = sessionStorage.getItem('resDay');
                    if (sessionStorage.getItem('resTime') != undefined) {
                        this.resTime = sessionStorage.getItem('resTime');
                    } else {
                        this.resTime = '01:00:00';
                    }

                    localStorage.setItem('cur_id', data.user_id);
                    this.logged_in = true;
                    this.Logging.emit('true');

                    this._account_service.checkBalance().subscribe(res => {
                        // console.log("checkbalance");
                        let result = JSON.parse(JSON.stringify(res));
                         // console.log(result);
                        this.timeT = parseInt(result.time, 10);
                        this.freeAccess = result.freeAccess;
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
                this.resDay = Math.floor(hour / 24).toString();

                let hours = Math.floor(hour % 24);
                let minutes = Math.floor(min % 60);
                let seconds = Math.floor(this.timeT % 60);
                let h="",m="",s = "";
                if (hours   < 10) {h   = "0"+hours.toString();} else {h = hours.toString();}
                if (minutes < 10) {m = "0"+minutes.toString();} else {m = minutes.toString();}
                if (seconds < 10) {s = "0"+seconds.toString();} else {s = seconds.toString();}

                this.resTime = h + ':' + m + ':' + s;
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
                this.resDay = '0';
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
            this.resDay = '0';
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
        if (newhref != window.location.href) {
            if (newhref.indexOf('request_list') != -1) {
                if (this.logged_in == true) {
                    document.location.href = newhref;
                } else {
                    this.modal_info('Предупреждение','Вход не был произведен, войдите пожалуйста в систему для просмотра списка заявок','Войти','login',false);
                }
            } else {
                document.location.href = newhref;
            }

        } else {
            window.location.reload();
            // this.closeButtons();
            // this.homePageOpen(home);
            // this.menuOpen('close_menu')
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
