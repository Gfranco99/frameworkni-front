import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinallyPageRoutingModule } from './finally-routing.module';

import { FinallyPage } from './finally.page';

import { FinallyEmailComponent } from '../../components/finally-email/finally-email/finally-email.component';
import { FinallySmsComponent } from '../../components/finally-sms/finally-sms/finally-sms.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinallyPageRoutingModule
  ],
  declarations: [FinallyPage, FinallySmsComponent, FinallyEmailComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class FinallyPageModule {}
