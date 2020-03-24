import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {AsyncSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import { Request } from '../class/Request';

@Injectable()
export class RequestService {
    servUrl: any;
    constructor(private _http: HttpClient, config: ConfigService) {
        this.servUrl = config.getConfig('servUrl');
    }

    save(request: Request) {
        console.log('request save');

        let _resourceUrl = this.servUrl + '/request/save';

        let data_str = JSON.stringify(request);
        let ret_subj = <AsyncSubject<Request>>new AsyncSubject();

        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
                let data = JSON.parse(JSON.stringify(raw));
                let r: Request = data.result;

                ret_subj.next(r);
                ret_subj.complete();

            }
        );
        return ret_subj;
    }
}
