import { Component, OnInit, OnDestroy } from "@angular/core";

import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { TextField } from "tns-core-modules/ui/text-field";
import { Slider } from "tns-core-modules/ui/slider";

import * as app from "tns-core-modules/application";
import { Pin } from "../pin.model";
import { Esp8266Service } from "../esp8266.service";
import { RouterExtensions } from "nativescript-angular/router";

const ONE_DAY = 24 * 60 * 60 * 1000;

@Component({
  selector: "Dashboard",
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnInit, OnDestroy {
  switchTitle: '...' | 'Manual' | 'Programado';
  scheduled: boolean;

  constructor(
    public esp8266Service: Esp8266Service,
    private routerExtensions: RouterExtensions
  ) {
  }

  ngOnInit(): void {
    this.switchTitle = '...';
    this.scheduled = false;
    this.getScheduled();

  }
  ngOnDestroy(): void {
  }

  onNavItemTap(navItemRoute: string): void {
    let extras = {
      // transition: { name: "fade" },
    };
    this.routerExtensions.navigate([navItemRoute], extras);
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }
  onSwitchScheduled() {
    this.esp8266Service.scheduledSwitch()
      .subscribe(
        response => {
          this.scheduled = response.scheduledMode == 1;
          this.switchTitle = this.scheduled ? 'Programado' : 'Manual';
          alert('Modo de dispositivo ' + this.switchTitle);
        },
        error => alert(error)
      );
  }

  private getScheduled() {
    this.esp8266Service.scheduledGet()
      .subscribe(
        response => {
          this.scheduled = response.scheduledMode == 1;
          this.switchTitle = this.scheduled ? 'Programado' : 'Manual';
        },
        error => alert(error)
      );
  }

}
