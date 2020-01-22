import {LOCAL_STORAGE} from '@ng-toolkit/universal';
import {Component, EventEmitter, OnInit, Output, AfterViewInit, Inject, Input} from '@angular/core';
import {Item} from '../../../item';
import ymaps from 'ymaps';
import {ActivatedRoute} from '@angular/router';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';


@Component({
    selector: 'app-filters-mobile',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit, AfterViewInit {
    filtersNum = 0;
    public map: any;
    maps: any;
    city = 'Хабаровск';
    manager = false;
    additional = false;
    offer = false;
    typeOfObject = false;
    countOfRooms = false;
    cityButton = false;
    cost = false;
    sort = false;
    drawActive: boolean;
    polygons: any[] = [];
    nearObjects: any[] = [];
    coordsPolygon: any[] = [];
    yellowCol: any;
    items: Item[] = [];
    canvas: any;
    clearActive = false;
    period = false;
    equipment = false;
    conditions = false;
    parking = false;
    parkingArr: any[] = [];
    costChosen = false;
    food = false;
    education = false;
    fitness = false;
    medicine = false;
    entertainment = false;
    khv: any;
    vld: any;
    geoObject: any;
    kna: any;
    paintProcess: any;
    cafe: any;
    procukty: any;
    supermarket: any;
    market: any;
    restaurant: any;
    canteen: any;
    // type == 'Детские сады' || type == 'Школы' || type == 'Гимназии' || type == 'Техникумы' || type == 'Институты' || type == 'Университеты'
    kindergarten: any;
    school: any;
    gymnasy: any;
    technikum: any;
    institute: any;
    univer: any;
    // type == 'Тренажерные залы' || type == 'Фитнес клубы'
    trenazher: any;
    fitnessClubs: any;
    //type == 'Аптеки' || type == 'Поликлиники' || type == 'Больницы' || type == 'Ветеринарные аптеки' || type == 'Ветеринарные клиники'
    apteka: any;
    poliklinika: any;
    hospital: any;
    vetapteka: any;
    vetklinika: any;
    //  type == 'Кинотеатры' || type == 'Театры' || type == 'Ночной клубы'
    kino: any;
    theater: any;
    nightclub: any;
    circus: any;
    park: any;
    // парковки
    free_parking: any;
    paid_parking: any;
    all_parking: any;
    public clusterer: any;
    filters = {
        'city': undefined,
        'contactType': 'private',                      // тип предложения (комиссия, без комиссии, все)
        'typeCode': String,                        // квартира, комната
        'roomsCount': String,
        'price': String,
        'isMiddleman': String,
        'addDate': undefined,
        'commission': undefined
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
    filtersChoseCount = 0;
    width = document.documentElement.clientWidth;
    @Input() initCoords: any;
    @Input() initZoom: Number;


    @Output() sendFilters = new EventEmitter();
    @Output() sendEquipment = new EventEmitter();
    @Output() sendSort = new EventEmitter();
    @Output() sendMainButtonActive = new EventEmitter();
    @Output() showItemsButtonActive = new EventEmitter();
    @Output() coordsPol = new EventEmitter();
    @Output() countOfItems = new EventEmitter();
    @Output() filtersChosen = new EventEmitter();
    @Output() changedCenter = new EventEmitter();
    @Output() changedZoom = new EventEmitter();
    lat = 48.4862268;
    lng = 135.0826369;

    constructor(@Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute,
                private _offer_service: OfferService,
                private _account_service: AccountService) {
    }

    ngOnInit() {
        this.drawActive = false;
        // this.get_count_cities('Хабаровск', this.khv);
        // this.get_count_cities('Владивосток', this.vld);
        // this.get_count_cities('Комсомольск-на-Амуре', this.kna);
    }

    ngAfterViewInit() {
        document.getElementById('fil-top').scrollIntoView({'block': 'center'});
        this.sendSortFunc();
        this.sendFiltersFunc();
        ymaps.load('https://api-maps.yandex.ru/2.1/?apikey=ADRpG1wBAAAAtIMIVgMAmOY9C0gOo4fhnAstjIg7y39Ls-0AAAAAAAAAAAAbBvdv4mKDz9rc97s4oi4IuoAq6g==&lang=ru_RU&amp;load=package.full').then(maps => {
            this.initMap(maps);
        }).catch(error => console.log('Failed to load Yandex Maps', error));

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
        this.typeOfObject = false;
        this.countOfRooms = false;
        this.cost = false;
        this.equipment = false;
        this.conditions = false;
        this.sort = false;
        this.period = false;
        this.coordsPolygon = [];
        this.coordsPol.emit(this.coordsPolygon);
        this.filtersChoseCount = 0;
        this.filtersChosen.emit('empty');
        this.sendSortFunc();
        this.sendFiltersFunc();
        this.sendEquipmentFunc();
        this.get_list();
    }

    get_list() {
        console.log('get_list filters');
        this.map.geoObjects.removeAll();
        this.items = [];
        if (this.filtersChoseCount == 0) {
            this.filtersChosen.emit('empty');
        } else {
            this.filtersChosen.emit('chose')
        }
        this._offer_service.list(0, 1000, this.filters, this.sort, this.equipmentFilters, this.coordsPolygon, '').subscribe(offers => {
            for (let offer of offers.list) {
                this.items.push(offer);
            }

            this.countOfItems.emit(this.items.length);

            if (this.clusterer != undefined) {
                this.map.geoObjects.remove(this.clusterer);
            }

            this.clusterer = new this.maps.Clusterer({
                preset: 'islands#invertedRedClusterIcons',
                clusterIconColor: '#c50101',
                groupByCoordinates: true,
                clusterDisableClickZoom: true,
                clusterHideIconOnBalloonOpen: false,
                geoObjectHideIconOnBalloonOpen: false
            });
            for (let i = 0; i < this.items.length; i++) {
                let baloon = new this.maps.Placemark([this.items[i].lat, this.items[i].lon], {}, {
                    preset: 'islands#icon',
                    iconColor: '#c50101',
                });
                this.clusterer.add(baloon);
            }
            this.map.geoObjects.add(this.clusterer);
            this.countOfItems.emit(this.items.length);
        });
    }

    initMap(maps) {
        this.maps = maps;
        this.map = new maps.Map('ymapsContainer', {
                center: this.initCoords,
                zoom: this.initZoom,
                controls: ['geolocationControl', 'zoomControl']
            }, {suppressMapOpenBlock: true}
        );
        let mapStyle = document.getElementsByClassName('ymaps-2-1-75-ground-pane') as HTMLCollectionOf<HTMLElement>;
        if (mapStyle.length != 0) {
            mapStyle.item(0).style.setProperty('filter', 'grayscale(.9)');
        }

        let mapdiv = document.getElementById('ymapsContainer');
        document.body.addEventListener('touchstart', function(e) {
            if (e.target == mapdiv) {
                e.preventDefault();
            }
        }, false);
        document.body.addEventListener('touchend', function(e) {
            if (e.target == mapdiv) {
                e.preventDefault();
            }
        }, false);
        document.body.addEventListener('touchmove', function(e) {
            if (e.target == mapdiv) {
                e.preventDefault();
            }
        }, false);
        let coordsArray;
        this.map.events.add('boundschange', e => {
            if (this.filtersChoseCount == 0) this.filtersChoseCount++;
            coordsArray = this.map.getBounds();
            this.changedCenter.emit(this.map.getCenter());
            this.changedZoom.emit(this.map.getZoom());
            this.coordsPolygon = [{lat: coordsArray[0][0], lon: coordsArray[0][1]}, {
                lat: coordsArray[0][0],
                lon: coordsArray[1][1]
            }, {lat: coordsArray[1][0], lon: coordsArray[1][1]}, {lat: coordsArray[1][0], lon: coordsArray[0][1]}];
            this.coordsPol.emit(this.coordsPolygon);
            this.get_list();
        });
        this.get_list();
    }

    clearMap() {
        this.clearActive = false;
        let canvas = <HTMLCanvasElement> document.getElementById('canvas');
        let ctx2d = canvas.getContext('2d');
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.setProperty('display', 'none');
        this.map.behaviors.enable('drag');
        this.map.geoObjects.removeAll();
        this.map.geoObjects.add(this.yellowCol);
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
            if (blockId == 1) {
                this.filters.commission = undefined;
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
            this.filtersChoseCount--;
            this.changeNameButton(blockId, name, varToChange, '');
        } else {
            buttonBox.item(blockId).children[optionId].classList.add('selected');
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

            if (blockId == 1) {
                for (let i = 0; i < buttonBox.item(blockId).childNodes.length; i++) {
                    buttonBox.item(blockId).children[i].classList.remove('selected');
                }
                buttonBox.item(blockId).children[optionId].classList.add('selected');
                if (optionId == 0) {
                    this.filters.commission = 0;
                } else if (optionId == 1) {
                    this.filters.commission = 0.00001;
                } else {
                    this.filters.commission = undefined;
                }
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
            this.filtersChoseCount++;
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
        this.get_list();
        console.log(this.filtersChoseCount);
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

    check() {
        let add_block = document.documentElement.getElementsByClassName('add-block-menu') as HTMLCollectionOf<HTMLElement>;
        if (this.localStorage.getItem('logged_in') != null && this.localStorage.getItem('logged_in') == 'true') {
            add_block.item(1).classList.remove('close');
        } else {
            add_block.item(0).classList.remove('close');
        }
    }
}
