import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { BrMaskerModule } from 'src/_niframework/directives/brMasker/br-mask.module';
import { ListaPaisesComponent } from 'src/_niframework/services/countries/lista-paises/lista-paises.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    BrMaskerModule
  ],
  declarations: [RegisterPage, ListaPaisesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterPageModule {}
