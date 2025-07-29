import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  PopoverController,
  isPlatform,
} from '@ionic/angular';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { Countries } from 'src/_niframework/models/county-model';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { Loader } from 'src/_niframework/providers/loader/loader';
import { Utils } from 'src/_niframework/providers/utils/utils-functions';
import { ListaPaisesComponent } from 'src/_niframework/services/countries/lista-paises/lista-paises.component';
import { DocumentoService } from 'src/_niframework/services/user/documento.service';
import { UserService } from 'src/_niframework/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  RegisterUserForm: FormGroup;
  isVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  accordion: any;
  urlPolitics;
  selectedCountry: Countries;

  constructor(
    private formBuilder: FormBuilder,
    public utils: Utils,
    private loader: Loader,
    private popCtrl: PopoverController,
    private userService: UserService,
    private router: Router,
    private alerts: AlertsProvider,
    private docServ: DocumentoService
  ) {}

  ngOnInit() {
    // if (isPlatform('ios')) {
    //   document.querySelectorAll('ion-icon[slot="start"]').forEach((element: any) => {
    //     element.style.display = 'none';
    //   })

    //   document.querySelectorAll('ion-label').forEach((element: HTMLElement) => {
    //     element.setAttribute('position', 'undefined');
    //   })

    //   document.querySelectorAll('ion-input').forEach((element: HTMLElement) => {
    //     element.style.width = 'min-content'
    //   })
    // }
    this.selectedCountry = {
      code: 'BR',
      name: 'Brazil (Brasil)',
      number: '055',
      value: '55',
      flag: 'br.svg',
    };

    this.RegisterUserForm = this.formBuilder.group({
      nome: [
        null,
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9_.%+-]{1,}@[a-zA-Z0-9-_.]{2,}[.]{1}[a-zA-Z0-9-.]+$'
          ),
        ]),
      ],
      documento: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9.-/]{14} || [0-9.-/]{18}'),
          Validators.minLength(14),
        ]),
      ],
      fone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(15),
        ]),
      ],
      senha: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.utils.RegExpStrongPassword),
        ]),
      ],
      confirmaSenha: ['', RxwebValidators.compare({ fieldName: 'senha' })],
      ativarNotificacao: [true],
      acceptTermOfUse: [false, RegisterPage.mustAccept],
      acceptAccountCreate: [false, RegisterPage.mustAccept],
    });

    this.urlPolitics = AppSettings.URL_POLITICS;

    this.setFunctionalities();
  }

  registerUser() {
    this.loader.present().then(() => {
      let doc = String(this.RegisterUserForm.controls['documento'].value);

      if (doc.length === 14) {
        doc = doc.replace('.', '').replace('.', '').replace('-', '');
      } else {
        doc = doc
          .replace('.', '')
          .replace('.', '')
          .replace('/', '')
          .replace('-', '');
      }

      let newuser = {
        nome: this.RegisterUserForm.controls['nome'].value,
        telefone: this.RegisterUserForm.controls['fone'].value
          .replace('(', '')
          .replace(')', '')
          .replace(' ', '')
          .replace('-', ''),

        // no momento o código do país não está sendo usado, o formulário está enviando apenas o número do telefone com o ddd
        // telefone: this.selectedCountry.number + this.RegisterUserForm.controls['fone'].value.replace('(', '').replace(')', '').replace(' ', '').replace('-', ''),
        email: this.RegisterUserForm.controls['email'].value,
        senha: this.RegisterUserForm.controls['senha'].value,
        notificacao: this.RegisterUserForm.controls['ativarNotificacao'].value,
        usuarioSignup: {
          nacionalidade: null,
          dataNascimento: null,
          nomeMae: null,
          genero: null,
        },
        listaDocumentos: [
          {
            idTipoDocto: 1,
            documento: doc,
            principal: false,
          },
        ],
      };

      let normalizeJson = this.utils.normalizeJsonString(newuser);

      console.log('Enviando novo registro de usuário : ' + normalizeJson);

      this.userService
        .registerUser(normalizeJson)
        .then((response: any) => {
          if (response['responseCode'] !== 'ERR') {
            sessionStorage.removeItem('doc');
            sessionStorage.removeItem('email');
            sessionStorage.setItem('doc', newuser.listaDocumentos[0].documento);
            sessionStorage.setItem('email', newuser.email);
            // sessionStorage.setItem('userId', response.codigoUsuario);

            this.alerts.showToaster(
              'Registro efetuado com sucesso.',
              'success'
            );
            // this.router.navigate(['register/options']);
            // console.log(sessionStorage.getItem('tel'));
            this.router.navigate(['/register/finally'], {
              queryParams: { option: 'email' },
            });

            this.RegisterUserForm.reset();

            // usado anteriormente
            // this.router.navigateByUrl('/confirm?email=' + newuser.email);
          } else if (response['responseCode'] == 'ERR') {
            this.alerts.showAlert('Falha!', 'Falha no registro do usuário.');
          }
        })
        .catch((err: HttpErrorResponse) => {
          console.log('Erro ao enviar requisição : ' + JSON.stringify(err));
          this.alerts.showAlert('Erro!', err.error['responseString']);
        })
        .then(() => {
          this.loader.dismiss();
        });
    });
  }

  setFunctionalities() {
    let accordionDiv = document.querySelector('.accordion-div');
    let accordionHeader =
      document.querySelector<HTMLIonItemElement>('.accordion-header');
    this.accordion = document.querySelector('#conditionsAccordionGroup');

    if (isPlatform('desktop')) {
      accordionDiv?.addEventListener('mouseenter', () => {
        this.toggleAccordion(this.accordion);
      });
      accordionDiv?.addEventListener('mouseleave', () => {
        this.toggleAccordion(this.accordion);
      });

      accordionHeader!.style.pointerEvents = 'none';
    } else {
      accordionHeader?.addEventListener('click', () => {
        this.toggleAccordion(this.accordion);
      });
    }
  }

  static mustAccept(control: AbstractControl): { [key: string]: boolean } {
    let rv: { [key: string]: boolean } = {};

    if (!control.value) {
      rv['notChecked'] = true;
    }

    return rv;
  }

  enterBtn() {
    this.RegisterUserForm.valid ? this.registerUser() : '';
  }

  toggleAccordion(accordionGroup: any) {
    const nativeEl = accordionGroup;

    if (nativeEl.value === 'first') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'first';
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

  validaDoc(eve) {
    let valida: boolean;

    if (eve.target.value.length === 14) {
      valida = this.docServ.validaCPF(eve);
    } else {
      valida = this.docServ.validaCNPJ(eve);
    }

    if (!valida) {
      this.RegisterUserForm.controls['documento'].setValue('');
    }
  }
}
