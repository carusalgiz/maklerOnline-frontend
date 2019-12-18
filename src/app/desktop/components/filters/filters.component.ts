import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
    constructor() {
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
    parking = false;
    costChosen = false;
    // инфраструктура на карте
    food = false;
    education = false;
    fitness = false;
    medicine = false;
    entertainment = false;
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
        'addDate': undefined
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
        this.filters.city = '';
        this.filters.contactType = 'private';
        this.filters.typeCode = undefined;
        this.filters.roomsCount = undefined;
        this.filters.price = undefined;
        this.filters.addDate = undefined;
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

        this.sendSortFunc();
        this.sendFiltersFunc();
        this.sendEquipmentFunc();
    }

    selectOption(blockId, optionId, name, varToChange, param) {
        let buttonBox = document.getElementsByClassName('filters-options-box') as HTMLCollectionOf<HTMLElement>;
        if (buttonBox.item(blockId).children[optionId].classList.contains('selected')) {
            buttonBox.item(blockId).children[optionId].classList.remove('selected');
            let selected = [];
            for (let i = 0; i < buttonBox.item(blockId).childNodes.length; i++) {
                if (buttonBox.item(blockId).children[i].classList.contains('selected')) {
                    if (buttonBox.item(blockId).children[i].children[0].innerHTML == 'Дом/Коттедж/Дача') {
                        selected.push('Дом Коттедж Дача');
                    } else {
                        selected.push(buttonBox.item(blockId).children[i].children[0].innerHTML);
                    }
                }
            }
            if (blockId == 9 || blockId == 10 || blockId == 11 || blockId == 12 || blockId == 13 || blockId == 14) {
                this.searchInCity.emit(this.filters.city + ',' + name + ',delete');
            }

            if (blockId == 1) {
                this.filters.isMiddleman = undefined;
            } else if (blockId == 3) {
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
                if (selected.length == 1) {
                    name = 'до ' + selected[0] + ' рублей';
                }
                if (selected.length > 1) {
                    name = 'от ' + selected[0] + ' до ' + selected[selected.length - 1] + ' рублей';
                }
                if (selected.length == 0) {
                    name = '';
                }
            } else if (blockId == 5) {
                switch (optionId) {
                    case 0:
                        this.equipmentFilters.complete = undefined;
                        break;
                    case 1:
                        this.equipmentFilters.living_room_furniture = undefined;
                        break;
                    case 2:
                        this.equipmentFilters.kitchen_furniture = undefined;
                        break;
                    case 3:
                        this.equipmentFilters.couchette = undefined;
                        break;
                    case 4:
                        this.equipmentFilters.bedding = undefined;
                        break;
                    case 5:
                        this.equipmentFilters.dishes = undefined;
                        break;
                    case 6:
                        this.equipmentFilters.refrigerator = undefined;
                        break;
                    case 7:
                        this.equipmentFilters.washer = undefined;
                        break;
                    case 8:
                        this.equipmentFilters.microwave_oven = undefined;
                        break;
                    case 9:
                        this.equipmentFilters.air_conditioning = undefined;
                        break;
                    case 10:
                        this.equipmentFilters.dishwasher = undefined;
                        break;
                    case 11:
                        this.equipmentFilters.tv = undefined;
                        break;
                }
            } else if (blockId == 6) {
                switch (optionId) {
                    case 0:
                        this.equipmentFilters.with_animals = undefined;
                        break;
                    case 1:
                        this.equipmentFilters.with_children = undefined;
                        break;
                    case 2:
                        this.equipmentFilters.can_smoke = undefined;
                        break;
                    case 3:
                        this.equipmentFilters.activities = undefined;
                        break;
                }
            } else if (blockId == 7) {
                if (name == 'дате') {
                    this.sortArray.addDate = undefined;
                } else if (name == 'цене') {
                    this.sortArray.ownerPrice = undefined;
                } else if (name == 'рейтингу') {
                    this.sortArray.finalRaiting = undefined;
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
            buttonBox.item(blockId).children[optionId].classList.add('selected');
            let selected = [];
            if (blockId == 9 || blockId == 10 || blockId == 11 || blockId == 12 || blockId == 13 || blockId == 14) {
                this.searchInCity.emit(this.filters.city + ',' + name + ',add');
            }

            for (let i = 0; i < buttonBox.item(blockId).childNodes.length; i++) {
                if (buttonBox.item(blockId).children[i].classList.contains('selected')) {
                    if (buttonBox.item(blockId).children[i].children[0].innerHTML == 'Дом/Коттедж/Дача') {
                        selected.push('Дом Коттедж Дача');
                    } else {
                        selected.push(buttonBox.item(blockId).children[i].children[0].innerHTML);
                    }

                }
            }

            if (blockId == 1) {
                this.filters.isMiddleman = param;
            } else if (blockId == 3) {
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
                if (selected.length == 1) {
                    name = 'до ' + selected[0] + ' рублей';
                }
                if (selected.length > 1) {
                    name = 'от ' + selected[0] + ' до ' + selected[selected.length - 1] + ' рублей';
                }
                if (selected.length == 0) {
                    name = '';
                }
            } else if (blockId == 5) {
                switch (optionId) {
                    case 0:
                        this.equipmentFilters.complete = 1;
                        break;
                    case 1:
                        this.equipmentFilters.living_room_furniture = 1;
                        break;
                    case 2:
                        this.equipmentFilters.kitchen_furniture = 1;
                        break;
                    case 3:
                        this.equipmentFilters.couchette = 1;
                        break;
                    case 4:
                        this.equipmentFilters.bedding = 1;
                        break;
                    case 5:
                        this.equipmentFilters.dishes = 1;
                        break;
                    case 6:
                        this.equipmentFilters.refrigerator = 1;
                        break;
                    case 7:
                        this.equipmentFilters.washer = 1;
                        break;
                    case 8:
                        this.equipmentFilters.microwave_oven = 1;
                        break;
                    case 9:
                        this.equipmentFilters.air_conditioning = 1;
                        break;
                    case 10:
                        this.equipmentFilters.dishwasher = 1;
                        break;
                    case 11:
                        this.equipmentFilters.tv = 1;
                        break;
                }

            } else if (blockId == 6) {
                switch (optionId) {
                    case 0:
                        this.equipmentFilters.with_animals = 1;
                        break;
                    case 1:
                        this.equipmentFilters.with_children = 1;
                        break;
                    case 2:
                        this.equipmentFilters.can_smoke = 1;
                        break;
                    case 3:
                        this.equipmentFilters.activities = 1;
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
