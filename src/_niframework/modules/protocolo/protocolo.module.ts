import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProtocolsComponent } from 'src/_niframework/pages/protocolo/components/user-protocols/user-protocols.component';
// import { UserProtocolsComponent } from 'src/_niframework/pages/protocolo/components/user-protocols/user-protocols.component';



@NgModule({
  declarations: [
    UserProtocolsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UserProtocolsComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProtocoloModule { }
