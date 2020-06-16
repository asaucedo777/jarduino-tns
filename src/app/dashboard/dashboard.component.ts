import { Component, OnInit, OnDestroy } from "@angular/core";

import { RadSideDrawer } from "nativescript-ui-sidedrawer";

import * as app from "tns-core-modules/application";
import { Esp8266Service } from "../esp8266.service";
import { RouterExtensions } from "nativescript-angular/router";
import { Pin } from "../pin.model";

const ONE_DAY = 24 * 60 * 60 * 1000;

@Component({
  selector: "Dashboard",
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnInit, OnDestroy {
  switchTitle: '...' | 'Manual' | 'Programado';
  scheduled: boolean;
  pines: Array<Pin>;
  irrigationText: string;
  regando: boolean;

  constructor(
    public esp8266Service: Esp8266Service,
    private routerExtensions: RouterExtensions
  ) {
  }

  ngOnInit(): void {
    this.switchTitle = '...';
    this.scheduled = false;
    this.irrigationText = 'RIEGO ...  \n';
    this.getScheduled();
    this.pines = new Array<Pin>();
    this.getPines();
    this.regando = false;
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
          if (this.scheduled) {
            alert('Ha cambiado al modo ' + this.switchTitle + '. Seleccione el elemento que desea programar');
          } else {
            alert('Ha cambiado al modo ' + this.switchTitle + '. Ahora puede activar o desactivar manualmente cualquier elemento');
          }
          this.getPines();
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
          this.buildIrrigationText(response.pines);
        },
        error => alert(error)
      );
  }
  private getPines() {
    this.esp8266Service.digitalPins()
      .subscribe(
        response => {
          this.setearPinesRiego(response.pines);
          this.buildIrrigationText(response.pines);
        },
        error => {
          alert(error);
        });
  }
  private setearPinesRiego(pines: Array<Pin>) {
    this.pines = [];
    if (pines) {
      pines.forEach((element: Pin) => {
        // TODO Crear atributo pinType
        if (element.description.includes('Riego')) {
          this.pines.push(new Pin(element));
        }
      });
    }
  }
  private buildIrrigationText(pines: Array<Pin>) {
    this.irrigationText = 'RIEGO ...  \n';
    pines.forEach((element: Pin) => {
      // TODO Crear atributo pinType
      if (element.description.includes('Riego')) {
        this.pines.push(new Pin(element));
        if (this.scheduled) {
          this.irrigationText += '\nD' + element.pin + '-1:' + element.start0 + '+' + element.duration0 + ' ';
          this.irrigationText += 'D' + element.pin + '-2:' + element.start1 + '+' + element.duration1;
        } else {
          this.irrigationText += '\nD' + element.pin + '-1: ' + (element.status == 1 ? 'ON' : 'OFF');
        }
      }
    });
  }
  estaRegando(): boolean {
    let retorno = false;
    this.pines.forEach((element: Pin) => {
      if (element.status == 1) {
        retorno = true;
      }
    });
    return true;
  }

}
