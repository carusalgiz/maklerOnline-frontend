import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MenuComponent} from './menu/menu.component';
import {HomeComponent} from './components/home/home.component';
import {ObjectsComponent} from './components/objects/objects.component';
import {ItemComponent} from './components/item/item.component';
import {AgmCoreModule} from '@agm/core';
import {FiltersComponent} from './components/filters/filters.component';
import {NgxMaskModule} from 'ngx-mask';
import {ProposalComponent} from './components/proposal/proposal.component';
import {AgreementComponent} from './components/agreement/agreement.component';
import {VirtualScrollerModule} from 'ngx-virtual-scroller';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ItemMiddle} from './components/item-middle';
import {UIUploadFile} from './ui/ui-upload-file.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {TextareaAutosizeModule} from 'ngx-textarea-autosize';

import {RequestService} from '../services/request.service';
import {RequestMiddleComponent} from './components/request-middle';
import {InputRangeComponent} from './ui/input-range';
import {UiModalWindow} from '../ui/ui-modal-window';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'objects/:mode', component: ObjectsComponent},
    {path: 'polzovatelskoe-soglashenie', component: AgreementComponent}
];

@NgModule({
    imports: [
        CommonModule, FormsModule, VirtualScrollerModule, ScrollingModule, TextareaAutosizeModule,
        ReactiveFormsModule, NgxMaskModule.forRoot(),
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAi9zTbzWtEhLVZ8syBV6l7d3QMNLRokVY'
        }),
        ImageCropperModule
    ],
    declarations: [
        ItemMiddle,
        MenuComponent,
        HomeComponent,
        ObjectsComponent,
        ItemComponent,
        FiltersComponent,
        ProposalComponent,
        AgreementComponent,
        UIUploadFile,
        UiModalWindow,
        RequestMiddleComponent,
        InputRangeComponent
    ],
    providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}, RequestService]
})
export class MobileModule {
}
