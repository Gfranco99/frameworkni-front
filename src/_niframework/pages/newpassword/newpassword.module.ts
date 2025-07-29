import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewpasswordPageRoutingModule } from './newpassword-routing.module';

import { NewpasswordPage } from './newpassword.page';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewpasswordPageRoutingModule,
    ReactiveFormsModule,
    RxReactiveFormsModule
  ],
  declarations: [NewpasswordPage]
})
export class NewpasswordPageModule {}
