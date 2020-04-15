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
    offerTypeCode: string;

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

        this.offerTypeCode = '';
        this.buildingType = [];
        this.buildingClass =  [];
        this.searchArea = [];
        this.conditions = new ConditionsBlock();
    }

    public static getDescription(request: Request) {
        let description = "<b>";
        if (request.rentType == 'short') {
            description += "КРАТКОСРОЧНАЯ ";
        } else if (request.rentType == 'long') {
            description += "ДОЛГОСРОЧНАЯ ";
        }

        description += "АРЕНДА ";
        if (request.roomsCount) {
            description += request.roomsCount + " ";
            if (request.offerTypeCode.indexOf('apartment') != -1 || request.offerTypeCode.indexOf('dacha') != -1 ) {
                description +=  " КОМНАТНОЙ ";
            } else if (request.offerTypeCode.indexOf('single_house') != -1 || request.offerTypeCode.indexOf('cottage') != -1) {
                description +=  " КОМНАТНОГО ";
            } else {
                if (request.offerTypeCode.indexOf('room') == -1 )
                    description += " КОМН., ";
            }
            if (request.offerTypeCode.indexOf('room') != -1 && request.buildingClass.length > 1) {
                description +=  " КОМНАТЫ, ";
            }
            if (request.offerTypeCode.indexOf('room') != -1 && request.buildingClass.length == 1 ) {
                description +=  " ОБЩЕЖИТИЯ, ";
            }
            if (request.offerTypeCode.indexOf('apartment') != -1  && request.buildingClass.length > 1) {
                description +=  " КВАРТИРЫ, ";
            }
            if (request.offerTypeCode.indexOf('apartment') != -1  && request.buildingClass.length == 1 && request.buildingClass.includes('gostinka')) {
                description +=  " ГОСТИНКИ, ";
            }
            if (request.offerTypeCode.indexOf('apartment') != -1  && request.buildingClass.length == 1 && request.buildingClass.includes('small_apartm')) {
                description +=  " МАЛОСЕМЕЙКИ, ";
            }
            if (request.offerTypeCode.indexOf('single_house') != -1) {
                description +=  " ДОМА, ";
            }
            if (request.offerTypeCode.indexOf('cottage') != -1) {
                description +=  " КОТТЕДЖА, ";
            }
            if (request.offerTypeCode.indexOf('dacha') != -1) {
                description +=  " ДАЧИ, ";
            }
        }
        description += "</b>";
        if (request.commission == 0) {
            description += " без комиссии, ";
        }
        if (request.commission > 0) {
            description += " с комиссией, ";
        }
        if (request.conditions) {
            let req_cond = request.conditions;
            if (req_cond.complete != null && req_cond.complete) {
                description += " укомплектовано полностью, ";
            } else {
                let check = false;
                for (let cond in req_cond) {
                    if (req_cond[cond])
                        check = true;
                }
                if (check == true)
                    description += " включены ";
            }
            if (req_cond.dishes != null && req_cond.dishes) {
                description += " посуда, ";
            }
            if (req_cond.bedding != null && req_cond.bedding) {
                description += " постельные принадлежности, ";
            }
            if (req_cond.couchette != null && req_cond.couchette) {
                description += " спальная мебель, ";
            }
            if (req_cond.kitchen_furniture != null && req_cond.kitchen_furniture) {
                description += " кухонная мебель, ";
            }
            if (req_cond.living_room_furniture != null && req_cond.living_room_furniture) {
                description += " гостиная мебель, ";
            }
            if (req_cond.tv != null && req_cond.tv) {
                description += " телевизор, ";
            }
            if (req_cond.refrigerator != null && req_cond.refrigerator) {
                description += " холодильник, ";
            }
            if (req_cond.washer != null && req_cond.washer) {
                description += " стиральная машина, ";
            }
            if (req_cond.dishwasher != null && req_cond.dishwasher) {
                description += " посудомоечная машина, ";
            }
            if (req_cond.microwave_oven != null && req_cond.microwave_oven) {
                description += " СВЧ-печь, ";
            }
            if (req_cond.air_conditioning != null && req_cond.air_conditioning) {
                description += " кондиционер, ";
            }
            if (req_cond.with_animals || req_cond.with_children) {
                description += " можно ";
            }
            if (req_cond.with_animals != null && req_cond.with_animals) {
                description += " с животными, ";
            }
            if (req_cond.with_children != null && req_cond.with_children) {
                description += " с детьми, ";
            }
            while (description.charAt(description.length-1) == ',' || description.charAt(description.length-1) == ' ') {
                description = description.substr(0, description.length - 2);
            }

        }
        return description;
    }
}
