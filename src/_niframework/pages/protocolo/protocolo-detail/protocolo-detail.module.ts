import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProtocoloDetailPageRoutingModule } from './protocolo-detail-routing.module';

import { ProtocoloDetailPage } from './protocolo-detail.page';
import { ProtocoloAnexosPage } from '../protocolo-anexos/protocolo-anexos.page';
import { UserProtocolsComponent } from '../components/user-protocols/user-protocols.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProtocoloDetailPageRoutingModule
  ],
  declarations: [ProtocoloDetailPage, ProtocoloAnexosPage],
  providers: [UserProtocolsComponent]
})
export class ProtocoloDetailPageModule {}
