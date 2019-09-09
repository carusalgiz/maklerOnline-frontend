import {LOCAL_STORAGE, WINDOW} from '@ng-toolkit/universal';
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    Inject,
    SimpleChanges
} from '@angular/core';
import {AccountService} from '../../../services/account.service';
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
import {PaymentResult} from "../class/main_classes";

declare let cp: any;

@Component({
    selector: 'app-pay',
    templateUrl: './pay.component.html',
    styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit, AfterViewInit, OnChanges {

    constructor(private ym: NgxMetrikaService, @Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, private _account_service: AccountService) {
    }

    @Input() itemOpen: boolean;
    @Output() blockClose = new EventEmitter();
    @Input() updateBalance: boolean;
    @Input() redirect: boolean;
    @Output() days = new EventEmitter();
    @Output() time = new EventEmitter();
    @Output() logout = new EventEmitter();
    @Output() payingMode = new EventEmitter();

    logged_in = false;
    user: any;
    sam = false;
    premium = false;
    special = false;
    publish = false;
    makler = false;
    width: number;
    balance = 0.0;
    resTime: any;
    resDay: any;
    timeT: any;
    timer: any;
    selectedButton: any[] = [{block: ''}];

    ngOnInit() {
        this.checklogin();
        this.checkBalance();
        clearInterval(this.timer);
        this.timer = false;

        this.width = document.documentElement.clientWidth;
    }

    ngOnChanges(changes: SimpleChanges) {
        this.checklogin();
        this.checkBalance();
    }

    ngAfterViewInit() {
    }

    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }

    log_out() {
        clearInterval(this.timer);
        this.localStorage.removeItem('time');
        this.localStorage.removeItem('logged_in');
        this.logged_in = false;
        this._account_service.logout();
    }

    blockCloseFunc(name) {
        this.blockClose.emit(name);
    }

    logoutFunc() {
        this.logout.emit();
    }

    payment(block, type, cost) {
        this.selectedButton = [];
        this.selectedButton.push({block: block});

        this.checklogin();
        if (this.user != null) {
            this._account_service.payment(type, cost).subscribe((res) => {
                console.log(res);
                if (res == "Такого пользователя не существует, либо вход не был произведен") {
                    alert(res);
                } else if (res.indexOf("http") != -1) {
                    this.window.location.href = res;
                } else {
                    alert(res);
                }
            });
        } else {
            alert("Вход не был произведен, войдите пожалуйста в систему перед совершение оплаты");
        }
    }

    checkBalance() {
        this._account_service.checkBalance().subscribe(res => {
            let result = JSON.parse(JSON.stringify(res));
            this.balance = result.balance;
            if (this.balance == 0) {
                this.balance = 0.0;
            }
            this.timeT = parseInt(result.time, 10);
            clearInterval(this.timer);
            this.timer = 0;
            this.timer = setInterval(e => this.updateTime(), 1000);
        });
    }

    updateTime() {
        if (this.redirect) {
            clearInterval(this.timer);
        }
        if (this.logged_in == true) {
            if (this.timeT > 0) {
                this.timeT = this.timeT - 1;
                let min = this.timeT / 60;
                let hour = min / 60;
                this.resDay = Math.floor(hour / 24);
                this.resTime = Math.floor(hour % 24) + ":" + Math.floor(min % 60) + ":" + Math.floor(this.timeT % 60);
                this.days.emit(this.resDay + "дн.");
                this.time.emit(Math.floor(hour % 24) + "ч." + Math.floor(min % 60) + "мин.");
                this.payingMode.emit(true);
            } else {
                clearInterval(this.timer);
                this.resDay = 0;
                this.resTime = "00:00:00";
                this.balance = 0.0;
                this.days.emit("00дн.");
                this.time.emit("00ч.00мин.");
                this.payingMode.emit(false);
            }
        } else {
            this.resDay = 0;
            this.balance = 0.0;
            this.resTime = "00:00:00";
            this.days.emit("00дн.");
            this.time.emit("00ч.00мин.");
            this.log_out();
            this.logoutFunc();
            this.payingMode.emit(false);
        }
        if (this.timeT > 0) {
            this.payingMode.emit(true);
            if (this.localStorage.getItem('timeAdd') != 'true') {
                this.localStorage.setItem("timeAdd", 'true');
            }
        } else {
            this.payingMode.emit(false);
            if (this.localStorage.getItem('timeAdd') != 'false') {
                this.localStorage.setItem("timeAdd", 'false');
            }
        }
    }

    checklogin() {
        this._account_service.checklogin().subscribe(res => {
            if (res != undefined) {
                let data = JSON.parse(JSON.stringify(res));
                if (data.result == 'success') {
                    this.user = data.user_id;
                    this.logged_in = true;
                } else {
                    this.log_out();
                }
            } else {
                this.log_out();
                console.log('not athorized!');
                return false;
            }
        });
    }
}
