import {NgtUniversalModule} from '@ng-toolkit/universal';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {CommonModule, HashLocationStrategy} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {LocationStrategy} from '@angular/common';
import {HttpModule} from '@angular/http';
import {OfferService} from './services/offer.service';
import {AccountService} from './services/account.service';
import {HubService} from './services/hub.service';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {NgxMaskModule} from 'ngx-mask';
import {HttpClientModule} from '@angular/common/http';
import {NgxMetrikaModule} from '@kolkov/ngx-metrika';
import {MatInputModule} from '@angular/material/input';
import {ConfigService} from './services/config.service';
import {UploadService} from './services/upload.service';
import {MobileModule} from './mobile/mobile.module';
import {DesktopModule} from './desktop/desktop.module';

const appRoutes: Routes = [
    {path: 'm', loadChildren: () => MobileModule},
    {path: 'd', loadChildren: () => DesktopModule},
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
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, OfferService, AccountService, ConfigService, UploadService, HubService],
})

export class AppModule {
}
