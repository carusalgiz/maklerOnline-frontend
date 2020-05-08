import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'ui-modal-window',
    inputs: ['title', 'message', 'button', 'cancel'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="blur-background"></div>
        <div id="modal-main">
            <div class="modal-title">{{title}}</div>
            <div class="modal-text">{{message}}</div>
            <div class="modal-buttons">
                <div class="button" *ngIf="cancel == true" (click)="button_func('cancel')">Отмена</div>
                <div class="button" (click)="button_func('action')">{{button}}</div>
            </div>
        </div>
    `,
    styles: [`
        .blur-background{
            position: fixed;
            height: 100vh;
            width: 100vw;
            background-color: #12181A;
            opacity: 0.6;
            z-index: 15000;
            top: 0;
            left: 0;
        }
        #modal-main{
            position: fixed;
            height: fit-content;
            width: 510px;
            left: calc(50% - 275px);
            padding: 20px;
            background-color: #f6f6f6;
            color: #252F32;
            z-index: 15001;
            border-radius: 3px;
            font-family: OpenSans, sans-serif;
            box-shadow: 0 0 3px 0 #d3d5d6;
        }
        .modal-title, .modal-text, .button{
            letter-spacing: 0;
        }
        .modal-title{
            font-size: 18px;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .modal-text{
            font-size: 16px;
            margin-bottom: 10px;
        }
        .modal-buttons{
            display: flex;
            width: 100%;
            justify-content: flex-end;
        }
        .button{
            color: #3e8175;
            font-size: 16px;
            padding: 0 15px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        .button:hover{
            cursor: pointer;
        }
    `]
})

export class UiModalWindow implements OnInit, AfterViewInit{
    @Input() title: any;
    @Input() message: any;
    @Input() button: any;
    @Input() cancel: any;

    @Output() buttonClicked = new EventEmitter();

    ngOnInit(): void {

    }
    ngAfterViewInit(): void {
        document.getElementById('modal-main').style.setProperty('top',
            'calc(50% - ' + (document.getElementById('modal-main').clientHeight / 2) + 'px)');
    }

    button_func(event){
        this.buttonClicked.emit(event);
    }
}
