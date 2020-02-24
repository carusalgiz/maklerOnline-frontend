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
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
import {AccountService} from '../../../services/account.service';

@Component({
    selector: 'app-pay',
    templateUrl: './pay.component.html',
    styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit, AfterViewInit, OnChanges {

    constructor(
        private ym: NgxMetrikaService, @Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, private _account_service: AccountService) {
    }

    @Input() itemOpen: boolean;
    @Output() blockClose = new EventEmitter();
    @Input() updateBalance: boolean;
    @Input() redirect: boolean;
    @Output() days = new EventEmitter();
    @Output() time = new EventEmitter();
    @Output() logout = new EventEmitter();
    @Output() payingMode = new EventEmitter();
    @Input() inpDay: any;
    @Input() inpTime: any;
    @Input() logging: any;

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
        this.width = document.documentElement.clientWidth;
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    ngAfterViewInit() {
    }
    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }
    log_out() {
        this.localStorage.removeItem('time');
        this.localStorage.removeItem('logged_in');
        this.logged_in = false;
        this._account_service.logout();
    }

    blockCloseFunc(name) {
        this.blockClose.emit(name);
    }
    sendMsg(){
        this._account_service.test('some message from front').subscribe((res) => {
            console.log(res);
        });
    }
    payment(block, type, cost) {
        this.selectedButton = [];
        this.selectedButton.push({block: block});
        if (sessionStorage.getItem('useremail')!= undefined && sessionStorage.getItem('useremail') != 'email') {
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
            alert("Вход не был произведен, войдите пожалуйста в систему перед совершением оплаты");
        }
    }
}
