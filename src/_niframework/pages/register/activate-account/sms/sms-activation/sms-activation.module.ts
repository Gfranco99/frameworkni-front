import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SmsActivationPageRoutingModule } from './sms-activation-routing.module';
import { MoveNextByMaxLengthDirective, SmsActivationPage } from './sms-activation.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrMaskerModule } from 'br-mask';
// import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AppComponent } from 'src/app.component';
import { ActivatedAccountBySmsComponent } from '../activated-account-by-sms/activated-account-by-sms.component';
import { BrMaskerModule } from 'src/_niframework/directives/brMasker/br-mask.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SmsActivationPageRoutingModule,
    ReactiveFormsModule,
    BrMaskerModule
  ],
  declarations: [
    SmsActivationPage,
    MoveNextByMaxLengthDirective,
    ActivatedAccountBySmsComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SmsActivationPageModule {}
