import {LOCAL_STORAGE, WINDOW} from '@ng-toolkit/universal';
import {AfterViewInit, Component, OnInit, Inject} from '@angular/core';
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

    activeObjectsButton = 'food';
    entertainmentIco = false;
    foodIco = false;
    medicineIco = false;
    educationIco = false;
    sportIco = false;
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
    similars = false;
    widthPhoto = 610; // ширина изображения
    count = 1; // количество изображений
    position = 0;
    number = 1;
    compareTopButton = false;
    objects: any;
    grayCol: any;
    stopsCol: any;
    coords = [0, 0];
    nearObjects: any[] = [];
    nrObjs: any[] = [];
    drawActive: boolean;
    paintProcess: any;
    polygons: any[] = [];
    clearActive = false;
    filters: any;
    equipment: any;
    coordsPolygon: any[] = [];
    logged_in: boolean = false;
    places: any[] = [];
    // check obj onclick
    food: any[] = [];
    education: any[] = [];
    fitness: any[] = [];
    medicine: any[] = [];
    entertainment: any[] = [];
    parking: any[] = [];
    activeBalloon: any;
    public selectedMarker: any;
// type == 'Кафе' || type == 'Магазины продуктов' || type == 'Супермаркеты'
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

    objClickIterator = 0;
    curItem: Item;
    payed: boolean = false;

    constructor(private ym: NgxMetrikaService, @Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute, private router: Router,
                private _offer_service: OfferService,
                private _account_service: AccountService) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => {
            return false;
        };
        this.subscription = route.params.subscribe((urlParams) => {
            if (urlParams['mode'] === 'list') {
                this.historyActive = false;
                this.filtersActive = true;
                this.itemOpen = false;
                this.activeButton = 'items';

                this.itemsActive = true;
                // this.checkFav();
            } else if (urlParams['mode'] === 'favorite') {

                this.activeButton = 'fav';
                this.itemsActive = false;
            } else {
                this.historyActive = false;
                this.itemOpen = true;
                this.similars = false;
                this.activeButton = 'obj';

                let str = '';
                str = urlParams['mode'];
                this._offer_service.list(1, 1, '', '', '', '').subscribe(offers => {
                    console.log("Ищем объект ", str);
                    for (let offer of offers) {
                        if (Number.parseInt(str.substring(0, 13), 10) == offer.id) {
                            this.item = offer;
                        }
                    }
                });
            }

        });
    }

    ngOnInit() {

        if ((this.item === undefined || this.item === null) && this.itemOpen === true) {
            this.filtersActive = true;
        }
        this.drawActive = false;
        this.width = document.documentElement.clientWidth;
    }

    ngAfterViewInit() {
        // this.checklogin();
        let items = document.getElementsByClassName('menuBlock') as HTMLCollectionOf<HTMLElement>;
        items.item(1).style.setProperty('border-top', '5px solid #821529');
        items.item(1).style.setProperty('font-weight', 'bold');

        let objects = document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        if (objects.length != 0) {
            this.widthPhoto = objects.item(0).offsetWidth;
        }
        ymaps.load('https://api-maps.yandex.ru/2.1/?apikey=ADRpG1wBAAAAtIMIVgMAmOY9C0gOo4fhnAstjIg7y39Ls-0AAAAAAAAAAAAbBvdv4mK' +
            'Dz9rc97s4oi4IuoAq6g==&lang=ru_RU&amp;load=package.full').then(maps => {
            this.initMap(maps);
            setTimeout(() => {
                if (this.item != undefined) {
                    this.openMarker(this.item);
                }
                let mapContainer = document.getElementsByClassName('ymaps-2-1-74-map') as HTMLCollectionOf<HTMLElement>;
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
            // console.log(this.watchedItems);
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
        this.openLeftPart('map');

    }

    changeLog(ev: any) {
        this.logged_in = ev;
    }

    changePay(ev: any) {
        this.payed = ev;
    }

    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }

    openLeftPart(name) {
        let inner = document.getElementsByClassName('inner-left') as HTMLCollectionOf<HTMLElement>;
        let topLayerForRightMenu = document.getElementsByClassName('topLayerForRightMenu') as HTMLCollectionOf<HTMLElement>;
        // topLayerForRightMenu.item(0).classList.add('open');
        if (name == 'bulletin') {
            for (let i = 0; i < inner.length; i++) {
                inner.item(i).style.setProperty('filter', 'blur(5px)');
            }
            topLayerForRightMenu.item(0).classList.add('open');
        }
        if (name == 'map') {
            for (let i = 0; i < inner.length; i++) {
                inner.item(i).style.removeProperty('filter');
            }
            topLayerForRightMenu.item(0).classList.remove('open');
        }
    }

    listActive() {
        setTimeout(() => {
            let mapContainer = document.getElementsByClassName('ymaps-2-1-74-map') as HTMLCollectionOf<HTMLElement>;
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
                // Включаем режим поиска панорам на карте.
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
        // console.log('lat: ' + latDiff);
        // console.log('lon: ' + lonDiff);

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
        this.free_parking = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#0A145B',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.paid_parking = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#0A145B',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.all_parking = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#0A145B',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.cafe = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#FB8C00',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.market = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#FB8C00',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.restaurant = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#FB8C00',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.canteen = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#FB8C00',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.procukty = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#FB8C00',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.supermarket = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#FB8C00',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.kindergarten = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#3F51B5',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.school = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#3F51B5',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.gymnasy = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#3F51B5',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.institute = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#3F51B5',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.technikum = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#3F51B5',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.univer = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#3F51B5',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.fitnessClubs = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#1E88E5',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.trenazher = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#1E88E5',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.apteka = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#00897B',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.poliklinika = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#00897B',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.hospital = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#00897B',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.vetapteka = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#00897B',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.vetklinika = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#00897B',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.kino = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#8E24AA',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.circus = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#8E24AA',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.park = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#8E24AA',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.theater = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#8E24AA',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        this.nightclub = new this.maps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterIconColor: '#8E24AA',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        let mapStyle = document.getElementsByClassName('ymaps-2-1-74-ground-pane') as HTMLCollectionOf<HTMLElement>;
        if (mapStyle.length != 0) {
            mapStyle.item(0).style.setProperty('filter', 'grayscale(.9)');
        }

        // Подпишемся на событие нажатия кнопки мыши.
        this.map.events.add('mousedown', () => {
            if (this.drawActive) {
                this.coordsPolygon = [];
                if (this.geoObject != undefined) {
                    this.map.geoObjects.remove(this.geoObject);
                }
                //   this.map.geoObjects.add(this.yellowCol).add(this.grayCol);
                this.paintProcess = this.paintOnMap();
            }
        });

        // Подпишемся на событие отпускания кнопки мыши.
        this.map.events.add('mouseup', () => {

            if (this.paintProcess) {
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
                if (coordinates.length != 0) {
                    this.polygons.push(this.geoObject);
                    this.get_list();
                    this.map.geoObjects.add(this.geoObject);
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
        this.get_list();
    }

    clearMap() {
        this.map.geoObjects.remove(this.geoObject);
        this.coordsPolygon = [];
        this.get_list();
    }

    markerFocus(id) {
        // console.log('id: ' + id);
        if (!this.itemOpen) {
            let catalog = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
            let objects = document.getElementsByClassName('objects') as HTMLCollectionOf<HTMLElement>;
            for (let i = 0; i < catalog.length; i++) {
                catalog.item(i).style.removeProperty('background-color');
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
                el.style.setProperty('background-color', '#d3d5d6');
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
        this.defineobj(item);

        this.selectedMarker.events.add('balloonopen', () => {
            let custertab = document.getElementsByClassName('ymaps-2-1-74-b-cluster-tabs__section') as HTMLCollectionOf<HTMLElement>;
            let baloon_content = document.getElementsByClassName('ymaps-2-1-74-balloon__content') as HTMLCollectionOf<HTMLElement>;
            let baloonlayout = document.getElementsByClassName('ymaps-2-1-74-balloon__layout') as HTMLCollectionOf<HTMLElement>;
            let baloonmenu = document.getElementsByClassName('ymaps-2-1-74-b-cluster-tabs__menu') as HTMLCollectionOf<HTMLElement>;
            let mainBaloon = document.getElementsByClassName('ymaps-2-1-74-balloon') as HTMLCollectionOf<HTMLElement>;
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
        for (let i = 0; i < this.items.length; i++) {

            if (item.lat == this.items[i].lat && item.lon == this.items[i].lon) {
                // this.map.geoObjects.remove(this.selectedMarker);
                // console.log(item.lat, this.items[i].lat, item.lon, this.items[i].lon);
                countOfSelected++;
                let photo, rooms, floor, floorsCount, square: any;
                if (this.items[i].roomsCount != undefined) {
                    rooms = this.items[i].roomsCount;
                } else {
                    rooms = '';
                }
                if (this.items[i].floor != undefined) {
                    floor = this.items[i].floor;
                } else {
                    floor = '';
                }
                if (this.items[i].floorsCount != undefined) {
                    floorsCount = this.items[i].floorsCount;
                } else {
                    floorsCount = '';
                }
                if (this.items[i].squareTotal != undefined) {
                    square = this.items[i].squareTotal;
                } else {
                    square = '';
                }
                if (this.items[i].photos == undefined) {
                    photo = 'url(https://makleronline.net/assets/noph.png)';
                } else {

                    if (this.items[i].photos[0] != undefined) {
                        photo = 'url(' + this.items[i].photos[0].href + ')';
                    } else {
                        photo = 'url(https://makleronline.net/assets/noph.png)';
                    }
                }
                let formattedPrice = this.items[i].price.toString();
                formattedPrice = formattedPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
                let baloon = new this.maps.Placemark([this.items[i].lat, this.items[i].lon], {
                    name: this.items[i].id,
                    balloonContentHeader: '<span style="font-family: OpenSansBold, sans-serif;margin-top: 13px; font-size: 12px">' + this.items[i].address + ' ' + this.items[i].house_num + '</span>',
                    balloonContentBody: '<div style="display: flex;height: 100%;width: fit-content">' +
                        ' <div style="margin-right: 15px; height: 80px; width: 110px;    background-position-x: center;background-position-y: center;background-repeat: no-repeat; background-size: 140% auto; background-image:' + photo + '"></div> <div style="display: flex; flex-direction: column;font-family: Cadillac, sans-serif;' +
                        'font-size: 14px;">' +
                        // '<span style="font-family: OpenSansBold;margin-top: 7px; font-size: 12px">' + this.items[i].address + ' ' + this.items[i].house_num + '</span>' +
                        '<div style="display: flex;font-family: OpenSans; font-size: 12px;padding: 0 30px 0 0 ;height: 15px"><div style="width: 75px">Квартира</div><div style="min-width: 85px;">' + rooms + ' комнатная</div></div>' +
                        '<div style="display: flex;font-family: OpenSans; font-size: 12px;padding: 0;height: 15px"><div style="width: 75px">Этаж</div><div>' + floor + '/' + floorsCount + '</div></div>' +
                        '<div style="display: flex;font-family: OpenSans; font-size: 12px; padding-bottom: 5px;height: 15px"><div style="width: 75px">Площадь</div><div>' + square + ' кв. м</div></div>' +
                        '<div style="display: flex;font-family: OpenSans; font-size: 12px"><div style="width: 75px">Стоимость</div><span style="font-family: OpenSansBold">' + formattedPrice + ' Р/МЕС</span></div></div>'
                }, {
                    preset: 'islands#icon',
                    iconColor: '#c50101',
                });
                baloon.events.add("balloonopen", () => {
                    this.activeBalloon = baloon;
                    let baloonlayout = document.getElementsByClassName('ymaps-2-1-74-balloon__layout') as HTMLCollectionOf<HTMLElement>;
                    let baloon_content = document.getElementsByClassName('ymaps-2-1-74-balloon__content') as HTMLCollectionOf<HTMLElement>;
                    let mainBaloon = document.getElementsByClassName('ymaps-2-1-74-balloon') as HTMLCollectionOf<HTMLElement>;
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
                    this.markerFocus(this.items[i].id);
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
                    this.map.setCenter([this.items[i].lat, this.items[i].lon], 15, {
                        duration: 500
                    });
                    // this.defineobj(this.items[i]);
                });
                this.selectedMarker.add(baloon);
                if (this.items[i].id == item.id) {
                    selectedBallon = baloon;
                    index = i;
                }
                let objectState1 = this.selectedMarker.getObjectState(baloon);
                // console.log(this.selectedMarker);
                // console.log(objectState1);
                if (i != index) {
                    if (objectState1.isClustered) {
                        objectState1.cluster.events.add("click", () => {
                            // console.log("index: ", i);
                            this.markerFocus(this.items[i].id);
                        });
                    }
                }
            }
        }
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
        // console.log(objectState);
        if (objectState.isClustered) {
            objectState.cluster.events.add("click", () => {
                this.markerFocus(this.items[index].id);
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
            // this.map.setCenter([this.items[i].lat, this.items[i].lon], 15);
            objectState.cluster.state.set('activeObject', selectedBallon);
            this.selectedMarker.balloon.open(objectState.cluster);
        } else {
            // Если метка не попала в кластер и видна на карте, откроем ее балун.
            this.map.setCenter([item.lat, item.lon]);
            selectedBallon.balloon.open();
            this.defineobj(this.items[index]);
        }
        // if (countOfSelected > 1) {
        //   this.map.geoObjects.add(this.selectedMarker);
        // }

    }

    selectbj() {
        let catalog = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
        let objects = document.getElementsByClassName('objects') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < catalog.length; i++) {
            catalog.item(i).style.removeProperty('background-color');
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
                el.style.setProperty('background-color', '#d3d5d6');
                el.style.setProperty('position', 'relative');
                el.style.setProperty('top', '-1px');
                el.style.setProperty('padding-top', '1px');
                el.style.setProperty('border-bottom', 'none');
                // break;
            }
            if (el.classList != undefined && el.classList.contains('objects') && el.classList.contains('hovered')) {
                el.scrollTop = el.scrollHeight;
                // el.style.setProperty('background-color', '#d3d5d6');
                // break;
            }
        }
    }

    focusOnObject(event: MouseEvent, item: Item, index, array) {
        this.objClickIterator++;
        let targ = event.target as HTMLElement;
        if (this.objClickIterator == 1 && !targ.classList.contains('starFav') && !targ.classList.contains('starImg') //&& targ.tagName != 'IMG'
            && !targ.classList.contains('arrow') && !targ.classList.contains('arrowFull')) {
            this.curItem = item;
            this.map.setZoom(17);
            this.map.setCenter([item.lat, item.lon]);
            setTimeout(() => {
                this.openMarker(item);
            }, 200);
            this.selectbj();
        } else if (this.objClickIterator == 2 && !targ.classList.contains('starFav') && !targ.classList.contains('starImg') // && targ.tagName != 'IMG'
            && item != this.curItem && !targ.classList.contains('arrow') && !targ.classList.contains('arrowFull')) {
            // console.log('second');
            this.objClickIterator = 0;
            this.map.setZoom(17);
            this.map.setCenter([item.lat, item.lon]);
            setTimeout(() => {
                this.openMarker(item);
            }, 200);
            this.selectbj();
        } else if (this.objClickIterator == 2 && item == this.curItem && !targ.classList.contains('starFav') && !targ.classList.contains('starImg') // && targ.tagName != 'IMG'
            && !targ.classList.contains('arrow') && !targ.classList.contains('arrowFull')) {
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

            let komn = '';
            if (this.curItem.roomsCount != undefined) {
                komn = '-' + this.curItem.roomsCount + '-komnaty';
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
            switch (this.curItem.typeCode) {
                case 'room':
                    this.router.navigate(['./d/objects', this.curItem.id + '-arenda-komnaty-bez-posrednikov']).then(() => {
                        // console.log('redirect to ' + this.curItem.id);
                    });
                    break;
                case 'apartment':
                    this.router.navigate(['./d/objects', this.curItem.id + '-arenda' + komn + '-kvartiry-bez-posrednikov']).then(() => {
                        // console.log('redirect to ' + this.curItem.id);
                    });
                    break;
                case 'house':
                    this.router.navigate(['./d/objects', this.curItem.id + '-arenda' + komn + '-doma-bez-posrednikov']).then(() => {
                        // console.log('redirect to ' + this.curItem.id);
                    });
                    break;
                case 'dacha':
                    this.router.navigate(['./d/objects', this.curItem.id + '-arenda' + komn + '-dachi-bez-posrednikov']).then(() => {
                        // console.log('redirect to ' + this.curItem.id);
                    });
                    break;
                case 'cottage':
                    this.router.navigate(['./d/objects', this.curItem.id + '-arenda' + komn + '-kottedzha-bez-posrednikov']).then(() => {
                        // console.log('redirect to ' + this.curItem.id);
                    });
                    break;
            }

            this.activeButton = 'obj';
            this.objClickIterator = 0;
            if (this.grayCol != undefined) {
                this.map.geoObjects.remove(this.grayCol);
            }
            this.getPlaces(this.coords[1], this.coords[0], item.address, item.house_num);
            this.getObj(index);
            this.openBlock('item');
        } else {
            this.objClickIterator = 0;
        }

    }

    getPlaces(x, y, address, house) {
        this._account_service.getObjects(x, y, "Магазин", '0.005').subscribe(res => {
            this.grayCol = new this.maps.GeoObjectCollection(null, {
                preset: 'islands#yellowIcon',
                iconColor: '#677578'
            });
            this.nearObjects = res;
            for (let i = 0; i < this.nearObjects.length; i++) {
                let obj = JSON.parse(JSON.stringify(this.nearObjects[i]));
                let coord = JSON.parse(JSON.stringify(obj.geometry));
                let properties = JSON.parse(JSON.stringify(obj.properties));
                this.nrObjs.push({
                    coordinates: coord.coordinates,
                    description: properties.description,
                    name: properties.name
                });
                let coor = [coord.coordinates[1], coord.coordinates[0]];
                this.grayCol.add(new this.maps.Placemark(coor, {
                    balloonContent: properties.name
                }));
            }

        });
        this._account_service.getObjects(x, y, "Остановка", '0.001').subscribe(res => {
            this.stopsCol = new this.maps.GeoObjectCollection(null, {
                preset: 'islands#yellowIcon',
                iconColor: '#821529'
            });
            this.nearObjects = res;
            for (let i = 0; i < this.nearObjects.length; i++) {
                let obj = JSON.parse(JSON.stringify(this.nearObjects[i]));
                let coord = JSON.parse(JSON.stringify(obj.geometry));
                let properties = JSON.parse(JSON.stringify(obj.properties));
                this.nrObjs.push({
                    coordinates: coord.coordinates,
                    description: properties.description,
                    name: properties.name
                });
                let coor = [coord.coordinates[1], coord.coordinates[0]];
                this.stopsCol.add(new this.maps.Placemark(coor, {
                    balloonContent: properties.name
                }));
            }
            //  this.map.geoObjects.add(this.stopsCol);
        });
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
        this.item = this.items[index];
        this.items[index].watched = true;
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
        let time = hour + ':' + minute;
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
        this.equipment = equipment;
        this.get_list();
    }

    setCityObjects(cityAndObject) {
        // console.warn(cityAndObject);
        let arrayOfStrings = cityAndObject.split(',');
        // console.log(arrayOfStrings);
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
        if (x != undefined && y != undefined) {
            this.requestMaps(x, y, arrayOfStrings[1], arrayOfStrings[2]);
        }
    }

    requestMaps(x, y, type, mode) {
        this._account_service.getObjects(x, y, type, '0.3').subscribe(res => {
            this.nearObjects = res;
            // console.log(res);
            // console.log(this.nearObjects);
            if (mode == 'delete') {
                // 0A145B
                if (type == 'Бесплатные парковки' || type == 'Платные парковки' || type == 'Автостоянки') {
                    this.parking = [];
                    if (type == 'Бесплатные парковки') {
                        this.map.geoObjects.remove(this.free_parking);
                        this.free_parking = [];
                        this.free_parking = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#0A145B',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Платные парковки') {
                        this.map.geoObjects.remove(this.paid_parking);
                        this.paid_parking = [];
                        this.paid_parking = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#0A145B',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Автостоянки') {
                        this.map.geoObjects.remove(this.all_parking);
                        this.all_parking = [];
                        this.all_parking = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#0A145B',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                }
                if (type == 'Кафе' || type == 'Магазины продуктов' || type == 'Супермаркеты' || type == 'Рынки' || type == 'Рестораны' || type == 'Столовые') {
                    this.food = [];
                    if (type == 'Кафе') {
                        this.map.geoObjects.remove(this.cafe);
                        this.cafe = [];
                        this.cafe = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#FB8C00',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Рынки') {
                        this.map.geoObjects.remove(this.market);
                        this.market = [];
                        this.market = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#FB8C00',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Рестораны') {
                        this.map.geoObjects.remove(this.restaurant);
                        this.restaurant = [];
                        this.restaurant = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#FB8C00',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Столовые') {
                        this.map.geoObjects.remove(this.canteen);
                        this.canteen = [];
                        this.canteen = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#FB8C00',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Магазины продуктов') {
                        this.map.geoObjects.remove(this.procukty);
                        this.procukty = [];
                        this.procukty = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#FB8C00',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Супермаркеты') {
                        this.map.geoObjects.remove(this.supermarket);
                        this.supermarket = [];
                        this.supermarket = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#FB8C00',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                }
                if (type == 'Детские сады' || type == 'Школы' || type == 'Гимназии' || type == 'Техникумы' || type == 'Институты' || type == 'Университеты') {
                    this.education = [];
                    if (type == 'Детские сады') {
                        this.map.geoObjects.remove(this.kindergarten);
                        this.kindergarten = [];
                        this.kindergarten = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#3F51B5',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Школы') {
                        this.map.geoObjects.remove(this.school);
                        this.school = [];
                        this.school = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#3F51B5',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Гимназии') {
                        this.map.geoObjects.remove(this.gymnasy);
                        this.gymnasy = [];
                        this.gymnasy = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#3F51B5',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Институты') {
                        this.map.geoObjects.remove(this.institute);
                        this.institute = [];
                        this.institute = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#3F51B5',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Техникумы') {
                        this.map.geoObjects.remove(this.technikum);
                        this.technikum = [];
                        this.technikum = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#3F51B5',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Университеты') {
                        this.map.geoObjects.remove(this.univer);
                        this.univer = [];
                        this.univer = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#3F51B5',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                }
                if (type == 'Тренажерные залы' || type == 'Фитнес клубы') {
                    this.fitness = [];
                    if (type == 'Тренажерные залы') {
                        this.map.geoObjects.remove(this.trenazher);
                        this.trenazher = [];
                        this.trenazher = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#1E88E5',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Фитнес клубы') {
                        this.map.geoObjects.remove(this.fitnessClubs);
                        this.fitnessClubs = [];
                        this.fitnessClubs = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#1E88E5',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                }
                if (type == 'Аптеки' || type == 'Поликлиники' || type == 'Больницы' || type == 'Ветеринарные аптеки' || type == 'Ветеринарные клиники') {
                    this.medicine = [];
                    if (type == 'Аптеки') {
                        this.map.geoObjects.remove(this.apteka);
                        this.apteka = [];
                        this.apteka = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#00897B',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Поликлиники') {
                        this.map.geoObjects.remove(this.poliklinika);
                        this.poliklinika = [];
                        this.poliklinika = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#00897B',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Больницы') {
                        this.map.geoObjects.remove(this.hospital);
                        this.hospital = [];
                        this.hospital = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#00897B',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Ветеринарные аптеки') {
                        this.map.geoObjects.remove(this.vetapteka);
                        this.vetapteka = [];
                        this.vetapteka = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#00897B',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Ветеринарные клиники') {
                        this.map.geoObjects.remove(this.vetklinika);
                        this.vetklinika = [];
                        this.vetklinika = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#00897B',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                }
                if (type == 'Кинотеатры' || type == 'Театры' || type == 'Ночные клубы' || type == 'Цирки' || type == 'Парки') {
                    this.entertainment = [];
                    if (type == 'Кинотеатры') {
                        this.map.geoObjects.remove(this.kino);
                        this.kino = [];
                        this.kino = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#8E24AA',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Цирки') {
                        this.map.geoObjects.remove(this.circus);
                        this.circus = [];
                        this.circus = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#8E24AA',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Парки') {
                        this.map.geoObjects.remove(this.park);
                        this.park = [];
                        this.park = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#8E24AA',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Театры') {
                        this.map.geoObjects.remove(this.theater);
                        this.theater = [];
                        this.theater = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#8E24AA',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                    if (type == 'Ночные клубы') {
                        this.map.geoObjects.remove(this.nightclub);
                        this.nightclub = [];
                        this.nightclub = new this.maps.Clusterer({
                            preset: 'islands#invertedRedClusterIcons',
                            clusterIconColor: '#8E24AA',
                            groupByCoordinates: false,
                            clusterDisableClickZoom: true,
                            clusterHideIconOnBalloonOpen: false,
                            geoObjectHideIconOnBalloonOpen: false
                        });
                    }
                }
            }
            if (mode == 'add') {
                for (let i = 0; i < this.nearObjects.length; i++) {
                    let obj = JSON.parse(JSON.stringify(this.nearObjects[i]));
                    //   console.log(obj);
                    let properties = JSON.parse(JSON.stringify(obj.properties));
                    let comp = JSON.parse(JSON.stringify(properties.CompanyMetaData.Categories));
                    let comp1 = JSON.parse(JSON.stringify(comp[0]));
                    let cat = JSON.parse(JSON.stringify(comp1.name));
                    let coord = JSON.parse(JSON.stringify(obj.geometry));

                    //    0A145B

                    if (type == 'Бесплатные парковки' || type == 'Платные парковки' || type == 'Автостоянки') {
                        this.parking.push({
                            coordinates: coord.coordinates,
                            type: cat,
                            description: properties.description,
                            name: properties.name
                        });
                        let coor = [coord.coordinates[1], coord.coordinates[0]];
                        if (type == 'Бесплатные парковки') {
                            this.free_parking.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#0A145B'
                            }));
                        }
                        if (type == 'Платные парковки') {
                            this.paid_parking.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#0A145B'
                            }));
                        }
                        if (type == 'Автостоянки') {
                            this.all_parking.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#0A145B'
                            }));
                        }
                    }
                    if (type == 'Кафе' || type == 'Магазины продуктов' || type == 'Супермаркеты' || type == 'Рынки' || type == 'Рестораны' || type == 'Столовые') {
                        this.food.push({
                            coordinates: coord.coordinates,
                            type: cat,
                            description: properties.description,
                            name: properties.name
                        });
                        let coor = [coord.coordinates[1], coord.coordinates[0]];
                        if (type == 'Кафе') {
                            this.cafe.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#FB8C00'
                            }));
                        }
                        if (type == 'Рынки') {
                            this.market.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#FB8C00'
                            }));
                        }
                        if (type == 'Рестораны') {
                            this.restaurant.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#FB8C00'
                            }));
                        }
                        if (type == 'Столовые') {
                            this.canteen.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#FB8C00'
                            }));
                        }
                        if (type == 'Магазины продуктов') {
                            this.procukty.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#FB8C00'
                            }));
                        }
                        if (type == 'Супермаркеты') {
                            this.supermarket.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#FB8C00'
                            }));
                        }
                    }
                    if (type == 'Детские сады' || type == 'Школы' || type == 'Гимназии' || type == 'Техникумы' || type == 'Институты' || type == 'Университеты') {
                        this.education.push({
                            coordinates: coord.coordinates,
                            type: cat,
                            description: properties.description,
                            name: properties.name
                        });
                        let coor = [coord.coordinates[1], coord.coordinates[0]];
                        if (type == 'Детские сады') {
                            this.kindergarten.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#3F51B5'
                            }));
                        }
                        if (type == 'Школы') {
                            this.school.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#3F51B5'
                            }));
                        }
                        if (type == 'Гимназии') {
                            this.gymnasy.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#3F51B5'
                            }));
                        }
                        if (type == 'Институты') {
                            this.institute.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#3F51B5'
                            }));
                        }
                        if (type == 'Техникумы') {
                            this.technikum.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#3F51B5'
                            }));
                        }
                        if (type == 'Университеты') {
                            this.univer.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#3F51B5'
                            }));
                        }
                    }
                    if (type == 'Тренажерные залы' || type == 'Фитнес клубы') {
                        this.fitness.push({
                            coordinates: coord.coordinates,
                            type: cat,
                            description: properties.description,
                            name: properties.name
                        });
                        let coor = [coord.coordinates[1], coord.coordinates[0]];
                        if (type == 'Тренажерные залы') {
                            this.trenazher.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#1E88E5'
                            }));
                        }
                        if (type == 'Фитнес клубы') {
                            this.fitnessClubs.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#1E88E5'
                            }));
                        }
                    }
                    if (type == 'Аптеки' || type == 'Поликлиники' || type == 'Больницы' || type == 'Ветеринарные аптеки' || type == 'Ветеринарные клиники') {
                        this.medicine.push({
                            coordinates: coord.coordinates,
                            type: cat,
                            description: properties.description,
                            name: properties.name
                        });
                        let coor = [coord.coordinates[1], coord.coordinates[0]];
                        if (type == 'Аптеки') {
                            this.apteka.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#00897B'
                            }));
                        }
                        if (type == 'Поликлиники') {
                            this.poliklinika.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#00897B'
                            }));
                        }
                        if (type == 'Больницы') {
                            this.hospital.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#00897B'
                            }));
                        }
                        if (type == 'Ветеринарные аптеки') {
                            this.vetapteka.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#00897B'
                            }));
                        }
                        if (type == 'Ветеринарные клиники') {
                            this.vetklinika.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#00897B'
                            }));
                        }
                    }
                    if (type == 'Кинотеатры' || type == 'Театры' || type == 'Ночные клубы' || type == 'Цирки' || type == 'Парки') {
                        this.entertainment.push({
                            coordinates: coord.coordinates,
                            type: cat,
                            description: properties.description,
                            name: properties.name
                        });
                        let coor = [coord.coordinates[1], coord.coordinates[0]];
                        if (type == 'Кинотеатры') {
                            this.kino.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#8E24AA'
                            }));
                        }
                        if (type == 'Цирки') {
                            this.circus.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#8E24AA'
                            }));
                        }
                        if (type == 'Парки') {
                            this.park.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#8E24AA'
                            }));
                        }
                        if (type == 'Театры') {
                            this.theater.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#8E24AA'
                            }));
                        }
                        if (type == 'Ночные клубы') {
                            this.nightclub.add(new this.maps.Placemark(coor, {
                                balloonContent: properties.name
                            }, {
                                preset: 'islands#yellowIcon',
                                iconColor: '#8E24AA'
                            }));
                        }
                    }
                }
                if (type == 'Бесплатные парковки' || type == 'Платные парковки' || type == 'Автостоянки') {
                    if (type == 'Бесплатные парковки') {
                        this.map.geoObjects.add(this.free_parking);
                    }
                    if (type == 'Платные парковки') {
                        this.map.geoObjects.add(this.paid_parking);
                    }
                    if (type == 'Автостоянки') {
                        this.map.geoObjects.add(this.all_parking);
                    }
                }
                if (type == 'Кафе' || type == 'Магазины продуктов' || type == 'Супермаркеты' || type == 'Рынки' || type == 'Рестораны' || type == 'Столовые') {
                    if (type == 'Кафе') {
                        this.map.geoObjects.add(this.cafe);
                    }
                    if (type == 'Магазины продуктов') {
                        this.map.geoObjects.add(this.procukty);
                    }
                    if (type == 'Супермаркеты') {
                        this.map.geoObjects.add(this.supermarket);
                    }
                    if (type == 'Рынки') {
                        this.map.geoObjects.add(this.market);
                    }
                    if (type == 'Рестораны') {
                        this.map.geoObjects.add(this.restaurant);
                    }
                    if (type == 'Столовые') {
                        this.map.geoObjects.add(this.canteen);
                    }
                }
                if (type == 'Детские сады' || type == 'Школы' || type == 'Гимназии' || type == 'Техникумы' || type == 'Институты' || type == 'Университеты') {
                    if (type == 'Детские сады') {
                        this.map.geoObjects.add(this.kindergarten);
                    }
                    if (type == 'Школы') {
                        this.map.geoObjects.add(this.school);
                    }
                    if (type == 'Гимназии') {
                        this.map.geoObjects.add(this.gymnasy);
                    }
                    if (type == 'Институты') {
                        this.map.geoObjects.add(this.institute);
                    }
                    if (type == 'Техникумы') {
                        this.map.geoObjects.add(this.technikum);
                    }
                    if (type == 'Университеты') {
                        this.map.geoObjects.add(this.univer);
                    }
                }
                if (type == 'Тренажерные залы' || type == 'Фитнес клубы') {
                    if (type == 'Тренажерные залы') {
                        this.map.geoObjects.add(this.trenazher);
                    }
                    if (type == 'Фитнес клубы') {
                        this.map.geoObjects.add(this.fitnessClubs);
                    }
                }
                if (type == 'Аптеки' || type == 'Поликлиники' || type == 'Больницы' || type == 'Ветеринарные аптеки' || type == 'Ветеринарные клиники') {
                    if (type == 'Аптеки') {
                        this.map.geoObjects.add(this.apteka);
                    }
                    if (type == 'Поликлиники') {
                        this.map.geoObjects.add(this.poliklinika);
                    }
                    if (type == 'Больницы') {
                        this.map.geoObjects.add(this.hospital);
                    }
                    if (type == 'Ветеринарные аптеки') {
                        this.map.geoObjects.add(this.vetapteka);
                    }
                    if (type == 'Ветеринарные клиники') {
                        this.map.geoObjects.add(this.vetklinika);
                    }
                }
                if (type == 'Кинотеатры' || type == 'Театры' || type == 'Ночные клубы' || type == 'Цирки' || type == 'Парки') {
                    if (type == 'Кинотеатры') {
                        this.map.geoObjects.add(this.kino);
                    }
                    if (type == 'Театры') {
                        this.map.geoObjects.add(this.theater);
                    }
                    if (type == 'Ночные клубы') {
                        this.map.geoObjects.add(this.nightclub);
                    }
                    if (type == 'Цирки') {
                        this.map.geoObjects.add(this.circus);
                    }
                    if (type == 'Парки') {
                        this.map.geoObjects.add(this.park);
                    }
                }
            }
        });
    }

    openPlace(coordinates) {
        this.closeBlock('filters');
        this.map.setCenter([coordinates[1], coordinates[0]], 17, {
            duration: 500
        });
    }

    changeFav(mode, item) {
        this.get_favObjects();
    }

    get_favObjects() {
        this.favItems = [];
        this._account_service.getFavObjects().subscribe(offers => {
            for (let offer of offers) {
                if (this.favItems.indexOf(offer) == -1) {
                    this.favItems.push(offer);
                }
            }
            for (let i = 0; i < this.favItems.length; i++) {
                this.favItems[i].is_fav = true;
            }
            this.redrawObjectsOnMap(this.favItems);
        });

    }

    defineobj(item: Item) {
        for (let j = 0; j < this.items.length; j++) {
            if (item.id == this.items[j].id) {
                this.markerFocus(this.items[j].id);
            }
        }
    }

    // log_out() {
    //     this.logged_in = false;
    //     this._account_service.logout();
    // }

    // checklogin() {
    //     this._account_service.checklogin().subscribe(res => {
    //         // console.log(res);
    //         if (res != undefined) {
    //             let data = JSON.parse(JSON.stringify(res));
    //             if (data.result == 'success') {
    //                 this.logged_in = true;
    //             } else {
    //                 this.logged_in = false;
    //                 this.log_out();
    //             }
    //         } else {
    //             this.logged_in = false;
    //             this.log_out();
    //         }
    //     });
    // }

    //
    // checkFav() {
    //     for (let j = 0; j < this.items.length; j++) {
    //         this.items[j].is_fav = false;
    //     }
    //     if (this.favItems != undefined && this.favItems.length != 0 && this.logged_in == true) {
    //         // console.log(this.favItems);
    //         for (let i = 0; i < this.favItems.length; i++) {
    //             for (let j = 0; j < this.items.length; j++) {
    //                 if (this.favItems[i].id == this.items[j].id) {
    //                     this.items[j].is_fav = true;
    //                     this.items[j].watched = true;
    //                 }
    //             }
    //         }
    //     }
    //
    // }

    redrawObjectsOnMap(items: Item[]) {
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
            let custertab = document.getElementsByClassName('ymaps-2-1-74-b-cluster-tabs__section') as HTMLCollectionOf<HTMLElement>;
            let baloon_content = document.getElementsByClassName('ymaps-2-1-74-balloon__content') as HTMLCollectionOf<HTMLElement>;
            let baloonlayout = document.getElementsByClassName('ymaps-2-1-74-balloon__layout') as HTMLCollectionOf<HTMLElement>;
            let baloonmenu = document.getElementsByClassName('ymaps-2-1-74-b-cluster-tabs__menu') as HTMLCollectionOf<HTMLElement>;
            let mainBaloon = document.getElementsByClassName('ymaps-2-1-74-balloon') as HTMLCollectionOf<HTMLElement>;
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
            if (this.item != undefined) {
                formattedPrice = this.item.price != undefined ? this.item.price.toString() : '';
                formattedPrice = formattedPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            }

            let baloon = new this.maps.Placemark([items[i].lat, items[i].lon], {
                name: items[i].id,
                balloonContentHeader: '<span style="font-family: OpenSansBold, sans-serif; margin-top: 13px; font-size: 12px">' + items[i].address + ' ' + items[i].house_num + '</span>',
                balloonContentBody: '<div style="display: flex;width: fit-content;height: 100%">' +
                    ' <div style="margin-right: 15px;height: 80px; width: 110px;    background-position-x: center;background-position-y: center;background-repeat: no-repeat; background-size: 140% auto; background-image:' + photo + '"></div> <div style="display: flex; flex-direction: column;font-family: Cadillac, sans-serif;' +
                    'font-size: 14px;">' +
                    // '<span style="font-family: OpenSansBold;margin-top: 7px; font-size: 12px">' + items[i].address + ' ' + items[i].house_num + '</span>' +
                    '<div style="display: flex;font-family: OpenSans; font-size: 12px;padding: 0 30px 0 0;height: 15px;"><div style="width: 75px">Квартира</div><div style="min-width: 85px;">' + rooms + ' комнатная</div></div>' +
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
                let baloonlayout = document.getElementsByClassName('ymaps-2-1-74-balloon__layout') as HTMLCollectionOf<HTMLElement>;
                let baloon_content = document.getElementsByClassName('ymaps-2-1-74-balloon__content') as HTMLCollectionOf<HTMLElement>;
                let mainBaloon = document.getElementsByClassName('ymaps-2-1-74-balloon') as HTMLCollectionOf<HTMLElement>;
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
        this.clusterer.events.add("balloonclose", () => {
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
        document.documentElement.addEventListener('mouseup', event => {
            let elem = event.target as HTMLElement;
            if ((elem.tagName == 'SPAN' && elem.id.indexOf('listitem') != -1)) {
                this.defineobj(items[elem.id.charAt(0)]);
            }
            if ((elem.children.length != 0 && elem.children[0].tagName == 'SPAN' && elem.children[0].id.indexOf('listitem') != -1)) {
                this.defineobj(items[elem.children[0].id.charAt(0)]);
            }

            let slide = document.getElementsByClassName('right-slide-box') as HTMLCollectionOf<HTMLElement>;
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

        this.map.geoObjects.add(this.clusterer);
    }

    update_list() {
        if (this.localStorage.length != 0) {
            this.watchedItems = [];
            for (let i = 0; i < this.localStorage.length; i++) {
                this.watchedItems.push(Number(this.localStorage.getItem(i)));
            }
        }

        this.items = [];
        this._offer_service.list(1, 1, this.filters, this.sort, this.equipment, this.coordsPolygon).subscribe(offers => {
            this.items = [];
            this.countOfObjects = offers.length;
            for (let offer of offers) {
                this.items.push(offer);
            }
            // console.log("items ", this.items);
            for (let i = 0; i < this.items.length; i++) {
                if (this.watchedItems.indexOf(this.items[i].id) != -1) {
                    this.items[i].watched = true;
                }
            }
            if (this.favItems != undefined && this.favItems.length != 0 && this.logged_in == true) {
                // console.log(this.favItems);
                for (let i = 0; i < this.favItems.length; i++) {
                    for (let j = 0; j < this.items.length; j++) {
                        if (this.favItems[i].id == this.items[j].id) {
                            this.items[j].is_fav = true;
                            this.items[j].watched = true;
                        }
                    }
                }
            }
            for (let j = 0; j < this.items.length; j++) {
                if (this.items[j].is_fav == undefined && this.items[j].is_fav != true) {
                    this.items[j].is_fav = false;
                }
            }
            // this.map.geoObjects.removeAll();
            this.redrawObjectsOnMap(this.items);
        });
    }

    get_list() {
        // this.checklogin();
        if (this.activeButton == 'fav') {
            this.get_favObjects();
        } else {
            this.update_list();
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
        if (name == 'filters') {
            this.openLeftPart('map');
        }
        switch (name) {
            case 'filters':
                this.filtersInnerActive = true;
                filters.item(0).classList.add('open'); // filters

                if (useless.item(0).classList.contains('scroll')) {
                    filters.item(0).style.setProperty('top', '0');
                    filters.item(0).style.setProperty('height', 'calc(100vh - 65px)');
                } else {
                    filters.item(0).style.setProperty('top', '130px');
                    filters.item(0).style.setProperty('height', 'calc(100vh - 195px)');
                }

                break;
            case 'proposal':
                filters.item(1).classList.add('open'); // proposal
                if (useless.item(0).classList.contains('scroll')) {
                    filters.item(1).style.setProperty('top', '0');
                    filters.item(1).style.setProperty('height', 'calc(100vh - 65px)');
                } else {
                    filters.item(1).style.setProperty('top', '130px');
                    filters.item(1).style.setProperty('height', 'calc(100vh - 195px)');
                }
                // filters.item(1).style.setProperty('box-shadow', '#677578 0 2px 10px 0');
                break;
            case 'login':
                filters.item(2).classList.add('open'); // login
                if (useless.item(0).classList.contains('scroll')) {
                    filters.item(2).style.setProperty('top', '0');
                    filters.item(2).style.setProperty('height', 'calc(100vh - 65px)');
                } else {
                    filters.item(2).style.setProperty('top', '130px');
                    filters.item(2).style.setProperty('height', 'calc(100vh - 195px)');
                }
                // filters.item(2).style.setProperty('box-shadow', '#677578 0 2px 10px 0');
                break;
            case 'pay':
                slide.item(1).classList.add('open');
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
                        slide.item(1).style.setProperty('top', '195px');
                        slide.item(1).style.setProperty('height', 'calc(100vh - 195px)');
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
                    filters.item(3).style.setProperty('height', 'calc(100vh - 195px)');
                }
                // filters.item(3).style.setProperty('box-shadow', '#677578 0 2px 10px 0');
                break;
            case 'premium':
                filters.item(4).classList.add('open'); // premium
                if (useless.item(0).classList.contains('scroll')) {
                    filters.item(4).style.setProperty('top', '0');
                    filters.item(4).style.setProperty('height', 'calc(100vh - 65px)');
                } else {
                    filters.item(4).style.setProperty('top', '130px');
                    filters.item(4).style.setProperty('height', 'calc(100vh - 195px)');
                }
                // filters.item(4).style.setProperty('box-shadow', '#677578 0 2px 10px 0');
                break;
            case 'item':
                this.itemOpen = true;
                // scroll.item(0).classList.remove('open');
                break;
            case 'objects':
                item.item(0).classList.remove('open');
                scroll.item(0).classList.add('open');
                break;
            case 'compare':
                useless.item(0).style.setProperty('box-shadow', 'none');
                inner.item(0).classList.add('close');
                this.similars = true;
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
        let topLayerForRightMenu = document.getElementsByClassName('topLayerForRightMenu') as HTMLCollectionOf<HTMLElement>;
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
                topLayerForRightMenu.item(0).classList.remove('open');
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
                // item.item(0).classList.remove('open');
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
                    objects.item(k).style.removeProperty('background-color');
                }
                this.map.balloon.close();
                // scroll.item(0).classList.add('open');
                break;
            case 'objects':
                item.item(0).classList.add('open');
                scroll.item(0).classList.remove('open');
                break;
            case 'compare':
                this.similars = false;
                inner.item(0).classList.remove('close');
                useless.item(0).style.setProperty('box-shadow', '#677578 0 2px 10px 0');
                //    inner.item(1).classList.add('close');
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
        // console.log(this.position);
        list.style.setProperty('margin-left', this.position + 'px');
    }

    onResize() {
        // console.log("ресайз");
        // this.map.container.fitToViewport(true);
        let filters = document.getElementsByClassName('filters open') as HTMLCollectionOf<HTMLElement>;
        // let arrowList = document.getElementsByClassName('listButton') as HTMLCollectionOf<HTMLElement>;

        let map = document.getElementsByClassName('map filters-map') as HTMLCollectionOf<HTMLElement>;
        if (!this.listMode) {
            map.item(0).style.setProperty('width', '100vw');
            map.item(0).style.setProperty('max-width', 'unset');
            // arrowList.item(0).style.setProperty('right', '0');
        } else {
            map.item(0).style.setProperty('width', '69vw');
            map.item(0).style.setProperty('max-width', 'calc(100vw - 400px)');
            // arrowList.item(0).style.setProperty('right', filters.item(0).clientWidth + 'px');

        }
        // ymaps-2-1-74-map
        let mapContainer = document.getElementsByClassName('ymaps-2-1-74-map') as HTMLCollectionOf<HTMLElement>;
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

    // checklogin() {
    //   this._account_service.checklogin().subscribe(res => {
    //     console.log(res);
    //     if (res != undefined) {
    //       let data = JSON.parse(JSON.stringify(res));
    //       // console.log(data.result);
    //       // console.log(data.user_id);
    //       // console.log(data.email);
    //       if (data.result == 'success' ) {
    //         this.userEmail = data.email;
    //         this.loggedIn = true;
    //       } else {
    //         this.log_out();
    //       }
    //     } else {
    //       this.log_out();
    //       console.log('not athorized!');
    //       return false;
    //     }
    //   });
    // }
}
