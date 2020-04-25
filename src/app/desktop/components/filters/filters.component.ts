import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
import {Request} from '../../../class/Request';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
    constructor(private ym: NgxMetrikaService,) {
    }

    city = 'Хабаровск';
    period = false;
    manager = false;
    additional = false;
    offer = false;
    typeOfObject = false;
    countOfRooms = false;
    cityButton = false;
    cost = false;
    sort = false;
    equipment = false;
    conditions = false;
    costChosen = false;
    rentType = false;
    priceMin = 0;
    priceMax = 200;
    request: Request = new Request();
    // ----------------------
    lat = 48.4862268;
    lng = 135.0826369;
    khv: any;
    vld: any;
    kna: any;
    filters = {
        'city': '',
        'contactType': 'private',                      // тип предложения (комиссия, без комиссии, все)
        'typeCode': String,                        // квартира, комната
        'roomsCount': String,
        'price': String,
        'isMiddleman': String,
        'addDate': undefined,
        'commission': undefined,
        'rentType': undefined
    };
    equipmentFilters = {
        'complete': undefined,
        'living_room_furniture': undefined,
        'kitchen_furniture': undefined,
        'couchette': undefined,
        'bedding': undefined,
        'dishes': undefined,
        'refrigerator': undefined,
        'washer': undefined,
        'microwave_oven': undefined,
        'air_conditioning': undefined,
        'dishwasher': undefined,
        'tv': undefined,
        'with_animals': undefined,
        'with_children': undefined,
        'can_smoke': undefined,
        'activities': undefined
    };
    sortArray = {
        'addDate': String,
        'finalRaiting': String,
        'ownerPrice': String
    };
    @Input() count: Number;
    @Input() activeButton: any;

    @Output() sendSort = new EventEmitter();
    width = document.documentElement.clientWidth;
    @Output() sendFilters = new EventEmitter();
    @Output() sendEquipment = new EventEmitter();
    @Output() closeFilters = new EventEmitter();
    @Output() openBlock = new EventEmitter();
    @Output() searchInCity = new EventEmitter();
    @Output() openLeft = new EventEmitter();
    @Output() showlist = new EventEmitter();


    ngOnInit() {
        // this.get_list();
        this.get_count_cities('Хабаровск', this.khv);
        this.get_count_cities('Владивосток', this.vld);
        this.get_count_cities('Комсомольск-на-Амуре', this.kna);
    }

    closeFunc(name) {
        this.closeFilters.emit(name);
    }
    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }
    openLeftFunc(name) {
        this.openLeft.emit(name);
    }

    openFunc(name) {
        this.openBlock.emit(name);
    }

    searchFunc(name) {
        this.searchInCity.emit(this.filters.city + ',' + name);
    }

    reset() {
        let buttonBox = document.getElementsByClassName('filters-options-box') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < buttonBox.length; i++) {
            for (let j = 0; j < buttonBox.item(i).children.length; j++) {
                if (buttonBox.item(i).children[j].classList.contains('selected')) {
                    buttonBox.item(i).children[j].classList.remove('selected');
                }
            }
        }
        this.filters.isMiddleman = undefined;
        this.filters.city = undefined;
        this.filters.contactType = 'private';
        this.filters.typeCode = undefined;
        this.filters.roomsCount = undefined;
        this.filters.price = undefined;
        this.filters.addDate = undefined;
        this.filters.commission = undefined;
        this.filters.rentType = undefined;
        this.equipmentFilters.complete = undefined;
        this.equipmentFilters.living_room_furniture = undefined;
        this.equipmentFilters.kitchen_furniture = undefined;
        this.equipmentFilters.couchette = undefined;
        this.equipmentFilters.bedding = undefined;
        this.equipmentFilters.dishes = undefined;
        this.equipmentFilters.refrigerator = undefined;
        this.equipmentFilters.washer = undefined;
        this.equipmentFilters.microwave_oven = undefined;
        this.equipmentFilters.air_conditioning = undefined;
        this.equipmentFilters.dishwasher = undefined;
        this.equipmentFilters.tv = undefined;
        this.equipmentFilters.with_animals = undefined;
        this.equipmentFilters.with_children = undefined;
        this.equipmentFilters.can_smoke = undefined;
        this.equipmentFilters.activities = undefined;
        this.sortArray.addDate = undefined;
        this.sortArray.ownerPrice = undefined;
        this.sortArray.finalRaiting = undefined;

        this.cityButton = false;
        this.offer = false;
        this.rentType = false;
        this.typeOfObject = false;
        this.countOfRooms = false;
        this.cost = false;
        this.equipment = false;
        this.conditions = false;
        this.sort = false;
        this.period = false;
        this.request = new Request();
        this.priceMin = 0;
        this.priceMax = 200;
        this.sendSortFunc();
        this.sendFiltersFunc();
        this.sendEquipmentFunc();
    }

    selectOption(blockId, optionId, name, varToChange, param) {
        let buttonBox = document.getElementById('filters-options-box' + blockId) as HTMLElement;
        if (buttonBox.children[optionId].classList.contains('selected')) {
            buttonBox.children[optionId].classList.remove('selected');
            let selected = [];
            if (blockId != 2) {
                for (let i = 0; i < buttonBox.childNodes.length; i++) {
                    if (buttonBox.children[i].classList.contains('selected')) {
                        selected.push(buttonBox.children[i].children[0].innerHTML);
                    }
                }
            }

            if (blockId == 1) {
                this.filters.commission = undefined;
                this.request.commission = undefined;
            } else if (blockId == 2) {
                selected = [];
                for (let i = 0; i < buttonBox.childNodes.length; i++) {
                    buttonBox.children[i].classList.remove('selected');
                }
                // buttonBox.children[optionId].classList.add('selected');
                // selected.push(buttonBox.children[optionId].children[0].innerHTML);

                this.request.offerTypeCode = '';
                this.request.buildingType = [];
                this.request.buildingClass = [];
                name = '';
                for (let i = 0; i < buttonBox.childNodes.length; i++) {
                    if (buttonBox.children[i].classList.contains('selected')) {
                        if (buttonBox.children[i].children[0].innerHTML == 'Дом')  {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'single_house';
                            this.request.buildingType = ['lowrise_house'];
                            this.request.buildingClass = ['single_house'];
                            name += ' Дом ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Коттедж')  {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'cottage';
                            this.request.buildingType = ['lowrise_house'];
                            this.request.buildingClass = ['cottage'];
                            name += ' Коттедж ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Дача')  {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'dacha';
                            this.request.buildingType = ['lowrise_house'];
                            this.request.buildingClass = ['dacha'];
                            name += ' Дача ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Комната')  {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'room';
                            name += ' Комната ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Квартира') {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'apartment';
                            name += ' Квартира ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Малосемейка') {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'apartment';
                            this.request.buildingType = ["multisection_house", "singlesection_house", "corridor_house", "galary_house"];
                            this.request.buildingClass = ["small_apartm"];
                            name += ' Малосемейка ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Гостинка') {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'apartment';
                            this.request.buildingType = ["multisection_house", "singlesection_house", "corridor_house", "galary_house"];
                            this.request.buildingClass = ["gostinka"];
                            name += ' Гостинка ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Общежитие') {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.buildingType = ["multisection_house", "singlesection_house", "corridor_house", "galary_house"];
                            this.request.buildingClass = ["dormitory"];
                            name += ' Общежитие ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Комната' || buttonBox.children[i].children[0].innerHTML == 'Квартира') {
                            if (this.request.buildingType.indexOf('multisection_house') == -1) {
                                this.request.buildingType = ["multisection_house", "singlesection_house", "corridor_house", "galary_house", "lowrise_house"];
                                this.request.buildingClass = ["business", "elite", "economy", "new", "improved", "khrushchev", "brezhnev", "stalin", "old_fund",
                                    "small_apartm","dormitory","gostinka","individual"];
                            }
                        }
                    }
                }
                console.log(this.request.offerTypeCode);
            } else if (blockId == 3) {
                if (this.activeButton == 'request') {
                    selected = [];
                    for (let i = 0; i < buttonBox.childNodes.length; i++) {
                        buttonBox.children[i].classList.remove('selected');
                    }
                    buttonBox.children[optionId].classList.add('selected');
                    selected.push(buttonBox.children[optionId].children[0].innerHTML);
                    if (buttonBox.childNodes.length != 0) {
                        if (optionId == 0){ this.request.roomsCount = 1}
                        if (optionId == 1){ this.request.roomsCount = 2}
                        if (optionId == 2){ this.request.roomsCount = 3}
                        if (optionId == 3){ this.request.roomsCount = 4}
                    } else {
                        this.request.roomsCount = undefined;
                    }
                }
                if (selected.length == 1) {
                    name = selected[0];
                }
                if (selected.length > 1) {
                    name = 'от ' + selected[0] + ' до ' + selected[selected.length - 1];
                }
                if (selected.length == 0) {
                    name = '';
                }
            } else if (blockId == 4) {
                if (this.priceMin == 0) {
                    name = 'до ' + (this.priceMax * 1000).toString() + ' рублей';
                }
                if (this.priceMin > 0) {
                    name = 'от ' + (this.priceMin * 1000).toString() + ' до ' + (this.priceMax * 1000).toString() + ' рублей';
                }
            } else if (blockId == 5) {
                switch (optionId) {
                    case 0:
                        this.equipmentFilters.complete = undefined;
                        this.request.conditions.complete = undefined;
                        break;
                    case 1:
                        this.equipmentFilters.living_room_furniture = undefined;
                        this.request.conditions.living_room_furniture = undefined;
                        break;
                    case 2:
                        this.equipmentFilters.kitchen_furniture = undefined;
                        this.request.conditions.kitchen_furniture = undefined;
                        break;
                    case 3:
                        this.equipmentFilters.couchette = undefined;
                        this.request.conditions.couchette = undefined;
                        break;
                    case 4:
                        this.equipmentFilters.bedding = undefined;
                        this.request.conditions.bedding = undefined;
                        break;
                    case 5:
                        this.equipmentFilters.dishes = undefined;
                        this.request.conditions.dishes = undefined;
                        break;
                    case 6:
                        this.equipmentFilters.refrigerator = undefined;
                        this.request.conditions.refrigerator = undefined;
                        break;
                    case 7:
                        this.equipmentFilters.washer = undefined;
                        this.request.conditions.washer = undefined;
                        break;
                    case 8:
                        this.equipmentFilters.microwave_oven = undefined;
                        this.request.conditions.microwave_oven = undefined;
                        break;
                    case 9:
                        this.equipmentFilters.air_conditioning = undefined;
                        this.request.conditions.air_conditioning = undefined;
                        break;
                    case 10:
                        this.equipmentFilters.dishwasher = undefined;
                        this.request.conditions.dishwasher = undefined;
                        break;
                    case 11:
                        this.equipmentFilters.tv = undefined;
                        this.request.conditions.tv = undefined;
                        break;
                }
            } else if (blockId == 6) {
                switch (optionId) {
                    case 0:
                        this.equipmentFilters.with_animals = undefined;
                        this.request.conditions.with_animals = undefined;
                        break;
                    case 1:
                        this.equipmentFilters.with_children = undefined;
                        this.request.conditions.with_children = undefined;
                        break;
                    case 2:
                        this.equipmentFilters.can_smoke = undefined;
                        break;
                    case 3:
                        this.equipmentFilters.activities = undefined;
                        break;
                }
            } else if (blockId == 7) {
                if (name == 'short') {
                    this.filters.rentType = undefined;
                    this.request.rentType = undefined;
                } else if (name == 'long') {
                    this.filters.rentType = undefined;
                    this.request.rentType = undefined;
                }
            } else if (blockId == 8) {
                this.filters.addDate = undefined;
            } else {
                name = '';
                for (let i = 0; i < selected.length; i++) {
                    name += selected[i] + ' ';
                }
            }
            this.changeNameButton(blockId, name, varToChange, '');
        } else {
            buttonBox.children[optionId].classList.add('selected');
            let selected = [];
            if (blockId != 2) {
                for (let i = 0; i < buttonBox.childNodes.length; i++) {
                    if (buttonBox.children[i].classList.contains('selected')) {
                        selected.push(buttonBox.children[i].children[0].innerHTML);
                    }
                }
            }

            if (blockId == 1) {
                for (let i = 0; i < buttonBox.childNodes.length; i++) {
                    buttonBox.children[i].classList.remove('selected');
                }
                buttonBox.children[optionId].classList.add('selected');
                if (optionId == 0) {
                    this.filters.commission = 0;
                    this.request.commission = 0;
                } else if (optionId == 1) {
                    this.filters.commission = 0.00001;
                    this.request.commission = 1;
                } else {
                    this.filters.commission = undefined;
                    this.request.commission = undefined;
                }
            } else if (blockId == 2) {
                selected = [];
                for (let i = 0; i < buttonBox.childNodes.length; i++) {
                    buttonBox.children[i].classList.remove('selected');
                }
                buttonBox.children[optionId].classList.add('selected');
                selected.push(buttonBox.children[optionId].children[0].innerHTML);


                this.request.offerTypeCode = '';
                this.request.buildingType = [];
                this.request.buildingClass = [];
                name = '';
                for (let i = 0; i < buttonBox.childNodes.length; i++) {
                    if (buttonBox.children[i].classList.contains('selected')) {
                        if (buttonBox.children[i].children[0].innerHTML == 'Дом')  {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'single_house';
                            this.request.buildingType = ['lowrise_house'];
                            this.request.buildingClass = ['single_house'];
                            name += ' Дом ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Коттедж')  {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'cottage';
                            this.request.buildingType = ['lowrise_house'];
                            this.request.buildingClass = ['cottage'];
                            name += ' Коттедж ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Дача')  {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'dacha';
                            this.request.buildingType = ['lowrise_house'];
                            this.request.buildingClass = ['dacha'];
                            name += ' Дача ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Комната')  {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'room';
                            name += ' Комната ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Квартира') {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'apartment';
                            name += ' Квартира ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Малосемейка') {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'apartment';
                            this.request.buildingType = ["multisection_house", "singlesection_house", "corridor_house", "galary_house"];
                            this.request.buildingClass = ["small_apartm"];
                            name += ' Малосемейка ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Гостинка') {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.offerTypeCode = 'apartment';
                            this.request.buildingType = ["multisection_house", "singlesection_house", "corridor_house", "galary_house"];
                            this.request.buildingClass = ["gostinka"];
                            name += ' Гостинка ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Общежитие') {
                            selected.push(buttonBox.children[i].children[0].innerHTML);
                            this.request.buildingType = ["multisection_house", "singlesection_house", "corridor_house", "galary_house"];
                            this.request.buildingClass = ["dormitory"];
                            name += ' Общежитие ';
                        }
                        if (buttonBox.children[i].children[0].innerHTML == 'Комната' || buttonBox.children[i].children[0].innerHTML == 'Квартира') {
                            if (this.request.buildingType.indexOf('multisection_house') == -1) {
                                this.request.buildingType = ["multisection_house", "singlesection_house", "corridor_house", "galary_house", "lowrise_house"];
                                this.request.buildingClass = ["business", "elite", "economy", "new", "improved", "khrushchev", "brezhnev", "stalin", "old_fund",
                                    "small_apartm","dormitory","gostinka","individual"];
                            }
                        }
                    }
                }
                // console.log(this.request.offerTypeCode);
            } else if (blockId == 3) {
                if (this.activeButton == 'request') {
                    selected = [];
                    for (let i = 0; i < buttonBox.childNodes.length; i++) {
                        buttonBox.children[i].classList.remove('selected');
                    }
                    buttonBox.children[optionId].classList.add('selected');
                    selected.push(buttonBox.children[optionId].children[0].innerHTML);
                    if (buttonBox.childNodes.length != 0) {
                        if (optionId == 0){ this.request.roomsCount = 1}
                        if (optionId == 1){ this.request.roomsCount = 2}
                        if (optionId == 2){ this.request.roomsCount = 3}
                        if (optionId == 3){ this.request.roomsCount = 4}
                    }
                }

                if (selected.length == 1) {
                    name = selected[0];
                }
                if (selected.length > 1) {
                    name = 'от ' + selected[0] + ' до ' + selected[selected.length - 1];
                }
                if (selected.length == 0) {
                    name = '';
                }
            } else if (blockId == 4) {
                // if (this.activeButton == 'request') {
                //     selected = [];
                //     for (let i = 0; i < buttonBox.childNodes.length; i++) {
                //         buttonBox.children[i].classList.remove('selected');
                //     }
                //     buttonBox.children[optionId].classList.add('selected');
                //     selected.push(buttonBox.children[optionId].children[0].innerHTML);
                //     if (buttonBox.childNodes.length != 0) {
                //         if (optionId == 0){ this.request.ownerPrice = 10}
                //         if (optionId == 1){ this.request.ownerPrice = 20}
                //         if (optionId == 2){ this.request.ownerPrice = 30}
                //         if (optionId == 3){ this.request.ownerPrice = 40}
                //     } else {
                //         this.request.ownerPrice = undefined;
                //     }
                // }
                if (this.priceMin == 0) {
                    name = 'до ' + (this.priceMax * 1000).toString() + ' рублей';
                }
                if (this.priceMin > 0) {
                    name = 'от ' + (this.priceMin * 1000).toString() + ' до ' + (this.priceMax * 1000).toString() + ' рублей';
                }
                // if (selected.length == 1) {
                //     name = 'до ' + selected[0] + ' рублей';
                // }
                // if (selected.length > 1) {
                //     name = 'от ' + selected[0] + ' до ' + selected[selected.length - 1] + ' рублей';
                // }
                // if (selected.length == 0) {
                //     name = '';
                // }
            } else if (blockId == 5) {
                switch (optionId) {
                    case 0:
                        this.equipmentFilters.complete = 1;
                        this.request.conditions.complete = true;
                        break;
                    case 1:
                        this.equipmentFilters.living_room_furniture = 1;
                        this.request.conditions.living_room_furniture = true;
                        break;
                    case 2:
                        this.equipmentFilters.kitchen_furniture = 1;
                        this.request.conditions.kitchen_furniture = true;
                        break;
                    case 3:
                        this.equipmentFilters.couchette = 1;
                        this.request.conditions.couchette = true;
                        break;
                    case 4:
                        this.equipmentFilters.bedding = 1;
                        this.request.conditions.bedding = true;
                        break;
                    case 5:
                        this.equipmentFilters.dishes = 1;
                        this.request.conditions.dishes = true;
                        break;
                    case 6:
                        this.equipmentFilters.refrigerator = 1;
                        this.request.conditions.refrigerator = true;
                        break;
                    case 7:
                        this.equipmentFilters.washer = 1;
                        this.request.conditions.washer = true;
                        break;
                    case 8:
                        this.equipmentFilters.microwave_oven = 1;
                        this.request.conditions.microwave_oven = true;
                        break;
                    case 9:
                        this.equipmentFilters.air_conditioning = 1;
                        this.request.conditions.air_conditioning = true;
                        break;
                    case 10:
                        this.equipmentFilters.dishwasher = 1;
                        this.request.conditions.dishwasher = true;
                        break;
                    case 11:
                        this.equipmentFilters.tv = 1;
                        this.request.conditions.tv = true;
                        break;
                }

            } else if (blockId == 6) {
                switch (optionId) {
                    case 0:
                        this.equipmentFilters.with_animals = 1;
                        this.request.conditions.with_animals = true;
                        break;
                    case 1:
                        this.equipmentFilters.with_children = 1;
                        this.request.conditions.with_children = true;
                        break;
                    case 2:
                        this.equipmentFilters.can_smoke = 1;
                        break;
                    case 3:
                        this.equipmentFilters.activities = 1;
                        break;
                }
            } else if (blockId == 7) {
                switch (optionId) {
                    case 0:
                        this.filters.rentType = 'short';
                        this.request.rentType = 'short';
                        break;
                    case 1:
                        this.filters.rentType = 'long';
                        this.request.rentType = 'long';
                        break;
                }
            } else if (blockId == 8) {
                switch (name) {
                    case '1 день':
                        this.filters.addDate = '1';
                        break;
                    case '3 дня':
                        this.filters.addDate = '3';
                        break;
                    case 'Неделя':
                        this.filters.addDate = '7';
                        break;
                    case '2 недели':
                        this.filters.addDate = '14';
                        break;
                    case 'Месяц':
                        this.filters.addDate = '30';
                        break;
                    case '3 месяца':
                        this.filters.addDate = '90';
                        break;
                }
            } else {
                name = '';
                for (let i = 0; i < selected.length; i++) {
                    if (selected.length > 1) {
                        name += selected[i] + ' ';
                    } else {
                        name += selected[i];
                    }
                }
            }
            this.changeNameButton(blockId, name, varToChange, param);
        }
    }

    changeNameButton(id, name, varToChange, param) {
        switch (varToChange) {
            case 'cityButton': {
                this.filters.city = name;
                break;
            }
            case 'offer': {
                this.filters.contactType = param;
                break;
            }
            case 'typeOfObject': {
                this.filters.typeCode = name;
                break;
            }
            case 'countOfRooms': {
                this.filters.roomsCount = name;
                break;
            }
            case 'cost': {
                this.filters.price = name;
                break;
            }
            case 'sort': {
                console.log(param);
                if (name === 'Дате добавления') {
                    this.sortArray.addDate = param;
                } else if (name === 'Стоимости') {
                    this.sortArray.ownerPrice = param;
                } else if (name === 'Рейтингу') {
                    this.sortArray.finalRaiting = param;
                }
                break;
            }
        }
        this.sendSortFunc();
        this.sendFiltersFunc();
        this.sendEquipmentFunc();
        // this.get_list();
    }

    sendFiltersFunc() {
        this.sendFilters.emit(this.filters);
    }

    sendEquipmentFunc() {
        this.sendEquipment.emit(this.equipmentFilters);
    }

    sendSortFunc() {
        this.sendSort.emit(this.sortArray);
    }

    get_count_cities(city, city_var) {
        let filter = {
            'city': city
        };
        // this._offer_service.list(1, 1,  filter, '', '', '').subscribe(offers => {
        //   city_var = offers.length;
        // });
    }
}
