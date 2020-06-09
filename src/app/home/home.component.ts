import { Component, OnInit, OnDestroy } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Pin } from "../pin.model";
import { Esp8266Service } from "./esp8266.service";

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;

@Component({
  selector: "Home",
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit, OnDestroy {
  alive: boolean;
  test: string;
  switchTitle: '...' | 'Manual' | 'Programado';
  scheduled: boolean;
  now: number;
  esp8266Time: number;
  esp8266Hour: number;
  esp8266Minute: number;
  pines: Array<Pin>;

  constructor(
    public esp8266Service: Esp8266Service,
  ) {
  }
  
  ngOnInit(): void {
    this.alive = true;
    this.test = 'Conectando..';
    this.getTest();
    this.switchTitle = '...';
    this.scheduled = false;
    this.getScheduled();
    // Quitamos ms y truncamos la fecha
    this.now = (Math.trunc((new Date()).getTime() / 1000) * 1000) % ONE_DAY;
    this.esp8266Time = 0;
    this.esp8266Hour = this.getHour(this.esp8266Time);
    this.esp8266Minute = this.getMinute(this.esp8266Time);
    this.onGetTime();
    this.pines = new Array<Pin>();
    this.getPines();
  }
  ngOnDestroy(): void {
    this.alive = false;
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }
  onSwitchScheduled() {
    this.esp8266Service.scheduledSwitch()
      .subscribe(
        response => {
          this.scheduled = response.scheduledMode == 1;
          this.switchTitle = this.scheduled ? 'Programado' : 'Manual';
          // alert('Modo de dispositivo ' + this.switchTitle);
          this.getPines();
        },
        error => alert(error)
      );
    this.onGetTime();
  }
  onSwitchPin(pin: number) {
    this.esp8266Service.digitalPinSwitch(pin)
      .subscribe(
        response => {
          this.getPines();
          alert('Switch pin D' + pin + ' ok');
        },
        error => alert(error)
      );
    this.onGetTime();
  }
  onUpdatePin(pin: number) {
    this.esp8266Service.digitalPinPost(this.bind(this.pines[pin]))
      .subscribe(
        response => {
          this.getPines();
          alert('Actualización de pin D' + pin + 'Pin actualizado');
        },
        error => {
          alert(error);
        }
      );
    this.onGetTime();
  }
  onGetTime() {
    this.esp8266Service.getTime()
      .subscribe(
        response => {
          this.esp8266Time = response.time * 1000;
        },
        error => alert(error)
      );
  }

  getHour(mseconds: number): number {
    let retorno = Math.trunc(
      (Math.trunc(mseconds / 1000) * 1000) % ONE_DAY
    ) / ONE_HOUR;
    return retorno;
  }
  getMinute(mseconds: number): number {
    let minutes = mseconds - (ONE_HOUR * this.getHour(mseconds));
    let retorno = (minutes / ONE_MINUTE);
    return retorno;
  }
  private getTest() {
    this.esp8266Service.test()
      .subscribe(
        response => {
          this.test = response.test;
          console.log(this.test);
        },
        error => {
          this.test = error;
          alert(error);
        }
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
  private getPines() {
    this.esp8266Service.digitalPins()
      .subscribe(
        response => this.setearPines(response.pines),
        error => {
          alert(error);
        });
  }
  private setearPines(pines: Array<Pin>) {
    this.pines = [];
    if (pines) {
      pines.forEach((element: any) => {
        this.pines.push(new Pin(element))
      });
    }
  }
  private bind(pin: Pin): string {
    let retorno = `pin=${pin.pin}&start0=${pin.start0 / 1000}&start1=${pin.start1 / 1000}&duration0=${pin.duration0}&duration1=${pin.duration1}`;
    // console.log(retorno);
    return retorno;
  }

}
