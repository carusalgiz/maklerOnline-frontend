import {LOCAL_STORAGE} from '@ng-toolkit/universal';
import {Component, EventEmitter, Input, OnInit, OnChanges, Output, AfterViewInit, Inject} from '@angular/core';
import {AccountService} from '../../../services/account.service';
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit, AfterViewInit, OnChanges {

    constructor(private ym: NgxMetrikaService,@Inject(LOCAL_STORAGE) private localStorage: any, private _account_service: AccountService) {
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
    regVar = true;
    logged_in = false;
    user: any;
    mode: any;
    modeButton = false;
    access_code = false;
    codeActive = false;
    result: any;
    recover = false;
    sendButton = true;
    saveButton = false;
    emailPass = false;
    phonePass = false;
    openBlock = true;
    log_in = true;
    register = false;
    recoverPass = false;
    height: number;
    width: number;
    check = false;
    login: any;
    phone = '+7';
    phone1 = '+7';
    checkNews = false;
    pass: any;
    items: any[] = [];
    recoverPhone = '+7';

    ngOnInit() {
        this.width = document.documentElement.clientWidth;
        this.openBlock = this.otherComponent !== false;
        if (this.localStorage.getItem('logged_in') != null && this.localStorage.getItem('logged_in') == 'true') {
            this.logged_in = true;
            this.user = this.localStorage.getItem('user');
        } else {
            this.log_out();
        }
    }

    ngOnChanges() {
        if (this.localStorage.getItem('logged_in') == null || this.localStorage.getItem('logged_in') != 'true') {
            this.log_out();
            let contact = document.documentElement.getElementsByClassName('contact-menu-info') as HTMLCollectionOf<HTMLElement>;
            if (contact.length > 2) {
                contact.item(3).classList.remove('close');
                contact.item(2).classList.add('close');
            } else {
                this.log_out();
                contact = document.documentElement.getElementsByClassName('contact-menu-info') as HTMLCollectionOf<HTMLElement>;
                if (contact.length > 3) {
                    contact.item(2).classList.remove('close');
                    contact.item(3).classList.add('close');
                }
            }
        } else {
            this.logged_in = false;
        }
    }

    ngAfterViewInit() {
        // let continueButton = document.documentElement.getElementsByClassName('loginButton') as HTMLCollectionOf<HTMLElement>;
        if (this.localStorage.getItem('logged_in') != null && this.localStorage.getItem('logged_in') == 'true') {
            let contact = document.documentElement.getElementsByClassName('contact-menu-info') as HTMLCollectionOf<HTMLElement>;
            if (contact.length > 2) {
                contact.item(3).classList.remove('close');
                contact.item(2).classList.add('close');
            }
            // continueButton.item(0).classList.add('close');
            // continueButton.item(1).classList.remove('close');
        } else {
            this.log_out();
            // if (continueButton.length != 0) {
            //     continueButton.item(1).classList.add('close');
            //     continueButton.item(0).classList.remove('close');
            // }

            let contact = document.documentElement.getElementsByClassName('contact-menu-info') as HTMLCollectionOf<HTMLElement>;
            if (contact.length > 2) {
                contact.item(2).classList.remove('close');
                contact.item(3).classList.add('close');
            }

        }
    }
    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }
    enterMode(name) {
        if (name === 'log in') {
            this.mode = 'login';
            this.log_in = true;
            this.register = false;
            document.getElementById('res').innerHTML = '';
        } else if (name === 'register') {
            this.mode = 'register';
            this.log_in = false;
            this.register = true;
            document.getElementById('res1').innerHTML = '';
        } else if (name === 'recoverPass') {
            document.getElementById('resRecover').innerHTML = this.result;
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

    blockCloseFunc(name) {
        if (document.getElementById('res') != null) {
            document.getElementById('res').innerHTML = '';
        }
        if (document.getElementById('res1') != null) {
            document.getElementById('res1').innerHTML = '';
        }
        this.phone = '+7';
        this.login = '';
        this.phone1 = '+7';
        this.pass = '';
        this.blockClose.emit(name);
    }

    save_user() {
        this.regVar = false;
        console.log('save_user');
        let phones = {
            'main': this.phone.slice(1, this.phone.length)
        };
        let emails = {
            'main': this.login
        };
        this._account_service.saveUser('1545092165300', emails, phones,'','','','','', '').subscribe(res => {
            if (res != undefined) {
                this.enterMode('register');
                this.get_users();
                // let arr = Object.values(res);
                //
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
        });
    }

    /**/
    get_users() {
        console.log(this.mode);
        if (!this.recover && this.log_in) {
            document.getElementById('res').style.setProperty('display', 'block');
        }

        this.result = '';
        let recoverMethod = '';
        console.log('get_users');

        if (this.mode == 'login') {
            console.log('login: ' + this.login + ' ' + 'pass: ' + this.pass);
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
                        if (this.result == 'Успешный вход') {
                            // let continueButton = document.documentElement.getElementsByClassName('loginButton') as HTMLCollectionOf<HTMLElement>;
                            // continueButton.item(0).classList.add('close');
                            // continueButton.item(1).classList.remove('close');
                            this.user = this.phone1;
                            this.logged_in = true;
                            this.blockCloseFunc('login');
                            this.phone1 = '+7';
                            this.pass = '';
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

        console.log(this.mode);
        this.items = [];
        if (this.mode === 'register') {
            this._account_service.data(this.login, this.pass, this.phone, this.mode, recoverMethod).subscribe(res => {
                let i = 0;
                for (let str of Object.values(res)) {
                    // console.log(str);
                    if (str.toString() == 'ok') {
                        // this.blockCloseFunc('login');
                        // document.getElementById('res1').innerHTML = "Учетная запись успешно создана";
                        this.register = false;
                        this.log_in = true;
                    }
                    i++;
                }
                if (this.log_in) {
                    document.getElementById('res1').innerHTML = 'Учетная запись успешно создана';
                }
            });

        } else if (this.mode === 'recoverPass') {
            // this.enterMode('log in');
            // if (this.emailPass) {
            //   recoverEmail = (<HTMLInputElement>document.getElementById('recoverEmail')).value;
            //   recoverMethod = 'email';
            //   if (recoverEmail === '') {
            //     alert('Поле почты для восстановления не заполнено');
            //   } else {
            //     this._account_service.data(recoverEmail, this.pass, this.phone, this.mode, recoverMethod).subscribe(res => {
            //       console.log(res);
            //       for (let str of Object.values(res)) {
            //       //  console.log(str);
            //         this.result += str.toString();
            //         document.getElementById('res1').innerHTML = this.result;
            //       }
            //     });
            //   }
            // } else if (this.phonePass) {
            //   this.recoverPhone = (<HTMLInputElement>document.getElementById('recoverPhone')).value;
            recoverMethod = 'phone';
            console.log(this.recoverPhone);
            if (this.recoverPhone == '') {
                alert('Поле телефона для восстановления не заполнено');
            } else {
                this._account_service.data(this.login, this.pass, this.recoverPhone, this.mode, recoverMethod).subscribe(res => {
                    console.log(res);
                    for (let str of Object.values(res)) {
                        if (str != 'ok')
                            this.result += str.toString();
                        document.getElementById('resRecover').innerHTML = this.result;
                    }
                });
            }
            // }
        } else if (this.mode === 'sendKey') {
            console.log('work ',this.phone,this.phone1,this.login, this.recover);
            recoverMethod = 'phone';

            let regexp = new RegExp('@');
            let test = regexp.test(this.login);
            if (this.recover == true) {
                if (this.phone1 == '' || this.phone1 == undefined || this.phone1.length < 11) {
                    console.log(document.getElementById('res'));
                    document.getElementById('res').innerHTML = 'Для восстановления пароля пожалуйста введите номер Вашего телефона';
                } else {
                    //   document.getElementById('res').innerHTML = "На Ваш телефон и почтовый ящик был отправлен пароль для входа в систему";
                    this.codeActive = true;
                    console.log('work ' + this.phone1 + ' ' + this.login);
                    this._account_service.data(this.login, this.pass, this.phone1, 'recoverPass', recoverMethod).subscribe(res => {
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
                    document.getElementById('res1').innerHTML = 'Некорректно введен адрес почтового ящика, пожалуйста проверьте правильность написания';
                } else if (this.phone == '' || this.phone == undefined || this.phone.length < 11) {
                    document.getElementById('res1').innerHTML = 'Некорректно введен номер телефона, пожалуйста проверьте правильность написания';
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

            // else if (this.mode === 'checkRecoverKey') {
            //   let recoverKey = (<HTMLInputElement>document.getElementById('recoverKey')).value;
            //   this._account_service.data(recoverEmail, recoverKey, recoverPhone, this.mode, recoverMethod).subscribe(res => {
            //     for (let str of Object.values(res)) {
            //      // console.log(str);
            //       this.result += str.toString();
            //     }
            //   });
            // }
        } else if (this.mode === 'checkAccessKey' && this.regVar == true) {
            if (this.check) {
                let i = 0;
                this._account_service.data(this.login, this.pass, this.phone, this.mode, recoverMethod).subscribe(res => {
                    for (let str of Object.values(res)) {
                        console.log('res: ', str);
                        if (i == 0) {
                            i++;
                            this.result = str.toString();
                            if (str.toString() == 'ok') {
                                console.log('hello!');
                                document.getElementById('res1').innerHTML = 'Учетная запись успешно создана';
                                this.access_code = true;
                                this.save_user();
                            } else {
                                document.getElementById('res1').innerHTML = str.toString();
                            }
                        }
                    }
                });
            }
        }
            // } else if (this.mode === 'savePass') {
            //   let newPassAgain = (<HTMLInputElement>document.getElementById('passConfirm')).value;
            //   if (this.pass === newPassAgain) {
            //     this._account_service.data(this.login, this.pass, this.phone, 'register', recoverMethod).subscribe(res => {
            //       console.log(res);
            //       for (let str of Object.values(res)) {
            //         this.result += str.toString();
            //       }
            //     });
            //   }
        // }
        else if (this.mode === 'savePassRecover') {
            recoverMethod = 'phone';
            let access_code1 = (<HTMLInputElement> document.getElementById('recoverKey')).value;
            this._account_service.data(this.login, access_code1, this.recoverPhone, this.mode, recoverMethod).subscribe(res => {
                console.log(res);
                for (let str of Object.values(res)) {
                    //  console.log(str);
                    if (str != 'ok')
                        this.result += str.toString();
                    document.getElementById('resRecover').innerHTML = this.result;
                }
            });
        }

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

    log_out() {
        this.localStorage.removeItem('user');
        this.localStorage.removeItem('logged_in');
        this.logged_in = false;
    }
}
