import { NgModule } from '@angular/core';
import {CommonModule, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ObjectsComponent} from './components/objects/objects.component';
import {FiltersComponent} from './components/filters/filters.component';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {PayComponent} from './components/pay/pay.component';
import {MenuComponent} from './components/menu/menu.component';
import {AgmCoreModule} from '@agm/core';
import {ItemComponent} from './components/item/item.component';
import {ContactComponent} from './components/contact/contact.component';
import {RatingComponent} from './components/rating/rating.component';
import {ProposalComponent} from './components/proposal/proposal.component';
import {NgxMaskModule} from 'ngx-mask';
import {AgreementComponent} from './components/agreement/agreement.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemMiddle} from './components/item-middle';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { NgxMetrikaModule } from '@kolkov/ngx-metrika';
import { NgxMetrikaService } from '@kolkov/ngx-metrika';
import {ScrollingModule} from '@angular/cdk/scrolling';

const routes: Routes = [
    {path: 'pay', component: PayComponent},
    {path: 'objects/:mode', component: ObjectsComponent},
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
    imports: [
        // NgxMetrikaModule.forRoot({
        //     id: 52712101,
        //     clickmap:true,
        //     trackLinks:true,
        //     accurateTrackBounce:true,
        //     webvisor:true
        // }),
        VirtualScrollerModule,
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild(routes),
        NgxMaskModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAi9zTbzWtEhLVZ8syBV6l7d3QMNLRokVY'
        }), ScrollingModule
    ],
  declarations: [
    ObjectsComponent,
    FiltersComponent,
    HomeComponent,
    LoginComponent,
    PayComponent,
    MenuComponent,
    ItemComponent,
    ContactComponent,
    RatingComponent,
    ProposalComponent,
    AgreementComponent,
      ItemMiddle
  ],
    providers: [ {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class DesktopModule { }
