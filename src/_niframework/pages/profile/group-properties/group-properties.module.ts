import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupPropertiesPageRoutingModule } from './group-properties-routing.module';

import { GroupPropertiesPage } from './group-properties.page';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatExpansionModule} from '@angular/material/expansion';
import { PipesSharedModule } from 'src/_niframework/pipes/pipes-shared.module';

@NgModule({
  imports: [
    PipesSharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    GroupPropertiesPageRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    ReactiveFormsModule
  ],
  declarations: [GroupPropertiesPage]
})
export class GroupPropertiesPageModule {}
