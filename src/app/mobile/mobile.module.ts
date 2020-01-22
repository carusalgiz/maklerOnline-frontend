import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CommonModule, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { MenuComponent} from './menu/menu.component';
import { HomeComponent} from './components/home/home.component';
import { ObjectsComponent} from './components/objects/objects.component';
import {ItemComponent} from './components/item/item.component';
import {AgmCoreModule} from '@agm/core';
import {FiltersComponent} from './components/filters/filters.component';
import {LoginComponent} from './components/login/login.component';
import {PayComponent} from './components/pay/pay.component';
import {RatingComponent} from './components/rating/rating.component';
import {ContactComponent} from './components/contact/contact.component';
import {EgrnComponent} from './components/egrn/egrn.component';
import {NgxMaskModule} from 'ngx-mask';
import {ProposalComponent} from './components/proposal/proposal.component';
import {AgreementComponent} from './components/agreement/agreement.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ItemMiddle} from './components/item-middle';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'objects/:mode', component: ObjectsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'pay', component: PayComponent},
    {path: 'polzovatelskoe-soglashenie', component: AgreementComponent}
];

@NgModule({
  imports: [
    CommonModule, FormsModule,VirtualScrollerModule, ScrollingModule,
    ReactiveFormsModule, NgxMaskModule.forRoot(),
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAi9zTbzWtEhLVZ8syBV6l7d3QMNLRokVY'
    })
  ],
  declarations: [
      ItemMiddle,
    MenuComponent,
    HomeComponent,
    ObjectsComponent,
    ItemComponent,
    FiltersComponent,
    LoginComponent,
    PayComponent,
    RatingComponent,
    ContactComponent,
    EgrnComponent,
    ProposalComponent,
    AgreementComponent
  ],
    providers: [ {provide: LocationStrategy, useClass: PathLocationStrategy} ]
})
export class MobileModule { }
