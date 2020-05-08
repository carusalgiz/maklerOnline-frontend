import { Injectable } from '@angular/core';
import {Item} from '../class/item';


@Injectable()
export class HubService {
    public mode: any;
    public transferItem: Item;

    constructor() {
    }

    public getMode(): any {
        return this.mode;
    }

    public setMode(mode: any): void {
        return this.mode = mode;
    }

    public getTransferItem(): Item {
        return this.transferItem;
    }

    public setTransferItem(item: Item): void {
        this.transferItem = item;
    }
}
