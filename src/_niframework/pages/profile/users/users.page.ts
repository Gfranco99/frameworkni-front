/* eslint-disable*/ 
import { Component, OnInit } from '@angular/core';
import { IsLoggedService } from 'src/_niframework/services/isLogged/is-logged.service';
import { PermissionsService } from 'src/_niframework/services/permissions/permissions.service';
import { GroupService } from 'src/_niframework/services/group/group.service';
import { SystemProfilesService } from 'src/_niframework/services/system-profiles/user-profiles.service';
import { UserService } from 'src/_niframework/services/user/user.service';
import { UserFromFilterService } from 'src/_niframework/services/user/user-from-filter.service';
import { delay, first, last, single, skipLast, take, takeLast, takeUntil, takeWhile } from 'rxjs/operators';
import { SharedService } from 'src/_niframework/services/shared/shared.service';
import { ToasterService } from 'src/_niframework/services/toaster/toaster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Loader } from 'src/_niframework/providers/loader/loader';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})

export class UsersPage implements OnInit {
  count = 0; // usado para controle do observable para pegar o ultimo valor retornado
  profilesFromDataBase = [];
  getGroupsFromDataBase = [];
  getPermissionsFromDataBase = [];
  currentUserProfiles: any = [];
  currentUserPermissions: any = [];
  currentUserGroups: any = [];
  temporaryDataSearch: any = [];
  currentUser: any = [];
  unlockFunctions: boolean = false;
  onSearchForm: FormGroup
  itemsPending: any;

  constructor(
    private userService: UserService,
    private systemProfileService: SystemProfilesService,
    private groupService: GroupService,
    private permissionsService: PermissionsService,
    private isLogged: IsLoggedService,
    private userFromFilterService: UserFromFilterService,
    private sharedService: SharedService,
    private toaster: ToasterService,
    private loader: Loader,
    private formBuilder: FormBuilder,
    ) {
      this.isLogged.isLoggedVerify(),
      this.getPermissions();
      this.getGroups();
      this.getSystemProfiles();

    }

    ngOnInit() {
      // observable filtro usuario
      this.userFromFilterService.getUser().subscribe(elements => {
        this.selectUserFromList(elements)
        // let user = elements;
        // this.count ++

        // if(this.count === 2) {
        //   this.selectUserFromList(user);
        //   this.count = 0;
        // }
      })

      this.onSearchForm = this.formBuilder.group({
        'userName': ['', Validators.compose([
          Validators.required,
          Validators.minLength(5)
        ])]
      })
    }
    
  // Busca por um usuário pesquisado
  getUserList(event: Event): void {
    this.loader.present().then(() => {

      const value = (event.target as HTMLInputElement).value
      
      if(!value) {
        this.temporaryDataSearch = []
        return;
      };
  
      if(value.length < 5 ) {
        this.toaster.presentToast("Informe pelo menos 5 caracteres.", "warning", 2 );
        return;
      };
      
      this.userService.getUserList(value).then((res) => {      
      this.temporaryDataSearch = res
  
      if(res === null) {
        this.toaster.presentToast('Usuário não encontrado.', "warning", 2);
        this.temporaryDataSearch = []
      }
      }).catch(err => {
        console.log( err )
      })
    }) .then(() => {
      this.loader.dismiss();
    })
  }

  // Carrega o usuário selecionado na busca
  selectUserFromList(user: any): void {
    
    this.loader.present("Carregando.").then(() => {

      this.sharedService.sendCleanChanges();
      document.getElementById("search-bar")!['value'] = "";
      
      this.currentUser = user;
  
      this.temporaryDataSearch = [];
      
      this.getSystemUserProfiles(user['codigoUsuario']);
      this.getCurrentUserGroups(user['codigoUsuario']);
      this.getPermissionsUser(user['codigoUsuario']);
      this.unlockFunctions = true;

    }).then(() => {
      this.loader.dismiss();
    })
  }

  // carrega todos os grupos registrados no sistema
  getGroups(): void {
    this.groupService.getGroups().then(value => {
      this.getGroupsFromDataBase = value;
    })
  }
 
  // carrega todas as permissões registrados no sistema
  getPermissions(): void {
    this.permissionsService.getPermissions().then(value => {
      this.getPermissionsFromDataBase = value;
    })
  }

  // carrega todos os perfis registrados no sistema
  getSystemProfiles(): void {
    this.systemProfileService.getSystemProfiles().then(value => {
      this.profilesFromDataBase = value;
    })
  }

  // carrega lista atual de perfis do usuário
  getSystemUserProfiles(userCode: any): void {
    this.userService.getSystemUserProfiles(userCode).then(response => {
      this.currentUserProfiles.splice(0, this.currentUserProfiles.length);
      for(let i of response) {
      this.currentUserProfiles.push(i);      
    } 
  })};

   // carrega lista atual de permissões do usuário
   getPermissionsUser(userCode: any): void {
    this.currentUserPermissions.splice(0, this.currentUserPermissions.length);
    this.userService.getCurrentUserPermissions(userCode).then(response => {
    for(let i of response) {
      this.currentUserPermissions.push(i)
    }
  })};

  // carrega lista atual de grupos do usuário
  getCurrentUserGroups(userCode: any): void {
    this.currentUserGroups.splice(0, this.currentUserGroups.length);
    this.userService.getCurrentUserGroups(userCode).then(response => {

    for(let i of response) {
      this.currentUserGroups.push(i)
    }  
  })};

  // envia uma solicitação para atualizar a tabela de filtro de usuários
  updateTableUserFilterRequest(): void {
    this.sharedService.sendUpdateUserFilter();
  }

  // volta para a página anterior através do histórico de navegação
  back(): void {
    window.history.back();
  }

}
