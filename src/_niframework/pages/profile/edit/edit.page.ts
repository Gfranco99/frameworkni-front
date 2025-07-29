import { AlertController, PopoverController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { UserService } from 'src/_niframework/services/user/user.service';

import { Utils } from 'src/_niframework/providers/utils/utils-functions';
import { ListaPaisesComponent } from 'src/_niframework/services/countries/lista-paises/lista-paises.component';
import { Countries } from 'src/_niframework/models/county-model';
import { countries } from 'src/_niframework/services/countries/countries.service';
import { DocumentoService } from 'src/_niframework/services/user/documento.service';
import { ToasterService } from 'src/_niframework/services/toaster/toaster.service';
// import { LoaderService } from 'src/_niframework/services/loader/loader.service';

import { ChangeDetectorRef } from '@angular/core';
import { SharedService } from 'src/_niframework/services/shared/shared.service';
import { Loader } from 'src/_niframework/providers/loader/loader';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  /*ATTRIBUTES*/
  public onEditProfileForm: FormGroup;
  public currentUser: any;
  public isLogged: boolean;
  public userData: any;

  public selectedCountry: Countries | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private userservice: UserService,
    public docServ: DocumentoService,
    public utils: Utils,

    private navctrl: Router,
    private httpClient: HttpClient,
    private alertCtrl: AlertController,
    private alerts: AlertsProvider,
    private popCtrl: PopoverController,
    private toaster: ToasterService,
    private loader: Loader,
    private changeDetector: ChangeDetectorRef,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    // this.updateDetailsData();

    /*FORM*/
    this.onEditProfileForm = this.formBuilder.group({
      nome: [null, Validators.compose([Validators.required])],
      doc: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9.-]{14}'),
          Validators.maxLength(14),
        ]),
      ],
      fone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(14),
          Validators.maxLength(15),
        ]),
      ],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ]),
      ],
    });

    /* INITIALIZE VALUES*/
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
            this.getCountry();
            /* LOAD VALUES*/
            this.onEditProfileForm.controls['nome'].setValue(
              this.userData.nome
            );
            this.onEditProfileForm.controls['doc'].setValue(
              this.userData.documento
            );
            this.onEditProfileForm.controls['email'].setValue(
              this.userData.email
            );
            this.onEditProfileForm.controls['fone'].setValue(
              this.userData.telefone.substring(3)
            );
          }
        });
    }
  }

  async updateProfile() {
    this.loader.present().then(() => {
      let userProfile = {
        nome: this.onEditProfileForm.controls['nome'].value,
        telefone:
          this.selectedCountry?.number +
          this.onEditProfileForm.controls['fone'].value
            .replace('(', '')
            .replace(')', '')
            .replace(' ', '')
            .replace('-', ''),
        email: this.onEditProfileForm.controls['email'].value,
        notificacao: true,
        idioma: '',
        estrangeiro: false,
      };

      let normalized = this.utils.normalizeJsonString(userProfile);
      let idUser: string;

      this.userservice
        .getUserProfile(
          localStorage.getItem('userCode'),
          localStorage.getItem('token')
        )
        .then((response) => {
          idUser = response.codigoUsuario;
        })
        .then((next) => {
          this.userservice
            .setUserProfile(normalized, localStorage.getItem('token'), idUser)
            .then((response) => {
              if (response === true) {
                this.updateDetailsData();

                this.navctrl.navigate(['/app/profile/details']);
              } else {
                this.toaster.presentToast(
                  'Ocorreu uma falha ao tentar atualizar os dados',
                  'danger',
                  3
                );
              }
            })
            .then(() => {
              this.loader.dismiss();
            });;
        })
    })
  }

  updateDetailsData(): void {
    this.sharedService.sendDetailsChanges();
  }

  validaDoc(eve) {
    let valida: boolean;

    if (eve.target.value.length === 14) {
      valida = this.docServ.validaCPF(eve);
    } else {
      valida = this.docServ.validaCNPJ(eve);
    }

    if (!valida) {
      this.onEditProfileForm.controls['doc'].setValue('');
    }
  }

  async presentPopover(ev: any) {
    const popover = await this.popCtrl.create({
      component: ListaPaisesComponent,
      cssClass: 'pop-meusProtocolos',
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();
    if (data !== undefined) {
      this.selectedCountry = data;
    }
  }

  async getCountry() {
    let userFone = this.userData.telefone;
    let userCountry = userFone.substring(0, 3);
    countries.forEach((pais) => {
      if (pais.number === userCountry) {
        this.selectedCountry = pais;
      }
    });
  }
}
