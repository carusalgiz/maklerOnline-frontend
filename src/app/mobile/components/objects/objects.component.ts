import {LOCAL_STORAGE, WINDOW} from '@ng-toolkit/universal';
import {Component, OnInit, AfterViewInit, Inject, OnChanges, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';
import {Item} from '../../../item';
import {ActivatedRoute, Router} from '@angular/router';
import {OfferService} from '../../../services/offer.service';
import {AccountService} from '../../../services/account.service';
import {NgxMetrikaService} from '@kolkov/ngx-metrika';
import {RequestService} from '../../../services/request.service';
import {Request} from '../../../class/Request';
import {Person} from '../../../class/person';

@Component({
    selector: 'app-objects',
    templateUrl: './objects.component.html',
    styleUrls: ['./objects.component.css']
})
export class ObjectsComponent implements OnInit, AfterViewInit {

    private subscription: Subscription;
    initCoords = [48.4862268, 135.0826369];
    tempItems: Item[] = [];
    mapBig = false;
    item_mode: any;
    mainHeight: any;
    blockMode = 'items';
    items: Item[] = [];
    request_items: Item[] = [];
    requests: Request[] = [];
    item: Item;
    filters: any;
    sort: any;
    watched: boolean;
    watchedItems: any[] = [];
    equipment: any;
    coordsPolygon: any[] = [];
    filtersChosen = 'empty';
    changedBound = false;
    countOfItems = 20;
    blockInputOpen = 'close_menu';
    lat = 48.4862268;
    lng = 135.0826369;
    activeButton: string;
    logged_in: any;
    payed: any;
    headerPos: any;
    touchStartPos: any;
    mainObjectsPadding: any;
    pagecounter = 0;
    hitsCount: number = 0;
    canLoad: number = 0;
    searchQuery: string = '';
    suggestionTo: any;
    favItems: Item[] = [];
    findPadding = 90;
    filterScroll = 'top';
    filterText = 'ВЫБЕРИТЕ ФИЛЬТРЫ ДЛЯ ПОИСКА';
    telephone: any;

    modal_title: any;
    modal_text: any;
    modal_action: any;
    modal_action_text: any;
    modal_active = false;
    modal_cancel = true;

    request: Request = new Request();
    person: Person = new Person();

    constructor(private ym: NgxMetrikaService, @Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, route: ActivatedRoute, private router: Router,
                private _offer_service: OfferService,
                private _account_service: AccountService,
                private _request_service: RequestService) {
        this.subscription = route.params.subscribe((urlParams) => {
            if (urlParams['mode'] === 'list') {
                this.blockInputOpen = 'close_menu';
                this.blockMode = 'items';
                this.activeButton = 'items';
                window.scrollTo(0, 0);
                let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
                if (filters.length !== 0) {
                    filters.item(0).style.setProperty('display', 'flex');
                }
            } else if (urlParams['mode'] === 'request') {
                this.blockInputOpen = 'close_menu';
                this.activeButton = 'request';
                window.scrollTo(0, 0);
                let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
                if (filters.length !== 0) {
                    filters.item(0).style.setProperty('display', 'flex');
                }
                this.blockMode = 'filters';
                this.openBlock('filters');
            } else if (urlParams['mode'] === 'filters') {
                this.blockInputOpen = 'close_menu';
                this.activeButton = 'filters';
                window.scrollTo(0, 0);
                let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
                if (filters.length !== 0) {
                    filters.item(0).style.setProperty('display', 'flex');
                }
                this.blockMode = 'filters';
                this.openBlock('filters');
            } else if (urlParams['mode'] == 'request_list') {
                this.blockInputOpen = 'close_menu';
                this.activeButton = 'request_list';
                window.scrollTo(0, 0);
                let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
                if (filters.length !== 0) {
                    filters.item(0).style.setProperty('display', 'flex');
                }
                this.blockMode = 'request_list';
            } else if (urlParams['mode'] === 'fav') {
                this.blockInputOpen = 'close_menu';
                this.blockMode = 'items';
                this.activeButton = 'fav';
                window.scrollTo(0, 0);
                let filters = document.documentElement.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
                if (filters.length !== 0) {
                    filters.item(0).style.setProperty('display', 'flex');
                }
            } else {
                this.blockMode = 'item';
                this.blockInputOpen = 'close_menu';
                this.activeButton = 'obj';
            }
            if (document.location.href.indexOf('request_list') != -1) {
                this.get_requests(20, 'request_test');
            } else {
                this.get_list(20, 'init');
            }
        });
    }

    ngOnInit() {
        this.checklogin();
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
        document.body.style.removeProperty('height');
        document.body.style.removeProperty('background-color');

        let header = document.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
        header.item(0).style.setProperty('z-index', '8');
        header.item(0).style.setProperty('top', '0');
        if (sessionStorage.length !== 0) {
            this.watchedItems = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                this.watchedItems.push(Number(sessionStorage.key(i)));
            }
        }
    }

    ymFunc(target) {
        this.ym.reachGoal.next({target: target});
    }

    changeFav(mode, item) {
        this.get_favObjects();
    }

    modalFunc(name) {
        switch (name) {
            case 'cancel':
                this.modal_active = false;
                break;
            case 'action':
                this.modal_active = false;
                switch (this.modal_action) {
                    case 'login':
                        this.blockInputOpen = 'open_login';
                        break;
                    case 'pay':
                        this.blockInputOpen = 'open_pay';
                        break;
                    case 'request':
                        break;
                    case 'continue':
                        break;
                }
                break;
        }
    }

    modal_info(title, text, action_text, action, cancel) {
        this.modal_title = title;
        this.modal_text = text;
        this.modal_action_text = action_text;
        this.modal_action = action;
        this.modal_active = true;
        this.modal_cancel = cancel;
    }

    updateRequest(request) {
        this.request = request;
    }

    saveRequest() {
        if (this.logged_in == 'false' || this.logged_in == false) {
            this.modal_info('Предупреждение', 'Для сохранения заявки необходимо войти или зарегистрироваться в системе', 'Продолжить', 'login', true);
        } else {
            this.request.person = this.person;
            this.request.personId = this.person.id;
            this.request.searchArea = this.coordsPolygon;
            this.request.categoryCode = 'rezidential';
            console.log(this.request);
            this._request_service.save(this.request).subscribe(request => {
                setTimeout(() => {
                    this.request = request;
                    this.modal_info('Сообщение', 'Заявка сохранена успешно. В ближайшее время с Вами свяжется наш специалист.', 'Продолжить', 'continue', true);
                });
            });
        }
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
                    if (this.items[j].is_fav == true) {
                        this.favItems.push(this.items[j]);
                    }
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
        if (num > 2) {
            if (this.blockMode == 'request_items')
                this.headerPos = -55;
            else
                this.headerPos = -90;
            this.mainObjectsPadding = 0;
            this.mainHeight = 'calc(100vh - 65px)';
            this.findPadding = 0;
        } else if (num < -2) {
            this.headerPos = 0;
            this.mainObjectsPadding = 90;
            this.mainHeight = 'calc(100vh - 155px)';
            if (this.blockMode == 'request_items')
                this.findPadding = 55;
            else
                this.findPadding = 90;
        }
        setTimeout(() => {
            if (document.getElementById('find_filter') != undefined) {
                if (document.getElementById('find_filter').getBoundingClientRect().top < 200) {
                    this.filterText = 'ОПРЕДЕЛИТЕ ОБЛАСТЬ ПОИСКА';
                    this.filterScroll = 'map';
                } else {
                    this.filterText = 'ВЫБЕРИТЕ ФИЛЬТРЫ ДЛЯ ПОИСКА';
                    this.filterScroll = 'top';
                }
            }

        }, 150);
        // console.log(event.changedTouches);
    }

    openBlock(type) {
        setTimeout(() => {
            if (type == 'filters') {
                document.getElementById('fil-top').scrollIntoView({'block': 'center'});
            }
        }, 100);
    }

    checkClick(index, obj, event, flag) {
        if (!event.target.classList.contains('starFav') && !event.target.classList.contains('starImg') && !event.target.classList.contains('contact-line')
            && !event.target.classList.contains('contact-photo') && !event.target.classList.contains('name')) {
            if (flag == 'request_item')
                this.item_mode = 'item_request';
            else
                this.item_mode = 'item';
            this.mainHeight = '100vh';
            this.blockMode = 'item';
            this.checklogin();
            this.blockInputOpen = 'close_menu';
            this.getObj(index, flag);
            this.item = obj;
            this.telephone = this.item.person.phoneBlock.main;
            document.documentElement.scrollTo(0, 0);
        } else if (event.target.classList.contains('contact-line')
            || event.target.classList.contains('contact-photo') || event.target.classList.contains('name')) {
            this.item_mode = 'contact';
            this.mainHeight = '100vh';
            this.blockMode = 'item';
            this.checklogin();
            this.blockInputOpen = 'close_menu';
            this.getObj(index, flag);
            this.item = obj;
            this.telephone = this.item.person.phoneBlock.main;
            document.documentElement.scrollTo(0, 0);
        }
    }

    requestClick(obj, event) {
        this.findPadding = 55;
        this.get_list(20, 'request_items');
        this.blockMode = 'request_items';
    }

    searchStringChanged(e) {
        let c = this;
        clearTimeout(this.suggestionTo);
        this.suggestionTo = setTimeout(() => {
            c.searchParamChanged();
        }, 500);
    }

    searchParamChanged() {
        this.pagecounter = 0;
        if (this.blockMode == 'items') {
            this.get_list(20, 'find');
        }
        if (this.blockMode == 'request_list') {
            this.get_requests(20, 'find');
        }
    }

    showContact() {
        if (this.logged_in == 'false' || this.logged_in == false) {
            this.modal_info('Предупреждение', 'Для просмотра контактов необходимо войти или зарегистрироваться в системе', 'Продолжить', 'login', true);
        } else if (this.payed == 'false' || this.payed == false) {
            this.modal_info('Предупреждение', 'Для просмотра контактов необходимо оплатить доступ', 'Продолжить', 'pay', true);
        }
    }

    setFilters(filters) {
        this.filters = filters;
    }

    setSort(sort) {
        this.sort = sort;
    }

    setEquipment(equipment) {
        this.equipment = equipment;
    }

    filtersChosenFunc(event) {
        this._offer_service.list(0, 1, this.filters, this.sort, this.equipment, this.coordsPolygon, this.searchQuery).subscribe(data => {
            this.countOfItems = data.hitsCount;
            this.filtersChosen = event;
            console.log(this.countOfItems, this.filtersChosen);
        });
    }

    close(name, id) {
        console.log('func work ' + name, ' id: ', id);
        switch (name) {
            case 'item': {
                this.mainHeight = 'calc(100vh - 155px)';
                this.blockInputOpen = 'close_menu';
                this.blockMode = 'items';
                this.activeButton = 'items';
                this.item_mode = 'none';
                let filt = document.getElementById('filters_open') as HTMLElement;
                filt.style.setProperty('opacity', '0');
                setTimeout(() => {
                    let it = document.getElementById(id) as HTMLElement;
                    console.log(it);
                    it.scrollIntoView({block: 'center'});
                    filt.style.setProperty('opacity', '1');
                }, 200);
                break;
            }
            case 'contact': {
                this.mainHeight = 'calc(100vh - 155px)';
                this.blockInputOpen = 'close_menu';
                this.blockMode = 'items';
                this.activeButton = 'items';
                this.item_mode = 'none';
                let filt = document.getElementById('filters_open') as HTMLElement;
                filt.style.setProperty('opacity', '0');
                setTimeout(() => {
                    let it = document.getElementById(id) as HTMLElement;
                    console.log(it);
                    it.scrollIntoView({block: 'center'});
                    filt.style.setProperty('opacity', '1');
                }, 200);
                break;
            }
            case 'item_request': {
                this.mainHeight = 'calc(100vh - 155px)';
                this.blockInputOpen = 'close_menu';
                this.blockMode = 'request_items';
                this.activeButton = 'request_items';
                this.item_mode = 'none';
                let filt = document.getElementById('filters_open') as HTMLElement;
                filt.style.setProperty('opacity', '0');
                setTimeout(() => {
                    let it = document.getElementById(id) as HTMLElement;
                    console.log(it);
                    it.scrollIntoView({block: 'center'});
                    filt.style.setProperty('opacity', '1');
                }, 100);
                break;
            }
            default: {
                console.log('default');
                break;
            }
        }
    }

    onResize() {
        this.watched = false;
    }

    getObj(index, flag) {
        this.blockMode = 'item';
        if (flag == 'list') {
            this.item = this.items[index];
        } else if (flag == 'fav') {
            this.item = this.favItems[index];
        } else if (flag == 'request_item') {
            this.item = this.request_items[index];
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
        sessionStorage.setItem(JSON.stringify(this.item.id), time);
        if (this.watchedItems.indexOf(index) === -1) {
            this.watchedItems.push(index);
        }
        let filtersInner = document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
        filtersInner.item(0).style.setProperty('right', '0');
    }

    menuMode(mode) {

        switch (mode) {
            case 'open_menu':
                this.tempItems = this.items;
                this.blockInputOpen = 'open_menu';
                break;
            case 'close_menu':
                this.items = [];
                this.blockInputOpen = 'close_menu';
                this.checklogin();
                setTimeout(() => {
                    console.log(this.tempItems);
                    this.items = this.tempItems;
                }, 100);

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
    }

    getCoords(coords) {
        this.coordsPolygon = coords;
    }

    setFocus(name) {
        document.getElementById(name).focus();
    }

    get_requests(objsOnPage, flag) {
        if (flag != 'listscroll') {
            this.requests = [];
        }

        this._request_service.list(this.pagecounter, objsOnPage).subscribe(
            data => {
                if (this.pagecounter == 0) {
                    for (let i = 0; i < data.hitsCount; i++) {
                        if (this.requests.indexOf(data.list[i]) == -1 && data.list[i] != undefined) {
                            this.requests.push(data.list[i]);
                        }
                    }
                    this.canLoad = 0;
                } else {
                    for (let i = 0; i < data.hitsCount; i++) {
                        if (this.requests.indexOf(data.list[i]) == -1 && data.list[i] != undefined) {
                            this.requests.push(data.list[i]);
                        }
                        this.canLoad = 0;
                    }
                    if (~~(this.hitsCount / 20) != this.pagecounter + 1 && data.list.length < 20) {
                        this.hitsCount -= (20 - data.list.length);
                    }
                }
                console.log(this.requests);
            },
            err => console.log(err)
        );

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
            this.countOfItems = data.hitsCount;
            if (flag == 'chose' || flag == 'empty') {
                this.filtersChosen = flag;
            }
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
                        if (flag == 'fav') {
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
                if (~~(this.hitsCount / 20) != this.pagecounter + 1 && data.list.length < 20) {
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
            if (flag == 'request_items') {
                this.request_items = this.items;
            }
            console.log(this.items);
        }), err => {
            console.log(err);
            this.canLoad = 0;
        };
    }

    listScroll(event: TouchEvent) {
        let num = this.touchStartPos - event.changedTouches[0].clientY;
        let its = document.documentElement.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
        if (its.length != 0 && num > 2) {
            if (this.canLoad == 0 && its.item(its.length - 1).getBoundingClientRect().top < 2000) {
                this.pagecounter += 1;
                this.get_list(20, 'listscroll');
            }
        }
    }

    listScrollRequests(event: TouchEvent) {
        let num = this.touchStartPos - event.changedTouches[0].clientY;
        let its = document.documentElement.getElementsByClassName('request-outer-block') as HTMLCollectionOf<HTMLElement>;
        if (its.length != 0 && num > 2) {
            if (this.canLoad == 0 && its.item(its.length - 1).getBoundingClientRect().top < 2000) {
                this.pagecounter += 1;
                this.get_requests(20, 'listscroll');
            }
        }
    }

    checklogin() {
        this._account_service.checklogin().subscribe(res => {
            console.log(res);
            if (res != undefined) {
                let data = JSON.parse(JSON.stringify(res));
                this.logged_in = data.result == 'success';
            } else {
                this.logged_in = false;
            }
        });
    }
}
