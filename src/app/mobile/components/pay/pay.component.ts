import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, Inject} from '@angular/core';
import {AccountService} from '../../../services/account.service';


@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})



export class PayComponent implements OnInit, OnChanges {

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, private _account_service: AccountService) { }

  @Input() otherComponent: boolean;
  @Input() updateBalance: boolean;
  @Input() redirect: boolean;
  @Output() days = new EventEmitter();
  @Output() time = new EventEmitter();
  @Output() logout = new EventEmitter();
  @Input() itemOpen: boolean;
  @Output() blockClose = new EventEmitter();
    @Output() payingMode = new EventEmitter();
    @Input() inpDay: any;
    @Input() inpTime: any;
  logged_in = false;
  user: any;
  height: number;
  openBlock = true;
  manager = false;
  access = false;
  publish = false;
  makler = false;
  width: number;
  balance = 0;
  resDay = 0;
  resTime = "00:00:00";
  timeT: any;
  timer: any;
    selectedButton: any[] = [{block: ''}];
  ngOnInit() {
    //   if (sessionStorage.getItem('useremail') != undefined) {
    //       if (sessionStorage.getItem('days') != undefined && sessionStorage.getItem('time') != undefined) {
    //           this.resDay = Number.parseInt(sessionStorage.getItem('resDay'));
    //           this.resTime = sessionStorage.getItem('resTime');
    //       }
    //   }
    this.width = document.documentElement.clientWidth;
    //   this.checklogin();
    //   this.checkBalance();
    //   clearInterval(this.timer);
    //   this.timer = false;
    // this.openBlock = this.otherComponent !== false;

  }
  ngOnChanges() {
      // this.checklogin();
      // this.checkBalance();

  }
    // checklogin() {
    //     this._account_service.checklogin().subscribe(res => {
    //         if (res != undefined) {
    //             let data = JSON.parse(JSON.stringify(res));
    //             if (data.result == 'success') {
    //                 this.user = data.user_id;
    //                 sessionStorage.setItem('useremail', data.email);
    //                 this.logged_in = true;
    //             } else {
    //                 this.log_out();
    //             }
    //         } else {
    //             this.log_out();
    //             console.log('not athorized!');
    //             return false;
    //         }
    //     });
    // }
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

        // this.checklogin();
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
    // checkBalance() {
    //     this._account_service.checkBalance().subscribe(res => {
    //         let result = JSON.parse(JSON.stringify(res));
    //         this.balance = result.balance;
    //         if (this.balance == 0) {
    //             this.balance = 0.0;
    //         }
    //         this.timeT = parseInt(result.time, 10);
    //         clearInterval(this.timer);
    //         this.timer = 0;
    //         this.timer = setInterval(e => this.updateTime(), 1000);
    //     });
    // }
    // updateTime() {
    //     if (this.redirect) {
    //         clearInterval(this.timer);
    //     }
    //     if (this.logged_in == true) {
    //         if (this.timeT > 0) {
    //             this.timeT = this.timeT - 1;
    //             let min = this.timeT / 60;
    //             let hour = min / 60;
    //             this.resDay = Math.floor(hour / 24);
    //             this.resTime = Math.floor(hour % 24) + ":" + Math.floor(min % 60) + ":" + Math.floor(this.timeT % 60);
    //             sessionStorage.setItem('resDay', this.resDay.toString());
    //             sessionStorage.setItem('resTime', this.resTime);
    //             sessionStorage.setItem('con_data', 'true');
    //             this.days.emit(this.resDay + "дн.");
    //             this.time.emit(Math.floor(hour % 24) + "ч." + Math.floor(min % 60) + "мин.");
    //         } else {
    //             clearInterval(this.timer);
    //             this.resDay = 0;
    //             this.resTime = "00:00:00";
    //             this.balance = 0.0;
    //             this.days.emit("00дн.");
    //             this.time.emit("00ч.00мин.");
    //             sessionStorage.setItem('resDay', this.resDay.toString());
    //             sessionStorage.setItem('resTime', this.resTime);
    //             sessionStorage.setItem('con_data', 'false');
    //         }
    //     } else {
    //         this.resDay = 0;
    //         this.balance = 0.0;
    //         this.resTime = "00:00:00";
    //         this.days.emit("00дн.");
    //         this.time.emit("00ч.00мин.");
    //         sessionStorage.setItem('resDay', this.resDay.toString());
    //         sessionStorage.setItem('resTime', this.resTime);
    //         sessionStorage.setItem('con_data', 'false');
    //         this.log_out();
    //         this.logoutFunc();
    //     }
    //     if (this.timeT > 0) {
    //         if (this.localStorage.getItem('timeAdd') != 'true') {
    //             this.localStorage.setItem("timeAdd", 'true');
    //         }
    //     } else {
    //         if (this.localStorage.getItem('timeAdd') != 'false') {
    //             this.localStorage.setItem("timeAdd", 'false');
    //         }
    //     }
    // }
}
