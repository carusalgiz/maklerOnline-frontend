import {UploadFile} from "./UploadFile";
import {ConditionsBlock} from "./conditionsBlock";
import {PhoneBlock} from './phoneBlock';
import {Person} from './person';
import {AddressBlock} from './addressBlock';
import {EmailBlock} from './emailBlock';

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
    squareTotal: number;
    squareLiving: number;
    squareKitchen: number;
    photos: UploadFile[];
    documents: UploadFile[];
    addDate: number;
    changeDate: number;
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
    commisionType: string;           //Тип комиссии
    person: Person;
    buildingType: string;           //тип дома
    buildingClass: string;          //тип недвижимости

    constructor() {
        // set default vals
        this.buildingType =  'multisection_house';
        this.buildingClass =  'economy';
        this.typeCode = 'apartment';
        this.bathroom = "other";
        this.condition = "other";
        this.photos = [];
        this.documents = [];
        this.address = '';
        this.house_num = '';
        this.conditions = new ConditionsBlock();
    }

    public static bathroomOptions = {
        no: {label: 'Нет'},
        splited: {label: 'Раздельный'},
        combined: {label: 'Совмещенный'},
        other: {label: 'Другое'}
    };
}
