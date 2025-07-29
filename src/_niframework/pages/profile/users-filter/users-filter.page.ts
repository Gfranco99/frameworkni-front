/* eslint-disable*/
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UserFilterTable } from 'src/_niframework/models/user-filter-table';
import { Router } from '@angular/router';

import { IsLoggedService } from 'src/_niframework/services/isLogged/is-logged.service';
import { UserService } from 'src/_niframework/services/user/user.service';
import { UserFromFilterService } from 'src/_niframework/services/user/user-from-filter.service';
import { GroupService } from 'src/_niframework/services/group/group.service';
import { SystemProfilesService } from 'src/_niframework/services/system-profiles/user-profiles.service';
import { SharedService } from 'src/_niframework/services/shared/shared.service';
import { ToasterService } from 'src/_niframework/services/toaster/toaster.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { Loader } from 'src/_niframework/providers/loader/loader';

@Component({
  selector: 'app-users-filter',
  templateUrl: './users-filter.page.html',
  styleUrls: ['./users-filter.page.scss'],
})
export class UsersFilterPage implements OnInit {
  
  nameInputValue: string = "";
  groupInputValue: string = "";
  profileInputValue: string = "";
  
  groupsFromDataBase = [];
  profilesFromDataBase: [] = [];
  usersFromDataBase: UserFilterTable[] = [];
  
  displayedColumns = [ 'nome', 'documento', 'grupos', 'perfis', 'ativo', 'codigoUsuario', 'editar' ];

  dataSource = new MatTableDataSource<any>(this.usersFromDataBase);
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  searchForm: FormGroup;
  
  constructor(
    private isLogged: IsLoggedService,
    private router: Router,
    private userService: UserService,
    private userFromFilterService: UserFromFilterService,
    private groupService: GroupService,
    private systemProfilesService: SystemProfilesService,
    private sharedService: SharedService,
    private loader: Loader,
    private toaster: ToasterService,
    private formBuilder: FormBuilder,
    private alert: AlertsProvider
  ) {
    this.isLogged.isLoggedVerify();
    this.getGroups();
    this.getProfiles();
    this.sharedService.getRequestUpdateUserFilter().subscribe(() => {
      this.dataSource.data = this.dataSource.data;
    });
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      userName: [
        null,
        // Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.dataSource.sort = this.sort.toArray()[1];
    // this.userFromFilterService.getUserData().subscribe(user => console.log(user));
  }

  // busca lista de usuários associados ao grupo específico.
  getUsersFromGroup(idGroup: number): void {
    this.groupService.getUsersFromGroup(idGroup).then((response) => {
      this.insertDataTable(response);
    });
  }

  // busca lista de usuários associados ao perfil específico.
  getUsersWithProfile(idProfile: number): void {
    this.systemProfilesService
      .getUsersWithProfile(idProfile)
      .then((response) => {
        this.insertDataTable(response);
      });
  }

  // carrega os grupos registrados no sistema
  getGroups(): void {
    this.groupService.getGroups().then((response) => {
      this.groupsFromDataBase = response;
    });
  }

  // carrega os perfis registrados no sistema
  getProfiles(): void {
    this.systemProfilesService.getSystemProfiles().then((response) => {
      this.profilesFromDataBase = response;
    });
  }

  // alimenta a tabela com os dados recebidos
  insertDataTable(data: any): void {
    this.cleanTable();

    data.forEach((element: any) => {
      this.usersFromDataBase.push(element)

    });

    this.updateTable();
  }

  // limpa os dados da tabela
  cleanTable(): void {
    this.usersFromDataBase.splice(0, this.usersFromDataBase.length);
    this.updateTable();
  }

  // limpa a tabela e os critérios de busca
  cleanSearch(): void {
    this.loader.present().then(() => {
      this.cleanTable();
      this.nameInputValue = "";
      this.groupInputValue = "";
      this.profileInputValue = "";
    }).then(() => {
      this.loader.dismiss();
    })
  }

  // atualiza a tabela para mostrar novos dados
  updateTable(): void {
    this.dataSource.data = this.dataSource.data;
  }

  // vai para a página de detalhes do usuário (controle de usuário)
  goToUserPage(userSelected: any): void {
        
    this.userFromFilterService.setUser(userSelected);
    this.router.navigate(['/app/users']);

  }

  // filtro avançado de usuário, busca usuário através de critérios
  filterUser(userName?: string, group?: string, profile?: string): void {
    this.loader.present().then(() => {
      
      let data = { token: localStorage.getItem('token') };
  
      if(userName != "") {
        data['nome'] = userName;
      }
  
      if(group != "") {
        data['idGrupo'] = group;
      }
  
      if(profile != "") {
        data['idPerfil'] = profile;
      }
  
      this.userService.getUserListFilter(data).then(response => {
        
        if( response.length === 0 ) {
          this.userNotFound();
  
        } else {    
          this.insertDataTable(response);
        }
      }).catch(err => {
        
        switch(err.status) {
          case 401:
            this.alert.showAlert("Erro: " + err.status, "Usuário não possui permissão para executar esta ação.")
            break;
  
          case 400:
            this.userNotFound();
          break;
        }
  
      })
    }).then(() => {
      this.loader.dismiss();
    })
  }

  // 
  search(): void {
    this.filterUser(this.nameInputValue, this.groupInputValue, this.profileInputValue);
  }

  // compartilha o aviso em toaster
  userNotFound(): void {
    this.toaster.presentToast("Usuário não encontrado", "warning", 2);
  }

  // volta para a página anterior através do histórico de navegação
  back(): void {
    window.history.back();
  }
}
