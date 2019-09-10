import { NgtUniversalModule } from '@ng-toolkit/universal';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { BrowserModule } from '@angular/platform-browser';
import {  NgModule} from '@angular/core';
import {CommonModule, HashLocationStrategy, PathLocationStrategy} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import {Routes, RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import {Location, LocationStrategy} from '@angular/common';
import {HttpModule} from '@angular/http';
import {OfferService} from './services/offer.service';
import {AccountService} from './services/account.service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgxMaskModule } from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http';
import { NgxMetrikaModule } from '@kolkov/ngx-metrika';
import { NgxMetrikaService } from '@kolkov/ngx-metrika';
import { ConfigService} from "./services/config.service";

const appRoutes: Routes = [
    { path: 'm', loadChildren: './mobile/mobile.module#MobileModule'},
    { path: 'd', loadChildren: './desktop/desktop.module#DesktopModule'},
    { path: 't', loadChildren: './tablet/tablet.module#TabletModule'},
];

@NgModule({
  declarations: [
      AppComponent
  ],
  imports:[
    NgxMetrikaModule.forRoot({
        id: 52712101,
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
    }),
    CommonModule,
    NgtUniversalModule,

    TransferHttpCacheModule,
    HttpClientModule,
      NgxMaskModule.forRoot({}),
      BrowserModule.withServerTransition({appId: 'maklerOnline-fe'}),
      HttpModule,
      HttpClientModule,
      RouterModule.forRoot(appRoutes),
      CommonModule,
      FormsModule,
    ReactiveFormsModule,
      DeviceDetectorModule.forRoot(),
      AgmCoreModule.forRoot({
        apiKey: 'AIzaSyAi9zTbzWtEhLVZ8syBV6l7d3QMNLRokVY'
      })
  ],
  exports: [RouterModule],
    bootstrap: [AppComponent],
  providers: [ {provide: LocationStrategy, useClass: HashLocationStrategy}, OfferService, AccountService, NgxMetrikaService, ConfigService],
})

export class AppModule {
}
