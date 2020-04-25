import {Component, OnInit, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ConfigService} from './services/config.service';
import {AccountService} from './services/account.service';
import {HttpClient} from '@angular/common/http';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit, AfterViewInit {
    deviceInfo = null;

    siteUrl = '';

    constructor(private _http: HttpClient, private route: ActivatedRoute, private deviceService: DeviceDetectorService, private  config: ConfigService, private _account_service: AccountService) {
        this.siteUrl = this.config.getConfig('siteUrl');
        this.resolveDevice();
    }

    title = 'app';
    delta = 0;
    width = document.documentElement.clientWidth;
    touchCheck = false;
    timer: any;

    ngOnInit() {
        sessionStorage.clear();
        // sessionStorage.removeItem('access');
        //  sessionStorage.removeItem('session');
        //  sessionStorage.removeItem('expires');
        // sessionStorage
        // sessionStorage.removeItem('logged_in');
        localStorage.clear();
        let Visible = function(elem) {
            let mapbuttons = document.getElementsByClassName('map-buttons-tablet') as HTMLCollectionOf<HTMLElement>;
            let mapbuttonsMobile = document.getElementsByClassName('map-buttons-mobile') as HTMLCollectionOf<HTMLElement>;
            let mapbuttonsdesk = document.getElementsByClassName('map-buttons') as HTMLCollectionOf<HTMLElement>;
            let mobileMenu = document.getElementsByClassName('mobileTopMenu') as HTMLCollectionOf<HTMLElement>;
            let filters = document.getElementsByClassName('filters-menu-desktop') as HTMLCollectionOf<HTMLElement>;
            let arrowsmobile = document.getElementsByClassName('arrows-mobile') as HTMLCollectionOf<HTMLElement>;

            // let targetPosition = {
            //         top: window.pageYOffset + elem.getBoundingClientRect().top,
            //         left: window.pageXOffset + elem.getBoundingClientRect().left,
            //         right: window.pageXOffset + elem.getBoundingClientRect().right,
            //         bottom: window.pageYOffset + elem.getBoundingClientRect().bottom
            //     },
            //     // Получаем позиции окна
            //     windowPosition = {
            //         top: window.pageYOffset,
            //         left: window.pageXOffset,
            //         right: window.pageXOffset + document.documentElement.clientWidth,
            //         bottom: window.pageYOffset + document.documentElement.clientHeight
            //     };

            let desk = document.getElementsByClassName('desk') as HTMLCollectionOf<HTMLElement>;
            let addRight = document.getElementsByClassName('output') as HTMLCollectionOf<HTMLElement>;
            let catalog = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
            let mapTest = document.getElementsByClassName('mapTest') as HTMLCollectionOf<HTMLElement>;
            let map = document.getElementsByClassName('filters-map') as HTMLCollectionOf<HTMLElement>;
            if (elem.getBoundingClientRect().top < 0 && elem.getBoundingClientRect().bottom > -150 && document.documentElement.clientWidth <= 1050 && desk.length != 0) {
                console.log('Вы видите элемент :)');
                // console.log('buttons' + mapbuttonsMobile.length);
                if ((mobileMenu.length != 0 && (desk.length != 0 || catalog.length != 0) || (map.length != 0 && map.item(0).getBoundingClientRect().top < document.documentElement.clientHeight - 80))) {
                    console.log(mapbuttonsMobile);
                    mobileMenu.item(0).style.setProperty('display', 'flex');
                }
                if (arrowsmobile.length != 0 && (desk.length != 0 || catalog.length != 0) && mapTest.length == 0) {
                    arrowsmobile.item(0).style.setProperty('display', 'flex');
                }
                if (filters.length != 0) {
                    filters.item(0).style.setProperty('display', 'none');
                }
                if (mapbuttonsdesk.length != 0) {
                    mapbuttonsdesk.item(0).style.setProperty('display', ' none');
                }
            } else if (elem.getBoundingClientRect().top < 500 && elem.getBoundingClientRect().bottom > 150 && document.documentElement.clientWidth > 1520 && desk.length != 0) {
                if (mapbuttonsdesk.length != 0) {
                    mapbuttonsdesk.item(0).style.setProperty('display', ' flex');
                }
            } else if (elem.getBoundingClientRect().top > -500 && elem.getBoundingClientRect().bottom > 150 && document.documentElement.clientWidth > 1050 && document.documentElement.clientWidth < 1520 && desk.length != 0) {
                if (mapbuttonsdesk.length != 0) {
                    mapbuttonsdesk.item(0).style.setProperty('display', ' flex');
                }
            } else {
                // console.log('Вы не видите элемент');
                if (filters.length != 0 && desk.length != 0 && document.documentElement.clientWidth > 1000) {
                    filters.item(0).style.setProperty('display', 'flex');
                }
                if (mobileMenu.length != 0 && addRight.length == 0) {
                    mobileMenu.item(0).style.setProperty('display', 'flex');
                }
                if (mapbuttonsdesk.length != 0) {
                    mapbuttonsdesk.item(0).style.setProperty('display', ' none');
                }
                if (arrowsmobile.length != 0 && (desk.length != 0 || catalog.length != 0)) {
                    arrowsmobile.item(0).style.setProperty('display', ' flex');
                }
            }
        };
        let touchstart, touchend;
        // document.addEventListener('mouseup', event =>  {
        //
        //   let slide = document.getElementsByClassName('right-slide-box')   as HTMLCollectionOf<HTMLElement>;
        //   // console.log( event.offsetX + " " + (document.documentElement.offsetWidth - slide.item(1).offsetWidth));
        //   if (slide.item(0).classList.contains('open') && event.pageX < document.documentElement.offsetWidth - slide.item(0).offsetWidth) {
        //     slide.item(0).classList.remove('open');
        //   }
        //   if (slide.item(1).classList.contains('open') && event.pageX < document.documentElement.offsetWidth - slide.item(1).offsetWidth) {
        //     slide.item(1).classList.remove('open');
        //   }
        //   if (slide.item(2).classList.contains('open') && event.pageX < document.documentElement.offsetWidth - slide.item(2).offsetWidth) {
        //     slide.item(2).classList.remove('open');
        //   }
        //   if (slide.item(3).classList.contains('open') && event.pageX < document.documentElement.offsetWidth - slide.item(3).offsetWidth) {
        //     slide.item(3).classList.remove('open');
        //   }
        // });
//         document.addEventListener('touchstart', event => {
//             touchstart = event.changedTouches[0].clientY;
//            // console.log('touchstart: ' + event.changedTouches[0].pageY);
//         });
//         document.addEventListener('touchend', event =>  {
//           //   console.log('touchend: ' + event.changedTouches[0].pageY);
//           //   let header = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
//           //   let main = document.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
//             let mainHome = document.getElementsByClassName('mainHome') as HTMLCollectionOf<HTMLElement>;
//             // let bigGalleryBlock = document.getElementsByClassName('bigGalleryBlock') as HTMLCollectionOf<HTMLElement>;
//             let showItemsButton = document.getElementsByClassName('show-items') as HTMLCollectionOf<HTMLElement>;
//             // let add_block = document.getElementsByClassName('add-block-menu')   as HTMLCollectionOf<HTMLElement>;
//             // let hideFilterButton = document.getElementsByClassName('hideFilterButton')   as HTMLCollectionOf<HTMLElement>;
//             touchend = event.changedTouches[0].clientY;
//             let num = touchstart - touchend;
//             // let val = num > 0 ? '-80px' :  '30px';
//             // if (hideFilterButton.length != 0) {
//             //     hideFilterButton.item(0).style.setProperty('bottom', val);
//             // }
//             // console.log(num + " start:" + touchstart + " end:" + touchend);
//             let wth = document.documentElement.clientWidth;
//
//             if (num > 0) {
//               if ( document.documentElement.clientWidth <= 1200) {
//                 if (showItemsButton.length != 0) {
//                   showItemsButton.item(0).style.setProperty('top', '0');
//                 }
//                 // if (main.length != 0) {
//                 //   main.item(0).style.setProperty('padding-top', '55px');
//                 // }
//                 if (mainHome.length != 0) {
//                   if (wth < 1050) {
//                     mainHome.item(0).style.setProperty('margin-top', '0');
//                   }
//                 }
//               }
// // -220 .getBoundingClientRect().top < 0
//             } else if (num < 0) {
//             //  console.log(map);
//            //   console.log(map.item(0).getBoundingClientRect().top);map.length == 0 ||
// //|| map.item(0).getBoundingClientRect().top > document.documentElement.clientHeight - 80
// //                 if (header.length != 0 && (!add_block.item(0).classList.contains('close') || !add_block.item(1).classList.contains('close')
// //                   || !add_block.item(2).classList.contains('close') )) {
// //                   header.item(0).style.setProperty('top', '0');
// //                   header.item(0).style.setProperty('z-index', '8');
// //                 }
//
//
//               if (showItemsButton.length != 0) {
//                 showItemsButton.item(0).style.setProperty('top', '90px');
//               }
//
//               if (mainHome.length != 0) {
//                 if (wth < 650) {
//                   mainHome.item(0).style.setProperty('margin-top', '90px');
//                 }
//                 if (wth > 650 && wth < 1050) {
//                       mainHome.item(0).style.setProperty('margin-top', '130px');
//                 }
//               }
//
//                 // if (main.length != 0) {
//                 //     if (bigGalleryBlock.length == 0) {
//                 //             if (wth < 650) {
//                 //               main.item(0).style.setProperty('padding-top', '95px');
//                 //             } else {
//                 //                 main.item(0).style.setProperty('padding-top', '137px');
//                 //             }
//                 //     } else {
//                 //         main.item(0).style.setProperty('padding-top', '0');
//                 //     }
//                 // }
//             }
//         });
        //  document.addEventListener('touchmove', function () {
        //   //   console.log(event.changedTouches[0].pageY);
        //      let map =  document.getElementsByClassName('map open') as HTMLCollectionOf<HTMLElement>;
        // //   console.log(map);
        //    if (document.documentElement.clientWidth < 650) {
        //      if (map.length != 0) {
        //        Visible(map.item(0));
        //      }
        //    }
        //  });
        document.addEventListener('wheel', event => {
            let map = document.getElementsByClassName('map open') as HTMLCollectionOf<HTMLElement>;
            //     console.log(map);
            if (document.documentElement.clientWidth < 650) {
                if (map.length != 0) {
                    Visible(map.item(0));
                    if (map.length > 1) {
                        Visible(map.item(1));
                    }
                }
            } else {
                if (map.length != 0 && map.item(1) != undefined && map.item(1) != null) {
                    Visible(map.item(1));
                }
            }
            let addobject = document.getElementsByClassName('add-obj-ext') as HTMLCollectionOf<HTMLElement>;
            let history = document.getElementsByClassName('history') as HTMLCollectionOf<HTMLElement>;
            let addButton = document.getElementsByClassName('add-button') as HTMLCollectionOf<HTMLElement>;
            let addr = document.getElementsByClassName('address-block') as HTMLCollectionOf<HTMLElement>;
            let mapbuttonstab = document.getElementsByClassName('map-buttons-tablet') as HTMLCollectionOf<HTMLElement>;
            let items = document.getElementsByClassName('header') as HTMLCollectionOf<HTMLElement>;
            let uselessLine = document.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
            let mobileMenu = document.getElementsByClassName('mobileTopMenu') as HTMLCollectionOf<HTMLElement>;
            let filters = document.getElementsByClassName('filters-menu-desktop') as HTMLCollectionOf<HTMLElement>;
            let filter = document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLElement>;
            let main = document.getElementsByClassName('scroll-container') as HTMLCollectionOf<HTMLElement>;
            let scrollItems = document.getElementsByClassName('scroll-items open') as HTMLCollectionOf<HTMLElement>;
            let filtersbox = document.getElementsByClassName('filters-box') as HTMLCollectionOf<HTMLElement>;
            let mainHome = document.getElementsByClassName('mainHome') as HTMLCollectionOf<HTMLElement>;
            let show = document.getElementsByClassName('show-items') as HTMLCollectionOf<HTMLElement>;
            let catalog = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
            let photofull = document.getElementsByClassName('photoFull') as HTMLCollectionOf<HTMLElement>;
            let objs = document.getElementsByClassName('filters objs') as HTMLCollectionOf<HTMLElement>;
            let ymaps = document.documentElement.getElementsByTagName('ymaps');
            let hide = document.documentElement.getElementsByClassName('hideMenu');

            if (event.target != ymaps.item(3) ) {
                if ((event.deltaY > 0)) {
                    this.delta = 0;
                    for (let i = 0; i < photofull.length; i++) {
                        if (photofull.item(i).getBoundingClientRect().top < 0) {
                            if (show.length != 0) {
                                show.item(0).style.setProperty('top', '60px');
                            }
                            items.item(0).style.setProperty('top', '-130px');
                            if (uselessLine.length != 0) {
                                uselessLine.item(0).style.setProperty('top', '0');
                                uselessLine.item(0).style.setProperty('margin-bottom', '0');
                            }
                            if (filter.length != 0) {
                                filter.item(0).style.setProperty('top', '60px');
                                filter.item(0).style.setProperty('height', 'calc(100vh - 60px)');
                            }
                            if (main.length != 0) {
                                main.item(0).style.setProperty('top', '60px');
                                main.item(0).style.setProperty('height', 'calc(100vh - 60px)');
                            }
                            for (let q = 0; q < filtersbox.length; q++) {
                                filtersbox.item(q).style.setProperty('height', 'calc(100vh - 60px)');
                                filtersbox.item(q).style.setProperty('top', '0');
                            }

                            if (filters.length != 0) {
                                filters.item(0).style.setProperty('top', '0');
                            }
                            if (uselessLine.length != 0) {
                                uselessLine.item(0).classList.add('scroll');
                            }
                            items.item(0).classList.add('scroll');
                            if (objs.length != 0) {
                                objs.item(0).style.setProperty('top', '0');
                            }
                        }
                    }
                    if (main.length != 0) {
                            main.item(0).style.setProperty('top', '60px');
                            main.item(0).style.setProperty('height', 'calc(100vh - 60px)');
                    }
                    if  ((filtersbox.length != 0 && filtersbox.item(0).classList.contains('open') && (addButton.item(0).getBoundingClientRect().top < 100 || hide.item(0).getBoundingClientRect().top < 100
                        || hide.item(1).getBoundingClientRect().top < 100 || hide.item(2).getBoundingClientRect().top < 100 || hide.item(3).getBoundingClientRect().top < 100))
                    || (main.length != 0 && main.item(0).getBoundingClientRect().top < 200)){
                        if (main.length != 0) {
                            main.item(0).style.setProperty('top', '60px');
                            main.item(0).style.setProperty('height', 'calc(100vh - 60px)');
                        }
                        items.item(0).style.setProperty('top', '-130px');
                        if (uselessLine.length != 0) {
                            uselessLine.item(0).classList.add('scroll');
                            uselessLine.item(0).style.setProperty('top', '0');
                            uselessLine.item(0).style.setProperty('margin-bottom', '0');
                        }
                        items.item(0).classList.add('scroll');

                        if (filter.length != 0) {
                            filter.item(0).style.setProperty('top', '60px');
                            filter.item(0).style.setProperty('height', 'calc(100vh - 60px)');
                        }
                        if (show.length != 0) {
                            show.item(0).style.setProperty('top', '60px');
                        }
                        if (filters.length != 0) {
                            filters.item(0).style.setProperty('top', '0');
                        }
                        for (let i = 0; i < filtersbox.length; i++) {
                            filtersbox.item(i).style.setProperty('height', 'calc(100vh - 60px)');
                            filtersbox.item(i).style.setProperty('top', '0');
                        }
                    }

                    if (
                        (catalog.length != 0 && catalog.item(0).getBoundingClientRect().top < 0) ||
                        (photofull.length != 0 && photofull.item(0).getBoundingClientRect().top < 0)) {
                        if (show.length != 0) {
                            show.item(0).style.setProperty('top', '60px');
                        }
                        for (let i = 0; i < filtersbox.length; i++) {
                            filtersbox.item(i).style.setProperty('height', 'calc(100vh - 60px)');
                            filtersbox.item(i).style.setProperty('top', '0');
                        }
                        items.item(0).style.setProperty('top', '-130px');
                        if (uselessLine.length != 0) {
                            uselessLine.item(0).style.setProperty('top', '0');
                            uselessLine.item(0).style.setProperty('margin-bottom', '0');
                            uselessLine.item(0).classList.add('scroll');
                        }
                        if (filter.length != 0) {
                            filter.item(0).style.setProperty('top', '60px');
                            filter.item(0).style.setProperty('height', 'calc(100vh - 60px)');
                        }
                        if (main.length != 0) {
                            main.item(0).style.setProperty('top', '60px');
                            main.item(0).style.setProperty('height', 'calc(100vh - 60px)');
                        }
                        if (filters.length != 0) {
                            filters.item(0).style.setProperty('top', '0');
                        }
                        // if (day.length != 0) {
                        //   day.item(0).style.setProperty('top', '70px');
                        // }
                        items.item(0).classList.add('scroll');
                    }


                    if (mainHome.length != 0 && document.documentElement.clientWidth > 1050) {
                        mainHome.item(0).style.setProperty('margin-top', '0');
                        items.item(0).classList.add('scroll');
                    }
                    if (mobileMenu.length != 0) {
                        mobileMenu.item(0).style.setProperty('top', '0');
                    }

                    if (addobject.length != 0) {
                        addobject.item(0).style.setProperty('top', '0');
                    }
                    if (history.length != 0) {
                        history.item(0).style.setProperty('top', '0');
                    }
                    if (addr.length != 0) {
                        addr.item(0).style.setProperty('top', '0');
                    }
                    if (mapbuttonstab.length != 0) {
                        mapbuttonstab.item(0).style.setProperty('top', '0');
                    }

                } else {
                    this.delta += event.deltaY;
                    if (uselessLine.item(0).classList.contains('homePage')) {
                        items.item(0).style.setProperty('top', '0');
                    }

                    if ((scrollItems.length != 0 || main.length != 0) && uselessLine.length != 0 && this.delta < -300) {
                        if (main.length != 0) {
                            main.item(0).style.setProperty('top', '190px');
                            main.item(0).style.setProperty('height', 'calc(100vh - 190px)');
                        }
                        for (let i = 0; i < filtersbox.length; i++) {
                            filtersbox.item(i).style.setProperty('top', '130px');
                            filtersbox.item(i).style.setProperty('height', 'calc(100vh - 190px)');
                        }
                        if (show.length != 0) {
                            show.item(0).style.setProperty('top', '190px');
                        }
                        if (objs.length != 0) {
                            objs.item(0).style.setProperty('top', '130px');
                        }
                        if (uselessLine.length != 0) {
                            uselessLine.item(0).classList.remove('scroll');
                            uselessLine.item(0).style.setProperty('top', '130px');
                            uselessLine.item(0).style.setProperty('margin-bottom', '130px');
                        }
                        items.item(0).classList.remove('scroll');

                        if (filters.length != 0) {
                            filters.item(0).style.setProperty('top', '130px');
                        }
                        items.item(0).style.setProperty('top', '0');
                        if (filter.length != 0) {
                            filter.item(0).style.setProperty('top', '190px');
                            filter.item(0).style.setProperty('height', 'calc(100vh - 190px)');
                        }
                    } else if (scrollItems.length == 0 && uselessLine.length != 0 && !uselessLine.item(0).classList.contains('homePage')) {
                        for (let i = 0; i < filtersbox.length; i++) {
                            filtersbox.item(i).style.setProperty('top', '130px');
                            filtersbox.item(i).style.setProperty('height', 'calc(100vh - 190px)');
                        }
                        if (show.length != 0) {
                            show.item(0).style.setProperty('top', '190px');
                        }
                        if (objs.length != 0) {
                            objs.item(0).style.setProperty('top', '130px');
                        }
                        items.item(0).style.setProperty('top', '0');
                        if (uselessLine.length != 0) {
                            uselessLine.item(0).classList.remove('scroll');
                            uselessLine.item(0).style.setProperty('top', '130px');
                            uselessLine.item(0).style.setProperty('margin-bottom', '130px');
                        }
                        items.item(0).classList.remove('scroll');

                        if (filters.length != 0) {
                            filters.item(0).style.setProperty('top', '130px');
                        }
                        if (filter.length != 0) {
                            filter.item(0).style.setProperty('top', '190px');
                            filter.item(0).style.setProperty('height', 'calc(100vh - 190px)');
                        }
                    }

                    if (mainHome.length != 0 && document.documentElement.clientWidth > 1050) {
                        mainHome.item(0).style.setProperty('margin-top', '130px');
                        items.item(0).classList.remove('scroll');
                    }
                    if (mobileMenu.length != 0) {
                        mobileMenu.item(0).style.setProperty('top', '130px');
                    }


                    if (addobject.length != 0) {
                        addobject.item(0).style.setProperty('top', '130px');
                    }
                    if (history.length != 0) {
                        history.item(0).style.setProperty('top', '190px');
                    }
                    if (addr.length != 0) {
                        addr.item(0).style.setProperty('top', '130px');
                    }
                    if (mapbuttonstab.length != 0) {
                        mapbuttonstab.item(0).style.setProperty('top', '130px');
                    }
                }
            }
        });
    }

    ngAfterViewInit() {
    }

    resolveDevice() {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        const isDesktopDevice = this.deviceService.isDesktop();

        console.log(document.location.href);
        let url = document.location.href;
        console.log('-');
        if (url.indexOf('access_token') != -1) {

            let str = url.split('=');
            console.log(str);
            let pars = [];
            for (let i = 1; i < str.length; i++) {
                let par = str[i].split('&');
                console.log(par);
                pars.push(par[0]);
            }

            let params = {
                access_token: pars[0],
                session_secret_key: pars[1],
                expires: pars[2]
            };
            sessionStorage.setItem('access', params.access_token);
            sessionStorage.setItem('session', params.session_secret_key);
            sessionStorage.setItem('expires', (Date.now() / 1000 + Number.parseInt(params.expires, 10)).toString());
            console.log(sessionStorage.getItem('access'));
            console.log(params);
            if (isMobile) {
                document.location.href = '//' + this.siteUrl + '/#/m';
            } else if (isDesktopDevice) {
                document.location.href = '//' + this.siteUrl + '/#/d/objects/list';
            }  else {
                document.location.href = '//' + this.siteUrl + '/#/d';
            }
        }
        setTimeout(e => {
            console.log('done!');
        }, 5000);

        if (url.indexOf(this.siteUrl + '/#/m') == -1 && url.indexOf(this.siteUrl + '/#/d') == -1 && url.indexOf(this.siteUrl + '/#/sitemap.xml') == -1 &&
            url.indexOf(this.siteUrl + '/#/t') == -1 && url.indexOf(this.siteUrl + ':4000') == -1 && url.indexOf('access_token') == -1) {
            if (isMobile) {
                document.location.href = '//' + this.siteUrl + '/#/m';
            } else if (isDesktopDevice) {
                document.location.href = '//' + this.siteUrl + '/#/d';
            } else {
                document.location.href = '//' + this.siteUrl + '/#/d';
            }
        } else if (url.indexOf(this.siteUrl + '/#/m') == -1 && isMobile) {
            document.location.href = '//' + this.siteUrl + '/#/m';
        } else if (url.indexOf(this.siteUrl + '/#/d') == -1 && isDesktopDevice) {
            document.location.href = '//' + this.siteUrl + '/#/d';
        }
    }
}
