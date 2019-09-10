import {Injectable} from "@angular/core";
import {Config} from "../class/config";

@Injectable()
export class ConfigService {
    public getConfig(field) {
        return config[field];
    }
}
let config: Config = {
    siteUrl: "//dev.makleronline.net",
    servUrl: "//dev.maklersoft.ru"
};
