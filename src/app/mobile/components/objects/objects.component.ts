import {LOCAL_STORAGE, WINDOW} from '@ng-toolkit/universal';
import {Component, OnInit, AfterViewInit, Inject} from '@angular/core';
import {Subscription} from 'rxjs';
import {Item} from '../../../item';
import {ActivatedRoute, Router} from '@angular/router';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';

@Component({
    selector: 'app-objects',
    templateUrl: './objects.component.html',
    styleUrls: ['./objects.component.css']
})
export class ObjectsComponent implements OnInit, AfterViewInit {

    private subscription: Subscription;
    initCoords = [48.4862268, 135.0826369];
    initZoom = 15;
    mapBig = false;
    public map: any;
    mainHeight: any;
    blockMode = 'items';
    desktopOpen = false;
    items: Item[] = [];
    item: Item;
    filters: any;
    sort: any;
    pages: any[] = [];
    historyItems: any[] = [];
    itemsActive: boolean;
    filtersInnerActive: boolean;
    itemOpen = false;
    watched: boolean;
    filtersMenuActive: boolean;
    timeAdd: any;
    filtersActive = true;
    mapActive = true;
    mobile = false;
    watchedItems: any[] = [];
    time: any[] = [];
    favouriteList: any[] = [];
    loginActive = false;
    contactActive = false;
    payActive = false;
    mapOpen = false;
    historyActive = false;
    ergnActive = false;
    shortversion = false;
    historyPrev: string;
    sendMailButton = false;
    food: any[] = [];
    equipment: any;
    coordsPolygon: any[] = [];
    filtersChosen = 'empty';
    countOfItems: any;
    blockInputOpen = 'open_menu';
    current = 0;
    y: number;
    width: number;
    mobileItemOpen = false;
    lat = 48.4862268;
    lng = 135.0826369;
    activeButton: string;
    menuOpen = false;
    logged_in: boolean = false;
    payed: boolean = false;
    bottomPxButton: any;
    headerPos: any;
    touchStartPos: any;
    mainObjectsPadding: any;
    pagecounter = 0;
    hitsCount: number = 0;
    canLoad: number = 0;
    searchQuery: string = "";
    suggestionTo: any;
    sgList: string[] = [];
    favItems: Item[] = [];
    findPadding = 90;
    filterText = 'ВЫБЕРИТЕ ФИЛЬТРЫ ДЛЯ ПОИСКА';
    styles = [
        {
            'featureType': 'landscape',
            'stylers': [
                {
                    'color': '#f0f0f0'
                }
            ]
        },
        {
            'featureType': 'poi.park',
            'elementType': 'geometry.fill',
            'stylers': [
                {
                    'color': '#cceab0'
                }
            ]
        },
        {
            'featureType': 'road.local',
            'stylers': [
                {
                    'color': '#ffffff'
                }
            ]
        },
        {
            'featureType': 'water',
            'stylers': [
                {
                    'color': '#87c2f8'
                }
            ]
        }
    ];

    constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute, private router: Router,
                private _offer_service: OfferService,
                private _account_service: AccountService) {
        this.subscription = route.params.subscribe((urlParams) => {
            if (urlParams['mode'] === 'list') {
                this.blockMode = 'items';
                this.activeButton = 'items';
                this.itemOpen = false;
                window.scrollTo(0, 0);
                this.filtersInnerActive = false;
                let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
                if (filters.length !== 0) {
                    filters.item(0).style.setProperty('display', 'flex');
                }
            } else {
                this.itemsActive = false;
                this.itemOpen = true;
                this.blockMode = 'item';
                this.blockInputOpen = 'close_menu';
                this.activeButton = 'obj';
                let str = '';
                str = urlParams['mode'];
                this._offer_service.list(0, 1000, '', '', '', '', '').subscribe(offers => {
                    for (let offer of offers.list) {
                        if (Number.parseInt(str.substring(0, 13)) == offer.id) {
                            this.item = offer;
                        }
                    }
                });
            }
        });
    }

    ngOnInit() {
        this.get_favObjects();
        this.checklogin();
        if ((this.item === undefined || this.item === null) && this.itemOpen === true) {
            this.itemOpen = false;
            this.filtersInnerActive = true;
            this.filtersActive = true;
        }
        this.pages = [];
        this.width = document.documentElement.clientWidth;
        const heightMobile = document.documentElement.clientHeight;
        let scrollItems = document.getElementsByClassName('scroll-items open') as HTMLCollectionOf<HTMLElement>;
        let filtersBox = document.getElementsByClassName('app-filters-box') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < scrollItems.length; i++) {
            scrollItems.item(i).style.setProperty('height', heightMobile - 60 + 'px');
        }
        for (let i = 0; i < filtersBox.length; i++) {
            filtersBox.item(i).style.setProperty('height', heightMobile - 60 + 'px');
        }
    }

    ngAfterViewInit() {
        this.get_list(20, 'init');
        let header = document.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
        header.item(0).style.setProperty('z-index', '8');
        if ((this.item === undefined || this.item === null) && this.itemOpen === true) {
            this.filtersInnerActive = true;
        }
        header.item(0).style.setProperty('top', '0');
        if (this.itemsActive || this.filtersInnerActive) {
            let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
            filters.item(0).style.setProperty('display', 'flex');
        }
        if (this.itemsActive) {
            this.chooseMenuButton(0);
        } else if (this.filtersInnerActive) {
            this.chooseMenuButton(1);
        } else if (this.historyActive) {
            this.chooseMenuButton(2);
        }
        // this.changeSize();
        if (sessionStorage.length !== 0) {
            this.watchedItems = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                this.watchedItems.push(Number(sessionStorage.key(i)));
            }
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
            if (this.items.length != 0) {
                this.favItems = [];
                for (let j = 0; j < this.items.length; j++) {
                    if (this.items[j].is_fav == true) {this.favItems.push(this.items[j]);}
                }
            }

        });
    }
    changeLog(ev: any) {
        this.logged_in = ev;
    }

    changePay(ev: any) {
        this.payed = ev;
    }
    changeCount(count) {
        this.countOfItems = count;
        if (document.getElementById('numObj') != undefined) {
            document.getElementById('numObj').innerText = count;
        }

    }
    touchstart(event: TouchEvent) {
        this.touchStartPos = event.changedTouches[0].clientY;
    }

    touchend(event: TouchEvent) {
        let num = this.touchStartPos - event.changedTouches[0].clientY;
        this.bottomPxButton = num > 0 ? -80 : 30;
        let targ = event.target as HTMLElement;
       // if (num == 0 && !targ.classList.contains('catalog-item'))
        if (num > 2) {
            this.headerPos = -90;
            this.mainObjectsPadding = 0;
            this.mainHeight = 'calc(100vh - 65px)';
            this.findPadding = 0;
            this.listScroll();
        } else if (num < -2){
            this.headerPos = 0;
            this.mainObjectsPadding = 90;
            this.mainHeight = 'calc(100vh - 155px)';
            this.findPadding = 90;
        }
        setTimeout( () => {
            if (document.getElementById('fil')!= undefined) {
                if (document.getElementById('fil').getBoundingClientRect().top < 200) {
                    this.filterText = 'ОПРЕДЕЛИТЕ ОБЛАСТЬ ПОИСКА';
                } else {
                    this.filterText = 'ВЫБЕРИТЕ ФИЛЬТРЫ ДЛЯ ПОИСКА';
                }
            }

        }, 200);
        // console.log(event.changedTouches);
    }
    openBlock(type) {
        setTimeout( () => {
            if (type == 'filters') {
                    document.getElementById('fil-top').scrollIntoView({'block': 'center'});
                    this.get_list(1000,'filters');
            }
        }, 100);
    }
    checkClick(index, obj, event, flag) {
        // let komn = '';
        // if (obj.roomsCount != undefined) {
        //     komn = '-' + obj.roomsCount + '-komn';
        // }
        // switch (obj.typeCode) {
        //     case 'room':
        //         this.router.navigate(['./m/objects', obj.id + '-arenda-komnaty-bez-posrednikov']).then(() => {
        //             console.log('redirect to ' + obj.id);
        //         });
        //         break;
        //     case 'apartment':
        //         this.router.navigate(['./m/objects', obj.id + '-arenda' + komn + '-kvartiry-bez-posrednikov']).then(() => {
        //             console.log('redirect to ' + obj.id);
        //         });
        //         break;
        //     case 'house':
        //         this.router.navigate(['./m/objects', obj.id + '-arenda' + komn + '-doma-bez-posrednikov']).then(() => {
        //             console.log('redirect to ' + obj.id);
        //         });
        //         break;
        //     case 'dacha':
        //         this.router.navigate(['./m/objects', obj.id + '-arenda' + komn + '-dachi-bez-posrednikov']).then(() => {
        //             console.log('redirect to ' + obj.id);
        //         });
        //         break;
        //     case 'cottage':
        //         this.router.navigate(['./m/objects', obj.id + '-arenda' + komn + '-kottedzha-bez-posrednikov']).then(() => {
        //             console.log('redirect to ' + obj.id);
        //         });
        //         break;
        // }
        console.log(this.headerPos);
        if (!event.target.classList.contains('starFav') && !event.target.classList.contains('starImg')) {
            this.mainHeight = '100vh';
            this.blockMode = 'item';
            this.checklogin();
            // console.log('blockMode:' + this.blockMode + ' logged_in:' + this.logged_in + ' timeAdd:' + this.timeAdd);
            this.blockInputOpen = 'open_menu';
            this.getObj(index ,flag);
            this.item = obj;
            this.mobileItemFunc();
            document.documentElement.scrollTo(0, 0);
        }

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
        this.get_list(10000, 'find');
    }
    setContactPos(e) {
        this.y = e;
    }

    getFiltersClicked(e) {
        this.sendMailButton = e > 1;
    }

    showContact() {
        console.log('contact ' + this.y);
        this.window.scrollTo(0, this.y - 165);
    }

    mobileItemFunc() {
        this.activeButton = 'item';
        this.shortversion = true;
        this.mapActive = false;
        this.mobileItemOpen = true;
        this.itemOpen = true;
        this.historyActive = false;
        let TopMenuButton = document.getElementsByClassName('TopMenu-button-tablet') as HTMLCollectionOf<HTMLElement>;
        let TopMenuWord = document.getElementsByClassName('TopMenu-button-word-tablet') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < TopMenuButton.length; i++) {
            TopMenuButton.item(i).style.removeProperty('background-color');
            TopMenuButton.item(i).style.removeProperty('color');
            TopMenuButton.item(i).style.removeProperty('border-top');
            TopMenuWord.item(i).style.removeProperty('border-bottom');
        }
    }

    chooseMenuButton(index) {
//    let TopMenuWord =  document.getElementsByClassName('TopMenu-button-word-tablet') as HTMLCollectionOf<HTMLElement>;
//     let iconImg = document.getElementsByClassName('iconImg') as HTMLCollectionOf<HTMLElement>;
//     for (let i = 0; i < iconImg.length; i++) {
        // iconImg.item(i).style.removeProperty('background');
//      TopMenuWord.item(i).style.removeProperty('border-bottom');

        // }
        // iconImg.item(index).style.setProperty('background', 'white');
//    TopMenuWord.item(index).style.setProperty('border-bottom', '1px solid white');
    }

    openHeaderAfterPage() {
        let header = document.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
        header.item(0).style.setProperty('z-index', '8');
        // let uselessLine = document.documentElement.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
        // uselessLine.item(0).style.setProperty('display', 'block');
        let arrows = document.documentElement.getElementsByClassName('arrows-mobile ') as HTMLCollectionOf<HTMLElement>;
        arrows.item(0).style.setProperty('display', 'flex');
    }

    setFilters(filters) {
        this.filters = filters;
    }

    setSort(sort) {
        this.sort = sort;
    }

    setEquipment(equipment) {
        this.equipment = equipment;
        // this.get_list();
    }

    close(name, id) {
        console.log('func work ' + name);
        switch (name) {
            case 'login': {
                this.loginActive = false;
                this.mobileItemOpen = true;
                this.itemOpen = true;
                this.desktopOpen = true;
                this.openHeaderAfterPage();
                break;
            }
            case 'contact': {
                this.contactActive = false;
                this.mobileItemOpen = true;
                this.itemOpen = true;
                this.desktopOpen = true;
                this.openHeaderAfterPage();
                break;
            }
            case 'pay': {
                this.payActive = false;
                this.mobileItemOpen = true;
                this.itemOpen = true;
                this.desktopOpen = true;
                this.openHeaderAfterPage();
                break;
            }
            case 'egrn': {
                this.ergnActive = false;
                this.mobileItemOpen = true;
                this.itemOpen = true;
                this.desktopOpen = true;
                this.openHeaderAfterPage();
                break;
            }
            case 'item': {
                this.mainHeight = 'calc(100vh - 155px)';
                this.blockInputOpen = 'open_menu';
                this.blockMode = 'items';
                this.activeButton = 'items';
                this.itemOpen = false;
                setTimeout( () => {
                    let it = document.getElementById(id) as HTMLElement;
                    it.scrollIntoView({block: "center"});
                }, 200);
                console.log(this.headerPos);

            }
            default: {
                console.log('default');
                break;
            }
        }
    }

    historyOpen() {
        this.chooseMenuButton(2);
        let filter = document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        filter.item(0).style.setProperty('display', 'flex');
        this.mapOpen = false;
        this.historyActive = true;
        this.itemOpen = false;
        if (this.itemsActive === true) {
            this.itemsActive = false;
            this.historyPrev = 'items';
        }
        if (this.filtersInnerActive === true) {
            this.filtersInnerActive = false;
            this.historyPrev = 'filters';
        }
        this.time = [];
    }

    onResize() {
        this.width = document.documentElement.clientWidth;
        this.watched = false;
        this.filtersMenuActive = false;
        this.mobile = true;
        this.shortversion = true;
        let map = document.getElementsByClassName('map') as HTMLCollectionOf<HTMLElement>;
        let mapbuttons = document.getElementsByClassName('map-buttons') as HTMLCollectionOf<HTMLElement>;
        let widthExt;
        if (map.length > 1) {
            widthExt = map.item(1).offsetWidth - 12;
        }
        if (mapbuttons.length !== 0) {
            if (!this.mapActive && widthExt !== undefined && widthExt !== null) {
                mapbuttons.item(0).style.setProperty('width', widthExt + 'px');
            } else {
                mapbuttons.item(0).style.setProperty('width', 'auto');
            }
        }
    }

    getObj(index, flag) {
        this.blockMode = 'item';
        if (flag == 'list') {
            this.item = this.items[index];
        } else if (flag == 'fav') {
            this.item = this.favItems[index];
        }
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
        //     this.favourite[this.item.id] = { value: false };
        sessionStorage.setItem(JSON.stringify(this.item.id), time);
        if (this.watchedItems.indexOf(index) === -1) {
            this.watchedItems.push(index);
        }
        if (this.current < this.pages.length - 1 && this.pages.length > 1) {
            let num = this.pages.length - this.current - 1;
            this.pages.splice(this.current + 1, num);
            this.pages.push(this.item);
            this.current = this.pages.length - 1;
        } else {
            this.pages.push(this.item);
            this.current = this.pages.length - 1;
        }
        this.mapActive = false;
        let filtersInner = document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        filtersInner.item(0).style.setProperty('right', '0');
    }

    addFav(index) {
        let item = document.getElementById('img' + index);
        if (this.favouriteList.indexOf(index) === -1) {
            this.favouriteList.push(index);
            item.classList.add('favActive');
        } else {
            let elemIndex = this.favouriteList.indexOf(index);
            this.favouriteList.splice(elemIndex, 1);
            item.classList.remove('favActive');
        }
    }

    info(check) {
        if (this.current < this.pages.length - 1 && this.pages.length > 1) {
            console.log('PAGES');
            let num = this.pages.length - this.current - 1;
            this.pages.splice(this.current + 1, num);
            this.pages.push(check);
            this.current = this.pages.length - 1;
        } else {
            this.pages.push(check);
            this.current = this.pages.length - 1;
        }
        this.checkSwitch(check);
    }

    checkSwitch(check) {
        if (typeof check !== 'string') {
            this.item = <Item> check;
        }
        switch (check) {

            case 'filters': {
                this.mapBig = false;
                this.loginActive = false;
                this.payActive = false;
                this.contactActive = false;
                this.ergnActive = false;
                this.filtersInnerActive = true;
                this.itemOpen = true;
                this.itemsActive = false;
                this.mapOpen = false;
                this.watched = false;
                this.filtersActive = true;
                this.mobileItemOpen = false;
                break;
            }
            case 'objects': {
                this.mapBig = false;
                this.payActive = false;
                this.loginActive = false;
                this.contactActive = false;
                this.mapOpen = false;
                this.ergnActive = false;
                this.filtersInnerActive = false;
                this.itemOpen = true;
                this.itemsActive = true;
                this.watched = true;
                this.filtersActive = true;
                this.mobileItemOpen = false;
                break;
            }
            case 'login': {
                this.mapBig = false;
                this.loginActive = true;
                this.payActive = false;
                this.contactActive = false;
                this.mapOpen = false;
                this.ergnActive = false;
                this.filtersInnerActive = false;
                this.itemOpen = false;
                this.desktopOpen = false;
                let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
                filters.item(0).style.setProperty('display', 'flex');
                this.itemsActive = false;
                this.mapActive = false;
                this.mobileItemOpen = false;
                break;
            }
            case 'pay': {
                this.mapBig = false;
                this.loginActive = false;
                this.contactActive = false;
                this.payActive = true;
                this.mapOpen = false;
                this.ergnActive = false;
                this.desktopOpen = false;
                let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
                filters.item(0).style.setProperty('display', 'flex');
                this.filtersInnerActive = false;
                this.itemOpen = false;
                this.itemsActive = false;
                this.mapActive = false;
                this.mobileItemOpen = false;
                break;
            }
            case 'contact': {
                this.mapBig = false;
                this.loginActive = false;
                this.payActive = false;
                this.mapOpen = false;
                this.desktopOpen = false;
                let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
                filters.item(0).style.setProperty('display', 'flex');
                this.contactActive = true;
                this.ergnActive = false;
                this.filtersInnerActive = false;
                this.itemOpen = false;
                this.itemsActive = false;
                this.mapActive = false;
                this.mobileItemOpen = false;
                break;
            }
            case 'test': {
                this.mapBig = false;
                this.loginActive = false;
                this.contactActive = false;
                this.payActive = false;
                this.mapOpen = false;
                this.ergnActive = false;
                this.filtersInnerActive = false;
                this.itemOpen = false;
                this.itemsActive = false;
                this.mapActive = false;
                this.mobileItemOpen = false;
                break;
            }
            case 'egrn' : {
                this.mapBig = false;
                this.loginActive = false;
                this.contactActive = false;
                this.mapOpen = false;
                this.payActive = false;
                this.ergnActive = true;
                this.desktopOpen = false;
                let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
                filters.item(0).style.setProperty('display', 'flex');
                this.filtersInnerActive = false;
                this.itemOpen = false;
                this.itemsActive = false;
                this.mapActive = false;
                this.mobileItemOpen = false;
                break;
            }
            case 'map' : {
                this.mapBig = true;
                this.loginActive = false;
                this.contactActive = false;
                this.ergnActive = false;
                this.payActive = false;
                this.filtersInnerActive = false;
                this.itemOpen = false;
                this.itemsActive = false;
                this.mapOpen = true;
                this.watched = false;
                this.mapActive = true;
                this.filtersActive = false;
                break;
            }
            case 'panorama' : {
                this.mapBig = true;
                this.loginActive = false;
                this.contactActive = false;
                this.payActive = false;
                this.ergnActive = false;
                this.filtersInnerActive = false;
                this.itemOpen = false;
                this.itemsActive = false;
                this.watched = false;
                this.mapActive = true;
                this.filtersActive = false;
                break;
            }
            case 'routes' : {
                this.mapBig = true;
                this.loginActive = false;
                this.contactActive = false;
                this.payActive = false;
                this.ergnActive = false;
                this.filtersInnerActive = false;
                this.itemOpen = false;
                this.itemsActive = false;
                this.watched = false;
                this.mapActive = true;
                this.filtersActive = false;
                break;
            }
            default: {
                this.loginActive = false;
                this.contactActive = true;
                this.payActive = false;
                this.ergnActive = false;
                this.filtersInnerActive = false;
                this.itemOpen = true;
                this.itemsActive = false;
                this.mapActive = false;
                this.shortversion = false;
                this.mapBig = false;
                break;
            }
        }
    }

    similarObj(obj: Item) {
        console.log('hello');
        this.item = obj;
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
        sessionStorage.setItem(JSON.stringify(obj.id), hour + ':' + minute);
        if (this.watchedItems.indexOf(this.item.id) === -1) {
            this.watchedItems.push(this.item.id);
        }
    }

    menuMode(mode) {

        switch (mode) {
            case 'open':
                this.menuOpen = true;
                break;
            case 'close':
                this.menuOpen = false;
                this.blockInputOpen = 'open_menu';
                this.checklogin();
                break;
            case 'close_login':
                this.blockInputOpen = 'open_menu';
                this.checklogin();
                break;
            case  'close_pay':
                this.blockInputOpen = 'open_menu';
                this.checklogin();
                break;
        }
        // console.log('mode:' + mode + ' blockMode:' + this.blockMode + ' blockInputOpen:' + this.blockInputOpen);
    }

    getCoords(coords) {
        this.coordsPolygon = coords;
    }

    get_list(objsOnPage, flag) {
        let coords = this.coordsPolygon;
        this.get_favObjects();
        if (this.localStorage.length != 0) {
            this.watchedItems = [];
            for (let i = 0; i < this.localStorage.length; i++) {
                this.watchedItems.push(Number(this.localStorage.getItem(i)));
            }
        }
        if (flag != 'listscroll') {
            this.items = [];
        }
        if (flag == 'filter') {
            this.pagecounter = 0;
        }
        this.canLoad = 1;
        if (flag == 'find') {
            coords = [];
        }
        this._offer_service.list(this.pagecounter, objsOnPage, this.filters, this.sort, this.equipment, coords, this.searchQuery).subscribe(data => {
            // this.countOfItems = data.hitsCount;
            this.canLoad = 0;
            if (sessionStorage.getItem('useremail') == undefined) {
                this.favItems = [];
            }
            this.hitsCount = data.hitsCount || (this.hitsCount > 0 ? this.hitsCount : 0);
            if (this.pagecounter == 0) {
                for (let i = 0; i < data.hitsCount; i++) {
                    if (this.items.indexOf(data.list[i]) == -1 && data.list[i] != undefined) {
                        if (this.watchedItems.indexOf(data.list[i].id) != -1) {
                            data.list[i].watched = true;
                        }
                        for (let j = 0; j < this.favItems.length; j++) {
                            if (this.favItems[j].id == data.list[i].id) {
                                data.list[i].is_fav = true;
                                console.log('founded: ', data.list[i].id);
                            }
                        }
                        if (flag == 'fav'){
                            data.list[i].is_fav = true;
                        }
                        this.items.push(data.list[i]);
                    }
                }
                this.canLoad = 0;
                for (let i = 0; i < this.favItems.length; i++) {
                    this.favItems[i].is_fav = true;
                }
            } else {
                for (let i = 0; i < data.hitsCount; i++) {
                    if (this.items.indexOf(data.list[i]) == -1 && data.list[i] != undefined) {
                        if (this.watchedItems.indexOf(data.list[i].id) != -1) {
                            data.list[i].watched = true;
                        }
                        for (let j = 0; j < this.favItems.length; j++) {
                            if (this.favItems[j].id == data.list[i].id) {
                                data.list[i].is_fav = true;
                                console.log('founded: ', data.list[i].id);
                            }
                        }
                        this.items.push(data.list[i]);
                    }
                    this.canLoad = 0;
                }
                if(~~(this.hitsCount/20) != this.pagecounter+1 && data.list.length < 20){
                    this.hitsCount -= (20 - data.list.length);
                }
                for (let i = 0; i < this.favItems.length; i++) {
                    this.favItems[i].is_fav = true;
                }
            }
            for (let i = 0; i < this.favItems.length; i++) {
                for (let j = 0; j < this.items.length; j++) {
                    if (this.favItems[i].id == this.items[j].id) {
                        this.items[j].is_fav = true;
                        this.items[j].watched = true;
                    }
                }
            }
            this.canLoad = 0;
        }), err => {
            console.log(err);
            this.canLoad = 0;
        };
    }
    listScroll() {
        let its = document.documentElement.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
        if (its.length != 0) {
            // console.log(its.item(its.length-1).getBoundingClientRect().top, this.canLoad);
            if (this.canLoad == 0 && its.item(its.length-1).getBoundingClientRect().top < 2000){
                this.pagecounter += 1;
                this.get_list(20, 'listscroll');
            }
        }

    }
    checklogin() {
        this.timeAdd = this.localStorage.getItem('timeAdd');
        this._account_service.checklogin().subscribe(res => {
            console.log(res);
            if (res != undefined) {
                let data = JSON.parse(JSON.stringify(res));
                if (data.result == 'success') {
                    this.logged_in = true;
                } else {
                    this.logged_in = false;
                }
            } else {
                this.logged_in = false;
            }
        });
    }
}
