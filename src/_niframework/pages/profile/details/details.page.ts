import { UserService } from './../../../services/user/user.service';
import {
  Component,
  OnInit,
  ViewChild,
  OnChanges,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
// import { IonSlides} from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';

import { AlertController, IonicSlides } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/_niframework/services/shared/shared.service';

import { ChangeDetectorRef } from '@angular/core';

// import { LoaderService } from 'src/_niframework/services/loader/loader.service';

import { VerificarPermissoes } from 'src/_niframework/services/guards/VerificarPermissoes';

// import { LocalstorageService } from 'src/_niframework/services/security/localstorage.service';
import ls from 'localstorage-slim';
import { Location } from '@angular/common';
import { Loader } from 'src/_niframework/providers/loader/loader';
import { SwiperContainer } from 'swiper/element';
import Swiper from 'swiper';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  /*ATTRIBUTES*/
  updateDataUser: Subscription;
  onDetailProfileForm: FormGroup;
  currentUser: any;
  isLogged: boolean;
  userData: any;
  urlPolitics: string;
  defaultButton: any = '0';
  permissions: string[] = [];
  swiperModules = [IonicSlides];

  //mostra itens na tela
  isVisible = {
    userControl: false,
    userFilter: false,
    groups: false,
  };

  swiperInstance = new Swiper('swiper-container');
  swiper: SwiperContainer | null;

  constructor(
    private formBuilder: FormBuilder,
    private navctrl: Router,
    private alerts: AlertsProvider,
    private userservice: UserService,
    private alertController: AlertController,
    private changeDetector: ChangeDetectorRef,
    private sharedService: SharedService,
    // private loader: LoaderService,
    private loader: Loader,
    private location: Location
  ) {
    // setTimeout(() => {
    //   console.log(JSON.stringify(this.userData));
    // }, 2000);
  }

  onDestroy() {
    this.updateDataUser.unsubscribe();
  }

  ngOnInit() {
    /* INITIALIZE VALUES*/
    this.updateDataUser = this.sharedService
      .getDetailsChanges()
      .subscribe(() => {
        this.updateUserData();
        this.loaderUserPermissions();
      });

    // localStorage.setItem('currentUser', 'rstopa@albacore.com.br');
    // localStorage.setItem('userCode', 'c6f1da95-8166-43b5-915f-a1d2fda7b03f');
    // localStorage.setItem('token', '4A5662582B45756F543952514A32784D4954644D494171423975346434413744684871696C645342536D7058586A71714A347150774454367A6C70384E66535564646F5A77553473695971523634465A4474544975773D3D');

    this.onDetailProfileForm = this.formBuilder.group({
      chkNotification: [null, ''],
    });

    this.currentUser = localStorage.getItem('currentUser');
    this.isLogged = localStorage.getItem('currentUser') != null;

    if (this.isLogged) {
      this.userservice
        .getUserProfile(
          localStorage.getItem('userCode'),
          localStorage.getItem('token')
        )
        .then((storedUser) => {
          if (storedUser) {
            this.userData = storedUser;
            this.onDetailProfileForm.controls.chkNotification.setValue(
              this.userData.notificacao
            );
          }
        });
    }

    /*FORM*/

    this.urlPolitics = AppSettings.URL_POLITICS;

    this.loaderUserPermissions();

    this.swiper = document.querySelector('swiper-container');

    this.swiper?.addEventListener('swiperslidechange', (event) => {
      this.defaultButton = this.swiper?.swiper.activeIndex.toString();
    });

    document
      .querySelector('.swiper-navigation-next')
      ?.addEventListener('click', () => {
        this.swiper?.swiper.slideNext();
      });

    document
      .querySelector('.swiper-navigation-prev')
      ?.addEventListener('click', () => {
        this.swiper?.swiper.slidePrev();
      });
  }

  // carrega as permissões do usuário
  async loaderUserPermissions() {
    new Promise((resolve) => {
      let permissionsList = JSON.parse(ls.get('rl', { decrypt: true })!);
      this.permissions.splice(0, this.permissions.length);

      if (permissionsList != null) {
        permissionsList.forEach((element) => {
          this.permissions.push(element);
        });
      }

      resolve(true);
    }).then(() => {
      this.isVisibleOptions();
    });
  }

  goToValidationOptions() {
    sessionStorage.clear();
    sessionStorage.setItem('tel', this.userData.telefone);
    sessionStorage.setItem('doc', this.userData.documento);
    sessionStorage.setItem('email', this.userData.email);
    this.navctrl.navigate(['/register/options']);
  }

  // mostra opções ao usuário se dentro das permissões
  isVisibleOptions(): void {
    this.isVisible.groups = false;

    this.permissions.forEach((element) => {
      switch (element) {
        case 'GRUPOS': //definir as demais permissões de acordo com as opções no html
          this.isVisible.groups = true;
          break;
      }
    });
  }

  ionViewDidEnter() {
    this.verificaError();
  }

  async verificaError() {
    this.userservice
      .getUserProfile(this.currentUser, localStorage.getItem('token'))
      .then((storedUser) => {
        if (storedUser === 'error') {
          this.navctrl.navigateByUrl('/app');
          this.presentAlert();
        }
      });
  }

  /* Methods logout user data */
  goExit(): any {
    sessionStorage.clear();
    localStorage.clear();
    this.navctrl.navigateByUrl('login');
  }

  updateProfile() {
    let chkNotification =
      this.onDetailProfileForm.controls['chkNotification'].value;

    //POST API /api/Usuario/AtualizarUsuario
    let userProfile = this.userData;
    userProfile['notificacao'] = chkNotification;

    //Service
    let user: any[] = [];
    this.userservice
      .getUserProfile(
        localStorage.getItem('userCode'),
        localStorage.getItem('token')
      )
      .then((el) => {
        user.push(el);
      });

    this.userservice
      .setUserProfile(
        userProfile,
        localStorage.getItem('token'),
        user['codigoUsuario']
      )
      .then((response: any) => {
        if (response == true) {
          this.alerts.showToaster('Profile atualizado com sucesso.');
        } else {
          this.alerts.showAlert('Falha!', 'Falha ao atualizar o profile');
        }
      });

    // if (this.userservice.setUserProfile(userProfile, localStorage.getItem('token'), user['codigoUsuario'])) {
    //   this.alerts.showToaster("Profile atualizado com sucesso.");
    // }
    // else {
    //   this.alerts.showAlert("Falha!", "Falha ao atualizar o profile");
    // }
  }

  // atualiza os dados do usuário ao haver mudanças
  updateUserData(): void {
    this.userservice
      .getUserProfile(
        localStorage.getItem('userCode'),
        localStorage.getItem('token')
      )
      .then((el) => {
        this.userData = el;
      });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'ERRO',
      subHeader: 'Ocorreu um erro',
      cssClass: 'buttonCss',
      buttons: [{ text: 'Ok' }],
    });

    await alert.present();
  }

  // verifica permissão para mostrar item
  checkRole(rolesFunctionalities: string[]): boolean {
    const userRoles = JSON.parse(localStorage.getItem('roles')!);

    return VerificarPermissoes.temPermissao(rolesFunctionalities, userRoles);
  }
}
