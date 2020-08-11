import { Component, OnInit, OnDestroy } from "@angular/core";

import { RadSideDrawer } from "nativescript-ui-sidedrawer";

import * as app from "tns-core-modules/application";
import { Esp8266Service } from "../../app.service";

const ONE_DAY = 24 * 60 * 60 * 1000;

@Component({
  selector: "Lights",
  templateUrl: "./lights.component.html"
})
export class LightsComponent implements OnInit, OnDestroy {

  constructor(
    public esp8266Service: Esp8266Service,
  ) {
  }
  
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }

}
