import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersFilterPageRoutingModule } from './users-filter-routing.module';

import { UsersFilterPage } from './users-filter.page';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PipesSharedModule } from 'src/_niframework/pipes/pipes-shared.module';

// import { CpfCnpjPipe } from 'src/_niframework/pipes/cpf-cnpj.pipe';
// import { AtivoInativoPipe } from 'src/_niframework/pipes/ativo-inativo.pipe';
// import { ReplaceCommaPipe } from 'src/_niframework/pipes/replace-comma.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersFilterPageRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    PipesSharedModule
  ],
  declarations: [ UsersFilterPage ]
})
export class UsersFilterPageModule {}
