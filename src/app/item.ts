import {UploadFile} from "./class/UploadFile";
import {ConditionsBlock} from "./class/conditionsBlock";
import {PhoneBlock} from './class/phoneBlock';

export class Item {
    bus_stop: any;
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
    phoneBlock: PhoneBlock;
    squareTotal: number;
    squareLiving: number;
    photos: UploadFile[];
    documents: UploadFile[];
    addDate: number;
    phone: string;
    photo: string;
    photoMini: string;
    email: string;
    conditions: ConditionsBlock;
    prepayment: boolean;
    electrificPay: boolean;        //плата за электричество
    waterPay: boolean;             //плата за воду
    gasPay: boolean;               //плата за газ
    heatingPay: boolean;           //плата за отопление
    utilityBills: boolean;         // коммунальные платежи
    paymentType: string;          //Тип расчета
    balcony: boolean;
    loggia: boolean;
    condition: string;
    bathroom: string;
    typeCode: string;
    is_fav: boolean;
    description: string;
    deposit: boolean;
    IsMiddleman: boolean;
    busStop: string;
    commission: number;

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
                squareLiving?: number,
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
                typeCode?: string,
                heatingPay?: boolean,           //плата за отопление
                utilityBills?: boolean,         // коммунальные платежи
                paymentType?: string,           //Тип расчета
                description?: string,
                deposit?: boolean,
                IsMiddleman?: boolean,
                phoneBlock?: PhoneBlock,
                busStop?: string,
                commission?: number
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
        this.squareLiving = squareLiving;
        this.busStop = busStop;
        this.commission = commission;
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
        this.electrificPay = electrificPay;
        this.waterPay = waterPay;
        this.gasPay = gasPay;
        this.balcony = balcony;
        this.loggia = loggia;
        this.condition = condition;
        this.bathroom = bathroom;
        this.typeCode = typeCode;
        this.heatingPay = heatingPay;
        this.utilityBills = utilityBills;
        this.paymentType = paymentType;
        this.description = description;
        this.deposit = deposit;
        this.IsMiddleman = IsMiddleman;
        this.phoneBlock = phoneBlock;
    }


    public paymentTypeOption = {
        all:  {label: 'Все'},
        cashless:  {label: 'Безналичный'},
        cash: {label: 'Наличный'}
    };
    public static bathroomOptions = {
        no: {label: 'Нет'},
        splited: {label: 'Раздельный'},
        combined: {label: 'Совмещенный'},
        other: {label: 'Другое'}
    };
}
