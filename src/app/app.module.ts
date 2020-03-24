import {NgtUniversalModule} from '@ng-toolkit/universal';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {CommonModule, HashLocationStrategy, PathLocationStrategy} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {Location, LocationStrategy} from '@angular/common';
import {HttpModule} from '@angular/http';
import {OfferService} from './services/offer.service';
// import {RequestService} from './services/request.service';
import {AccountService} from './services/account.service';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {NgxMaskModule} from 'ngx-mask';
import {HttpClientModule} from '@angular/common/http';
import {NgxMetrikaModule} from '@kolkov/ngx-metrika';
import {MatInputModule} from '@angular/material/input';
// import { NgxMetrikaService } from '@kolkov/ngx-metrika';
import {ConfigService} from './services/config.service';
import {UploadService} from './services/upload.service';
import {MobileModule} from './mobile/mobile.module';
import {DesktopModule} from './desktop/desktop.module';
import {TabletModule} from './tablet/tablet.module';

const appRoutes: Routes = [
    {path: 'm', loadChildren: () => MobileModule},
    {path: 'd', loadChildren: () => DesktopModule},
    {path: 't', loadChildren: () => TabletModule},
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        NgxMetrikaModule.forRoot({
            id: 52712101,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
        }),
        CommonModule,
        NgtUniversalModule,
        TransferHttpCacheModule,
        HttpClientModule,
        NgxMaskModule.forRoot({}),
        BrowserAnimationsModule,
        // BrowserModule.withServerTransition({appId: 'maklerOnline-fe'}),
        HttpModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DeviceDetectorModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAi9zTbzWtEhLVZ8syBV6l7d3QMNLRokVY'
        }), MatInputModule
    ],
    exports: [RouterModule],
    bootstrap: [AppComponent],
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, OfferService, AccountService, ConfigService, UploadService],
})

export class AppModule {
}
