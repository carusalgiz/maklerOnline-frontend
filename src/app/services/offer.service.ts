import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AsyncSubject} from 'rxjs/AsyncSubject';
import {map} from 'rxjs/operators';
import {Item} from '../item';
import {ConfigService} from './config.service';
import {ListResult} from '../class/listResult';


@Injectable()
export class OfferService {
    servUrl: any;

    constructor(private _http: HttpClient, config: ConfigService) {
        this.servUrl = config.getConfig('servUrl');
    }
    _escape(s: string) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    listKeywords(prefix: string) {

        let res = prefix.match(/((\d+)([^\d]*))$/);

        let sgs: string[] = [];

        if (res && res.length > 0) {

            let term = res[1];
            let value = parseFloat(res[2]);
            let word = res[3];
            let px = prefix.replace(term, '');


            let rx = new RegExp('^' + this._escape(word), 'i');

            if (value > 0 && value < 10 && ' комнатная'.match(rx)) {
                sgs.push(px + value + ' комнатная');
            }
            if (value > 0 && value < 100000 && ' тыс. руб.'.match(rx)) {
                sgs.push(px + value + ' тыс. руб.');
                sgs.push(px + value + ' рублей');
            }
            if (value > 0 && value < 100 && ' этаж'.match(rx)) {
                sgs.push(px + value + ' этаж');
            }
            if (value > 0 && value < 1000 && ' кв. м.'.match(rx)) {
                sgs.push(px + value + ' кв. м.');
            }
        } else {
            for (let e of ['одно', 'двух', 'трех', 'четырех', 'пяти', 'шести', 'семи', 'восьми', 'девяти']) {
                let x = e + 'комнатная';

                let term = prefix.match(/(\S+)$/)[0];
                let trx = new RegExp('^' + this._escape(term), 'i');

                if (x.match(trx)) {
                    let px = prefix.replace(term, '');
                    sgs.push(px + x);
                }
            }

            for (let e of ['сталинка',
                'хрущевка',
                'улучшенная план.',
                'улучшенная планировка',
                'новая план.',
                'новая планировка',
                'индивидуальная план.',
                'индивидуальная планировка',
                'общежитие',
                'балкон',
                'лоджия',
                'балкон',
                'лоджия',
                'балкон застеклен',
                'застеклен балкон',
                'застеклена лоджия',
                'лоджия застеклена',
                'балкон',
                'лоджия',
                'раздельный санузел',
                'санузел раздельный',
                'санузел смежный',
                'смежный санузел',
                'раздельный санузел',
                'санузел раздельный',
                'душ',
                'туалет',
                'туалет',
                'санузел совмещенный',
                'совмещенный санузел',
                'после строителей',
                'социальный ремонт',
                'ремонт',
                'евроремонт',
                'евро ремонт',
                'дизайнерский ремонт',
                'удовлетворительное сост.',
                'удовлетворительное состояние',
                'нормальное сост.',
                'нормальное состояние',
                'хорошее сост.',
                'хорошее состояние',
                'отличное сост.',
                'отличное состояние',
                'кирпичный',
                'кирпичный дом',
                'монолитный',
                'монолитный дом',
                'панельный',
                'панельный дом',
                'деревянный',
                'деревянный дом',
                'брус',
                'каркасно засыпной',
                'каркасно засыпной дом',
                'монолитно кирпичный',
                'монолитно кирпичный дом',
                'комната',
                'квартира',
                'коттедж',
                'таунхаус',
                'дом',
                'земельный участок',
                'дача',
                'офис',
                'новостройка',
                'малосемейка',
                'другое',
                'торговая площадь',
                'офисное помещение',
                'здание',
                'помещение под сферу услуг',
                'база',
                'склад',
                'помещение под автобизнес',
                'помещение свободного назначения',
                'производственное помещение',
                'гараж',
                'стояночное место',
                'студия',
                'комнаты раздельные',
                'раздельные комнаты',
                'комнаты смежные',
                'смежные комнаты',
                'икарус',
                'комнаты смежно раздельные',
                'смежно раздельные комнаты']) {

                let term = prefix.match(/(\S+)$/)[0];
                let trx = new RegExp('^' + this._escape(term), 'i');

                console.log(term);

                if (e.match(trx)) {
                    let px = prefix.replace(term, '');
                    sgs.push(px + e);
                }

            }
        }

        let ret_subj = <AsyncSubject<string[]>> new AsyncSubject();

        ret_subj.next(sgs);
        ret_subj.complete();

        return ret_subj;
    }

    list(page: number, perPage: number, filter: any, sort: any, equipment: any, coords: any, searchQuery: any) {
        let query = [];
        query.push('page=' + page);
        query.push('per_page=' + perPage);
        if (filter) {
            query.push('filter=' + JSON.stringify(filter));
        }
        if (sort) {
            // addDate finalRaiting
            query.push('sort=' + JSON.stringify(sort));
        }
        if (equipment) {
            query.push('equipment=' + JSON.stringify(equipment));
        }
        if (coords) {
            // addDate finalRaiting
            query.push('search_area=' + JSON.stringify(coords));
        }
        if (searchQuery) {
            // addDate finalRaiting
            query.push('search_query=' + JSON.stringify(searchQuery));
        }
        let _resourceUrl = this.servUrl + '/offer/list?' + query.join('&');

        let ret_subj = <AsyncSubject<ListResult>> new AsyncSubject();

        this._http.get(_resourceUrl, {withCredentials: true}).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
                // console.log(raw);
                // let obj: Item[];
                let data = JSON.parse(JSON.stringify(raw));
                let obj: ListResult = new ListResult();
                if (data.result) {
                    obj.hitsCount = data.hitsCount;
                    obj.list = data.result;

                    ret_subj.next(obj);
                    ret_subj.complete();
                }
                // console.log(Object.values(data));
                //  console.log(obj);
            },
            err => console.log(err)
        );
        return ret_subj;
    }
}
