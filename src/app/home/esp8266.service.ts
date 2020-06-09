import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pin } from '../pin.model';
import { environment } from '../../environment';

@Injectable()
export class Esp8266Service {

  constructor(public httpClient: HttpClient) { }

  public test(): Observable<any> {
    return this.httpClient.get(environment.API_URL + '/TEST');
  }
  public getTime(): Observable<any> {
    return this.httpClient.get(environment.API_URL + '/TIME');
  }

  public ledBuiltinStatus(): Observable<any> {
    return this.httpClient.get(environment.API_URL + '/LED_BUILTIN');
  }
  public ledBuiltinSwitch(): Observable<any> {
    return this.httpClient.get(environment.API_URL + '/LED_BUILTIN/SWITCH');
  }
  public ledBuiltinOn(): Observable<any> {
    return this.httpClient.get(environment.API_URL + '/LED_BUILTIN/ON');
  }
  public ledBuiltinOff(): Observable<any> {
    return this.httpClient.get(environment.API_URL + '/LED_BUILTIN/OFF');
  }

  public digitalPins(): Observable<any> {
    return this.httpClient.get(environment.API_URL + '/DIGITAL_PINS');
  }
  public digitalPinGet(pin: number): Observable<Pin> {
    return this.httpClient.get<Pin>(environment.API_URL + '/DIGITAL_PIN_GET?pin=' + pin);
  }
  public digitalPinPost(pinData: string): Observable<Pin> {
    let headers = {
      // "Access-Control-Allow-Origin": "*",
      "Content-type": "application/x-www-form-urlencoded",
    };
    let options = {
      headers: headers
    }
    return this.httpClient.post<Pin>(environment.API_URL + '/DIGITAL_PIN_POST', pinData, options);
  }
  public digitalPinStatus(pin: number): Observable<any> {
    return this.httpClient.get(environment.API_URL + '/DIGITAL_PIN/STATUS?pin=' + pin);
  }
  public digitalPinSwitch(pin: number): Observable<any> {
    return this.httpClient.get(environment.API_URL + '/DIGITAL_PIN/SWITCH?pin=' + pin);
  }
  public digitalPinOn(pin: number): Observable<any> {
    return this.httpClient.get(environment.API_URL + '/DIGITAL_PIN/ON?pin=' + pin);
  }
  public digitalPinOff(pin: number): Observable<any> {
    return this.httpClient.get(environment.API_URL + '/DIGITAL_PIN/OFF?pin=' + pin);
  }

  public scheduledGet(): Observable<any> {
    return this.httpClient.get(environment.API_URL + '/SCHEDULED');
  }
  public scheduledSwitch(): Observable<any> {
    return this.httpClient.get(environment.API_URL + '/SCHEDULED/SWITCH');
  }
}
