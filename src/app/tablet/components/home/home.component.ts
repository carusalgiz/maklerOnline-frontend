import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor() { }

  width: number;
  ngOnInit() {
    this.width = document.documentElement.clientWidth;
  }
  ngAfterViewInit() {
    if (document.documentElement.clientWidth > 1050) {
      let items = document.getElementsByClassName('menuBlock')   as HTMLCollectionOf<HTMLElement>;
      items.item(0).style.setProperty('border-top', '5px solid #821529');
      items.item(0).style.setProperty('font-weight', 'bold');
    }
    let picture = document.getElementsByClassName('picture')   as HTMLCollectionOf<HTMLElement>;
    let mainHome = document.getElementsByClassName('mainHome')   as HTMLCollectionOf<HTMLElement>;
    let logotitle2 = document.getElementsByClassName('logoTitle2')   as HTMLCollectionOf<HTMLElement>;
    let infoText = document.getElementsByClassName('infoText')   as HTMLCollectionOf<HTMLElement>;
    if (this.width < 650) {
      picture.item(0).style.setProperty('height', (document.documentElement.clientHeight - 10) + 'px');
      logotitle2.item(0).style.setProperty('top', ((document.documentElement.clientHeight * 0.6) - 135) + 'px');
      infoText.item(0).style.setProperty('top', ((document.documentElement.clientHeight * 0.6)) + 'px');
      mainHome.item(0).style.setProperty('background-size', 'auto ' + (document.documentElement.clientHeight + 100) + 'px');
    }
  }
  openMobileMenu() {
    let mobileMenu = document.getElementsByClassName('menuMobile')   as HTMLCollectionOf<HTMLElement>;
    mobileMenu.item(0).classList.add('open');
  }

}
