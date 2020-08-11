import { Component, OnInit, OnDestroy } from "@angular/core";

import { TextField } from "tns-core-modules/ui/text-field";
import { Slider } from "tns-core-modules/ui/slider";

import { Pin } from "../../pin.model";
import { Esp8266Service } from "../../app.service";
import { getHour, getMinute } from "~/app/app.utils";

const ONE_DAY = 24 * 60 * 60 * 1000;

@Component({
  selector: "Irrigation",
  templateUrl: "./irrigation.component.html"
})
export class IrrigationComponent implements OnInit, OnDestroy {
  alive: boolean;
  title: string;
  switchTitle: '...' | 'Manual' | 'Programado';
  scheduled: boolean;
  now: number;
  esp8266Time: number;
  pines: Array<Pin>;
  regando: Array<boolean>;

  constructor(
    public esp8266Service: Esp8266Service,
  ) {
  }

  ngOnInit(): void {
    this.alive = true;
    this.title = 'Conectando al riego...';
    this.getTest();
    this.switchTitle = '...';
    this.scheduled = false;
    this.getScheduled();
    // Quitamos ms y truncamos la fecha
    this.now = (Math.trunc((new Date()).getTime() / 1000) * 1000) % ONE_DAY;
    this.esp8266Time = 0;
    this.onGetTime();
    this.pines = new Array<Pin>();
    this.getPines();
    this.regando = [ false, false];
  }
  ngOnDestroy(): void {
    this.alive = false;
  }

  onSwitchScheduled() {
    this.esp8266Service.scheduledSwitch()
      .subscribe(
        response => {
          this.scheduled = response.scheduledMode == 1;
          this.switchTitle = this.scheduled ? 'Programado' : 'Manual';
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
          if (this.pines[pin].status == 1) {
            alert('Fase ' + (pin + 1) + ' de riego DESACTIVADA.');
            this.regando[pin] = false;
          } else {
            alert('Fase ' + (pin + 1) + ' de riego ACTIVADA.');
            this.regando[pin] = true;
          }
        },
        error => alert(error)
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
  onStart0Change(pin: number, event) {
    this.pines[pin].start0 = event.valor;
  }
  onDuration0Blur(pin: number, event) {
    let value = (<TextField>event.object).text;
    this.pines[pin].duration0 = parseInt(value);
  }
  onDuration0Change(pin: number, event) {
    let value = (<Slider>event.object).value;
    this.pines[pin].duration0 = value;
  }
  onStart1Change(pin: number, event) {
    this.pines[pin].start1 = event.valor;
  }
  onDuration1Blur(pin: number, event) {
    let value = (<TextField>event.object).text;
    this.pines[pin].duration1 = parseInt(value);
  }
  onDuration1Change(pin: number, event) {
    let value = (<Slider>event.object).value;
    this.pines[pin].duration1 = value;
  }
  onUpdatePin(pin: number) {
    this.esp8266Service.digitalPinPost(this.bind(this.pines[pin]))
      .subscribe(
        response => {
          this.getPines();
          alert('Pin D' + pin + ' programado a las ' 
            + getHour(this.pines[pin].start0) + ':'  
            + getMinute(this.pines[pin].start0) + ' durante '  
            + this.pines[pin].duration0 + ' segundos y programado a las ' 
            + getHour(this.pines[pin].start1) + ':'  
            + getMinute(this.pines[pin].start1) + ' durante '  
            + this.pines[pin].duration1 + ' segundos.');
        },
        error => {
          alert(error);
        }
      );
    this.onGetTime();
  }

  private getTest() {
    this.esp8266Service.test()
      .subscribe(
        response => {
          this.title = 'CONECTADO AL RIEGO';
        },
        error => {
          this.title = JSON.stringify(error);
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
        response => this.setearPinesRiego(response.pines),
        error => {
          alert(error);
        });
  }
  private setearPinesRiego(pines: Array<Pin>) {
    this.pines = [];
    if (pines) {
      pines.forEach((element: any) => {
        // TODO Crear atributo pinType
        if (element.description.includes('Riego')) {
          this.pines.push(new Pin(element))
        }
      });
    }
  }
  private bind(pin: Pin): string {
    let retorno = `pin=${pin.pin}&start0=${pin.start0 / 1000}&start1=${pin.start1 / 1000}&duration0=${pin.duration0}&duration1=${pin.duration1}`;
    return retorno;
  }

}
