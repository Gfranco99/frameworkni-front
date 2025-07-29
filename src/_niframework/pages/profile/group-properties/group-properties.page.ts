/*eslint-disable*/
import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PermissionsFilter } from 'src/_niframework/models/permissions-filter copy';
import { UserFilter } from 'src/_niframework/models/user-filter';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { PermissionsService } from 'src/_niframework/services/permissions/permissions.service';
import { UserService } from 'src/_niframework/services/user/user.service';
import { GroupService } from 'src/_niframework/services/group/group.service';
import { IsLoggedService } from 'src/_niframework/services/isLogged/is-logged.service';
import { SharedService } from 'src/_niframework/services/shared/shared.service';
import { concat, Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
// import { LoaderService } from 'src/_niframework/services/loader/loader.service';
import { ToasterService } from 'src/_niframework/services/toaster/toaster.service';
// import { inArray, param } from 'jquery';
// import { element } from 'protractor';
// import { ValueAccessor } from '@ionic/angular/directives/control-value-accessors/value-accessor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonSearchbar } from '@ionic/angular';
import { Loader } from 'src/_niframework/providers/loader/loader';

@Component({
  selector: 'app-group-properties',
  templateUrl: './group-properties.page.html',
  styleUrls: ['./group-properties.page.scss'],
})

export class GroupPropertiesPage implements OnInit, AfterViewInit {
  onFormGroups: FormGroup;
  newGroup: Subscription;
  editGroupProperties: Subscription;
  usersFromDataBase: UserFilter[] = [];
  currentUsers: any = []; 
  temporaryDataSearch: UserFilter[] = []; //array auxiliar para realizar as buscas
  permissions: PermissionsFilter[] = [];
  currentGroup = {
    idGrupo: 0,
	  nomeGrupo: "",
	  descricaoGrupo: "",
	  ativo: false
  };
  currentGroupPermissions: any = []

  panelOpenState = true
  displayedColumnsOfUsers = ['nome', 'documento', 'situacao', 'remover', 'pendente'];
  displayedColumnsOfPermissions = ['id', 'nome', 'ds', 'remover']
  permissionsDataSource = new MatTableDataSource<PermissionsFilter>(this.permissions);
  userDataSource = new MatTableDataSource<any>(this.currentUsers);
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  constructor(
    private alert: AlertsProvider,
    private permissionsService: PermissionsService,
    private userService: UserService,
    private groupService: GroupService,
    private isLogged: IsLoggedService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private loader: Loader,
    private toaster: ToasterService,
    private formBuilder: FormBuilder,
    private alertController: AlertController
    ) {
        // this.isLogged.isLoggedVerify();
        this.peddingUsers();
        // this.getUsersFromDB();
        this.getPermissionsFromDB();
        this.updateTables("delay");
        this.newGroup = this.sharedService.getRequestNewGroup().subscribe(() => {
          this.createNewGroup(0);
        })

        this.editGroupProperties = this.sharedService.getRequestEditGroup().subscribe(() => {
          let idGroup;
          
          this.activatedRoute.queryParamMap.subscribe((param: ParamMap) => {
            idGroup = param.get('idGroup')
          })
          this.getGroup(Number(idGroup))
        })
      }
    
  ngOnInit() {
    this.onFormGroups = this.formBuilder.group({
      'nameGroup': ['', Validators.compose([
        Validators.required,
        Validators.minLength(1)
      ])],
      'descriptionGroup': ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])]
    })
  }

  ngAfterViewInit() {
    this.permissionsDataSource.paginator = this.paginator.toArray()[0];
    this.permissionsDataSource.sort = this.sort.toArray()[0];
    this.userDataSource.paginator = this.paginator.toArray()[1];
    this.userDataSource.sort = this.sort.toArray()[1];
  }

  // criar novo grupo.
  // params: 0=limparDadosFormulário  1=enviaParaBackEndCriar
  createNewGroup(requestValue: number): void {
    if(requestValue === 0) {
      this.currentGroup.ativo = false;
      this.currentGroup.nomeGrupo = "";
      this.currentGroup.descricaoGrupo = "";
      this.currentGroup.idGrupo = 0;
      this.currentUsers.splice(0, this.currentUsers.length)
      this.userDataSource.data = this.userDataSource.data;
      this.getPermissionsFromDB();
    }

    if(requestValue === 1) {
      
      let userToken = localStorage.getItem('token');

      this.loader.present("Criando novo grupo").then(() => {
        this.groupService.newGroup(this.currentGroup, userToken).then(res => {

          this.getGroup(res.idGrupo);

          setTimeout(() => {
            this.toaster.presentToast("Novo grupo criado com sucesso", "success", 3);
          }, 3000)
        }).catch(err => {
          
          // number

          switch(err.status) {
            case 401:
              this.alert.showAlert("Erro " + err.status, "Usuário não autorizado a utilizar este recurso.")
              break;
            
            case 400:
              this.alert.showAlert("Erro " + err.status, "Ocorreu uma falha ao tentar criar o grupo.")
              break;
            
            default:
              this.alert.showAlert("Erro " + err.status, "Ocorreu uma falha.")
              break;
          }

        })
      }).then(() => {
        this.loader.dismiss();
      })
    }
  }

  // carrega lista de permissões do banco de dados
  getPermissionsFromDB():void {
    this.permissions.splice(0, this.permissions.length)
    let listGroupPermissions: any = []
    let checkedOn: any = [];
    let checkedOff: any = [];
    this.permissionsService.getPermissions().then(resposne => {

      this.currentGroupPermissions.forEach(el => {
        listGroupPermissions.push(el.idPermissao)
      })

      resposne.forEach(el => {
      let exists = listGroupPermissions.find(res => res === el.idPermissao)        
        if(exists != undefined) {
          el.checked = 'on'
          checkedOn.push(el)
        } else {
          el.checked = null
          checkedOff.push(el)
        }
      })
      checkedOn.forEach(el => this.permissions.push(el));
      checkedOff.forEach(el => this.permissions.push(el))
      this.permissionsDataSource.data = this.permissions;
    })
  }

  // atualiza nome e descrição do grupo
  updateNameGroup(): void {
    this.loader.present("Salvando... aguarde.").then(() => {
      this.groupService.updateNameGroup(this.currentGroup.idGrupo, this.currentGroup)
      .then(response => {
        console.log(response);
        if (response.responseCode === 'OK') {
          this.toaster.presentToast("Salvo com sucesso", "success", 4)
        }
      });
    }).then(() => {
      this.loader.dismiss();
    })
  }

  // carrega dados do grupo selecionado
  getGroup(id?: any): void {
    this.groupService.getGroup(id).then(value => {
      this.currentGroup = value});
      this.getGroupPermissions(id);
      this.getUsersGroup(id);
  }

  // carrega os usuários associados ao grupo
  getUsersGroup(idGroup: number): void {
    this.currentUsers.splice(0, this.currentUsers.length);
    
    this.groupService.getUsersFromGroup(idGroup).then(response => {
      let users = response;

      if(users === null) {
        this.userDataSource.data = this.userDataSource.data;
        return;

      } else {
        response.forEach(el => this.currentUsers.push(el))
      }
      this.userDataSource.data = this.userDataSource.data;
    }) 
  }

  // carrega as permissões associadas ao grupo
  getGroupPermissions(idGroup: number): void {
    this.currentGroupPermissions.splice(0, this.currentGroupPermissions.length)
    this.permissionsService.getGroupPermissions(idGroup)
    .then(response => {
      response.forEach(element => {
        this.currentGroupPermissions.push(element);
      });
      this.getPermissionsFromDB();
    })
  }

  // pesquisa por usuários e apresenta os resultados
  search(event: Event) {

    const query = (event.target as HTMLInputElement).value;

    if (!query) {
        this.temporaryDataSearch = [];
    } else { 
        this.temporaryDataSearch;
        
        this.userService.getUserList(query).then(res => this.temporaryDataSearch = res)
        
    }
  }

  // seleciona e adiciona usuário temporáriamente ao grupo
  addUserOnGroup(user): void {
    let exists = this.currentUsers.find(el => el.codigoUsuario === user.codigoUsuario)
    if(exists !== undefined) {
      this.toaster.presentToast("Usuário já está na lista", "warning", 2);
      return
    }
    this.temporaryDataSearch = []
    user.localUser = true;
    this.currentUsers.push(user);
    this.updateTables();
  }

  // remove usuário do grupo
  removeUserFromGroup(user: UserFilter):void {
    const index = this.currentUsers.indexOf(user);
    if(user.localUser === true) {

        this.currentUsers.splice(index, 1)
        this.updateTables();

    } else {
      this.groupService.delUserFromGroup(user['codigoUsuario'], this.currentGroup.idGrupo).then(res => {
        this.currentUsers.splice(index, 1)
        this.updateTables();
        this.toaster.presentToast("Usuário removido", "success", 2)
      })
    }
  }

  // salva definitivamente usuários selecionados para o grupo
  confirmUserGroup(): void {
    const users = this.currentUsers.filter(value => value.localUser === true);
    
    users.forEach(el => {
      this.groupService.addUserToGroup(el['codigoUsuario'], this.currentGroup.idGrupo).then(res => {
        el.localUser = false
      })
    })
    this.userDataSource.data = this.currentUsers;
    this.toaster.presentToast("Salvo com sucesso", "success", 4);
    this.peddingUsers();
  }

  // atualiza os dados da tabela
  updateTables(delay?: string): void {
    if(delay !== "delay") {
      this.userDataSource.data = this.userDataSource.data;
    } else {
      setTimeout(() => {
        this.permissionsDataSource.data = this.permissions;
      }, 1000)
    }
  }

  // adiciona ou remove permissões
  addPermissions(event:  Event, idPermissions: number):void {

    const value = (event.target as HTMLInputElement).checked;
    
    
    if (value) {
      this.permissionsService.delPermission(this.currentGroup.idGrupo, idPermissions)
      .then(el => {console.log('delete permission') })
      .catch((err) => {
        this.alert.showAlert("Erro " + err.status, "Ocorreu uma falha.")
      });

    } else {
      this.permissionsService.addPermission(this.currentGroup.idGrupo, idPermissions, 'false')
      .then(response => {console.log('add  permission');
      })
      .catch((err) => {
        this.alert.showAlert('Erro ' + err.status, "Ocorreu uma falha.")
      })
    }
  }

  // observable para atualizar páginas de grupos
  updateGroupsDataTable(): void {
    this.sharedService.sendUpdateGroupsTable();
  }

  // confirmação antes de remover o usuário do grupo
  async presentAlertDeleteUser(user: any) {

    const alert = await this.alertController.create({
      
      header: 'Atenção',
      message: 'Tem certeza que deseja remover o usuário do grupo?',
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
            this.removeUserFromGroup(user)
          }
        }
      ]      
    });
    
    await alert.present();
  }

  // apresenta um badge informando pendencia para salvar os dados
  peddingUsers() {
    const count = this.currentUsers.filter(value => value.localUser);
    const result = count.length > 0 ? true : false
    return result;
  }

}
