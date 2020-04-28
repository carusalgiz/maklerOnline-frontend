import {LOCAL_STORAGE} from '@ng-toolkit/universal';
import {Component, EventEmitter, OnInit, Output, AfterViewInit, Inject, Input} from '@angular/core';
import {Item} from '../../../class/item';
import ymaps from 'ymaps';
import {ActivatedRoute} from '@angular/router';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
import {Request} from '../../../class/Request';

@Component({
    selector: 'app-filters-mobile',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit, AfterViewInit {
    filtersNum = 0;
    public map: any;
    maps: any;
    priceMin = 0;
    priceMax = 200;
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
    costChosen = false;
    rentType = false;
    food = false;
    khv: any;
    vld: any;
    kna: any;
    paintProcess: any;
    park: any;
    bound_changed = false;
    public clusterer: any;
    map_timer: any;
    filters = {
        'city': undefined,
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
    filtersChoseCount = 0;
    load = false;
    width = document.documentElement.clientWidth;
    request: Request = new Request();

    @Input() initCoords: any;
    @Input() scrollPlace: any;
    @Input() blockMode: any;
    @Input() activeButton: any;


    @Output() sendFilters = new EventEmitter();
    @Output() sendEquipment = new EventEmitter();
    @Output() sendSort = new EventEmitter();
    @Output() coordsPol = new EventEmitter();
    @Output() countOfItems = new EventEmitter();
    @Output() filtersChosen = new EventEmitter();
    @Output() changedCenter = new EventEmitter();
    @Output() changedZoom = new EventEmitter();
    @Output() changedBound = new EventEmitter();
    @Output() requestUpdate = new EventEmitter();
    lat = 48.4862268;
    lng = 135.0826369;

    constructor(private ym: NgxMetrikaService, @Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute,
                private _offer_service: OfferService,
                private _account_service: AccountService) {
    }

    ngOnInit() {
        this.drawActive = false;
        document.addEventListener('touchstart', (event) => {

           let target = event.target as HTMLElement;
           if (target.tagName == 'YMAPS') {
               let coordsArray = this.map.getBounds();
               this.changedCenter.emit(this.map.getCenter());
               this.changedZoom.emit(this.map.getZoom());
               this.coordsPolygon = [{lat: coordsArray[0][0], lon: coordsArray[0][1]}, {
                   lat: coordsArray[0][0],
                   lon: coordsArray[1][1]
               }, {lat: coordsArray[1][0], lon: coordsArray[1][1]}, {lat: coordsArray[1][0], lon: coordsArray[0][1]}];
               this.coordsPol.emit(this.coordsPolygon);
               // if (this.activeButton != 'request') {
                   this.bound_changed = true;
                   this.boundChanged();
               // }

           }
        });
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

    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
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
        this.coordsPolygon = [];
        this.coordsPol.emit(this.coordsPolygon);
        this.filtersChoseCount = 0;
        this.filtersChosen.emit('empty');
        this.request = new Request();
        this.priceMin = 0;
        this.priceMax = 200;
        this.bound_changed = false;
        this.load = false;
        this.boundChanged();
        this.sendSortFunc();
        this.sendFiltersFunc();
        this.sendEquipmentFunc(0);
        this.map.geoObjects.removeAll();
    }
    find_map_request() {
        if (this.activeButton == 'request') {
            this.bound_changed = false;
            this.boundChanged();
        } else {
            this.bound_changed = false; this.load = true; this.get_list();
        }
    }
    get_list() {
        console.log('get_list filters');

        if (this.filtersChoseCount == 0) {
            this.filtersChosen.emit('empty');
        } else {
            this.filtersChosen.emit('chose');
        }
        clearTimeout(this.map_timer);
        this.map_timer = setTimeout(() => {
            this._offer_service.list(0, 1000, this.filters, this.sort, this.equipmentFilters, this.coordsPolygon, '').subscribe(offers => {
                // console.log('timeout filter');

                this.items = [];
                for (let offer of offers.list) {
                    if (this.items.indexOf(offer)) {
                        this.items.push(offer);
                    }
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
                    geoObjectHideIconOnBalloonOpen: false,
                    clusterOpenBalloonOnClick: false
                });
                // console.log(this.items);
                for (let i = 0; i < this.items.length; i++) {
                    let baloon = new this.maps.Placemark([this.items[i].lat, this.items[i].lon], {}, {
                        preset: 'islands#icon',
                        iconColor: '#c50101',
                    });
                    this.clusterer.add(baloon);
                }
                this.map.geoObjects.removeAll();
                this.map.geoObjects.add(this.clusterer);
                this.countOfItems.emit(this.items.length);
                this.load = false;
                this.boundChanged();
            });
        }, 1000);
    }

    initMap(maps) {
        this.maps = maps;
        this.map = new maps.Map('ymapsContainer', {
                center: this.initCoords,
                zoom: 15,
                controls: ['geolocationControl', 'zoomControl']
            }, {suppressMapOpenBlock: true}
        );
        let mapStyle = document.getElementsByClassName('ymaps-2-1-76-ground-pane') as HTMLCollectionOf<HTMLElement>;
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
            console.log(this.activeButton);
            if (this.filtersChoseCount == 0) {
                this.filtersChoseCount++;
            }
            coordsArray = this.map.getBounds();
            this.changedCenter.emit(this.map.getCenter());
            this.changedZoom.emit(this.map.getZoom());
            this.coordsPolygon = [{lat: coordsArray[0][0], lon: coordsArray[0][1]}, {
                lat: coordsArray[0][0],
                lon: coordsArray[1][1]
            }, {lat: coordsArray[1][0], lon: coordsArray[1][1]}, {lat: coordsArray[1][0], lon: coordsArray[0][1]}];
            this.coordsPol.emit(this.coordsPolygon);
            // if (this.activeButton != 'request') {
                this.bound_changed = true;
                this.boundChanged();
            // }
        });
        // this.get_list();
    }

    boundChanged(){
        this.changedBound.emit(this.bound_changed);
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
        this.bound_changed = false;
        this.load = false;
        this.boundChanged();
        this.coordsPolygon = [];
        this.coordsPol.emit(this.coordsPolygon);
        this.map.geoObjects.removeAll();
        console.log('selectopt', blockId, optionId, name, varToChange, param);
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
            this.filtersChoseCount--;
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
            this.filtersChoseCount++;
            this.changeNameButton(blockId, name, varToChange, param);
        }
        // console.log(this.request.offerTypeCode);
        this.request.searchArea = this.coordsPolygon;
        this.requestUpdate.emit(this.request);

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
        this.sendEquipmentFunc(id);

        // this.get_list();
        // console.log(this.filtersChoseCount);
    }

    sendFiltersFunc() {
        this.sendFilters.emit(this.filters);
    }

    sendEquipmentFunc(id) {
        this.sendEquipment.emit(this.equipmentFilters);
        setTimeout(() => {
            if (this.filtersChoseCount == 0 && id != 4) {
                this.filtersChosen.emit('empty');
            } else {
                this.filtersChosen.emit('chose');
            }
        }, 200);

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
