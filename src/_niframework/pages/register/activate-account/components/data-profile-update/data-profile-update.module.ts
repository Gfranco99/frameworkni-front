import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataProfileUpdatePageRoutingModule } from './data-profile-update-routing.module';
import { DataProfileUpdatePage } from './data-profile-update.page';
// import { BrMaskerModule } from 'br-mask';
import { EmailEditComponent } from './email-edit/email-edit.component';
// import { PhoneEditComponent } from './phone-edit/phone-edit.component';
import { BrMaskerModule } from 'src/_niframework/directives/brMasker/br-mask.module';
import { PhoneEditComponent } from './phone-edit/phone-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DataProfileUpdatePageRoutingModule,
    BrMaskerModule

  ],
  declarations: [DataProfileUpdatePage, EmailEditComponent, PhoneEditComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class DataProfileUpdatePageModule {}
