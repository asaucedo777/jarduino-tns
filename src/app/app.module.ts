import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";

import { AppRoutingModule } from "./app.routing.module";
import { AppComponent } from "./app.component";
import { Esp8266Service } from "./app.service";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    NativeScriptModule,
    NativeScriptUISideDrawerModule,
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    Esp8266Service,
  ],
  bootstrap: [
    AppComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
