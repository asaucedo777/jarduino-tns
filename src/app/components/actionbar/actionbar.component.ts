import { Component, OnInit, Input } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from "tns-core-modules/application";

@Component({
  selector: 'app-actionbar',
  templateUrl: 'actionbar.component.html'
})

export class ActionBarAsvComponent implements OnInit {
  @Input() title: string;
  constructor() {
    if (!this.title) {
      this.title = 'sin título';
    }
  }
  ngOnInit() { }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }
}
