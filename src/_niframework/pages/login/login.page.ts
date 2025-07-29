import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, isPlatform } from '@ionic/angular';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { Loader } from 'src/_niframework/providers/loader/loader';
import { LoginService } from 'src/_niframework/services/access/login.service';
import { ToasterService } from 'src/_niframework/services/toaster/toaster.service';
import { UpdateConcernsModalPage } from './update-concerns-modal/update-concerns-modal.page';
import { UserService } from 'src/_niframework/services/user/user.service';
import { PermissionsService } from 'src/_niframework/services/permissions/permissions.service';
import ls from 'localstorage-slim';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  onLoginForm: FormGroup;
  isVisible: boolean = false;
  // dualUser: boolean = false;
  newInputAccordion: any;
  token: any;

  constructor(
    private formBuilder: FormBuilder,
    private routerCtrl: Router,
    private loader: Loader,
    private loginService: LoginService,
    private toaster: ToasterService,
    private navCtrl: Router,
    private alerts: AlertsProvider,
    private modalCtrl: ModalController,
    private userService: UserService,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit() {
    // if (isPlatform('ios')) {
    //   document.querySelectorAll('ion-icon[slot="start"]').forEach((element: any) => {
    //     element.style.display = 'none';
    //   })

    //   document.querySelectorAll('ion-label').forEach((element: HTMLElement) => {
    //     element.setAttribute('position', 'undefined');
    //   })
    // }

    this.onLoginForm = this.formBuilder.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ]),
      ],
      senha: [null, Validators.compose([Validators.required])],
      documento: [''],
    });
  }

  goLogin() {
    this.loader.present().then(() => {
      let doc = this.onLoginForm.controls.documento.value;
      this.newInputAccordion = document.querySelector('ion-accordion-group');

      if (doc != null) {
        if (doc.length === 14) {
          doc = doc.replace('.', '').replace('.', '').replace('-', '');
        } else {
          doc = doc
            .replace('.', '')
            .replace('.', '')
            .replace('/', '')
            .replace('-', '');
        }
      }

      let login = {
        email: this.onLoginForm.controls['email'].value,
        senha: this.onLoginForm.controls['senha'].value,
        documento: doc,
      };

      this.loginService
        .goLogin(login)
        .then((response: any) => {
          if (response.responseCode == 'OK') {
            if (response.arg1 !== null) {
              alert('concern update');
              this.showUpdateConcernsModal(response.responseString);
            } else {
              this.toaster.presentToast(
                'Login efetuado com sucesso.',
                'success',
                3
              );

              localStorage.setItem('token', response.responseString);
              localStorage.setItem('currentUser', login.email);
              localStorage.setItem('userCode', response.arg2);
              this.loadUserRoles();

              this.navCtrl.navigateByUrl('/app/home');
            }

            if (this.newInputAccordion.value != undefined) {
              this.newInputAccordion.value = 'undefined';
              this.onLoginForm.controls.documento.setValidators(null);
              this.onLoginForm.controls.documento.updateValueAndValidity();
            }

            this.onLoginForm.reset();
          }
        })
        .catch((err) => {
          this.errorLogin(err);
          if (err.error.arg1 === 'SELECIONAR_CONTA_USUARIO') {
            console.warn(
              'Para proseguir com o login, deve-se informar um documento.'
            );
          }
        })
        .then(() => {
          this.loader.dismiss();
        });
    });
  }

  // ionViewDidEnter() {
  // }

  async loadUserRoles() {
    let user = localStorage.getItem('userCode');
    let roles: string[] = [];

    //permissões vinculadas ao grupo do usuário
    this.userService
      .getCurrentUserGroups(user)
      .then((grupos) => {
        grupos.forEach((element) => {
          this.permissionsService
            .getGroupPermissions(element.idGrupo)
            .then((groupPermissions) => {
              for (let i of groupPermissions) {
                roles.push(i.nomePermissao);
              }
            });
        });
      })
      .then(() => {
        //permissões vinculadas ao usuário
        this.userService
          .getCurrentUserPermissions(user)
          .then((response) => {
            response.forEach((element) => {
              roles.push(element.nomePermissao);
            });
            //permissões vinculadas ao perfil do usuário (falta desenvolver API)
          })
          .then(() => {
            const uniqueRoles = new Set(roles);
            const newRolesList = [...uniqueRoles.values()];
            let normalize = JSON.stringify(newRolesList);
            // localStorage.setItem('rl', normalize);
            ls.set('rl', normalize, { encrypt: true });
          });
      })
      .catch((err) => {
        this.errorLogin(err);
      });
  }

  async showUpdateConcernsModal(token) {
    const modal = await this.modalCtrl.create({
      component: UpdateConcernsModalPage,
      componentProps: { ptoken: token },
    });

    //Event handler on dismiss the modal
    modal.onDidDismiss().then((data) => {
      const modalMsg = data['data'];
    });
    //show the modal
    return await modal.present();
  }

  async errorLogin(err: any) {
    if (err.status === 401 && err.error.arg1 === 'SELECIONAR_CONTA_USUARIO') {
      // this.dualUser = true;
      this.toaster.presentToast(
        'Informe o CPF/CNPJ para continuar',
        'warning',
        4
      );

      this.newDocInput();

      return;
    } else if (err.status === 401 && err.error.arg1 === 'ATIVAR_CADASTRO') {
      this.goToActivateAccount(this.onLoginForm.controls['email'].value);

      // console.log(err);
      // this.navCtrl.navigate(["/register/options"]);
    } else {
      const erroeMessage = err.error['responseString']
        ? err.error['responseString']
        : 'Dados de acesso inválidos.';
      this.alerts.showAlert('Falha!', erroeMessage);
    }

    // if (
    //   err.status === 401 &&
    //   err.error.responseString === 'Usuário não confirmado'
    // ) {
    //   // this.goToActivateAccount(this.onLoginForm.controls['email'].value);
    // } else
  }

  newDocInput() {
    let docInput = this.onLoginForm.controls.documento;

    docInput.setValidators([
      Validators.required,
      Validators.pattern('[0-9.-/]{14} || [0-9.-/]{18}'),
      Validators.minLength(14),
    ]);

    docInput.updateValueAndValidity();
    this.newInputAccordion.value = 'first';
  }

  enterBtn() {
    this.onLoginForm.valid ? this.goLogin() : '';
  }

  goToActivateAccount(email: string): void {
    sessionStorage.clear();
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('doc', 'false');
    this.navCtrl.navigate(['register/options']);
  }
}
