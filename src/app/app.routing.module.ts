import { NativeScriptRouterModule } from "nativescript-angular/router";

import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", loadChildren: () => import("~/app/home/home.module").then((m) => m.HomeModule) },
  { path: "dashboard", loadChildren: () => import("~/app/dashboard/dashboard.module").then((m) => m.DashboardModule) },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
