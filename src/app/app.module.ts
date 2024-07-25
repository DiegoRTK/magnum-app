import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './components/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { localStorageSync } from 'ngrx-store-localstorage';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { GameEffects } from './store/app.effects';
import { reducer } from './store/app.reducer';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function localStorageSyncReducer(reducer: any): any {
  return function (state: {}, action: { type: string; }) {
    if (action.type === '[Auth] Logout') {
      state = {};
      localStorage.removeItem('appmagnum');
    }
    return localStorageSync({
      keys: ['appmagnum'],
      rehydrate: true,
      storage: localStorage
    })(reducer)(state, action);
  };
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    FontAwesomeModule,
    StoreModule.forRoot({ appmagnum: reducer }, {metaReducers}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([GameEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
