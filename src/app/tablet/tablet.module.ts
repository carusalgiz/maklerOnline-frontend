import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContactComponent} from './components/contact/contact.component';
import {EgrnComponent} from './components/egrn/egrn.component';
import {FiltersComponent} from './components/filters/filters.component';
import {HomeComponent} from './components/home/home.component';
import {ItemComponent} from './components/item/item.component';
import {LoginComponent} from './components/login/login.component';
import {MenuComponent} from './components/menu/menu.component';
import {ObjectPageComponent} from './components/object-page/object-page.component';
import {ObjectsComponent} from './components/objects/objects.component';
import {PayComponent} from './components/pay/pay.component';
import {RatingComponent} from './components/rating/rating.component';
import {RouterModule, Routes} from '@angular/router';
import {AgmCoreModule} from '@agm/core';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'objects/:mode', component: ObjectsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'pay', component: PayComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAi9zTbzWtEhLVZ8syBV6l7d3QMNLRokVY'
    })
  ],
  declarations: [
    ContactComponent,
    EgrnComponent,
    FiltersComponent,
    HomeComponent,
    ItemComponent,
    LoginComponent,
    MenuComponent,
    ObjectPageComponent,
    ObjectsComponent,
    PayComponent,
    RatingComponent
  ]
})
export class TabletModule { }
