import { Component, OnInit, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import {ConfigService} from "./services/config.service";
import {split} from 'ts-node';
import {AccountService} from './services/account.service';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {AsyncSubject} from 'rxjs';
import {log} from 'util';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit, AfterViewInit {
    deviceInfo = null;

    siteUrl = "";
    constructor( private _http: HttpClient, private route: ActivatedRoute, private deviceService: DeviceDetectorService, private  config: ConfigService,private _account_service: AccountService) {
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
        let Visible = function (elem) {
            let mapbuttons =  document.getElementsByClassName('map-buttons-tablet') as HTMLCollectionOf<HTMLElement>;
            let mapbuttonsMobile =  document.getElementsByClassName('map-buttons-mobile') as HTMLCollectionOf<HTMLElement>;
            let mapbuttonsdesk =  document.getElementsByClassName('map-buttons') as HTMLCollectionOf<HTMLElement>;
            let mobileMenu = document.getElementsByClassName('mobileTopMenu')   as HTMLCollectionOf<HTMLElement>;
            let filters = document.getElementsByClassName('filters-menu-desktop')   as HTMLCollectionOf<HTMLElement>;
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
            let addRight = document.getElementsByClassName('output')   as HTMLCollectionOf<HTMLElement>;
            let catalog = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
          let mapTest = document.getElementsByClassName('mapTest') as HTMLCollectionOf<HTMLElement>;
          let map =  document.getElementsByClassName('filters-map') as HTMLCollectionOf<HTMLElement>;
            if (elem.getBoundingClientRect().top < 0 && elem.getBoundingClientRect().bottom > -150  && document.documentElement.clientWidth <= 1050 && desk.length != 0) {
                console.log('Вы видите элемент :)');
             // console.log('buttons' + mapbuttonsMobile.length);
                if ((mobileMenu.length != 0 && (desk.length != 0 || catalog.length != 0) || (map.length != 0 && map.item(0).getBoundingClientRect().top < document.documentElement.clientHeight - 80)) ) {
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
            } else if (elem.getBoundingClientRect().top > -500 && elem.getBoundingClientRect().bottom > 150 && document.documentElement.clientWidth > 1050 && document.documentElement.clientWidth < 1520  && desk.length != 0)  {
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
            let map =  document.getElementsByClassName('map open') as HTMLCollectionOf<HTMLElement>;
       //     console.log(map);
            if (document.documentElement.clientWidth < 650) {
              if (map.length != 0) {
                Visible(map.item(0));
                if (map.length > 1) { Visible(map.item(1)); }
              }
            } else {
              if (map.length != 0 && map.item(1) != undefined && map.item(1) != null) {
                Visible(map.item(1));
              }
            }
          let addobject =  document.getElementsByClassName('add-obj-ext') as HTMLCollectionOf<HTMLElement>;
          let history =  document.getElementsByClassName('history') as HTMLCollectionOf<HTMLElement>;
          let addButton = document.getElementsByClassName('add-button') as HTMLCollectionOf<HTMLElement>;
          let addr = document.getElementsByClassName('address-block') as HTMLCollectionOf<HTMLElement>;
          let mapbuttonstab =  document.getElementsByClassName('map-buttons-tablet') as HTMLCollectionOf<HTMLElement>;
          let items = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
          let uselessLine = document.getElementsByClassName('uselessLine')   as HTMLCollectionOf<HTMLElement>;
          let mobileMenu = document.getElementsByClassName('mobileTopMenu')   as HTMLCollectionOf<HTMLElement>;
          let filters = document.getElementsByClassName('filters-menu-desktop')   as HTMLCollectionOf<HTMLElement>;
          let filter = document.getElementsByClassName('filters')   as HTMLCollectionOf<HTMLElement>;
          let scrollItems = document.getElementsByClassName('scroll-items open')   as HTMLCollectionOf<HTMLElement>;
          let filtersbox = document.getElementsByClassName('filters-box')   as HTMLCollectionOf<HTMLElement>;
          let slide = document.getElementsByClassName('right-slide-box')   as HTMLCollectionOf<HTMLElement>;
          let mainHome =  document.getElementsByClassName('mainHome')   as HTMLCollectionOf<HTMLElement>;
          let show = document.getElementsByClassName('show-items') as HTMLCollectionOf<HTMLElement>;
          let arrows = document.getElementsByClassName('arrow comparisonArrow')   as HTMLCollectionOf<HTMLElement>;
          let day = document.getElementsByClassName('dayExt') as HTMLCollectionOf<HTMLElement>;
          let catalog = document.getElementsByClassName('catalog-item') as HTMLCollectionOf<HTMLElement>;
          let photofull = document.getElementsByClassName('photoFull') as HTMLCollectionOf<HTMLElement>;
          let objs = document.getElementsByClassName('filters objs') as HTMLCollectionOf<HTMLElement>;
          let dark = document.getElementsByClassName('darkBlueLine') as HTMLCollectionOf<HTMLElement>;
          let ymaps = document.documentElement.getElementsByTagName('ymaps');
          let hide = document.documentElement.getElementsByClassName('hideMenu');

          // console.log(document.documentElement.offsetHeight);
          // console.log('hi ' + desk.item(0).scrollTop);


          if (event.target != ymaps.item(3)) {

          if ((event.deltaY > 0)) {
            if (uselessLine.item(0).classList.contains('homePage')) {
                items.item(0).style.setProperty('top', '-130px');
                for (let i = 0; i < slide.length; i++) {
                  slide.item(i).style.setProperty('top', '0');
                  slide.item(i).style.setProperty('height', '100vh');
                }

            }
            this.delta = 0;
            for (let i = 0; i < photofull.length; i++) {
              if (photofull.item(i).getBoundingClientRect().top < 0) {
                for (let q = 0; q < slide.length; q++) {
                  slide.item(q).style.setProperty('top', '65px');
                  slide.item(q).style.setProperty('height', 'calc(100vh - 65px)');
                }
                if (show.length != 0) {
                  show.item(0).style.setProperty('top', '65px');
                }
                items.item(0).style.setProperty('top', '-130px');
                uselessLine.item(0).style.setProperty('top', '0');
                uselessLine.item(0).style.setProperty('margin-bottom', '0');
                for (let q = 0; q < filtersbox.length; q++) {
                  filtersbox.item(q).style.setProperty('height', 'calc(100vh - 65px)');
                  filtersbox.item(q).style.setProperty('top', '0');
                }

                if (filters.length != 0) {
                  filters.item(0).style.setProperty('top', '0');
                }
                uselessLine.item(0).classList.add('scroll');
                items.item(0).classList.add('scroll');
                if (objs.length != 0) {
                  objs.item(0).style.setProperty('top', '0');
                }
                if ( dark.length != 0) {
                  dark.item(0).style.setProperty('top', '0');
                }
              }
              if (arrows.length != 0) {
                arrows.item(0).style.setProperty('top', '35vh');
                arrows.item(1).style.setProperty('top', '35vh');
              }
            }
            if (filtersbox.length != 0 && filtersbox.item(0).classList.contains('open') && (addButton.item(0).getBoundingClientRect().top < 100 || hide.item(0).getBoundingClientRect().top < 100
              || hide.item(1).getBoundingClientRect().top < 100 || hide.item(2).getBoundingClientRect().top < 100  || hide.item(3).getBoundingClientRect().top < 100)) {
              items.item(0).style.setProperty('top', '-130px');
              for (let i = 0; i < slide.length; i++) {
                slide.item(i).style.setProperty('top', '65px');
                slide.item(i).style.setProperty('height', 'calc(100vh - 65px)');
              }
              uselessLine.item(0).classList.add('scroll');
              items.item(0).classList.add('scroll');
              uselessLine.item(0).style.setProperty('top', '0');
              uselessLine.item(0).style.setProperty('margin-bottom', '0');
              if (show.length != 0) {
                show.item(0).style.setProperty('top', '65px');
              }
              if (filters.length != 0) {
                filters.item(0).style.setProperty('top', '0');
              }
              for (let i = 0; i < filtersbox.length; i++) {
                filtersbox.item(i).style.setProperty('height', 'calc(100vh - 65px)');
                filtersbox.item(i).style.setProperty('top', '0');
              }
            }

            if (
              (catalog.length != 0 && catalog.item(0).getBoundingClientRect().top < 0) ||
              (photofull.length != 0 && photofull.item(0).getBoundingClientRect().top < 0)) {
              if (show.length != 0) {
                show.item(0).style.setProperty('top', '65px');
              }
              for (let i = 0; i < filtersbox.length; i++) {
                filtersbox.item(i).style.setProperty('height', 'calc(100vh - 65px)');
                filtersbox.item(i).style.setProperty('top', '0');
              }
              for (let i = 0; i < slide.length; i++) {
                slide.item(i).style.setProperty('top', '65px');
                slide.item(i).style.setProperty('height', 'calc(100vh - 65px)');
              }
              items.item(0).style.setProperty('top', '-130px');
              uselessLine.item(0).style.setProperty('top', '0');
              uselessLine.item(0).style.setProperty('margin-bottom', '0');
              if (filters.length != 0) {
                filters.item(0).style.setProperty('top', '0');
              }
              if (day.length != 0) {
                day.item(0).style.setProperty('top', '65px');
              }
              uselessLine.item(0).classList.add('scroll');
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
            if (filter.length != 0) {
              filter.item(0).style.setProperty('top', '0');
            }

            // if (filtersbox.length != 0) {
            //   for (let i = 0; i < filtersbox.length; i++) {
            //     filtersbox.item(i).style.setProperty('top', '65px');
            //   }
            // }
            // if (main.length != 0) {
            //   main.item(0).style.setProperty('height', 'calc(100vh - 65px)');
            //  main.item(0).style.setProperty('top', '65px');
            // }

          } else {
            this.delta += event.deltaY;
            if (uselessLine.item(0).classList.contains('homePage')) {
              items.item(0).style.setProperty('top', '0');
              for (let i = 0; i < slide.length; i++) {
                slide.item(i).style.setProperty('top', '130px');
                slide.item(i).style.setProperty('height', 'calc(100vh - 130px)');
              }
            }




            if (scrollItems.length != 0 && uselessLine.length != 0 && this.delta < -300) {
              for (let i = 0; i < slide.length; i++) {
                slide.item(i).style.setProperty('top', '195px');
                slide.item(i).style.setProperty('height', 'calc(100vh - 195px)');
              }
              for (let i = 0; i < filtersbox.length; i++) {
                filtersbox.item(i).style.setProperty('top', '130px');
                filtersbox.item(i).style.setProperty('height', 'calc(100vh - 195px)');
              }
              if (show.length != 0) {
                show.item(0).style.setProperty('top', '195px');
              }
              if (objs.length != 0) {
                objs.item(0).style.setProperty('top', '130px');
              }
              uselessLine.item(0).classList.remove('scroll');
              items.item(0).classList.remove('scroll');
              uselessLine.item(0).style.setProperty('top', '130px');
              uselessLine.item(0).style.setProperty('margin-bottom', '130px');
              if (filters.length != 0) {
                filters.item(0).style.setProperty('top', '130px');
              }
              items.item(0).style.setProperty('top', '0');
              if (filter.length != 0) {
                filter.item(0).style.setProperty('top', '130px');
              }
              if (day.length != 0) {
                day.item(0).style.setProperty('top', '195px');
              }
              if ( dark.length != 0) {
                dark.item(0).style.setProperty('top', '130px');
              }
              for (let i = 0; i < photofull.length; i++) {
                if (photofull.item(i).getBoundingClientRect().top < 0) {
                  if (arrows.length != 0) {
                    arrows.item(0).style.setProperty('top', 'calc(35vh - 130px)');
                    arrows.item(1).style.setProperty('top', 'calc(35vh - 130px)');
                  }
                }
              }
            } else if (scrollItems.length == 0 && uselessLine.length != 0 && !uselessLine.item(0).classList.contains('homePage')) {
              for (let i = 0; i < slide.length; i++) {
                slide.item(i).style.setProperty('top', '195px');
                slide.item(i).style.setProperty('height', 'calc(100vh - 195px)');
              }
              for (let i = 0; i < filtersbox.length; i++) {
                filtersbox.item(i).style.setProperty('top', '130px');
                filtersbox.item(i).style.setProperty('height', 'calc(100vh - 195px)');
              }
              if (show.length != 0) {
                show.item(0).style.setProperty('top', '195px');
              }
              if (objs.length != 0) {
                objs.item(0).style.setProperty('top', '130px');
              }
              for (let i = 0; i < photofull.length; i++) {
                if (photofull.item(i).getBoundingClientRect().top < 0) {
                  if (arrows.length != 0) {
                    arrows.item(0).style.setProperty('top', 'calc(35vh - 130px)');
                    arrows.item(1).style.setProperty('top', 'calc(35vh - 130px)');
                  }
                }
              }
              if ( dark.length != 0) {
                dark.item(0).style.setProperty('top', '130px');
              }
              items.item(0).style.setProperty('top', '0');
              uselessLine.item(0).classList.remove('scroll');
              items.item(0).classList.remove('scroll');
              uselessLine.item(0).style.setProperty('top', '130px');
              uselessLine.item(0).style.setProperty('margin-bottom', '130px');
              if (filters.length != 0) {
                filters.item(0).style.setProperty('top', '130px');
              }
              if (filter.length != 0) {
                filter.item(0).style.setProperty('top', '130px');
              }
              if (day.length != 0) {
                day.item(0).style.setProperty('top', '195px');
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
              history.item(0).style.setProperty('top', '195px');
            }
            if (addr.length != 0) {
              addr.item(0).style.setProperty('top', '130px');
            }
            if (mapbuttonstab.length != 0) {
              mapbuttonstab.item(0).style.setProperty('top', '130px');
            }
            // if (desk.length == 0 && filter.length != 0) {
            //   filter.item(0).style.setProperty('height', 'calc(100vh - 195px)');
            // }


            // if (scrollItems.length != 0) {
            //   scrollItems.item(0).style.setProperty('height', 'calc(100% - 130px)');
            // }
            // for (let i = 0; i < filtersbox.length; i++) {
            //   filtersbox.item(i).style.setProperty('top', '195px');
            // }
            // if (main.length != 0) {
            //   main.item(0).style.setProperty('height', 'calc(100vh - 195px)');
            //  main.item(0).style.setProperty('top', '195px');
            // }
          }
          }
        });
    }

    ngAfterViewInit() {}
    scrollActive(name) {
        let mapbuttons =  document.getElementsByClassName('map-buttons') as HTMLCollectionOf<HTMLElement>;
        let addobject =  document.getElementsByClassName('add-obj-ext') as HTMLCollectionOf<HTMLElement>;
        let history =  document.getElementsByClassName('history') as HTMLCollectionOf<HTMLElement>;
        let addr = document.getElementsByClassName('address-block') as HTMLCollectionOf<HTMLElement>;
        let mapbuttonstab =  document.getElementsByClassName('map-buttons-tablet') as HTMLCollectionOf<HTMLElement>;
        let items = document.getElementsByClassName('header')   as HTMLCollectionOf<HTMLElement>;
        let uselessLine = document.getElementsByClassName('uselessLine')   as HTMLCollectionOf<HTMLElement>;
        let mobileMenu = document.getElementsByClassName('mobileTopMenu')   as HTMLCollectionOf<HTMLElement>;
        let filters = document.getElementsByClassName('filters-menu-desktop')   as HTMLCollectionOf<HTMLElement>;
        let filter = document.getElementsByClassName('filters')   as HTMLCollectionOf<HTMLElement>;
        let scrollItems = document.getElementsByClassName('scroll-items open')   as HTMLCollectionOf<HTMLElement>;
        let filtersbox = document.getElementsByClassName('filters-box open')   as HTMLCollectionOf<HTMLElement>;
        let mainHome =  document.getElementsByClassName('mainHome')   as HTMLCollectionOf<HTMLElement>;
        let main = document.getElementsByClassName('main-objects') as HTMLCollectionOf<HTMLElement>;
        let desk = document.getElementsByClassName('desk') as HTMLCollectionOf<HTMLElement>;
        let arrowsmobile = document.getElementsByClassName('arrows-mobile') as HTMLCollectionOf<HTMLElement>;
       // console.log('wheel: ' + name.deltaY);
        this.delta += name.deltaY;

        if (this.delta < 0) {
          this.delta = 0;
        }
       // console.log(document.documentElement.offsetHeight);
       // console.log('hi ' + desk.item(0).scrollTop);
        if ((name.deltaY > 0)) {
                items.item(0).style.setProperty('top', '-130px');
          if (mainHome.length != 0 && document.documentElement.clientWidth > 1050) {
            mainHome.item(0).style.setProperty('margin-top', '0');
          }
                uselessLine.item(0).style.setProperty('top', '0');
                uselessLine.item(0).style.setProperty('margin-bottom', '0');
            if (mobileMenu.length != 0) {
                mobileMenu.item(0).style.setProperty('top', '0');
            }
            if (filters.length != 0) {
                filters.item(0).style.setProperty('top', '0');
            }
            if (mapbuttons.length != 0) {
                mapbuttons.item(0).style.setProperty('top', '0');
            }
            if (addobject.length != 0) {
                addobject.item(0).style.setProperty('top', '0');
            }
            if (document.documentElement.clientWidth < 650) {
              if (arrowsmobile.length != 0) {
                arrowsmobile.item(0).style.setProperty('top', '0');
              }
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
            if (desk.length == 0 && filter.length != 0) {
                filter.item(0).style.setProperty('height', 'calc(100vh - 65px)');
            }
            if (scrollItems.length != 0) {
                scrollItems.item(0).style.setProperty('height', '100%');
            }
            if (filtersbox.length != 0) {
                filtersbox.item(0).style.setProperty('height', 'calc(100% - 65px)');
            }
            if (main.length != 0) {
                main.item(0).style.setProperty('height', 'calc(100vh - 65px)');
            }
        } else {
            items.item(0).style.setProperty('top', '0');
          if (uselessLine.length != 0) {
            if (document.documentElement.clientWidth < 350) {
              uselessLine.item(0).style.setProperty('top', '100px');
              uselessLine.item(0).style.setProperty('margin-bottom', '100px');
            } else {
              uselessLine.item(0).style.setProperty('top', '130px');
              uselessLine.item(0).style.setProperty('margin-bottom', '130px');
            }
          }
          if (mainHome.length != 0 && document.documentElement.clientWidth > 1050) {
            mainHome.item(0).style.setProperty('margin-top', '130px');
          }
          if (mobileMenu.length != 0) {
            if (document.documentElement.clientWidth < 350) {
              mobileMenu.item(0).style.setProperty('top', '100px');
            } else {
              mobileMenu.item(0).style.setProperty('top', '130px');
            }
          }
            if (filters.length != 0) {
                filters.item(0).style.setProperty('top', '130px');
            }
            if (mapbuttons.length != 0) {
                mapbuttons.item(0).style.setProperty('top', '130px');
            }
            if (arrowsmobile.length != 0) {
              if (document.documentElement.clientWidth < 350) {
                arrowsmobile.item(0).style.setProperty('top', '100px');
              } else {
                arrowsmobile.item(0).style.setProperty('top', '130px');
              }
            }
            if (addobject.length != 0) {
                addobject.item(0).style.setProperty('top', '130px');
            }
            if (history.length != 0) {
                history.item(0).style.setProperty('top', '195px');
            }
            if (addr.length != 0) {
                addr.item(0).style.setProperty('top', '130px');
            }
            if (mapbuttonstab.length != 0) {
                mapbuttonstab.item(0).style.setProperty('top', '130px');
            }
            if (desk.length == 0 && filter.length != 0) {
                filter.item(0).style.setProperty('height', 'calc(100vh - 195px)');
            }
            if (scrollItems.length != 0) {
                scrollItems.item(0).style.setProperty('height', 'calc(100% - 130px)');
            }
            if (filtersbox.length != 0) {
                filtersbox.item(0).style.setProperty('height', 'calc(100% - 130px)');
            }
            if (main.length != 0) {
              main.item(0).style.setProperty('height', 'calc(100vh - 195px)');
            }
        }
    }

    resolveDevice() {
      this.deviceInfo = this.deviceService.getDeviceInfo();
      const isMobile = this.deviceService.isMobile();
      const isTablet = this.deviceService.isTablet();
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
           sessionStorage.setItem('expires', (Date.now()/1000 + Number.parseInt(params.expires, 10)).toString())
            console.log(sessionStorage.getItem('access'));
            console.log(params);
           if (isMobile) {
               document.location.href = '//' + this.siteUrl + '/#/m';
           } else if (isDesktopDevice) {
               document.location.href = '//' + this.siteUrl + '/#/d/objects/list';
           } else if (isTablet) {
               document.location.href = '//' + this.siteUrl + '/#/t';
           } else {
               document.location.href = '//' + this.siteUrl + '/#/d';
           }
           //  let _resourceUrl = "https://api.ok.ru/oauth/token.do?code=" + params.code +"&client_id=512000104776&client_secret=CJEKJGJGDIHBABABA&redirect_uri=" + this.siteUrl + "&grant_type=authorization_code";
           // let ret_subj = <AsyncSubject<any>>new AsyncSubject();
           // console.log('отправляем запрос на ', _resourceUrl);
           //  this._http.post(_resourceUrl, { withCredentials: true }).pipe(
           //     map((res: Response) => res)).subscribe(
           //
           //     data => {
           //         console.log("result: ");
           //         console.log(data);
           //         ret_subj.next(data);
           //         ret_subj.complete();
           //     },
           //     err => console.log(err)
           // );
           //  console.log(ret_subj);
           //  setTimeout(() => { console.log('no answer') }, 3000);

           //  let user_data = params[params.length-1].split('_');
           //  // http://dev.makleronline.net/#access_token=c31fd5f6d4f59538fb482e92210fb4e39d5073e142bc599d01919d091cb32322c9be887938e4a40682c37&expires_in=86400&user_id=122956555&state=123456
           //  let body = {
           //      access_token: params[0],
           //      user_id_vk: params[2],
           //      user_id: user_data[0],
           //      obj_id: user_data[1]
           //  };
           // this._account_service.save_access_token(body).subscribe(res => {
           //     console.log(res);
           //     if (res != undefined) {
           //         let data = JSON.parse(JSON.stringify(res));
           //         if (data.obj_id != undefined) {
           //             window.location.href = this.siteUrl + "/#/d/objects/" + data.obj_id;
           //         } else {
           //             alert(data.error)
           //         }
           //     }
           // });
           // this._account_service.publish(params[0]).subscribe(res => {
           //     console.log(res);
           //     console.log(res);
           // });
          // window.location.href = "https://api.vk.com/method/wall.post?owner_id=-186613956&message=%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%BF%D0%BE%D1%81%D1%82&access_token=6daefd335a545179be2612f5e332a6c4439af3e7099721ce2593409d3fed901cd39bd90891debfd6776f9&v=5.101";
       }
    setTimeout(e =>{ console.log('done!')}, 5000);
      if (url.indexOf(this.siteUrl + '/#/m') == -1 && url.indexOf(this.siteUrl + '/#/d') == -1 && url.indexOf(this.siteUrl + '/#/sitemap.xml') == -1 &&
          url.indexOf(this.siteUrl + '/#/t') == -1 && url.indexOf(this.siteUrl + ':4000') == -1 && url.indexOf('access_token') == -1) {
        if (isMobile) {
          document.location.href = '//' + this.siteUrl + '/#/m';
        } else if (isDesktopDevice) {
          document.location.href = '//' + this.siteUrl + '/#/d';
        } else if (isTablet) {
          document.location.href = '//' + this.siteUrl + '/#/t';
        } else {
            document.location.href = '//' + this.siteUrl + '/#/d';
        }
      }

        if (url.indexOf(this.siteUrl + ':4000') != -1) {
            if (isMobile) {
                document.location.href = '//' + this.siteUrl + ':4000/m';
            } else if (isDesktopDevice) {
                document.location.href = '//' + this.siteUrl + ':4000/d';
            } else if (isTablet) {
                document.location.href = '//' + this.siteUrl + ':4000/t';
            }
        }
    }
}
