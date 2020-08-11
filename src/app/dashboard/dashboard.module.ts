import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { DashboardRoutingModule } from "./dashboard.routing.module";
import { DashboardComponent } from "./dashboard.component";
import { SharedModule } from "../components/shared.module";
import { IrrigationComponent } from "./irrigation/irrigation.component";
import { LightsComponent } from "./lights/lights.component";
import { DoorsComponent } from "./doors/doors.component";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    DashboardRoutingModule,
    SharedModule,
  ],
  declarations: [
    DashboardComponent,
    IrrigationComponent,
    LightsComponent,
    DoorsComponent,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class DashboardModule { }
