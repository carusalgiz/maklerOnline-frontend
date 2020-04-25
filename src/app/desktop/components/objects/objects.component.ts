import {LOCAL_STORAGE, WINDOW} from '@ng-toolkit/universal';
import {AfterViewInit, Component, OnInit, Inject, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';
import {Item} from '../../../item';
import {ActivatedRoute} from '@angular/router';
import {OfferService} from '../../../services/offer.service';
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
import ymaps from 'ymaps';
import {Router} from "@angular/router";
import {AccountService} from '../../../services/account.service';
@Component({
    selector: 'app-objects',
    templateUrl: './objects.component.html',
    styleUrls: ['./objects.component.css']
})
export class ObjectsComponent implements OnInit, AfterViewInit {

    private subscription: Subscription;
    galleryFullItem = false;
    listscroll = 0;
    scrollArr = [];
    panoramaActive = false;
    maps: any;
    public map: any;
    public clusterer: any;
    items: Item[] = [];
    countOfObjects = 0;
    favItems: Item[] = [];
    item: Item;
    geoObject: any;
    historyItems: any[] = [];
    listMode = true;
    filtersInnerActive: boolean;
    itemOpen = false;
    watched: boolean;
    filtersMenuActive: boolean;
    itemsActive: boolean;
    filtersActive = true;
    watchedItems: any[] = [];
    time: any[] = [];
    sort: any;
    historyActive = false;
    id: number;
    checkFilt = false;
    width: number;
    activeButton: string;
    widthPhoto = 610; // ширина изображения
    count = 1; // количество изображений
    position = 0;
    number = 1;
    coords = [0, 0];
    nearObjects: any[] = [];
    nrObjs: any[] = [];
    drawActive = false;
    paintProcess: any;
    polygons: any[] = [];
    clearActive = false;
    filters: any;
    equipment: any;
    coordsPolygon: any[] = [];
    logged_in: boolean = false;
    activeBalloon: any;
    public selectedMarker: any;
    find_obj_check = false;
    objClickIterator = 0;
    curItem: Item;
    payed: boolean = false;
    pagecounter = 0;
    polygonActive = false;
    hitsCount: number = 0;
    canLoad: number = 0;
    searchQuery: string = "";
    suggestionTo: any;
    sgList: string[] = [];
    galleryType: any;

    constructor(private ym: NgxMetrikaService, @Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute, private router: Router,
                private _offer_service: OfferService,
                private _account_service: AccountService) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => {
            return false;
        };
        let url = document.location.href;
        if (url.indexOf('access') != -1) {
            let str = (url.slice(url.indexOf('access')+6, url.length)).split('&');
            let p = str[1];
            let s = str[2];
            console.log(str);
        }
        this.subscription = route.params.subscribe((urlParams) => {
             if (urlParams['mode'] === 'list') {
                 this.historyActive = false;
                 this.filtersActive = true;
                 this.itemOpen = false;
                 this.activeButton = 'items';
                 this.itemsActive = true;
                 this.get_list(1000, 'constructor')
             }
        });
    }

    ngOnInit() {
        if ((this.item === undefined || this.item === null) && this.itemOpen === true) {
            this.filtersActive = true;
        }
        this.width = document.documentElement.clientWidth;
    }

    ngAfterViewInit() {
        let item = document.getElementsByClassName('total-padding').item(0) as HTMLElement;
        item.style.setProperty('width', '460px');
        let items = document.getElementsByClassName('menuBlock') as HTMLCollectionOf<HTMLElement>;
        items.item(1).style.setProperty('border-top', '5px solid #821529');
        items.item(1).style.setProperty('font-weight', 'bold');

        let objects = document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        if (objects.length != 0) {
            this.widthPhoto = objects.item(0).offsetWidth;
        }
        ymaps.load('https://api-maps.yandex.ru/2.1/?apikey=c9d5cf84-277c-4432-a839-2e371a6f2e21&lang=ru_RU&amp;load=package.full').then(maps => {
            this.initMap(maps);
            setTimeout(() => {
                if (this.item != undefined) {
                    this.openMarker(this.item);
                }
                let mapContainer = document.getElementsByClassName('ymaps-2-1-76-map') as HTMLCollectionOf<HTMLElement>;
                for (let i = 0; i < mapContainer.length; i++) {
                    mapContainer.item(i).style.setProperty('width', '100% !important');
                    mapContainer.item(i).style.setProperty('height', '100% !important');
                }
                this.map.container.fitToViewport();
            }, 300);
        });
        if (this.localStorage.length != 0) {
            this.watchedItems = [];
            this.historyItems = [];
            for (let i = 0; i < this.localStorage.length; i++) {
                this.watchedItems.push(this.localStorage.key(i));
            }
            for (let i = 0; i < this.localStorage.length; i++) {
                this.historyItems.push(this.items[Number(this.localStorage.key(i))]);
            }
        }
        let itemsMenu = document.getElementsByClassName('menuBlock') as HTMLCollectionOf<HTMLElement>;
        if (itemsMenu.length !== 0) {
            for (let i = 0; i < itemsMenu.length; i++) {
                if (i !== 1) {
                    itemsMenu.item(i).style.removeProperty('border-top');
                    itemsMenu.item(i).style.removeProperty('font-weight');
                } else {
                    itemsMenu.item(i).style.setProperty('border-top', '5px solid #821529');
                    itemsMenu.item(i).style.setProperty('font-weight', 'bold');
                }
            }
        }
    }

    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }
    openGallery(obj, event) {
        this.item = obj;
        this.galleryFullItem = event;
        this.itemOpen = true;
        this.activeButton = 'obj';
        this.galleryType = 'list';
    }
    searchStringChanged(e) {
        let c = this;
        clearTimeout(this.suggestionTo);
        this.suggestionTo = setTimeout(() => {
            c.searchParamChanged();
        }, 500);
    }
    searchParamChanged() {
        if (this.searchQuery.length > 0) {
            let sq = this.searchQuery.split(" ");
            let lp = sq.pop()
            let q = sq.join(" ");
            this.sgList = [];
            if (lp.length > 0) {
                // запросить варианты
                this._offer_service.listKeywords(this.searchQuery).subscribe(sgs => {
                    sgs.forEach(ev => {
                        this.sgList.push(ev);
                    });
                });
            }
        }
        this.pagecounter = 0;
        this.update_list(10000, 'filters');
    }
    changeLog(ev: any) {
        this.logged_in = ev;
    }

    changePay(ev: any) {
        this.payed = ev;
    }
    modeChange(type){
        this.closeBlock('item');
        localStorage.setItem('listType', type);
        switch (type) {
            case 'fav': {
                this.activeButton = 'fav';
                this.itemsActive = false;
                this.listMode = true;
                break;
            }
            case 'items': {
                this.activeButton = 'items';
                this.itemsActive = true;
                this.historyClose();
                this.listMode = true;
                this.itemOpen = false;
                break;
            }
        }
    }

    listActive() {
        setTimeout(() => {
            let mapContainer = document.getElementsByClassName('ymaps-2-1-76-map') as HTMLCollectionOf<HTMLElement>;
            for (let i = 0; i < mapContainer.length; i++) {
                mapContainer.item(i).style.setProperty('width', '100% !important');
                mapContainer.item(i).style.setProperty('height', '100% !important');
            }
            this.map.container.fitToViewport();
        }, 50);

    }

    panorama(typePan) {
        if (typePan == 'open') {
            this.map.getPanoramaManager().then(manager => {
                manager.enableLookup();
            });
        }
        if (typePan == 'close') {
            this.map.getPanoramaManager().then(manager => {
                manager.disableLookup();
                manager.closePlayer();
            });
        }
    }

    paintOnMap() {
        this.map.behaviors.disable('drag');
        let style = {
            strokeColor: '#252f32',
            strokeOpacity: 0.7,
            strokeWidth: 3,
            fillColor: '#252f32',
            fillOpacity: 0.4
        };

        let pane = new this.maps.pane.EventsPane(this.map, {
            css: {position: 'absolute', width: '100%', height: '100%'},
            zIndex: 550,
            transparent: true
        });

        this.map.panes.append('ext-paint-on-map', pane);

        let canvas = document.createElement('canvas');
        let ctx2d = canvas.getContext('2d');
        let rect = this.map.container.getParentElement().getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx2d.globalAlpha = style.strokeOpacity;
        ctx2d.strokeStyle = style.strokeColor;
        ctx2d.lineWidth = style.strokeWidth;

        canvas.style.width = '100%';
        canvas.style.height = '100%';

        pane.getElement().appendChild(canvas);
        let coordinates: any[] = [];
        let bounds = this.map.getBounds();
        let latDiff = bounds[1][0] - bounds[0][0];
        let lonDiff = bounds[1][1] - bounds[0][1];

        canvas.onmousemove = function (e) {
            coordinates.push([e.offsetX, e.offsetY]);

            ctx2d.clearRect(0, 0, canvas.width, canvas.height);
            ctx2d.beginPath();

            ctx2d.moveTo(coordinates[0][0], coordinates[0][1]);
            for (let i = 1; i < coordinates.length; i++) {
                ctx2d.lineTo(coordinates[i][0], coordinates[i][1]);
            }

            ctx2d.stroke();

        }.bind(this);
        return {
            finishPaintingAt: () => {
                this.map.panes.remove(pane);
                let calc = Math.floor(coordinates.length / 30);
                let coords: any[] = [];
                for (let i = 0; i < coordinates.length; i++) {
                    if (i % calc == 0) {
                        let lon = bounds[0][1] + (coordinates[i][0] / canvas.width) * lonDiff;
                        let lat = bounds[0][0] + (1 - coordinates[i][1] / canvas.height) * latDiff;
                        coords.push([lat, lon]);
                    }
                }
                return coords;
            }
        };
    }

    initMap(maps) {
        this.maps = maps;
        this.map = new maps.Map('filters-map-map1', {
                center: [48.4862268, 135.0826369],
                zoom: 15,
                controls: ['geolocationControl']
            }, {suppressMapOpenBlock: true}
        );
        let mapStyle = document.getElementsByClassName('ymaps-2-1-76-ground-pane') as HTMLCollectionOf<HTMLElement>;
        if (mapStyle.length != 0) {
            mapStyle.item(0).style.setProperty('filter', 'grayscale(.9)');
        }

        this.map.events.add('mousedown', () => {
            if (this.drawActive) {
                this.coordsPolygon = [];
                if (this.geoObject != undefined) {
                    this.map.geoObjects.remove(this.geoObject);
                }
                this.paintProcess = this.paintOnMap();
            }
        });

        // Подпишемся на событие отпускания кнопки мыши.
        this.map.events.add('mouseup', () => {
            if (this.paintProcess) {
                this.pagecounter = 0;
                let coordinates = this.paintProcess.finishPaintingAt();
                for (let i = 0; i < coordinates.length; i++) {
                    this.coordsPolygon.push({lat: coordinates[i][0], lon: coordinates[i][1]});
                }
                this.paintProcess = null;
                let style = {
                    strokeColor: '#252f32',
                    strokeOpacity: 0.7,
                    strokeWidth: 3,
                    fillColor: '#252f32',
                    fillOpacity: 0.4
                };
                if (this.drawActive) {
                    this.geoObject = new this.maps.Polygon([coordinates], {}, style);
                }
                this.map.geoObjects.add(this.geoObject);
                if (coordinates.length != 0) {
                    this.polygons.push(this.geoObject);
                    this.items = [];
                    this._offer_service.list(0, 10000, this.filters, this.sort, this.equipment, this.coordsPolygon, this.searchQuery).subscribe(offers => {
                        for (let offer of offers.list) {
                            if (this.items.indexOf(offer) == -1) {
                                this.items.push(offer);
                            }
                        }
                        for (let i = 0; i < this.items.length; i++) {
                            if (this.watchedItems.indexOf(this.items[i].id) != -1) {
                                this.items[i].watched = true;
                            }
                        }
                        this.polygonActive = true;
                        this.redrawObjectsOnMap(this.items, 'paint');
                    });
                } else {
                    this.panorama('close');
                    this.coordsPolygon = [];
                    this.drawActive = false;
                    this.clearActive = false;
                    this.panoramaActive = false;
                }
                this.map.behaviors.enable('drag');
            }
            this.drawActive = false;
        });
    }

    clearMap() {
        this.polygonActive = false;
        this.geoObject = null;
        this.map.geoObjects.removeAll();
        this.coordsPolygon = [];
        this.pagecounter = 0;
        this.items = [];
        this.get_favObjects();
        if (this.localStorage.length != 0) {
            this.watchedItems = [];
            for (let i = 0; i < this.localStorage.length; i++) {
                this.watchedItems.push(Number(this.localStorage.getItem(i)));
            }
        }
        this.canLoad = 1;
        this._offer_service.list(this.pagecounter, 100, this.filters, this.sort, this.equipment, this.coordsPolygon,this.searchQuery).subscribe(data => {
            console.log(data);
            this.countOfObjects = data.hitsCount;
            this.hitsCount = data.hitsCount || (this.hitsCount > 0 ? this.hitsCount : 0);
            if (this.pagecounter == 0) {
                this.items = data.list;
            } else {
                data.list.forEach(i => {
                    this.items.push(i);
                });
                if(~~(this.hitsCount/20) != this.pagecounter+1 && data.list.length < 20){
                    this.hitsCount -= (20 - data.list.length);
                }
            }
            for (let i = 0; i < this.items.length; i++) {
                if (this.watchedItems.indexOf(this.items[i].id) != -1) {
                    this.items[i].watched = true;
                }
            }
            for (let i = 0; i < this.favItems.length; i++) {
                for (let j = 0; j < this.items.length; j++) {
                    if (this.favItems[i].id == this.items[j].id) {
                        console.log(this.items[j]);
                        this.items[j].is_fav = true;
                        this.items[j].watched = true;
                    }
                }
            }
            this.canLoad = 0;
        }),err => {
            console.log(err);
            this.canLoad = 0;
        };
        this.find_obj_check = false;
    }

    markerFocus(id) {
        if (!this.itemOpen) {
            let catalog = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
            let objects = document.getElementsByClassName('objects') as HTMLCollectionOf<HTMLElement>;
            for (let i = 0; i < catalog.length; i++) {
                catalog.item(i).style.removeProperty('box-shadow');
                catalog.item(i).style.removeProperty('position');
                catalog.item(i).style.removeProperty('top');
                catalog.item(i).style.removeProperty('padding-top');
                catalog.item(i).style.removeProperty('border-bottom');
            }
            for (let i = 0; i < objects.length; i++) {
                objects.item(i).style.removeProperty('background-color');
            }
            let el = document.getElementById(id) as HTMLElement;
            // el.scrollIntoView(true);
            if (el != undefined) {
                el.style.setProperty('box-shadow', '0 3px 4px 5px #d3d5d6');
                el.style.setProperty('position', 'relative');
                el.style.setProperty('top', '-1px');
                el.style.setProperty('padding-top', '1px');
                el.style.setProperty('border-bottom', 'none');
                // break;
                el.scrollIntoView(true);
            }
        }
    }

    openMarker(item: Item) {
        let countOfSelected = 0;
        this.map.geoObjects.remove(this.selectedMarker);
        this.selectedMarker = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#c50101',
            groupByCoordinates: true,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
       // this.defineobj(item);
        this.markerFocus(item.id);

        this.selectedMarker.events.add('balloonopen', () => {
            let custertab = document.getElementsByClassName('ymaps-2-1-76-b-cluster-tabs__section') as HTMLCollectionOf<HTMLElement>;
            let baloon_content = document.getElementsByClassName('ymaps-2-1-76-balloon__content') as HTMLCollectionOf<HTMLElement>;
            let baloonlayout = document.getElementsByClassName('ymaps-2-1-76-balloon__layout') as HTMLCollectionOf<HTMLElement>;
            let baloonmenu = document.getElementsByClassName('ymaps-2-1-76-b-cluster-tabs__menu') as HTMLCollectionOf<HTMLElement>;
            let mainBaloon = document.getElementsByClassName('ymaps-2-1-76-balloon') as HTMLCollectionOf<HTMLElement>;
            for (let k = 0; k < mainBaloon.length; k++) {
                mainBaloon.item(k).style.setProperty('top', '-150px');
                mainBaloon.item(k).style.setProperty('max-width', '465px');
                mainBaloon.item(k).style.setProperty('max-height', '125px');
            }
            for (let i = 0; i < custertab.length; i++) {
                custertab.item(i).style.setProperty('max-height', '135px');
            }
            for (let i = 0; i < baloon_content.length; i++) {
                baloon_content.item(i).style.setProperty('max-height', '135px');
            }
            for (let i = 0; i < baloonlayout.length; i++) {
                baloonlayout.item(i).style.setProperty('max-height', '125px');
            }
            for (let i = 0; i < baloonmenu.length; i++) {
                baloonmenu.item(i).style.setProperty('max-height', '110px');
            }
        });
        let selectedBallon: any;
        let index = 0;
       // for (let i = 0; i < this.items.length; i++) {

      //      if (item.lat == this.items[i].lat && item.lon == this.items[i].lon) {
                countOfSelected++;
                let photo, rooms, floor, floorsCount, square: any;
                if (item.roomsCount != undefined) {
                    rooms = item.roomsCount;
                } else {
                    rooms = '';
                }
                if (item.floor != undefined) {
                    floor = item.floor;
                } else {
                    floor = '';
                }
                if (item.floorsCount != undefined) {
                    floorsCount = item.floorsCount;
                } else {
                    floorsCount = '';
                }
                if (item.squareTotal != undefined) {
                    square = item.squareTotal;
                } else {
                    square = '';
                }
                if (item.photos == undefined) {
                    photo = 'url(https://makleronline.net/assets/noph.png)';
                } else {

                    if (item.photos[0] != undefined) {
                        photo = 'url(' + item.photos[0].href + ')';
                    } else {
                        photo = 'url(https://makleronline.net/assets/noph.png)';
                    }
                }
                let formattedPrice = item.price.toString();
                formattedPrice = formattedPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        let obj_type = '';
        switch (item.typeCode) {
            case 'apartment': obj_type = 'Квартира'; break;
            case 'house': obj_type = 'Дом'; break;
            case 'dacha': obj_type = 'Дача'; break;
            case 'cottage': obj_type = 'Коттедж'; break;
            case 'room': obj_type = 'Комната'; break;
        }
        let addr = item.address;
        if (!item.address.includes('ул.')) {
            addr = 'ул. ' + item.address.toUpperCase() + ' ' + item.house_num.toUpperCase();
        } else {
            addr = item.address.toUpperCase() + ' ' + item.house_num.toUpperCase();
        }
        let baloon = new this.maps.Placemark([item.lat, item.lon], {
                    name: item.id,
                    balloonContentHeader: '<span style="font-family: OpenSansBold, sans-serif;margin-top: 13px; font-size: 12px;letter-spacing: 0;">' + addr + '</span>',
                    balloonContentBody: '<div style="display: flex;height: 100%;width: fit-content">' +
                        ' <div style="margin-right: 15px; height: 80px; width: 110px;    background-position-x: center;background-position-y: center;background-repeat: no-repeat; background-size: 140% auto; background-image:' + photo + '"></div> <div style="display: flex; flex-direction: column;font-family: Cadillac, sans-serif;' +
                        'font-size: 14px;">' +
                        // '<span style="font-family: OpenSansBold;margin-top: 7px; font-size: 12px">' + item.address + ' ' + item.house_num + '</span>' +
                        '<div style="display: flex;font-family: OpenSans; font-size: 12px;padding: 0 30px 0 0 ;height: 15px;letter-spacing: 0;"><div style="width: 75px">' + obj_type +'</div><div style="min-width: 85px;">' + rooms + ' комнатная</div></div>' +
                        '<div style="display: flex;font-family: OpenSans; font-size: 12px;padding: 0;height: 15px;letter-spacing: 0;"><div style="width: 75px">Этаж</div><div>' + floor + '/' + floorsCount + '</div></div>' +
                        '<div style="display: flex;font-family: OpenSans; font-size: 12px; padding-bottom: 5px;height: 15px;letter-spacing: 0;"><div style="width: 75px">Площадь</div><div>' + square + ' кв. м</div></div>' +
                        '<div style="display: flex;font-family: OpenSans; font-size: 12px"><div style="width: 75px;letter-spacing: 0;">Стоимость</div><span style="font-family: OpenSansBold">' + formattedPrice + ' Р/МЕС</span></div></div>'
                }, {
                    preset: 'islands#icon',
                    iconColor: '#c50101',
                });
                baloon.events.add("balloonopen", () => {
                    this.activeBalloon = baloon;
                    let baloonlayout = document.getElementsByClassName('ymaps-2-1-76-balloon__layout') as HTMLCollectionOf<HTMLElement>;
                    let baloon_content = document.getElementsByClassName('ymaps-2-1-76-balloon__content') as HTMLCollectionOf<HTMLElement>;
                    let mainBaloon = document.getElementsByClassName('ymaps-2-1-76-balloon') as HTMLCollectionOf<HTMLElement>;

                    for (let k = 0; k < mainBaloon.length; k++) {
                        mainBaloon.item(k).style.setProperty('top', '-150px');
                    }
                    for (let k = 0; k < baloon_content.length; k++) {
                        baloon_content.item(k).style.setProperty('padding-top', '5px');
                        baloon_content.item(k).style.setProperty('height', '100%');
                        let inner = baloon_content[k].children[0] as HTMLElement;
                        inner.style.setProperty('height', '100%');
                    }
                    for (let k = 0; k < baloonlayout.length; k++) {
                        baloonlayout.item(k).style.setProperty('height', '120px');
                    }
                    let cross =  document.getElementsByClassName('ymaps-2-1-76-balloon__close-button') as HTMLCollectionOf<HTMLElement>;
                    for (let k = 0; k < cross.length; k++) {
                        cross.item(k).style.setProperty('width', '16px');
                        cross.item(k).style.setProperty('height', '16px');
                        cross.item(k).style.setProperty('margin-right', '12px');
                        cross.item(k).style.setProperty('margin-top', '12px');
                    }
                    this.markerFocus(item.id);
                });
                baloon.events.add("balloonclose", () => {
                    let catalog = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
                    let objects = document.getElementsByClassName('objects') as HTMLCollectionOf<HTMLElement>;
                    for (let k = 0; k < catalog.length; k++) {
                        catalog.item(k).style.removeProperty('background-color');
                        catalog.item(k).style.removeProperty('position');
                        catalog.item(k).style.removeProperty('top');
                        catalog.item(k).style.removeProperty('padding-top');
                        catalog.item(k).style.removeProperty('border-bottom');
                    }
                    for (let k = 0; k < objects.length; k++) {
                        objects.item(k).style.removeProperty('background-color');
                    }
                });
                baloon.events.add("mouseup", () => {
                    this.map.setCenter([item.lat, item.lon], 15, {
                        duration: 500
                    });
                });
                this.selectedMarker.add(baloon);
                if (item.id == item.id) {
                    selectedBallon = baloon;
                  //  index = i;
                }
                let objectState1 = this.selectedMarker.getObjectState(baloon);
               // if (i != index) {
                    if (objectState1.isClustered) {
                        objectState1.cluster.events.add("click", () => {
                            // console.log("index: ", i);
                            this.markerFocus(item.id);
                        });
                    }
              //  }
        //    }
      // }
        this.selectedMarker.events.add("balloonclose", () => {
            let catalog = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
            let objects = document.getElementsByClassName('objects') as HTMLCollectionOf<HTMLElement>;
            for (let k = 0; k < catalog.length; k++) {
                catalog.item(k).style.removeProperty('background-color');
                catalog.item(k).style.removeProperty('position');
                catalog.item(k).style.removeProperty('top');
                catalog.item(k).style.removeProperty('padding-top');
                catalog.item(k).style.removeProperty('border-bottom');
            }
            for (let k = 0; k < objects.length; k++) {
                objects.item(k).style.removeProperty('background-color');
            }
        });
        this.map.geoObjects.add(this.selectedMarker);
        let objectState = this.selectedMarker.getObjectState(selectedBallon);
        if (objectState.isClustered) {
            objectState.cluster.events.add("click", () => {
                this.markerFocus(item.id);
            });
            objectState.cluster.events.add("balloonclose", () => {
                let catalog = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
                let objects = document.getElementsByClassName('objects') as HTMLCollectionOf<HTMLElement>;
                for (let k = 0; k < catalog.length; k++) {
                    catalog.item(k).style.removeProperty('background-color');
                    catalog.item(k).style.removeProperty('position');
                    catalog.item(k).style.removeProperty('top');
                    catalog.item(k).style.removeProperty('padding-top');
                    catalog.item(k).style.removeProperty('border-bottom');
                }
                for (let k = 0; k < objects.length; k++) {
                    objects.item(k).style.removeProperty('background-color');
                }
            });
            objectState.cluster.state.set('activeObject', selectedBallon);
            this.selectedMarker.balloon.open(objectState.cluster);
        } else {
            this.map.setCenter([item.lat, item.lon]);
            selectedBallon.balloon.open();
            this.defineobj(item);
        }
    }

    selectbj() {
        let catalog = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
        let objects = document.getElementsByClassName('objects') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < catalog.length; i++) {
            catalog.item(i).style.removeProperty('position');
            catalog.item(i).style.removeProperty('top');
            catalog.item(i).style.removeProperty('padding-top');
            catalog.item(i).style.removeProperty('border-bottom');
        }
        for (let i = 0; i < objects.length; i++) {
            objects.item(i).style.removeProperty('background-color');
        }
        let elem = event.composedPath();
        // console.log(elem);
        for (let i = 0; i < elem.length; i++) {
            let el = elem[i] as HTMLElement;
            if (el.classList != undefined && el.classList.contains('catalog-item') && el.classList.contains('hovered')) {
                el.scrollTop = el.scrollHeight;
                el.style.setProperty('position', 'relative');
                el.style.setProperty('top', '-1px');
                el.style.setProperty('padding-top', '1px');
                el.style.setProperty('border-bottom', 'none');
                // break;
            }
            if (el.classList != undefined && el.classList.contains('objects') && el.classList.contains('hovered')) {
                el.scrollTop = el.scrollHeight;
            }
        }
    }

    focusOnObject(event: MouseEvent, item: Item, index, array) {
        this.objClickIterator++;
        let targ = event.target as HTMLElement;
        if (this.objClickIterator == 1 && !targ.classList.contains('starFav') && !targ.classList.contains('starImg') //&& targ.tagName != 'IMG'
            && !targ.classList.contains('arrow') && !targ.classList.contains('arrowFull') && !targ.classList.contains('button-contact') && !targ.classList.contains('magnifier')) {
            this.curItem = item;
            this.map.setZoom(17);
            this.map.setCenter([item.lat, item.lon]);
            setTimeout(() => {
                this.openMarker(item);
            }, 200);
            this.selectbj();
        } else if (this.objClickIterator == 2 && !targ.classList.contains('starFav') && !targ.classList.contains('starImg') // && targ.tagName != 'IMG'
            && item != this.curItem && !targ.classList.contains('arrow') && !targ.classList.contains('arrowFull') && !targ.classList.contains('button-contact') && !targ.classList.contains('magnifier')) {
            // console.log('second');
            this.objClickIterator = 0;
            this.map.setZoom(17);
            this.curItem = item;
            this.map.setCenter([item.lat, item.lon]);
            setTimeout(() => {
                this.openMarker(item);
            }, 200);
            this.selectbj();
        } else if (this.objClickIterator == 2 && item == this.curItem && !targ.classList.contains('starFav') && !targ.classList.contains('starImg') // && targ.tagName != 'IMG'
            && !targ.classList.contains('arrow') && !targ.classList.contains('arrowFull') && !targ.classList.contains('button-contact') && !targ.classList.contains('magnifier')) {
            let itemWatchCheck = false;
            for (let i = 0; i < this.localStorage.length; i++) {
                if (this.localStorage.getItem(i) == item.id) {
                    itemWatchCheck = true;
                }
            }
            if (!itemWatchCheck) {
                this.localStorage.setItem(JSON.stringify(this.localStorage.length + 1), JSON.stringify(item.id));
                if (this.watchedItems.indexOf(item.id) == -1) {
                    this.watchedItems.push(item.id);
                }
            }
            let el = document.getElementById(item.id.toString()) as HTMLElement;
            // el.scrollIntoView(true);
            if (el != undefined) {
                el.style.removeProperty('background-color');
                el.style.removeProperty('position');
                el.style.removeProperty('top');
                el.style.removeProperty('padding-top');
                el.style.removeProperty('border-bottom');
            }
            if (sessionStorage.getItem('con_data') == 'true') {
                this.payed = true;
                this.logged_in = true;
            } else {
                this.payed = false;
                this.logged_in = false;
            }
            this.item = item;
            this.galleryType = 'item';
            this.historyActive = false;
            this.itemOpen = true;
            this.activeButton = 'obj';
            this.objClickIterator = 0;
            this.getObj(index);
            this.openBlock('item');
        } else {
            this.objClickIterator = 0;
        }

    }

    historyOpen() {
        let filter = document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        filter.item(0).style.setProperty('display', 'flex');
        this.historyActive = true;
    }

    historyClose() {
        let filter = document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        filter.item(0).style.setProperty('display', 'flex');
        this.historyActive = false;
        let header = document.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
        header.item(0).style.setProperty('z-index', '8');
        if (this.activeButton == 'items') {
        } else if (this.activeButton == 'filters') {
        } else {
            let TopMenuButton = document.getElementsByClassName('TopMenu-button-tablet') as HTMLCollectionOf<HTMLElement>;
            let TopMenuWord = document.getElementsByClassName('TopMenu-button-word-tablet') as HTMLCollectionOf<HTMLElement>;
            for (let i = 0; i < TopMenuButton.length; i++) {
                TopMenuButton.item(i).style.removeProperty('background-color');
                TopMenuButton.item(i).style.removeProperty('color');
                TopMenuButton.item(i).style.removeProperty('border-top');
                TopMenuWord.item(i).style.removeProperty('border-bottom');
            }
        }
    }

    getObj(index) {
        // this.item = this.items[index];
        this.item.watched = true;
        this.id = index;
        if (this.historyItems.indexOf(this.item) === -1) {
            this.historyItems.push(this.item);
        }
        let data = new Date();
        let hour, minute;
        if (data.getHours() < 10) {
            hour = '0' + data.getHours();
        } else {
            hour = data.getHours();
        }
        if (data.getMinutes() < 10) {
            minute = '0' + data.getMinutes();
        } else {
            minute = data.getMinutes();
        }
        this.time.unshift(hour + ':' + minute);
        this.localStorage.setItem(JSON.stringify(this.localStorage.length + 1), JSON.stringify(this.item.id));
        if (this.watchedItems.indexOf(this.item.id) == -1) {
            this.watchedItems.push(this.item.id);
        }
        let filtersInner = document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        filtersInner.item(0).style.setProperty('right', '0');
    }

    setFilters(filters) {
        this.filters = filters;
    }

    setSort(sort) {
        this.sort = sort;
    }

    setEquipment(equipment) {
        console.log(equipment);
        this.equipment = equipment;
        this.items = [];
        this.pagecounter = 0;
        this.get_list(10000, 'filters');
    }

    setCityObjects(cityAndObject) {
        let arrayOfStrings = cityAndObject.split(',');
        let x, y;
        switch (arrayOfStrings[0]) {
            case 'Хабаровск':
                y = 48.48272;
                x = 135.08379;
                break;
            case 'Владивосток':
                y = 43.15;
                x = 131.90;
                break;
            case 'Комсомольск-на-Амуре':
                y = 50.549923;
                x = 137.007948;
                break;
        }
    }
    changeFav(mode, item) {
        this.get_favObjects();
    }
    get_favObjects() {
        this.favItems = [];
        this._account_service.getFavObjects().subscribe(offers => {
            // console.log(offers);
            for (let offer of offers) {
                if (this.favItems.indexOf(offer) == -1) {
                    this.favItems.push(offer);
                }
            }
            if (localStorage.getItem('listType') == 'fav') {
                for (let i = 0; i < this.favItems.length; i++) {
                    this.favItems[i].is_fav = true;
                }
            }
            for (let j = 0; j < this.items.length; j++) {
                this.items[j].is_fav = false;
            }
            for (let i = 0; i < this.favItems.length; i++) {
                for (let j = 0; j < this.items.length; j++) {
                    if (this.favItems[i].id == this.items[j].id) {
                        console.log(this.items[j]);
                        this.items[j].is_fav = true;
                        this.items[j].watched = true;
                    }
                }
            }
            this.favItems = [];
            for (let j = 0; j < this.items.length; j++) {
                if (this.items[j].is_fav == true) {this.favItems.push(this.items[j]);}
            }
        });
    }

    defineobj(item: Item) {
        for (let j = 0; j < this.items.length; j++) {
            if (item.id == this.items[j].id) {
                this.markerFocus(this.items[j].id);
            }
        }
    }
    redrawObjectsOnMap(items: Item[], flag) {
        if (items.length == 0 && flag != 'clearmap') { this.map.geoObjects.removeAll();this.map.geoObjects.add(this.geoObject); }
        if (flag == 'clearmap') { this.geoObject = null; this.map.geoObjects.removeAll();}
        this.countOfObjects = this.items.length;
       // if (this.polygonActive) this.map.geoObjects.add(this.geoObject);
         this.map.geoObjects.remove(this.clusterer);
        this.clusterer = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#c50101',
            groupByCoordinates: true,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });


        this.clusterer.events.add('balloonopen', () => {
            let custertab = document.getElementsByClassName('ymaps-2-1-76-b-cluster-tabs__section') as HTMLCollectionOf<HTMLElement>;
            let baloon_content = document.getElementsByClassName('ymaps-2-1-76-balloon__content') as HTMLCollectionOf<HTMLElement>;
            let baloonlayout = document.getElementsByClassName('ymaps-2-1-76-balloon__layout') as HTMLCollectionOf<HTMLElement>;
            let baloonmenu = document.getElementsByClassName('ymaps-2-1-76-b-cluster-tabs__menu') as HTMLCollectionOf<HTMLElement>;
            let mainBaloon = document.getElementsByClassName('ymaps-2-1-76-balloon') as HTMLCollectionOf<HTMLElement>;
            for (let k = 0; k < mainBaloon.length; k++) {
                mainBaloon.item(k).style.setProperty('top', '-150px');
                mainBaloon.item(k).style.setProperty('max-width', '465px');
                mainBaloon.item(k).style.setProperty('max-height', '125px');
            }
            for (let i = 0; i < custertab.length; i++) {
                custertab.item(i).style.setProperty('max-height', '135px');
            }
            let cross =  document.getElementsByClassName('ymaps-2-1-76-balloon__close-button') as HTMLCollectionOf<HTMLElement>;
            for (let k = 0; k < cross.length; k++) {
                cross.item(k).style.setProperty('width', '16px');
                cross.item(k).style.setProperty('height', '16px');
                cross.item(k).style.setProperty('margin-right', '12px');
                cross.item(k).style.setProperty('margin-top', '12px');
            }
            for (let i = 0; i < baloon_content.length; i++) {
                baloon_content.item(i).style.setProperty('max-height', '135px');
            }
            for (let i = 0; i < baloonlayout.length; i++) {
                baloonlayout.item(i).style.setProperty('max-height', '125px');
            }
            for (let i = 0; i < baloonmenu.length; i++) {
                baloonmenu.item(i).style.setProperty('max-height', '110px');
            }
        });
         console.log("redraw items: " , items);
        for (let i = 0; i < items.length; i++) {

            let photo, rooms, floor, floorsCount, square: any;
            if (items[i].roomsCount != undefined) {
                rooms = items[i].roomsCount;
            } else {
                rooms = '';
            }
            if (items[i].floor != undefined) {
                floor = items[i].floor;
            } else {
                floor = '';
            }
            if (items[i].floorsCount != undefined) {
                floorsCount = items[i].floorsCount;
            } else {
                floorsCount = '';
            }
            if (items[i].squareTotal != undefined) {
                square = items[i].squareTotal;
            } else {
                square = '';
            }
            if (items[i].photos == undefined) {
                photo = 'url(https://makleronline.net/assets/noph.png)';
            } else {
                if (items[i].photos[0] != undefined) {
                    photo = 'url(' + items[i].photos[0].href + ')';
                } else {
                    photo = 'url(https://makleronline.net/assets/noph.png)';
                }
            }

             let formattedPrice = '';
            if (this.items[i].price != undefined) {
                formattedPrice = this.items[i].price.toString();
            }
             formattedPrice = formattedPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            let obj_type = '';
            switch (items[i].typeCode) {
                case 'apartment': obj_type = 'Квартира'; break;
                case 'house': obj_type = 'Дом'; break;
                case 'dacha': obj_type = 'Дача'; break;
                case 'cottage': obj_type = 'Коттедж'; break;
                case 'room': obj_type = 'Комната'; break;
            };
            let baloon = new this.maps.Placemark([items[i].lat, items[i].lon], {
                name: items[i].id,
                balloonContentHeader: '<span style="font-family: OpenSansBold, sans-serif; margin-top: 13px; font-size: 12px">' + items[i].address + ' ' + items[i].house_num + '</span>',
                balloonContentBody: '<div style="display: flex;width: fit-content;height: 100%">' +
                    ' <div style="margin-right: 15px;height: 80px; width: 110px;    background-position-x: center;background-position-y: center;background-repeat: no-repeat; background-size: 140% auto; background-image:' + photo + '"></div> <div style="display: flex; flex-direction: column;font-family: Cadillac, sans-serif;' +
                    'font-size: 14px;">' +
                    '<div style="display: flex;font-family: OpenSans; font-size: 12px;padding: 0 30px 0 0;height: 15px;"><div style="width: 75px">' + obj_type + '</div><div style="min-width: 85px;">' + rooms + ' комнатная</div></div>' +
                    '<div style="display: flex;font-family: OpenSans; font-size: 12px;padding: 0;height: 15px"><div style="width: 75px">Этаж</div><div>' + floor + '/' + floorsCount + '</div></div>' +
                    '<div style="display: flex;font-family: OpenSans; font-size: 12px; padding-bottom: 5px;height: 15px"><div style="width: 75px">Площадь</div><div>' + square + ' кв. м</div></div>' +
                    '<div style="display: flex;font-family: OpenSans; font-size: 12px"><div style="width: 75px">Стоимость</div><span style="font-family: OpenSansBold;">' + formattedPrice + ' Р/МЕС</span></div></div>',
                clusterCaption: '<span id="' + i + 'listitem">' + items[i].address + ' ' + items[i].house_num + '</span>'
            }, {
                preset: 'islands#icon',
                iconColor: '#c50101',
            });
            baloon.events.add("balloonopen", () => {
                this.activeBalloon = baloon;
                let baloonlayout = document.getElementsByClassName('ymaps-2-1-76-balloon__layout') as HTMLCollectionOf<HTMLElement>;
                let baloon_content = document.getElementsByClassName('ymaps-2-1-76-balloon__content') as HTMLCollectionOf<HTMLElement>;
                let mainBaloon = document.getElementsByClassName('ymaps-2-1-76-balloon') as HTMLCollectionOf<HTMLElement>;
                for (let k = 0; k < mainBaloon.length; k++) {
                    mainBaloon.item(k).style.setProperty('top', '-150px');
                }
                for (let k = 0; k < baloon_content.length; k++) {
                    baloon_content.item(k).style.setProperty('padding-top', '5px');
                    baloon_content.item(k).style.setProperty('height', '100%');
                    let inner = baloon_content[k].children[0] as HTMLElement;
                    inner.style.setProperty('height', '100%');
                }
                let cross =  document.getElementsByClassName('ymaps-2-1-76-balloon__close-button') as HTMLCollectionOf<HTMLElement>;
                for (let k = 0; k < cross.length; k++) {
                    cross.item(k).style.setProperty('width', '16px');
                    cross.item(k).style.setProperty('height', '16px');
                    cross.item(k).style.setProperty('margin-right', '12px');
                    cross.item(k).style.setProperty('margin-top', '12px');
                }
                for (let k = 0; k < baloonlayout.length; k++) {
                    baloonlayout.item(k).style.setProperty('height', '120px');
                }
                this.markerFocus(items[i].id);
            });
            baloon.events.add("mouseup", () => {
                this.map.setCenter([items[i].lat, items[i].lon], 15, {
                    duration: 500
                });
                this.defineobj(items[i]);
            });
            baloon.events.add("balloonclose", () => {
                let catalog = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
                let objects = document.getElementsByClassName('objects') as HTMLCollectionOf<HTMLElement>;
                for (let k = 0; k < catalog.length; k++) {
                    catalog.item(k).style.removeProperty('background-color');
                    catalog.item(k).style.removeProperty('position');
                    catalog.item(k).style.removeProperty('top');
                    catalog.item(k).style.removeProperty('padding-top');
                    catalog.item(k).style.removeProperty('border-bottom');
                }
                for (let k = 0; k < objects.length; k++) {
                    objects.item(k).style.removeProperty('background-color');
                }
            });
            this.clusterer.add(baloon);
            let objectState = this.clusterer.getObjectState(baloon);
            if (objectState.isClustered) {
                objectState.cluster.events.add("click", () => {
                    this.markerFocus(items[i].id);
                });
            }
        }
        this.map.geoObjects.add(this.clusterer);
        this.paintProcess = null;
        console.log('кластер добавлен');
        document.documentElement.addEventListener('mouseup', event => {
            let elem = event.target as HTMLElement;
            if ((elem.tagName == 'SPAN' && elem.id.indexOf('listitem') != -1)) {
                this.defineobj(items[elem.id.charAt(0)]);
            }
            if ((elem.children.length != 0 && elem.children[0].tagName == 'SPAN' && elem.children[0].id.indexOf('listitem') != -1)) {
                this.defineobj(items[elem.children[0].id.charAt(0)]);
            }

            let slide = document.getElementsByClassName('right-slide-box') as HTMLCollectionOf<HTMLElement>;
            let filters = document.getElementsByClassName('filters-box') as HTMLCollectionOf<HTMLElement>;
            if (filters.item(0).classList.contains('open') && event.pageX < document.documentElement.offsetWidth - filters.item(0).offsetWidth) {
                this.closeBlock('filters');
            }
            // console.log( event.offsetX + " " + (document.documentElement.offsetWidth - slide.item(1).offsetWidth));
            if (slide.item(0).classList.contains('open') && event.pageX < document.documentElement.offsetWidth - slide.item(0).offsetWidth) {
                slide.item(0).classList.remove('open');
            }
            if (slide.item(1).classList.contains('open') && event.pageX < document.documentElement.offsetWidth - slide.item(1).offsetWidth) {
                slide.item(1).classList.remove('open');
            }
            if (slide.item(2).classList.contains('open') && event.pageX < document.documentElement.offsetWidth - slide.item(2).offsetWidth) {
                slide.item(2).classList.remove('open');
            }
            if (slide.item(3).classList.contains('open') && event.pageX < document.documentElement.offsetWidth - slide.item(3).offsetWidth) {
                slide.item(3).classList.remove('open');
            }
        });
    }

    update_list(objsOnPage, flag) {
        if (flag == 'menu' || flag == 'init') {
            this.pagecounter = 0;
        }
        this.get_favObjects();
        if (this.localStorage.length != 0) {
            this.watchedItems = [];
            for (let i = 0; i < this.localStorage.length; i++) {
                this.watchedItems.push(Number(this.localStorage.getItem(i)));
            }
        }

        this.canLoad = 1;
        this._offer_service.list(this.pagecounter, objsOnPage, this.filters, this.sort, this.equipment, this.coordsPolygon, this.searchQuery).subscribe(
            data => setTimeout(() =>{
            // console.log(data);
                    if (flag != 'listscroll') {this.items = []}
             this.countOfObjects = data.hitsCount;
            this.hitsCount = data.hitsCount || (this.hitsCount > 0 ? this.hitsCount : 0);
            console.log("favs:",this.favItems);
            console.log('list: ', data.list);
            if (this.pagecounter == 0) {
                for (let i = 0; i < data.hitsCount; i++) {
                    if (this.items.indexOf(data.list[i]) == -1) {

                        if (this.watchedItems.indexOf(data.list[i].id) != -1) {
                            data.list[i].watched = true;
                        }
                        for (let i = 0; i < this.favItems.length; i++) {
                            if (this.favItems[i].id == data.list[i].id) {
                                data.list[i].is_fav = true;
                                console.log('founded: ', data.list[i].id);
                            }
                        }
                        this.items.push(data.list[i]);
                    }
                }
                for (let i = 0; i < this.favItems.length; i++) {
                    this.favItems[i].is_fav = true;
                }
            } else {
                for (let i = 0; i < data.hitsCount; i++) {
                    if (this.items.indexOf(data.list[i]) == -1) {
                        if (this.watchedItems.indexOf(data.list[i].id) != -1) {
                            data.list[i].watched = true;
                        }
                        for (let i = 0; i < this.favItems.length; i++) {
                            if (this.favItems[i].id == data.list[i].id) {
                                data.list[i].is_fav = true;
                                console.log('founded: ', data.list[i].id);
                            }
                        }
                        this.items.push(data.list[i]);
                    }
                }
                    if(~~(this.hitsCount/20) != this.pagecounter+1 && data.list.length < 20){
                        this.hitsCount -= (20 - data.list.length);
                    }
                for (let i = 0; i < this.favItems.length; i++) {
                    this.favItems[i].is_fav = true;
                }
            }
            if (flag == 'filters') { this.countOfObjects = this.items.length; } else {this.countOfObjects = data.hitsCount;}
            // for (let i = 0; i < this.items.length; i++) {
            //     if (this.watchedItems.indexOf(this.items[i].id) != -1) {
            //         this.items[i].watched = true;
            //     }
            // }
                    for (let i = 0; i < this.favItems.length; i++) {
                        for (let j = 0; j < this.items.length; j++) {
                            if (this.favItems[i].id == this.items[j].id) {
                                console.log(this.items[j]);
                                this.items[j].is_fav = true;
                                this.items[j].watched = true;
                            }
                        }
                    }
            this.canLoad = 0;
            console.log("items: ", this.items);
            if (this.polygonActive && flag != 'listscroll') { this.redrawObjectsOnMap(this.items, flag); }
        }),err => {
                console.log(err);
                this.canLoad = 0;
            }
        );
        this.find_obj_check = false;

    }
    listScroll(event) {
        if (this.canLoad == 0 && ~~(this.hitsCount/20)+1 != this.pagecounter){
             if (event.currentTarget.scrollTop + event.currentTarget.clientHeight >= event.currentTarget.scrollHeight ) {
                console.log(this.scrollArr);
                this.pagecounter += 1;
                this.update_list(100,'listscroll');
            }
        }
    }
    get_list(objsOnPage, flag) {
        if (this.activeButton == 'fav') {
            this.get_favObjects();
        } else {
            // let newitem = new Item(1, 'Центральный район','Хабаровский край','Ленина','51','Хабаровск',15000,3,3,5,73.6, 'Дмитрий', 'https://sun9-64.userapi.com/c626322/v626322965/645d2/SYugy9naJVw.jpg',
            //     1576754927, new UploadFile('https://avatars.mds.yandex.net/get-pdb/988157/cb39263b-cc68-46a0-a72d-7b12818edf8e/s1200'), undefined,'https://sun9-64.userapi.com/c626322/v626322965/645d2/SYugy9naJVw.jpg', new ConditionsBlock(true, true,true,true,true,true,true,true,true,true,true,true,true,true),
            //     'email@yandex.ru', '79244030001', true, true, true, true, true,true, undefined, 'combined','apartment', true, true, 'all', 'Данная квартира находится  в удобной доступности от объектов инфраструктуры. Рядом есть крупный торговый центр, детский сад.', true, true, new PhoneBlock(undefined, undefined, undefined, '79245057898', '79997929333'));
            // newitem.lat = '48.4770865';
            // newitem.lon = '135.0805373';
            // this.items = [];
            // this.items.push(newitem);
            this.update_list(objsOnPage, flag);
        }
    }

    checkFilters() {
        this.checkFilt = !this.checkFilt;
        if (this.checkFilt) {
            this.openBlock('filters');
        } else {
            this.closeBlock('filters');
            this.closeBlock('proposal');
            this.closeBlock('login');
            this.closeBlock('special');
            this.closeBlock('premium');
        }
    }

    openBlock(name) {
        let slide = document.getElementsByClassName('right-slide-box') as HTMLCollectionOf<HTMLElement>;
        let header = document.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
        let filters = document.getElementsByClassName('filters-box') as HTMLCollectionOf<HTMLElement>;
        let item = document.getElementsByClassName('item') as HTMLCollectionOf<HTMLElement>;
        let scroll = document.getElementsByClassName('scroll-items') as HTMLCollectionOf<HTMLElement>;
        let inner = document.getElementsByClassName('inner-left') as HTMLCollectionOf<HTMLElement>;
        let useless = document.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
        switch (name) {
            case 'filters':
                this.filtersInnerActive = true;
                filters.item(0).classList.add('open'); // filters

                if (useless.item(0).classList.contains('scroll')) {
                    filters.item(0).style.setProperty('top', '0');
                    filters.item(0).style.setProperty('height', 'calc(100vh - 65px)');
                } else {
                    filters.item(0).style.setProperty('top', '130px');
                    filters.item(0).style.setProperty('height', 'calc(100vh - 190px)');
                }

                break;
            case 'proposal':
                filters.item(1).classList.add('open'); // proposal
                if (useless.item(0).classList.contains('scroll')) {
                    filters.item(1).style.setProperty('top', '0');
                    filters.item(1).style.setProperty('height', 'calc(100vh - 65px)');
                } else {
                    filters.item(1).style.setProperty('top', '130px');
                    filters.item(1).style.setProperty('height', 'calc(100vh - 190px)');
                }
                break;
            case 'login':
                slide.item(0).classList.add('open');
                slide.item(0).style.setProperty('z-index', '1500');
                if (useless.item(0).classList.contains('homePage')) {
                    if (header.item(0).classList.contains('scroll')) {
                        slide.item(0).style.setProperty('top', '0');
                        slide.item(0).style.setProperty('height', '100vh');
                    } else {
                        slide.item(0).style.setProperty('top', '130px');
                        slide.item(0).style.setProperty('height', 'calc(100vh - 130px)');
                    }
                } else {
                    if (useless.item(0).classList.contains('scroll')) {
                        slide.item(0).style.setProperty('top', '65px');
                        slide.item(0).style.setProperty('height', 'calc(100vh - 65px)');
                    } else {
                        slide.item(0).style.setProperty('top', '190px');
                        slide.item(0).style.setProperty('height', 'calc(100vh - 190px)');
                    }
                }
                break;
            case 'pay':
                slide.item(1).classList.add('open');
                slide.item(1).style.setProperty('z-index', '1500');
                if (useless.item(0).classList.contains('homePage')) {
                    if (header.item(0).classList.contains('scroll')) {
                        slide.item(1).style.setProperty('top', '0');
                        slide.item(1).style.setProperty('height', '100vh');
                    } else {
                        slide.item(1).style.setProperty('top', '130px');
                        slide.item(1).style.setProperty('height', 'calc(100vh - 130px)');
                    }
                } else {
                    if (useless.item(0).classList.contains('scroll')) {
                        slide.item(1).style.setProperty('top', '65px');
                        slide.item(1).style.setProperty('height', 'calc(100vh - 65px)');
                    } else {
                        slide.item(1).style.setProperty('top', '190px');
                        slide.item(1).style.setProperty('height', 'calc(100vh - 190px)');
                    }
                }
                break;
            case 'special':
                filters.item(3).classList.add('open'); // special
                if (useless.item(0).classList.contains('scroll')) {
                    filters.item(3).style.setProperty('top', '0');
                    filters.item(3).style.setProperty('height', 'calc(100vh - 65px)');
                } else {
                    filters.item(3).style.setProperty('top', '130px');
                    filters.item(3).style.setProperty('height', 'calc(100vh - 190px)');
                }
                break;
            case 'premium':
                filters.item(4).classList.add('open'); // premium
                if (useless.item(0).classList.contains('scroll')) {
                    filters.item(4).style.setProperty('top', '0');
                    filters.item(4).style.setProperty('height', 'calc(100vh - 65px)');
                } else {
                    filters.item(4).style.setProperty('top', '130px');
                    filters.item(4).style.setProperty('height', 'calc(100vh - 190px)');
                }
                break;
            case 'item':
                this.itemOpen = true;
                break;
            case 'objects':
                item.item(0).classList.remove('open');
                scroll.item(0).classList.add('open');
                break;
            case 'compare':
                useless.item(0).style.setProperty('box-shadow', 'none');
                inner.item(0).classList.add('close');
                setTimeout(this.onResize, 500);
                if (useless.item(0).classList.contains('scroll')) {
                    let objs = document.getElementsByClassName('filters objs') as HTMLCollectionOf<HTMLElement>;
                    let dark = document.getElementsByClassName('darkBlueLine') as HTMLCollectionOf<HTMLElement>;
                    let arrows = document.getElementsByClassName('arrow comparisonArrow') as HTMLCollectionOf<HTMLElement>;
                    if (objs.length != 0) {
                        objs.item(0).style.setProperty('top', '0');
                    }
                    if (dark.length != 0) {
                        dark.item(0).style.setProperty('top', '0');
                    }
                    if (arrows.length != 0) {
                        arrows.item(0).style.setProperty('top', '35vh');
                        arrows.item(1).style.setProperty('top', '35vh');
                    }
                }
                break;
        }
    }

    closeBlock(name) {
        let filters = document.getElementsByClassName('filters-box') as HTMLCollectionOf<HTMLElement>;
        let item = document.getElementsByClassName('item') as HTMLCollectionOf<HTMLElement>;
        let scroll = document.getElementsByClassName('scroll-items') as HTMLCollectionOf<HTMLElement>;
        let inner = document.getElementsByClassName('inner-left') as HTMLCollectionOf<HTMLElement>;
        let useless = document.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
        let slide = document.getElementsByClassName('right-slide-box') as HTMLCollectionOf<HTMLElement>;

        switch (name) {
            case 'filters':
                // this.get_list();
                this.checkFilt = false;
                this.filtersInnerActive = false;
                filters.item(0).classList.remove('open');
                for (let i = 0; i < inner.length; i++) {
                    inner.item(i).style.setProperty('filter', 'none');
                }
                break;
            case 'proposal':
                filters.item(1).classList.remove('open');
                break;
            case 'login':
                filters.item(2).classList.remove('open');
                break;
            case 'pay':
                slide.item(1).classList.remove('open');
                break;
            case 'special':
                filters.item(3).classList.remove('open');
                break;
            case 'premium':
                filters.item(4).classList.remove('open');
                break;
            case 'item':
                this.itemOpen = false;
                this.activeButton = 'items';
                let catalog = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
                let objects = document.getElementsByClassName('objects') as HTMLCollectionOf<HTMLElement>;
                for (let k = 0; k < catalog.length; k++) {
                    catalog.item(k).style.removeProperty('background-color');
                    catalog.item(k).style.removeProperty('position');
                    catalog.item(k).style.removeProperty('top');
                    catalog.item(k).style.removeProperty('padding-top');
                    catalog.item(k).style.removeProperty('border-bottom');
                }
                for (let k = 0; k < objects.length; k++) {
                    objects.item(k).style.removeProperty('box-shadow');
                }
                // this.map.balloon.close();
                // if (!this.polygonActive) { this.map.geoObjects.removeAll()}
                break;
            case 'objects':
                item.item(0).classList.add('open');
                scroll.item(0).classList.remove('open');
                break;
            case 'compare':
                inner.item(0).classList.remove('close');
                useless.item(0).style.setProperty('box-shadow', '#677578 0 2px 10px 0');
                break;
        }
    }

    prev() {
        const list = document.getElementById('carousel-ul1') as HTMLElement;
        this.position = Math.min(this.position + this.widthPhoto * this.count, 0);
        list.style.setProperty('margin-left', this.position + 'px');
    }

    next() {
        const listElems = document.getElementsByClassName('carousel-li1') as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('carousel-ul1') as HTMLElement;
        this.position = Math.max(this.position - this.widthPhoto * this.count, -this.widthPhoto * (listElems.length - this.count - 1));
        list.style.setProperty('margin-left', this.position + 'px');
    }

    onResize() {
      let mapContainer = document.getElementsByClassName('ymaps-2-1-76-map') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < mapContainer.length; i++) {
            mapContainer.item(i).style.setProperty('width', '100%');
            mapContainer.item(i).style.setProperty('height', '100%');
        }
        let objects = document.getElementsByClassName('objects') as HTMLCollectionOf<HTMLElement>;
        if (objects.length != 0) {
            this.widthPhoto = objects.item(0).offsetWidth / 2;
        }
        // console.log(this.widthPhoto);
        let useless = document.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
        if (useless.item(0).classList.contains('scroll')) {
            let objs = document.getElementsByClassName('filters objs') as HTMLCollectionOf<HTMLElement>;
            let dark = document.getElementsByClassName('darkBlueLine') as HTMLCollectionOf<HTMLElement>;
            let arrows = document.getElementsByClassName('arrow comparisonArrow') as HTMLCollectionOf<HTMLElement>;
            if (objs.length != 0) {
                objs.item(0).style.setProperty('top', '0');
            }
            if (dark.length != 0) {
                dark.item(0).style.setProperty('top', '0');
            }
            if (arrows.length != 0) {
                arrows.item(0).style.setProperty('top', '35vh');
                arrows.item(1).style.setProperty('top', '35vh');
            }
        }
    }
}
