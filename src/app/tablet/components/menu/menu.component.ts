import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  checkHome = false;
  mobileMenuActive = false;
  objectMenu = false;
  applicationMenu = false;
  width = document.documentElement.clientWidth;

  constructor() { }

  ngOnInit() {
  }
  closeButtons() {
    let mapButtons =  document.getElementsByClassName('map-buttons-tablet') as HTMLCollectionOf<HTMLElement>;
    let mobileMenu = document.getElementsByClassName('mobileTopMenu')   as HTMLCollectionOf<HTMLElement>;
    if (mobileMenu.length !== 0) {
      mobileMenu.item(0).style.setProperty('display', 'flex');
    }
    if (mapButtons.length !== 0) {
      mapButtons.item(0).style.setProperty('display', ' none');
    }
  }
  selected(el: MouseEvent) {
    let items =  (<HTMLElement>el.currentTarget).parentElement.parentElement.parentElement.children;
    for (let i = 0; i < items.length; i++) {
      (<HTMLElement>items.item(i).firstChild.firstChild).style.removeProperty('font-weight');
      (<HTMLElement>items.item(i).firstChild.firstChild).style.removeProperty('border-top');
    }
    (<HTMLElement>el.currentTarget).style.setProperty('border-top', '5px solid #821529');
    (<HTMLElement>el.currentTarget).style.setProperty('font-weight', 'bold');
  }
  selectedMapButtonTab(el: MouseEvent) {
    let items =  document.getElementsByClassName('map-button-tablet') as HTMLCollectionOf<HTMLElement>;
    let items1 =  document.getElementsByClassName('map-button-word-tablet') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < items.length; i++) {
      items.item(i).style.removeProperty('background-color');
      items1.item(i).style.removeProperty('border-bottom');
    }
    (<HTMLElement>el.currentTarget).style.setProperty('background-color', 'rgba(38,47,50,1)');
    (<HTMLElement>(<HTMLElement>el.currentTarget).firstChild).style.setProperty('border-bottom', '1px solid white');
  }
  homePageOpen(check) {
    this.checkHome = check;
    if (!this.checkHome) {
      let line = document.documentElement.getElementsByClassName('uselessLine') as HTMLCollectionOf<HTMLElement>;
      line.item(0).style.removeProperty('display');
      line.item(0).style.removeProperty('top');
      line.item(0).style.removeProperty('margin-bottom');
    }
  }
  displayMenu(mode) {
    let mobileMenu = document.getElementsByClassName('menuMobile')   as HTMLCollectionOf<HTMLElement>;
    if (mode === 'show') {
      mobileMenu.item(0).classList.add('open');
    } else if (mode === 'hide') {
      mobileMenu.item(0).classList.remove('open');
    }

  }
}
