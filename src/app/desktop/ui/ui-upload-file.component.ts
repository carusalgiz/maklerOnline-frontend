import {Component, OnInit, OnChanges} from '@angular/core';
import {Output,Input, EventEmitter} from '@angular/core';
import {UploadService} from '../../services/upload.service';
import {HttpEventType, HttpProgressEvent} from "@angular/common/http";
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';


@Component({
    selector: 'ui-upload-file',
    inputs:['activeColor','baseColor','overlayColor', 'type', 'obj_id', 'obj_type', 'parent'],
    template: `
        <label class="ui-upload-file add-block"  ondragover="return false;"
            [class.loaded]="loaded"
            (dragenter)="handleDragEnter()"
            (dragleave)="handleDragLeave()"
            (drop)="handleDrop($event)"
        >

            <div class="plus" *ngIf="parent == 'photo' || parent == 'docs'">
                <div class="line"></div>
                <div class="line"></div>
            </div>
            <div class="add-text" *ngIf="parent == 'photo' || parent == 'docs'">Добавить фотографию</div>
<!--            <div class="image_contain" *ngIf="type=='image'">-->
<!--                <div class='image' *ngFor="let image of fileSrc" (click)="remove(image.index)">-->
<!--                    <img  [src]="image.src" (load)="handleImageLoad()" [class.loaded]="imageLoaded"/>-->
<!--                    <div style="height: 4px; background-color: #54b947; border-radius: 10px; position: absolute; bottom: 0; left: 0;"-->
<!--                        [style.width]="image.load_pers"-->
<!--                    ></div>-->
<!--                </div>-->
<!--            </div>-->
            <!--<div class="doc_contain" *ngIf="type=='document'">
                <div class='document' *ngFor="let image of fileSrc">
                    <span style="position: relative;display: block;width: 100%;text-align: center;margin: 5px;"
                        >Идет загрузка файла...
                    </span>
                    <progress
                         [value]="image.load_pers" max="300"
                    ></progress>
                </div>
            </div>-->
            <input type="file" name="file" [accept]="format" [multiple]="multiple"
                (change)="handleInputChange($event)">

        </label>
        <div  *ngIf="cropOpen" style="position: fixed;top: 0;left: 0;width: 100vw; height: 100vh; background-color: rgba(94,94,94, 0.5);z-index: 150;">
            <div style="width: auto; max-width: 100vw; height: auto; max-height: calc(100vh - 100px); padding: 20px">
                <image-cropper
                    [imageChangedEvent]="imageChangedEvent"
                    [maintainAspectRatio]="true"
                    [resizeToWidth]="256"
                    [cropperMinWidth]="128"
                    [onlyScaleDown]="true"
                    [roundCropper]="false"
                    [canvasRotation]="canvasRotation"
                    [transform]="transform"
                    [alignImage]="'left'"
                    [style.display]="showCropper ? null : 'none'"
                    format="png"
                    (imageCropped)="imageCropped($event)"
                    (imageLoaded)="imageLoadedFunc()"
                    (cropperReady)="cropperReady($event)"
                    (loadImageFailed)="loadImageFailed()"
                ></image-cropper>
            </div>
            <div class="photo-button" (click)="savePhoto()">Сохранить</div>
        </div>
    `,
    styles: [`
        .photo-button{
            height: 50px;
            width: calc(100% - 50px);
            margin: 25px;
            background-color: #252F32;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .add-block{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        .add-block:hover .plus .line{
            background-color: #252F32;
        }
        .add-block:hover .add-text{
            color: #252F32;
        }
        .plus{
            width: 120px;
            height: 100px;
        }
        .plus .line:first-child{
            width: 40px;
            height: 1px;
            background-color: #252F32;
            position: relative;
            top: 50%;
            left: calc(50% - 20px);
        }
        .plus .line:last-child{
            width: 40px;
            height: 1px;
            background-color: #252F32;
            position: relative;
            left: 40px;
            transform: rotate(90deg);
            top: 50%;
        }
        .add-block input {
            display: none;
        }
        .add-block img {
            pointer-events: none;
        }

        .add-block img {
            opacity: 0;
            max-height: 100%;
            max-width: 100%;
            transition: all 300ms ease-in;
            z-index: -1;
        }

        .image_contain>.image{
            width: 175px;
            height: 130px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .image_contain>.image:hover{
            transition: all 250ms linear;
            background-color: rgba(107, 107, 107, 0.79);
        }
        .image_contain>.image:hover:before{
            content: "Удалить";
            color: white;
            position: absolute;
            font-size: 12pt;
        }

        .doc_contain{
            width: calc(100% - 10px);
            height: calc(100% - 10px);
        }

        .doc_contain>.document{
            width: 100%;
            height: 100%;
        }

        .doc_contain>.document>progress:not([value]){
            background-color: #ff9900;
        }

        .doc_contain>.document>progress {
	        width: 355px;
	        height: 20px;
            max-width: 100%;
        	display: block;
        	-webkit-appearance: none;
        	border: none;
            margin-left: 2px;
        }

        .doc_contain>.document>progress::-webkit-progress-bar {
            background: transparent;
        }

        .doc_contain>.document>progress::-webkit-progress-value {
            background-image:
                -webkit-linear-gradient(-45deg, transparent 33%, rgba(0, 0, 0, .1) 33%, rgba(0,0, 0, .1) 66%, transparent 66%),
                -webkit-linear-gradient(top, rgba(255, 255, 255, .25), rgba(0, 0, 0, .25)),
                -webkit-linear-gradient(left, #338c4e, #0dce00);
            background-size: 35px 20px, 100% 100%, 100% 100%;
            background-repeat: repeat-x;
            -webkit-animation: animate-stripes 5s linear infinite;
            animation: animate-stripes 5s linear infinite;
        }

        @-webkit-keyframes animate-stripes {
            from { background-position: 0px 0px; }
            to { background-position: -100px 0px; }
        }

        @keyframes animate-stripes {
            from { background-position: 0px 0px; }
            to { background-position: -100px 0px; }
        }
    `]
})


export class UIUploadFile implements OnInit{
    activeColor: string = 'green';
    public obj_id: any;
    public obj_type: string = "offers";
    public parent: any;
    baseColor: string = '#ccc';
    overlayColor: string = 'rgba(255,255,255,0.5)';
    type: string = 'image';
    dragging: boolean = false;
    loaded: boolean = false;
    imageLoaded: boolean = false;
    format: string;
    pattern: RegExp;
    multiple: boolean = true;

    //image-crop
    cropOpen = false;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    canvasRotation = 0;
    rotation = 0;
    scale = 1;
    showCropper = false;
    containWithinAspectRatio = false;
    transform: ImageTransform = {};
    imageName: any = 'img';
    @Output() addNewFile: EventEmitter<any> = new EventEmitter();
    @Output() progressState: EventEmitter<any> = new EventEmitter();

    constructor(
        private _uploadService: UploadService
    ) { }

    ngOnInit(){
        if(this.type == 'image'){
            this.format='image/*';
            this.pattern=/image-*/;
        }else if(this.type == 'docs'){
            this.format='application/pdf, .doc, .docx, .xls, .xlsx, .txt, .rtf, .odt';
            this.pattern=/(application\/pdf)|(application\/vnd\.openxmlformats-officedocument)|(application\/vnd\.ms-excel)|(text\/plain)|(application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)|(application\/vnd\.oasis\.opendocument\.text)|(application\/msword)/;
        }

    }

    // crop image
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        console.log(event);
    }

    imageLoadedFunc() {
        this.showCropper = true;
        console.log('Image loaded');
    }

    cropperReady(sourceImageDimensions: Dimensions) {
        console.log('Cropper ready', sourceImageDimensions);
    }

    loadImageFailed() {
        console.log('Load failed');
    }
    // end crop
    handleDragEnter() {
        this.dragging = true;
    }

    handleDragLeave() {
        this.dragging = false;
    }

    handleDrop(e) {
        e.preventDefault();
        this.dragging = false;
        this.handleInputChange(e);
    }

    handleImageLoad() {
        this.imageLoaded = true;
    }
    savePhoto(){
        // let reader = new FileReader();
        // reader.onload = (() =>{
            console.log('cropped: ', this.croppedImage, typeof this.croppedImage);
            fetch(this.croppedImage)
            .then(res => res.blob())
            .then(blob => {
                let file = new File([blob], this.imageName,{ type: "image/png" });
                this._uploadService.uploadFiles([file]).subscribe(
                    data => {
                        if (data.type === HttpEventType.UploadProgress) {
                            let progress = data as HttpProgressEvent;
                            this.progressState.emit(Math.floor(progress.loaded / progress.total*100));
                        } else if(data.type === HttpEventType.Response){
                            console.log(data);
                            this.addNewFile.emit((data.body as any).result);
                            event = null;
                        }
                    },
                    err => {
                        console.log(err);
                        if (err.status == 413 || err.statusText == 'Request Entity Too Large') {
                            alert('Превышен максимальный размер файла. Файл должен иметь размер не более 1 мб');
                        }
                    });
                this.cropOpen = false;
            });


        // });

        // reader.readAsDataURL(this.croppedImage);

    }
    handleInputChange(event) {
        this.imageChangedEvent = event;
        this.cropOpen = true;
         let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
         this.imageName = files[0].name;
        // let pattern = this.pattern;
        // let reader = new FileReader();
        //
        // reader.onload = (() =>{
        //     for(let file of files){
        //         if (!file.type.match(pattern))  {
        //             alert("Файл " + file.name + " не поддерживается");
        //             return;
        //         }
        //         if (file.size == 0)  {
        //             alert("Внимание! Файл " + file.name+" пустой");
        //             return;
        //         }
        //     }
        //
        //     this._uploadService.uploadFiles(files).subscribe(
        //         data => {
        //             if (data.type === HttpEventType.UploadProgress) {
        //                 let progress = data as HttpProgressEvent;
        //                 this.progressState.emit(Math.floor(progress.loaded / progress.total*100));
        //             } else if(data.type === HttpEventType.Response){
        //                 this.addNewFile.emit((data.body as any).files);
        //                 event = null;
        //             }
        //         },
        //         err => {
        //             console.log(err);
        //             if (err.status == 413 || err.statusText == 'Request Entity Too Large') {
        //                 alert('Превышен максимальный размер файла. Файл должен иметь размер не более 1 мб');
        //             }
        //         });
        // });
        //
        // reader.readAsDataURL(files[0]);

    }

}
