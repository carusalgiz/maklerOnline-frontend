import {Component, AfterViewInit, ChangeDetectionStrategy, OnChanges} from "@angular/core";
import {Output, Input, EventEmitter} from "@angular/core";
import {BehaviorSubject} from 'rxjs';
import {takeWhile, tap} from 'rxjs/operators';

@Component({
    selector: "input-range",
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ["name", "valueMin", "valueMax", "min", "max", "step"],
    styles: [`
        :host{
            position: relative;
            height: 45px;
            display: flex;
            flex-wrap: wrap;
        }

        div{
            display: inline-flex;
            width: 100%;
            justify-content: space-between;
            padding: 0 30px;
            line-height: 30px;
        }

        input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 5px;
            height: 15px;
            background: #3f51b5;
            cursor: pointer;
            position: relative;
            z-index:10;
        }

        input{
            width: calc(100% - 60px);
            -webkit-appearance: none;
            background: #c7c7c7;
            height: 5px;
            position: absolute;
            top: 30px;
            margin: 0 30px;
        }
    `],
    template: `
        <div><span class="label">{{name}}</span><span>{{valueMin > 0 ? "от " + valueMin : ""}} {{valueMax < max ? "до " + valueMax : ""}}</span></div>
        <input [min]="min" [max]="max" [step]="step" type="range" [(ngModel)]="valueMin" (ngModelChange)="change()" (change)="emitChange()">
        <input [min]="min" [max]="max" [step]="step" type="range" [(ngModel)]="valueMax" (ngModelChange)="change()" (change)="emitChange()"
               [style.background]="'linear-gradient(90deg, #c7c7c7 ' + (valueMin || 0) * 100/(max-min) + '%, #3f51b5 ' + (valueMin || 0) * 100/(max-min) + '%, #3f51b5 ' + (valueMax || 0) * 100/(max-min) +'%, #c7c7c7 0%)'"

        >
    `
})


export class InputRangeComponent implements AfterViewInit, OnChanges {
    public name: string;
    public min: number = 0;
    public max: number = 200;
    public step: number = 10;
    public valueMin: number = 0;
    public valueMax: number = 200;
    timer: any;
    @Output() newValue: EventEmitter<any> = new EventEmitter();

    constructor() {}

    ngAfterViewInit() {
        if(!this.valueMin) this.valueMin = this.min;
        if(!this.valueMax)  this.valueMax = this.max;
        this.change();
    }

    ngOnChanges(){
        this.change();
    }

    change(){
        if( this.valueMin > this.valueMax ){
            let tmp = this.valueMin;
            this.valueMin = this.valueMax;
            this.valueMax = tmp;
        }

    }
    emitChange(){
        this.newValue.emit({"min": this.valueMin, "max": this.valueMax});
    }
}
