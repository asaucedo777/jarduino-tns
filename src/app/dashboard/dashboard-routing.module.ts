import { NativeScriptRouterModule } from "nativescript-angular/router";

import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";

import { DashboardComponent } from "./dashboard.component";
import { IrrigationComponent } from "./irrigation/irrigation.component";
import { LightsComponent } from "./lights/lights.component";
import { DoorsComponent } from "./doors/doors.component";

const routes: Routes = [
  { path: "", component: DashboardComponent },
  { path: "irrigation", component: IrrigationComponent },
  { path: "lights", component: LightsComponent },
  { path: "doors", component: DoorsComponent },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class DashboardRoutingModule { }
