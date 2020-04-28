import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {AccountService} from '../../../services/account.service';
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
import {Person} from '../../../class/person';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

    constructor(
        private ym: NgxMetrikaService,private _account_service: AccountService) {
    }

    public customPatterns = {
        '0': {pattern: new RegExp('([\\d])')},
        '1': {pattern: new RegExp('[\+]?')}
    };
    @Input() otherComponent: boolean;
    @Input() itemOpen: boolean;
    @Input() countOfItems: any;
    @Output() blockClose = new EventEmitter();
    @Output() userLoggedIn = new EventEmitter();
    @Output() loggingMode = new EventEmitter();
    regVar = true;
    counter: any;
    openBlock = true;
    height: number;
    width: number;
    check = false;
    recover = false;
    modeButton = false;
    access_code = false;
    codeActive = false;
    result: any;
    log_in = true;
    register = false;
    login: any;
    phone = "+7";
    logged_in = false;
    user: any;
    mode: any;
    pass: any;
    items: any[] = [];
    phone1 = "+7";
    position: any;
    progressWidth: number = 0;

    model_name: any;
    model_whatsapp: any;
    model_vk: any;
    model_ok: any;
    model_instagram: any;
    model_description: any;

    modal_title: any;
    modal_text: any;
    modal_action: any;
    modal_action_text: any;
    modal_active = false;
    modal_cancel = true;

    person: Person = new Person();

    advices = [
        {
            text: 'Сохраните Ваш запрос  как заявку. (кнопка в фильтрах)\n' +
                'Для уточнения параметров поиска, с Вами свяжется \n' +
                'наш менеджер.\n' +
                'Когда будут найдены подходящие объявления, Вы \n' +
                'получите оповещение. ( обработка заявки 1 день ).\n' +
                'Создание заявки  - бесплатно!'
        },
        {
            text: 'Сохраните Ваш запрос  как заявку. (кнопка в фильтрах)\n' +
                'Для уточнения параметров поиска, с Вами свяжется \n' +
                'наш менеджер.\n' +
                'Когда будут найдены подходящие объявления, Вы \n' +
                'получите оповещение. ( обработка заявки 1 день ).\n' +
                'Создание заявки  - бесплатно!'
        },
        {
            text: 'Сохраните Ваш запрос  как заявку. (кнопка в фильтрах)\n' +
                'Для уточнения параметров поиска, с Вами свяжется \n' +
                'наш менеджер.\n' +
                'Когда будут найдены подходящие объявления, Вы \n' +
                'получите оповещение. ( обработка заявки 1 день ).\n' +
                'Создание заявки  - бесплатно!'
        }
    ];

    ngOnInit() {
        this.width = document.documentElement.clientWidth;
        this.openBlock = this.otherComponent !== false;
    }

    ngAfterViewInit() {
    }
    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }
    blockCloseFunc(name) {
        if (document.getElementById('res') != null) {
            document.getElementById('res').innerHTML = "";
        }
        if (document.getElementById('res1') != null) {
            document.getElementById('res1').innerHTML = "";
        }
        this.phone = "+7";
        this.login = "";
        this.phone1 = "+7";
        this.pass = "";
        this.blockClose.emit(name);
    }
    setFocus(name){
        console.log(document.getElementById(name), name);
        document.getElementById(name).focus();
    }
    addFile(event){
        console.log(event);
        this.person.photoMini = event.href;
    }
    displayProgress(event) {
        this.progressWidth = event;
        if (event == 100) setTimeout(() => {
            this.progressWidth = 0;
        }, 1300);
    }
    prevAdvice() {
        const listElems = document.getElementsByClassName('advice_carousel-li') as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('advice_carousel-ul') as HTMLElement;
        let last = listElems.item(listElems.length - 1);
        listElems.item(listElems.length - 1).remove();
        list.insertBefore(last, listElems.item(0));
        list.style.setProperty('transition', 'unset');
        this.position= -330;
        list.style.setProperty('margin-left', this.position + 'px');
        setTimeout(() => {
            list.style.setProperty('transition', 'margin-left .4s');
            this.position = 0;
            list.style.setProperty('margin-left', this.position + 'px');
        }, 0);
    }
    nextAdvice() {
        const listElems = document.getElementsByClassName('advice_carousel-li') as HTMLCollectionOf<HTMLElement>;
        let first = listElems.item(0);
        let clone = first.cloneNode(true);
        listElems.item(0).remove();
        const list = document.getElementById('advice_carousel-ul') as HTMLElement;
        list.appendChild(clone);
        list.style.setProperty('transition', 'unset');
        this.position = 330;

        list.style.setProperty('margin-left', this.position + 'px');
        setTimeout(() => {
            list.style.setProperty('transition', 'margin-left .4s');
            this.position = 0;
            list.style.setProperty('margin-left', this.position + 'px');
        }, 0);
    }
    inputToCenter(ev){
        setTimeout(() => {
            ev.target.scrollIntoView({block: 'center', behavior: 'smooth'});
        },300);
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
                          break;
                    case 'continue':
                        break;
                    case 'login_continue':
                        this.user = this.phone1;
                        this.logged_in = true;
                        this.blockCloseFunc('login');
                        this.phone1 = "+7";
                        this.pass = "";
                        this.register = false;
                        this.log_in = true;
                        this.loggingMode.emit(true);
                        break;
                }
                break;
        }
    }
    enterMode(name) {
        this.mode = name;
        if (name === 'login') {
            this.log_in = true;
            this.register = false;
        } else if (name === 'register') {
            this.log_in = false;
            this.register = true;
        }
    }

    openDocument() {
        let slide = document.getElementsByClassName('right-slide-box') as HTMLCollectionOf<HTMLElement>;
        let useless = document.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
        let header = document.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
        slide.item(2).classList.add('open');
        if (useless.item(0).classList.contains('homePage')) {
            if (header.item(0).classList.contains('scroll')) {
                slide.item(2).style.setProperty('top', '0');
                slide.item(2).style.setProperty('height', '100vh');
            } else {
                slide.item(2).style.setProperty('top', '130px');
                slide.item(2).style.setProperty('height', 'calc(100vh - 130px)');
            }
        } else {
            if (useless.item(0).classList.contains('scroll')) {
                slide.item(2).style.setProperty('top', '65px');
                slide.item(2).style.setProperty('height', 'calc(100vh - 65px)');
            } else {
                slide.item(2).style.setProperty('top', '195px');
                slide.item(2).style.setProperty('height', 'calc(100vh - 195px)');
            }
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
        this._account_service.saveUser(emails, phones, messengers, socials, undefined, this.model_name, this.model_description, false, this.person.photoMini).subscribe(res => {
            console.log('save', res);
            if (res != undefined) {
                this.mode = 'register';
                this.log_in = false;
                this.register = true;
                this.get_users();
            } else {
                this.modal_info('Предупреждение','Произошла ошибка в системе. Регистрация на данный момент невозможна','Продолжить','continue',true);
            }
        });
    }

    modal_info(title, text, action_text, action, cancel) {
        this.modal_title = title;
        this.modal_text = text;
        this.modal_action_text = action_text;
        this.modal_action = action;
        this.modal_active = true;
        this.modal_cancel = cancel;
    }

    selected(el: MouseEvent) {
        let items = (<HTMLElement>el.currentTarget).parentElement.parentElement.parentElement.children;
        for (let i = 0; i < items.length; i++) {
            (<HTMLElement>items.item(i).firstChild.firstChild).style.removeProperty('font-weight');
            (<HTMLElement>items.item(i).firstChild.firstChild).style.removeProperty('border-top');
        }
        (<HTMLElement>el.currentTarget).style.setProperty('border-top', '5px solid #821529');
        (<HTMLElement>el.currentTarget).style.setProperty('font-weight', 'bold');
    }

    get_users() {
        this.result = '';
        let recoverMethod = '';
        console.log('get_users', this.mode);

        if (this.mode === 'login') {
            if ((this.phone1 == '' || this.phone1 == undefined || this.phone1.length < 3) && (this.pass == '' || this.pass == undefined))                {
                this.modal_info('Предупреждение','Для входа в систему, пожалуйста введите номер вашего телефона и пароль','Продолжить','continue',true);
            }  else if ((this.phone1.length == 12) && (this.pass == '' || this.pass == undefined)) {
                this.modal_info('Предупреждение','Для входа в систему, пожалуйста введите номер вашего телефона и пароль','Продолжить','continue',false);
            } else if (this.phone1.length > 2 && this.phone1.length < 11) {
                this.modal_info('Предупреждение','Некорректно введен номер телефона, пожалуйста проверьте правильность написания','Продолжить','continue',true);
            } else if (this.pass != undefined && (this.pass.length > 0 && this.pass.length < 5)) {
                this.modal_info('Предупреждение','Некорректно введен пароль, пожалуйста проверьте правильность написания','Продолжить','continue',false);
            } else {
                console.log('login: ' + this.phone1 + ' ' + 'pass: ' + this.pass);
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
                        } else if (i == 3) {
                            this.userLoggedIn.emit(this.result);
                        }
                    }
                });
            }
        }

        if (this.mode === 'register' && this.login !== '' && this.pass !== '' && this.phone !== '') {
            if (((this.login == '' || this.login == undefined ) && (this.phone == '' || this.phone == undefined || this.phone.length < 3))
                || (this.phone.length == 11 && (this.login == '' || this.login == undefined)) ){
                this.modal_info('Предупреждение','Для регистрации в системе, пожалуйста введите номер вашего телефона и почтовый адрес','Продолжить','continue',false);
            } else if (this.phone.length > 2 && this.phone.length < 11) {
                this.modal_info('Предупреждение','Некорректно введен номер телефона, пожалуйста проверьте правильность написания','Продолжить','continue',true);
            } else if (this.login.indexOf('@') == -1) {
                this.modal_info('Предупреждение','Некорректно введен почтовый адрес, пожалуйста проверьте правильность написания','Продолжить','continue',true);
            }  else {
                this._account_service.data(this.login.replace(' ', ''), this.pass, this.phone, this.mode, recoverMethod).subscribe(res => {
                    if (res.response == 'ok') {
                        this.phone1 = this.phone;
                        this.mode = 'login';
                        this.log_in = true;
                        this.register = false;
                        this.get_users();
                    }
                });
            }
        }
        if (this.mode === 'sendKey') {
            recoverMethod = 'phone';
            let regexp = new RegExp('@');
            let test = regexp.test(this.login);
            if (this.recover) {
                if (this.phone1 == '' || this.phone1 == undefined || this.phone1.length < 11) {
                    this.modal_info('Сообщение','Для восстановления пароля пожалуйста введите номер Вашего телефона','Продолжить','continue',false);
                } else {
                    this.codeActive = true;
                    console.log('work ' + this.phone1 + " " + this.login);
                    this._account_service.data(this.login, this.pass, this.phone1, "recoverPass", recoverMethod).subscribe(res => {
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
                if (((this.login == '' || this.login == undefined || !test) && (this.phone == '' || this.phone == undefined || this.phone.length < 3))
                    || (this.phone.length == 11 && (this.login == '' || this.login == undefined)) ){
                    this.modal_info('Предупреждение','Для регистрации в системе, пожалуйста введите номер вашего телефона и почтовый адрес','Продолжить','continue',true);
                } else if (this.phone.length > 2 && this.phone.length < 11) {
                    this.modal_info('Предупреждение','Некорректно введен номер телефона, пожалуйста проверьте правильность написания','Продолжить','continue',true);
                } else if (this.login.indexOf('@') == -1) {
                    this.modal_info('Предупреждение','Некорректно введен почтовый адрес, пожалуйста проверьте правильность написания','Продолжить','continue',true);
                }  else {
                   this.codeActive = true;
                    this._account_service.data(this.login, this.pass, this.phone, this.mode, recoverMethod).subscribe(res => {
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

        }
        if (this.mode === 'checkAccessKey' && this.regVar == true) {
            this.counter = 0;
            if (((this.login == '' || this.login == undefined ) && (this.phone == '' || this.phone == undefined || this.phone.length < 3))
                || (this.phone.length == 11 && (this.login == '' || this.login == undefined)) ){
                this.modal_info('Предупреждение','Для регистрации в системе, пожалуйста введите номер вашего телефона и почтовый адрес','Продолжить','continue',false);
            } else if (this.phone.length > 2 && this.phone.length < 11) {
                this.modal_info('Предупреждение','Некорректно введен номер телефона, пожалуйста проверьте правильность написания','Продолжить','continue',true);
            } else if (this.login.indexOf('@') == -1) {
                this.modal_info('Предупреждение','Некорректно введен почтовый адрес, пожалуйста проверьте правильность написания','Продолжить','continue',true);
            }  else if (!this.check && this.phone.length == 11 && this.login.indexOf('@') != -1) {
                this.modal_info('Предупреждение', 'Для регистрации в системе необходимо дать согласие на условия использования и политику конфиденциальности', 'Продолжить', 'continue', false);
            } else {
                let i = 0;
                this._account_service.data(this.login, this.pass, this.phone, this.mode, recoverMethod).subscribe(res => {
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
        }
    }

    checkKey(variable) {
        if ((variable.charAt(0) == '7' || variable[0] == '7') && variable.length < 2) {
            variable = "+7";
        } else if (variable.charAt(0) != '7' && variable[0] != '7' && variable.charAt(0) != '8' && variable[0] != '8'
            && variable.charAt(0) != '+' && variable[0] != '+' && variable.length < 2) {
            variable = "+7";
        }
        return variable;
    }
}
