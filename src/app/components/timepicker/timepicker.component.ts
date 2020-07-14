import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_MINUTE_MS = 60 * 1000;
const ONE_SECOND_MS = 1000;

@Component({
  selector: 'app-timepicker',
  templateUrl: 'timepicker.component.html'
})
export class TimePickerComponent implements OnInit {
  @Input() horaMs: number;
  @Input() horaDate: Date;
  hours: number;
  minutes: number;
  seconds: number;
  @Output() cambio = new EventEmitter();
  emitirNuevoValor() {
    this.cambio.emit({ valor: this.horaMs });
    // console.log('nuevo valor:' + this.horaMs);
  }
  constructor() {
  }
  ngOnInit() {
    if (this.horaMs) {
      this.horaDate = this.horaMs ? new Date(this.horaMs) : new Date();
    } else if (this.horaDate) {
      this.horaMs = this.horaDate.getTime();
    }
    this.hours = this.horaDate ? (this.horaDate.getHours() == 0 ? 23 : this.horaDate.getHours() - 1) : 0;
    this.minutes = this.horaDate ? this.horaDate.getMinutes() : 0;
    this.seconds = this.horaDate ? this.horaDate.getSeconds() : 0;
  }
  onPlus(s: string) {
    switch (s) {
      case 'H':
        if (this.hours < 23) {
          this.hours++;
          this.horaMs += ONE_HOUR_MS;
        } else {
          this.hours = 0;
          this.horaMs -= 23 * ONE_HOUR_MS;
        }
        break;
      case 'm':
        if (this.minutes < 59) {
          this.minutes++;
          this.horaMs += ONE_MINUTE_MS;
        } else {
          this.minutes = 0;
          this.horaMs -= 59 * ONE_MINUTE_MS;
        }
        break;
      case 's':
        if (this.seconds < 59) {
          this.seconds++;
          this.horaMs += ONE_SECOND_MS;
        } else {
          this.seconds = 0;
          this.horaMs -= 59 * ONE_SECOND_MS;
        }
        break;
      default:
        break;
    }
    this.emitirNuevoValor();
  }
  onMinus(s: string) {
    switch (s) {
      case 'H':
        if (this.hours > 0) {
          this.hours--;
          this.horaMs -= ONE_HOUR_MS;
        } else {
          this.hours = 23;
          this.horaMs += 23 * ONE_HOUR_MS;
        }
        break;
      case 'm':
        if (this.minutes > 0) {
          this.minutes--;
          this.horaMs -= ONE_MINUTE_MS;
        } else {
          this.minutes = 59;
          this.horaMs += 59 * ONE_MINUTE_MS;
        }
        break;
      case 's':
        if (this.seconds > 0) {
          this.seconds--;
          this.horaMs -= ONE_SECOND_MS;
        } else {
          this.seconds = 59;
          this.horaMs += 59 * ONE_SECOND_MS;
        }
        break;
      default:
        break;
    }
    this.emitirNuevoValor();
  }

}
