import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AsyncSubject} from 'rxjs/AsyncSubject';
import {map} from 'rxjs/operators';
import {Item} from '../item';
import {PaymentResult} from "../desktop/components/class/main_classes";
import {ConfigService} from "./config.service";


@Injectable()
export class AccountService {
    servUrl: any;
  constructor(private _http: HttpClient, config: ConfigService) {
      this.servUrl = config.getConfig('servUrl');
  }
// , filter: any, sort: any
  getObjects(x: any, y: any, type: any, radius: any) {
    let query = [];
    query.push('apikey=e444f2d4-ae9a-4bef-a1c6-9550235e74bc');
    query.push('text=' + type);
    query.push('lang=ru_RU');
    query.push('ll=' + x + ',' + y);
    query.push('spn=' + radius + ',' + radius);
    query.push('rspn=1');
    query.push('results=500');

    let _resourceUrl = 'https://search-maps.yandex.ru/v1/?' + query.join('&');
 // console.log(_resourceUrl);

    let ret_subj = <AsyncSubject<any>>new AsyncSubject();

    this._http.get(_resourceUrl).pipe(
      map((res: Response) => res)).subscribe(
      raw => {
        let obj: any;
        let data = JSON.parse(JSON.stringify(raw));
        if (data.features) {
          //   // obj.hitsCount = data.result.hitsCount;
          obj = data.features;
          //
          ret_subj.next(obj);
          ret_subj.complete();
        }
        ret_subj.next(data);
        ret_subj.complete();
      },
      err => console.log(err)
    );
    return ret_subj;
  }
  data(user: any, pass: any, phone: any, mode: any, recoverMethod: any) {

    let query = [];
    query.push('login=' + user);
    query.push('pass=' + pass);
    query.push('phone=' + phone);
    query.push('mode=' + mode);
    query.push('recoverMethod=' + recoverMethod);

    let _resourceUrl =  this.servUrl + '/login/account?' + query.join('&');
    console.log(_resourceUrl);
    let ret_subj = <AsyncSubject<any>>new AsyncSubject();

    this._http.get(_resourceUrl, { withCredentials: true }).pipe(
      map((res: Response) => res)).subscribe(
      data => {
        ret_subj.next(data);
        ret_subj.complete();
      },
      err => console.log(err)
    );
    return ret_subj;
  }
  save_access_token(body) {
      let query = [];
      query.push('access_token=' + body.access_token);
      query.push('user_id=' + body.user_id);
      query.push('obj_id=' + body.obj_id);

      let _resourceUrl =  this.servUrl + '/saveAccessToken?'+ query.join('&');
      let ret_subj = <AsyncSubject<any>>new AsyncSubject();

      this._http.get(_resourceUrl, { withCredentials: true }).pipe(
          map((res: Response) => res)).subscribe(
          data => {
              ret_subj.next(data);
              ret_subj.complete();
          },
          err => console.log(err)
      );
      return ret_subj;
  }
    ok_sendPost(url, photos) {
        const body = {url: url, photos: photos};
        let _resourceUrl =  this.servUrl + '/ok_publish';
        let ret_subj = <AsyncSubject<any>>new AsyncSubject();

        this._http.post(_resourceUrl, JSON.stringify(body)).pipe(
            map((res: Response) => res)).subscribe(
            data => {
                ret_subj.next(data);
                ret_subj.complete();
            },
            err => console.log(err)
        );
        return ret_subj;
    }
    sendPost(item:Item) {
        let query = [];
        query.push('item=' + JSON.stringify(item));
        let _resourceUrl =  this.servUrl + '/publish?'+ query.join('&');
        let ret_subj = <AsyncSubject<any>>new AsyncSubject();

        this._http.post(_resourceUrl, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
            data => {
                ret_subj.next(data);
                ret_subj.complete();
            },
            err => console.log(err)
        );
        return ret_subj;
    }
    publish(photo, url, index) {
        const body = {url: url, photo: photo, index: index};
        let _resourceUrl =  this.servUrl + '/publish';

        let ret_subj = <AsyncSubject<any>>new AsyncSubject();

        this._http.post(_resourceUrl, JSON.stringify(body)).pipe(
            map((res: Response) => res)).subscribe(

            data => {
                // let obj: any;
                // if (data.result) {
                //   // obj.hitsCount = data.result.hitsCount;
                //   obj = data.result;
                //  // console.log(obj);
                //   ret_subj.next(obj);
                //   ret_subj.complete();
                // }
                ret_subj.next(data);
                ret_subj.complete();
            },
            err => console.log(err)
        );
        console.log(ret_subj);
        return ret_subj;
    }
  saveUser(accountId: any, email_block: any, phone_block: any) {
    const body = {accountId: accountId, emailBlock: email_block, phoneBlock: phone_block, sourceCode: "internet"};
    let _resourceUrl =  this.servUrl + '/person/save';
    console.log(_resourceUrl + JSON.stringify(body));

    let ret_subj = <AsyncSubject<any>>new AsyncSubject();

    this._http.post(_resourceUrl, JSON.stringify(body)).pipe(
      map((res: Response) => res)).subscribe(

      data => {
        // let obj: any;
        // if (data.result) {
        //   // obj.hitsCount = data.result.hitsCount;
        //   obj = data.result;
        //  // console.log(obj);
        //   ret_subj.next(obj);
        //   ret_subj.complete();
        // }
        ret_subj.next(data);
        ret_subj.complete();
      },
      err => console.log(err)
    );
    console.log(ret_subj);
    return ret_subj;
  }


  // ????????????????????????????????????????
  payment( payment_type: any, payment_price: any) {
    let query = [];
    query.push('payment_type=' + payment_type);
    query.push('payment_price=' + payment_price);

    query.push('return_url=' + document.location.href.replace('#', 'ю'));
    console.log(query.toString());

    let _resourceUrl =  this.servUrl + '/person/payment?' + query.join('&');
    console.log(_resourceUrl);
    // console.log(_resourceUrl + JSON.stringify(body));
    let ret_subj = <AsyncSubject<any>>new AsyncSubject();

    this._http.get(_resourceUrl, { withCredentials: true}).subscribe(
        (raw: PaymentResult) => {
          console.log(raw);
          // let data = JSON.parse(JSON.stringify(raw));
          ret_subj.next(raw.result);
        ret_subj.complete();
      },
      err => console.log(err)
    );
    return ret_subj;
  }
  // ????????????????????????????????????????
  checkBalance() {
      let query = [];
      query.push('rand=' + Math.random().toFixed(20).replace('.', ''));
    let _resourceUrl =  this.servUrl + '/person/balance?' + query.join('&');
     console.log(_resourceUrl);
    let ret_subj = <AsyncSubject<any>>new AsyncSubject();

    //, responseType: 'text'
    this._http.get(_resourceUrl, { withCredentials: true }).pipe(
          map((res: Response) => res)).subscribe(
          data => {
              ret_subj.next(data);
              ret_subj.complete();
          },
          err => console.log(err)
      );
    console.log("----" + _resourceUrl);
    return ret_subj;
  }
  checklogin() {
      let query = [];
      query.push('rand=' + Math.random().toFixed(20).replace('.', ''));
    let ret_subj = <AsyncSubject<any>>new AsyncSubject();
    let _resourceUrl =  this.servUrl + '/person/checklogin?' + query.join('&');
    this._http.get(_resourceUrl, {withCredentials: true}).pipe(
      map((res: Response) => res)).subscribe(
      raw => {
        let data = JSON.parse(JSON.stringify(raw));
        let struct = {
          'result': data.result,
          'user_id': data.user_id,
          'email' : data.email
        };
        // console.log(data);
        // console.log("res: ", data.result, " user: ", data.user_id, " email: ", data.email);
        if (data.result) {
          ret_subj.next(struct);
        }
        ret_subj.complete();
      },
      err => console.log(err)
    );
    return ret_subj;
  }
  logout() {
    let _resourceUrl =  this.servUrl + '/person/logout';
    // , responseType: 'text'
    this._http.post(_resourceUrl, '', {withCredentials: true}).pipe(
      map((res: Response) => res)).subscribe(
      data => {
        // console.log(data);
      },
      err => {}
    );
  }
  getFavObjects() {
    let _resourceUrl =  this.servUrl + '/person/getFavObjects';
    let ret_subj = <AsyncSubject<any>>new AsyncSubject();
    // console.log(_resourceUrl);

    this._http.get(_resourceUrl, { withCredentials: true }).pipe(
      map((res: Response) => res)).subscribe(
      raw => {
        console.log(raw);
        console.log(JSON.stringify(raw));
        if (raw != undefined) {
            let obj: Item[];
            let data = JSON.parse(JSON.stringify(raw));
            if (data.result) {
                //   // obj.hitsCount = data.result.hitsCount;
                obj = data.result;
                //
                ret_subj.next(obj);
                ret_subj.complete();
            }
        } else {
            ret_subj.complete();
        }

      },
      err => {
        console.log(err.error);
        console.log("error: ", err);
      }
    );
    // console.log(ret_subj);
    return ret_subj;
  }
  delFavObject(object_id: any) {
    const body = {object_id: object_id};
    let _resourceUrl =  this.servUrl + '/person/delFavObject';
    // console.log(_resourceUrl + JSON.stringify(body));
    let ret_subj = <AsyncSubject<any>>new AsyncSubject();

    // , responseType: 'text'
    this._http.post(_resourceUrl, JSON.stringify(body), {withCredentials: true}).pipe(
      map((res: Response) => res)).subscribe(
      data => {
        console.log(data);
        ret_subj.next(data);
        ret_subj.complete();
      },
      err => console.log(err)
    );
    return ret_subj;
  }
  addFavObject( object_id: any) {
    const body = {object_id: object_id};
    let _resourceUrl =  this.servUrl + '/person/addFavObject';
    // console.log(_resourceUrl + JSON.stringify(body));
    let ret_subj = <AsyncSubject<any>>new AsyncSubject();

    //, responseType: 'text'
    this._http.post(_resourceUrl, JSON.stringify(body), {withCredentials: true}).pipe(
      map((res: Response) => res)).subscribe(
      data => {
        // console.log(data);
        ret_subj.next(data);
        ret_subj.complete();
      },
      err => console.log(err)
    );
    return ret_subj;
  }
  login(email: any, pass: any) {
    let query = [];
    query.push('login=' + email);
    query.push('pass=' + pass);
    let _resourceUrl =  this.servUrl + '/person/get?' + query.join('&');
    let ret_subj = <AsyncSubject<any>>new AsyncSubject();
    // console.log(_resourceUrl);

    this._http.get<any>(_resourceUrl, { withCredentials: true }).pipe(
      map((res: Response) => res)).subscribe(
      data => {
        // console.log(typeof data);
      //  console.log(data);

        // let obj: any;
        // if (data.result) {
        //   // obj.hitsCount = data.result.hitsCount;
        //   obj = data.result;
        //   alert(data.result);
        //   ret_subj.next(obj);
        //   ret_subj.complete();
        // }
        ret_subj.next(data);
        ret_subj.complete();
      },
      err => console.log(err)
    );
   // console.log(ret_subj);
    return ret_subj;
  }
    test( message: any) {
        const body = {message: message};
        let _resourceUrl =  this.servUrl + '/testFunc';
        // console.log(_resourceUrl + JSON.stringify(body));
        let ret_subj = <AsyncSubject<any>>new AsyncSubject();

        //, responseType: 'text'
        this._http.post(_resourceUrl, JSON.stringify(body), {withCredentials: true}).pipe(
            map((res: Response) => res)).subscribe(
            data => {
                 console.log(data);
                ret_subj.next(data);
                ret_subj.complete();
            },
            err => console.log(err)
        );
        return ret_subj;
    }
}
