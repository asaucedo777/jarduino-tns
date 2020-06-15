import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TimePickerComponent } from "./timepicker/timepicker.component";
import { ActionBarAsvComponent } from "./actionbar/actionbar.component";

@NgModule({
  imports: [
    NativeScriptCommonModule,
  ],
  exports: [
    TimePickerComponent,
    ActionBarAsvComponent,
  ],
  declarations: [
    TimePickerComponent,
    ActionBarAsvComponent,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
