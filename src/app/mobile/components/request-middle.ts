import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Request} from '../../class/Request';
import * as moment from 'moment';

@Component({
    selector: 'request-middle',
    inputs: ['request'],
    template: `
        <div class="request-outer-block">
            <div class="request-top-block">
                <div class="contact-photo-request"
                     [ngStyle]="{'background-image': request?.person?.photoMini != undefined ? 'url('+request?.person?.photoMini+')' : 'url(../../../../assets/user-icon.png)', 'background-size': request?.person?.photoMini != undefined  ? 'cover':'125% 125%' }"></div>
                <div class="request-contact">
                    <div class="request-contact-top">
                        <div><span style="font-weight: bold">{{first_name}}</span> <span>{{last_name}}</span></div>
                        <div>{{addDate}}</div>
                    </div>
                    <div class="request-contact-email">{{request?.person?.emailBlock?.main}}</div>
                </div>
            </div>
            <div class="request-description" [innerHTML]="req_class.getDescription(request)"></div>
            <div class="request-bottom-block">Бюджет {{request.ownerPrice}} 000 Р</div>
        </div>
    `,
    styles: [`
        .request-contact{
            display: flex;
            flex-direction: column;
            width: calc(100% - 50px);
            justify-content: space-between;
        }
        .request-contact > div:first-child{
            height: 13px;
            margin-top: 1px;
        }
        .request-contact > div:last-child{
            height: 11px;
            position: relative;
            top: -7px;
        }
        .request-outer-block {
            width: calc(100% - 40px);
            height: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            font-family: Helvetica, sans-serif;
            font-size: 14px;
            border-bottom: 1px solid #EAEBEC !important;
        }
        .contact-photo-request {
            margin-right: 10px;
            width: 36px;
            height: 36px;
            min-height: 36px;
            border-radius: 18px;
            background-repeat: no-repeat;
            background-position: center;
            background-color: #FBFAF9;
        }

        .request-top-block {
            display: flex;
        }
        .request-top-block, .request-description {
            margin-bottom: 15px;
        }
        .request-bottom-block {
            display: flex;
            justify-content: flex-end;
            width: 100%;
        }
        .request-contact-top {
            display: flex;
            width: 100%;
        }
        .request-contact-top > div:first-child {
            color: #3F51B5;
            flex-grow: 1;
        }
        .request-contact-email {
            color: #72727D;
        }
    `]
})

export class RequestMiddleComponent implements OnInit {
    @Input() request: Request;
    addDate: any;
    first_name = "";
    last_name = "";
    req_class = Request;

    constructor() {
    }

    ngOnInit() {
        this.initParams();
    }

    initParams() {
        let date = this.request.addDate;
        let day = moment.unix(this.request.addDate);
        let curDate = new Date();
        let secs = curDate.getTime() / 1000;
        let timeHasCome = secs - date;
        let dayDiff = moment.unix(curDate.getTime() / 1000).day() - moment.unix(this.request.addDate).day();
        if (dayDiff == 0) {
            if (day.minutes() < 10) {
                this.addDate = 'Сегодня, в ' + day.hours() + ':0' + day.minutes();
            } else {
                this.addDate = 'Сегодня, в ' + day.hours() + ':' + day.minutes();
            }
        } else if (dayDiff == 1) {
            if (day.minutes() < 10) {
                this.addDate = 'Вчера, в ' + day.hours() + ':0' + day.minutes();
            } else {
                this.addDate = 'Вчера, в ' + day.hours() + ':' + day.minutes();
            }
        } else if (dayDiff == 2) {
            if (day.minutes() < 10) {
                this.addDate = 'Позавчера, в ' + day.hours() + ':0' + day.minutes();
            } else {
                this.addDate = 'Позавчера, в ' + day.hours() + ':' + day.minutes();
            }
        } else {
            let hour = '';
            if (Math.floor(timeHasCome / 60 / 60 / 24) < 4) {
                hour = Math.floor(timeHasCome / 60 / 60 / 24) + ' дня ';
            } else {
                hour = Math.floor(timeHasCome / 60 / 60 / 24) + ' дней ';
            }
            this.addDate = hour + 'назад в ' + day.hours() + ':0' + day.minutes();
        }
        if (this.request.person.name != undefined) {
            let spArray = this.request.person.name.split(' ');
            this.first_name = spArray[0].toUpperCase();
            if (spArray.length > 1) {
                for (let i = 1; i < spArray.length; i++) {
                    this.last_name += ' ' + spArray[i];
                }
            }
        }
    }
}
