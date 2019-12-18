import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AsyncSubject} from "rxjs/AsyncSubject";
import {map} from 'rxjs/operators';
import {Item} from "../item";
import {ConfigService} from "./config.service";
import {ListResult} from '../class/listResult';


@Injectable()
export class OfferService {
    servUrl: any;
  constructor(private _http: HttpClient, config: ConfigService) {
      this.servUrl = config.getConfig('servUrl');
  }

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
    let _resourceUrl =  this.servUrl + '/offer/list?' + query.join("&");

    let ret_subj = <AsyncSubject<ListResult>>new AsyncSubject();

    this._http.get(_resourceUrl, { withCredentials: true }).pipe(
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
