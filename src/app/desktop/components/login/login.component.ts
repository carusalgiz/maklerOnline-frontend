import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {AccountService} from '../../../services/account.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

    constructor(
        private _account_service: AccountService) {
    }

    public customPatterns = {
        '0': {pattern: new RegExp('([\\d])')},
        '1': {pattern: new RegExp('[\+]?')}
    };
    @Input() otherComponent: boolean;
    @Input() itemOpen: boolean;
    @Output() blockClose = new EventEmitter();
    @Output() userLoggedIn = new EventEmitter();
    @Output() loggingMode = new EventEmitter();
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

    ngOnInit() {
        this.width = document.documentElement.clientWidth;
        this.openBlock = this.otherComponent !== false;
    }

    ngAfterViewInit() {
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

    onResize() {
        let hei = document.getElementsByClassName('left-block') as HTMLCollectionOf<HTMLElement>;
        let logo = document.getElementsByClassName('logo') as HTMLCollectionOf<HTMLElement>;
        let text = document.getElementsByClassName('text-block') as HTMLCollectionOf<HTMLElement>;
        let dark = document.getElementsByClassName('dark-layer') as HTMLCollectionOf<HTMLElement>;
        let height = -text.item(0).clientHeight - logo.item(2).offsetHeight;
        logo.item(2).style.setProperty('top', '50px');

        dark.item(0).style.setProperty('top', height + 'px');
        //  logo.item(2).style.setProperty('top', '50px');
        text.item(0).style.setProperty('top', '300px');
        this.height = hei.item(0).offsetHeight;
        this.width = hei.item(0).offsetWidth;
    }

    enterMode(name) {
        if (name === 'log in') {
            this.mode = 'login';
            this.log_in = true;
            this.register = false;
            document.getElementById('res').innerHTML = "";
        } else if (name === 'register') {
            this.mode = 'register';
            this.log_in = false;
            this.register = true;
            document.getElementById('res1').innerHTML = "";
        } else if (name === 'recoverPass') {
            this.mode = 'recoverPass';
        } else if (name === 'checkRecoverKey') {
            this.mode = 'checkRecoverKey';
        } else if (name === 'savePass') {
            this.mode = 'savePass';
        } else if (name === 'checkAccessKey') {
            this.mode = 'checkAccessKey';
        } else if (name === 'sendKey') {
            this.mode = 'sendKey';
        } else if (name === 'savePassRecover') {
            this.mode = 'savePassRecover';
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

        let phones = {
            'main': this.phone.slice(1, this.phone.length)
        };
        let emails = {
            'main': this.login
        };
        this._account_service.saveUser('1545092165300', emails, phones).subscribe(res => {
            console.log(res);

            // console.log(arr);
            if (res != undefined) {
                this.enterMode('register');
                this.get_users();
                // let arr = Object.values(res);
                // if (arr[0] == 201 || arr[0] == '201') {
                //     this.enterMode('register');
                //     this.get_users();
                // } else if (arr[0] != 201 && arr[0] != '201') {
                //     document.getElementById('res1').innerHTML = 'Пользователь с такими данными уже существует, регистрация ' +
                //         'невозможна. Воспользуйтесь пожалуйста функцией восстановления пароля на странице входа.';
                //     //  alert('Пользователь с такими данными уже существует');
                // }
            } else {
                document.getElementById('res1').innerHTML = 'Произошла ошибка в системе. Регистрация на данный момент невозможна';
            }

            //  console.log(this.result + " " + typeof this.result);
        });
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
        if (this.mode == 'login') {
            document.getElementById('res').style.setProperty('display', 'block');
        }
        if (this.mode == 'register' || this.mode == 'recoverPass') {
            document.getElementById('res1').style.setProperty('display', 'block');
        }

        this.result = '';
        let recoverMethod = '';
        console.log('get_users');

        if (this.mode === 'login') {
            console.log('login: ' + this.phone1 + ' ' + 'pass: ' + this.pass);
            this._account_service.login(this.phone1, this.pass).subscribe(res => {
                console.log('login work');
                console.log(res);
                let i = 0;
                for (let str of Object.values(res)) {
                    i++;
                    console.log(str);
                    this.result = str.toString();
                    if (i == 1) {
                        document.getElementById('res').innerHTML = this.result;
                        if (this.result == "Успешный вход") {
                            this.user = this.phone1;
                            this.logged_in = true;
                            this.blockCloseFunc('login');
                            this.phone1 = "+7";
                            this.pass = "";
                            this.register = false;
                            this.log_in = true;
                            this.loggingMode.emit(true);
                        }
                    } else if (i == 3) {
                        this.userLoggedIn.emit(this.result);
                    }
                }
            });
        }
        this.items = [];
        if (this.mode === 'register' && this.login !== '' && this.pass !== '' && this.phone !== '') {
            this._account_service.data(this.login, this.pass, this.phone, this.mode, recoverMethod).subscribe(res => {
                let i = 0;
                for (let str of Object.values(res)) {
                    if (i == 0) {
                        i++;
                        console.log(str);
                        if (str.toString() == "ok") {
                            document.getElementById('res1').innerHTML = "Учетная запись успешно создана";
                            this.register = false;
                            this.log_in = true;
                            this.phone1 = "+" + this.phone;
                        }
                    }

                }
            });

        } else if (this.mode === 'sendKey') {
            recoverMethod = 'phone';
            let regexp = new RegExp('@');
            let test = regexp.test(this.login);
            if (this.recover) {
                if (this.phone1 == '' || this.phone1 == undefined || this.phone1.length < 11) {
                    document.getElementById('res').innerHTML = "Для восстановления пароля пожалуйста введите номер Вашего телефона";
                } else {
                    this.codeActive = true;
                    console.log('work ' + this.phone1 + " " + this.login);
                    this._account_service.data(this.login, this.pass, this.phone1, "recoverPass", recoverMethod).subscribe(res => {
                        document.getElementById('res').style.setProperty('display', 'block');
                        let i = 0;
                        for (let str of Object.values(res)) {
                            if (i == 0) {
                                this.result += str.toString();
                                document.getElementById('res').innerHTML = this.result;
                            }
                            i++;
                        }
                    });
                }
            } else {
                if (this.login == '' || this.login == undefined || !test) {
                    document.getElementById('res1').innerHTML = "Некорректно введен адрес почтового ящика, пожалуйста проверьте правильность написания";
                } else if (this.phone == '' || this.phone == undefined || this.phone.length < 11) {
                    document.getElementById('res1').innerHTML = "Некорректно введен номер телефона, пожалуйста проверьте правильность написания";
                } else {
                    //  document.getElementById('res1').innerHTML = "На Ваш телефон и почтовый ящик был отправлен пароль для входа в систему";
                    this.codeActive = true;
                    this._account_service.data(this.login, this.pass, this.phone, this.mode, recoverMethod).subscribe(res => {
                        document.getElementById('res1').style.setProperty('display', 'block');
                        let i = 0;
                        for (let str of Object.values(res)) {
                            if (i == 0) {
                                this.result = str.toString();
                                document.getElementById('res1').innerHTML = str.toString();
                            }
                            i++;
                        }
                    });
                    console.log(this.result);
                    //  document.getElementById('res1').innerHTML = this.result;
                }
            }

        } else if (this.mode === 'checkAccessKey') {
            this.counter = 0;
            if (this.check) {
                let i = 0;
                this._account_service.data(this.login, this.pass, this.phone, this.mode, recoverMethod).subscribe(res => {
                    for (let str of Object.values(res)) {
                        i++;
                        this.result = str.toString();
                        if (str.toString() == 'ok' && i == 1) {
                            document.getElementById('res1').innerHTML = "Учетная запись успешно создана";
                            this.access_code = true;
                            this.counter++;
                            if (this.counter == 1) {
                                this.save_user();
                            }
                        } else if (str.toString() != 'ok') {
                            document.getElementById('res1').innerHTML = str.toString();
                        }
                    }
                });
            }
        }
    }

    checkKey(key) {
        if (document.getElementById('res') != null) {
            document.getElementById('res').innerHTML = "";
        }
        if (document.getElementById('res1') != null) {
            document.getElementById('res1').innerHTML = "";
        }
        if (key == "phone") {
            if ((this.phone.charAt(0) == '7' || this.phone[0] == '7') && this.phone.length < 2) {
                this.phone = "+7";
            } else if (this.phone.charAt(0) != '7' && this.phone[0] != '7' && this.phone.charAt(0) != '8' && this.phone[0] != '8'
                && this.phone.charAt(0) != '+' && this.phone[0] != '+' && this.phone.length < 2) {
                this.phone = "+7";
            }
        } else if (key == "phone1") {
            // console.log(this.phone1.charAt(0) + " " + this.phone1[0]);
            if ((this.phone1.charAt(0) == '7' || this.phone1[0] == '7') && this.phone1.length < 2) {
                this.phone1 = "+7";
            } else if (this.phone1.charAt(0) != '7' && this.phone1[0] != '7' && this.phone1.charAt(0) != '8' && this.phone1[0] != '8'
                && this.phone1.charAt(0) != '+' && this.phone1[0] != '+' && this.phone1.length < 2) {
                this.phone1 = "+7";
            }
        }
    }
}
