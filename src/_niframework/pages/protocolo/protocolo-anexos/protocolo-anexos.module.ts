import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProtocoloAnexosPageRoutingModule } from './protocolo-anexos-routing.module';

import { ProtocoloAnexosPage } from './protocolo-anexos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProtocoloAnexosPageRoutingModule
  ],
  declarations: []
})
export class ProtocoloAnexosPageModule {}
