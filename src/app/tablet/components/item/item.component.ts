import {Component, EventEmitter, Input, OnInit, Output, AfterViewInit} from '@angular/core';
import {Item} from '../../../item';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() item: Item;
  @Input() mode: string;
  @Input() similarOpen: any;
  @Input() watched: boolean;
  @Input() historyOpen: boolean;
  @Input() id: number;
  @Input() historyId: number;
  photoBlockOpen = false;
  photos: any[] = [];
  widthPhotoBlock: number;
  positionPhoto = 0;
  countPhoto = 1;
  number = 1;
  nearButton = true;
  contact: any;
  y: number;
  egrn = false;
  width = 450; // ширина изображения
  widthDocument: number;
  count = 1; // количество изображений
  position = 0;
  items: Item[] = [];
  length = false;
  @Output() similarItem = new EventEmitter<Item>();
  @Output() showInfoEvent = new EventEmitter();
  @Output() favouriteItemEvent = new EventEmitter();
  @Output() contactPos = new EventEmitter();
  ngOnInit() {
    this.widthPhotoBlock = document.documentElement.clientWidth;
    this.widthDocument = document.documentElement.clientWidth;
    let desk = document.getElementsByClassName('desk') as HTMLCollectionOf<HTMLElement>;
    this.length = desk.length !== 0;

  }
  ngAfterViewInit() {
    this.changeSize();
    let itemPhoto = document.getElementById('img' + this.id);
    if (this.item.photo !== undefined) {
      itemPhoto.style.setProperty('background-image', 'url("' + this.item.photo[0] + '")');
      itemPhoto.style.setProperty('background-size', '100% auto');
    }
  }
  changeSize() {
    let desk = document.getElementsByClassName('desk') as HTMLCollectionOf<HTMLElement>;
    if (desk.length !== 0) {
      this.length = true;
    } else {
      this.length = false;
    }
    this.widthDocument = document.documentElement.clientWidth;
    let photo = document.getElementsByClassName('photoBlock')   as HTMLCollectionOf<HTMLElement>;
    let userInfo = document.getElementsByClassName('userInfo')  as HTMLCollectionOf<HTMLElement>;
    let top = photo.item(0).clientHeight - userInfo.item(0).clientHeight;
    if (document.documentElement.clientWidth > 650) {
      for (let i = 0; i < userInfo.length; i++) {
        userInfo.item(i).style.setProperty('top', top + 'px');
      }
    } else {
      for (let i = 0; i < userInfo.length; i++) {
        userInfo.item(i).style.setProperty('top', 'auto');
      }
    }
  }
  onResize() {
    this.widthPhotoBlock = document.documentElement.clientWidth;
    let bottomButtons = document.getElementsByClassName('bottom-buttons') as HTMLCollectionOf<HTMLElement>;
    if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
      if (bottomButtons.length !== 0) {
        bottomButtons.item(0).style.setProperty('display', 'none');
      }
    } else {
      if (bottomButtons.length !== 0) {
        bottomButtons.item(0).style.setProperty('display', 'block');
      }
    }
    const list = document.getElementById('photoGallery-ul') as HTMLElement;
    this.positionPhoto = -this.widthPhotoBlock * (this.number - 1);
    list.style.setProperty('margin-left', this.positionPhoto + 'px');
  }

}
