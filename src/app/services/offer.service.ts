import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AsyncSubject} from "rxjs/AsyncSubject";
import {map} from 'rxjs/operators';
import {Item} from "../item";


@Injectable()
export class OfferService {

  constructor(private _http: HttpClient) {}

  list(page: number, perPage: number, filter: any, sort: any, equipment: any, coords: any) {
    // console.log('offers list');

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
    let _resourceUrl = 'https://maklersoft.ru/offer/list?' + query.join("&");

    let ret_subj = <AsyncSubject<Item[]>>new AsyncSubject();

    this._http.get(_resourceUrl, { withCredentials: true }).pipe(
      map((res: Response) => res)).subscribe(
      raw => {
        // console.log(raw);
        let obj: Item[];
        let data = JSON.parse(JSON.stringify(raw));
        if (data.result) {
        //   // obj.hitsCount = data.result.hitsCount;
           obj = data.result;
        //
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
