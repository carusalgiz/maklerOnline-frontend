import {UploadFile} from "./class/UploadFile";
import {ConditionsBlock} from "./class/conditionsBlock";

export class Item {
    watched: boolean;
    id: number;
    admArea: string;
    region: string;
    city: string;
    lat: any;
    lon: any;
    name: string;
    address: string;
    house_num: string;
    price: number;
    roomsCount: number;
    floor: number;
    floorsCount: number;
    squareTotal: number;
    photos: UploadFile[];
    documents: UploadFile[];
    addDate: number;
    phone: string;
    photo: string;
    photoMini: string;
    email: string;
    conditions: ConditionsBlock;
    prepayment: boolean;
    electrific_pay: boolean;
    water_pay: boolean;
    gas_pay: boolean;
    balcony: boolean;
    loggia: boolean;
    condition: string;
    bathroom: string;
    typeCode: string;
    is_fav: boolean;

    constructor(id?: number,
                admArea?: string,
                region?: string,
                address?: string,
                house_num?: string,
                city?: string,
                price?: number,
                roomsCount?: number,
                floor?: number,
                floorsCount?: number,
                squareTotal?: number,
                name?: string,
                photo?: string,
                addDate?: number,
                photos?: UploadFile,
                documents?: UploadFile,
                photoMini?: string,
                conditions?: ConditionsBlock,
                email?: string,
                phone?: string,
                prepayment?: boolean,
                electrificPay?: boolean,
                waterPay?: boolean,
                gasPay?: boolean,
                balcony?: boolean,
                loggia?: boolean,
                condition?: string,
                bathroom?: string,
                typeCode?: string
    ) {
        this.id = id;
        this.admArea = admArea;
        this.region = region;
        this.address = address;
        this.price = price;
        this.roomsCount = roomsCount;
        this.city = city;
        this.house_num = house_num;
        this.floor = floor;
        this.floorsCount = floorsCount;
        this.squareTotal = squareTotal;
        this.name = name;
        this.photos = [];
        this.photos.push(photos);
        this.documents = [];
        this.documents.push(documents);
        this.addDate = addDate;
        this.phone = phone;
        this.photo = photo;
        this.photoMini = photoMini;
        this.conditions = conditions;
        this.email = email;
        this.prepayment = prepayment;
        this.electrific_pay = electrificPay;
        this.water_pay = waterPay;
        this.gas_pay = gasPay;
        this.balcony = balcony;
        this.loggia = loggia;
        this.condition = condition;
        this.bathroom = bathroom;
        this.typeCode = typeCode;

    }
}
