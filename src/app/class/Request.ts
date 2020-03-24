import {Person} from './person';
import {PhoneBlock} from './phoneBlock';
import {ConditionsBlock} from './conditionsBlock';

export class Request {
    id: number;
    personId: number;
    person: Person;
    phoneBlock: PhoneBlock;

    buildingType: string[];           //тип дома
    buildingClass: string[];          //тип недвижимости
    typeCode: string;               //тип объекта
    categoryCode: string;
    addDate: number;
    conditions: ConditionsBlock;
    commission: number;
    roomsCount: number;
    ownerPrice: number;
    offerTypeCode: string[];

    houseType: string[];            //Материал дома
    roomScheme: string[];           //Тип комнат
    floor: string[];
    condition: string[];            //Состояние объекта
    bathroom: string[];             //тип санузла

    searchArea: any[];
    rentType: string;

    constructor() {
        this.categoryCode = "rezidential";
        this.typeCode = "rent";
        this.phoneBlock = new PhoneBlock();
        this.categoryCode = "";
        this.houseType = [];
        this.roomScheme = [];
        this.floor = [];
        this.bathroom = [];
        this.condition = [];
        this.ownerPrice = 200;

        this.offerTypeCode = [];
        this.buildingType = [];
        this.buildingClass =  [];
        this.searchArea = [];
        this.conditions = new ConditionsBlock();
    }
}
