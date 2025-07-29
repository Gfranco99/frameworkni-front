import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GroupsPageRoutingModule } from './groups-routing.module';
import { GroupsPage } from './groups.page';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
    declarations: [GroupsPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GroupsPageRoutingModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule
    ]
})
export class GroupsPageModule {}
