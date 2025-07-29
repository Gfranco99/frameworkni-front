/* eslint-disable*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Groups } from 'src/_niframework/models/groups-filter';
import { IsLoggedService } from 'src/_niframework/services/isLogged/is-logged.service';
import { GroupService } from 'src/_niframework/services/group/group.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SharedService } from 'src/_niframework/services/shared/shared.service';
import { Subscription } from 'rxjs';
import { VerificarPermissoes } from 'src/_niframework/services/guards/VerificarPermissoes';
import ls from 'localstorage-slim'
import { Loader } from 'src/_niframework/providers/loader/loader';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  refreshTable: Subscription;
  groupsFromDataBase: Groups[] = [];
  displayedColumns = ['idGrupo', 'nomeGrupo', 'descricaoGrupo', 'desativar', 'editar', 'remover'];
  dataSource = new MatTableDataSource();
  
  @ViewChild('paginator') paginator:MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private isLogged: IsLoggedService,
    private groupService: GroupService,
    private alertController: AlertController,
    private router: Router,
    private sharedService: SharedService,
    private loader: Loader
    ) {
      this.refreshTable = sharedService.getRequestUpdateGroupsTable().subscribe(res => {
        this.refreshDataTable();
      });
      this.isLogged.isLoggedVerify();
      this.getGroups();
    }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // ativa ou desativa o grupo
  inAtivo(event: Event , group: Object):void {

    const value = (event.target as HTMLInputElement).checked
    
    this.loader.present().then(() => {
      
      this.groupService.enableDisableGroup(group, !value).then(el => {
        this.updateData();
      })

    }).then(() => {
      this.loader.dismiss();
    })

  }
  
  newGroup(): void {
    this.loader.present("Aguarde").then(() => {
      this.sharedService.sendCreateNewGroup();

      setTimeout(() => {
        this.router.navigate(['/app/group-properties'])
      }, 1000)
      
    }).then(() => {
      this.loader.dismiss();
    })
  }

  editGroup(idGroup: number): void {
    this.loader.present( "Carregando os dados do grupo" ).then(() => {
      this.router.navigate(['/app/group-properties'], {queryParams: {idGroup: idGroup}});
      this.sharedService.sendEditGroup();
    }).then(() => {
      this.loader.dismiss();
    })
  }
  
  goToDetailsPage(idGroup): void {
    this.router.navigate(['/app/group-properties'], {queryParams: {idGroup}})
  }

  getGroups(): void{  
    this.groupService.getGroups().then(response => {
    this.groupsFromDataBase = response;
    this.dataSource.data = this.groupsFromDataBase;
    }).catch(err => console.log(err));
  }

  deleteGroup(idGroup?: number, deleteGroup?: boolean): void {
    if(deleteGroup === undefined) {
      this.presentAlert(idGroup)
    } else {
      this.loader.present( "Excluindo o grupo..." ).then(() => {
        
        this.groupService.deleteGroup(idGroup).then(res => {
          this.updateData();
        })
      }).then(() => {
        this.loader.dismiss();
      })
    }
  }

  async presentAlert(idGroup) {
    let deleteGroup = false;

    const alert = await this.alertController.create({

      header: 'Atenção',
      message: 'O grupo será excluído permanentemente, após a confirmação.',
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'secondary',
          handler: () => {

            alert.dismiss();
            return false;
        }
        }, {
          text: 'Confirmar',
          handler: () => {
            deleteGroup =  true;
        }
        }
      ]      
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    if(deleteGroup) this.deleteGroup(idGroup, deleteGroup)
  }

  updateData(): void {
    this.getGroups();
    this.dataSource.data = this.groupsFromDataBase;
  }

  refreshDataTable(): void {
    this.getGroups();
  }

  // volta para a página anterior através do histórico de navegação
  back(): void {
    window.history.back();
  }

  // verifica permissão para mostrar item
  checkRole( rolesFunctionalities: string[] ): boolean {
    const userRoles = JSON.parse(ls.get('rl', {decrypt: true})!);

    return VerificarPermissoes.temPermissao( rolesFunctionalities, userRoles );

  }
}
