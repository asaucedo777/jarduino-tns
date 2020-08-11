import { Component, OnInit, OnDestroy } from "@angular/core";

import { RadSideDrawer } from "nativescript-ui-sidedrawer";

import * as app from "tns-core-modules/application";
import { Esp8266Service } from "../app.service";
import { RouterExtensions } from "nativescript-angular/router";
import { Pin } from "../pin.model";
import { getHour, getMinute } from "../app.utils";

const ONE_DAY = 24 * 60 * 60 * 1000;
const REFRESH_TIME = 5000;
const MAX_ATTEMPTS = 5;

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
  hora: number;

  isConnecting: boolean;
  isError: boolean;
  attempts: number;

  constructor(
    public esp8266Service: Esp8266Service,
    private routerExtensions: RouterExtensions
  ) {
    this.isConnecting = false;
    this.isError = false;
    this.attempts = 0;
  }

  ngOnInit(): void {
    this.switchTitle = '...';
    this.scheduled = false;
    this.irrigationText = 'RIEGO ...  \n';
    this.pines = new Array<Pin>();
    this.regando = false;
    setInterval(() => {
      this.esp8266Service.getTime()
        .subscribe(
          response => {
            this.hora = response.time * 1000;
            this.getScheduled(this.esp8266Service);
            this.getPines(this.esp8266Service);
            this.isConnecting = false;
            this.isError = false;
            this.attempts = 0;
          },
          error => {
            this.isError = true;
            this.attempts++;
            if (this.attempts > MAX_ATTEMPTS) {
              alert(error);
              this.attempts = 0;
            }
          }
        );
    }, REFRESH_TIME);
    this.isConnecting = true;
  }
  ngOnDestroy(): void {
  }

  onNavItemTap(navItemRoute: string): void {
    let extras = {
      transition: { name: "fade" },
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
          this.getPines(this.esp8266Service);
          this.isConnecting = false;
          this.isError = false;
          this.attempts = 0;
        },
        error => {
          this.isError = true;
          this.attempts++;
          if (this.attempts > MAX_ATTEMPTS) {
            alert(error);
            this.attempts = 0;
          }
         }
      );
  }
  private getScheduled(service: Esp8266Service) {
    service.scheduledGet()
      .subscribe(
        response => {
          this.scheduled = response.scheduledMode == 1;
          this.switchTitle = this.scheduled ? 'Programado' : 'Manual';
          this.isConnecting = false;
          this.isError = false;
          this.attempts = 0;
        },
        error => {
          this.isError = true;
          this.attempts++;
          if (this.attempts > MAX_ATTEMPTS) {
            alert(error);
            this.attempts = 0;
          }
         }
      );
  }
  private getPines(service: Esp8266Service) {
    service.digitalPins()
      .subscribe(
        response => {
          this.setearPinesRiego(response.pines);
          this.buildIrrigationText(response.pines);
          this.isConnecting = false;
          this.isError = false;
          this.attempts = 0;
        },
        error => {
          this.isError = true;
          this.attempts++;
          if (this.attempts > MAX_ATTEMPTS) {
            alert(error);
            this.attempts = 0;
          }
         }
      );
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
    this.irrigationText = 'RIEGO:\n';
    if (pines) {
      pines.forEach((element: Pin) => {
        // TODO Crear atributo pinType
        if (element.description.includes('Riego')) {
          this.pines.push(new Pin(element));
          if (this.scheduled) {
            this.irrigationText += '\nD' + element.pin
              + '-1:' + getHour(element.start0 * 1000) + ':' + getMinute(element.start0 * 1000)
              + '+' + element.duration0 + ' ';
            this.irrigationText += 'D' + element.pin
              + '-2:' + getHour(element.start1 * 1000) + ':' + getMinute(element.start1 * 1000)
              + '+' + element.duration1;
          } else {
            this.irrigationText += '\nD' + element.pin
              + '-1: ' + (element.status == 1 ? 'ON' : 'OFF');
          }
        }
      });
    } else {
      this.irrigationText = 'NO HAY PINES';
    }
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
