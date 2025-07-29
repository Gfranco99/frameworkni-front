import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LoadingController,
  ModalController,
  NumericValueAccessor,
} from '@ionic/angular';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { Utils } from 'src/_niframework/providers/utils/utils-functions';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { Directive, HostListener } from '@angular/core';
import { ActivatedAccountBySmsComponent } from '../activated-account-by-sms/activated-account-by-sms.component';
import { PhoneService } from 'src/_niframework/services/user/phone.service';
import { throwError } from 'rxjs';
import { EmailService } from 'src/_niframework/services/user/email.service';
import { environment } from 'src/environments/environment';
import { Loader } from 'src/_niframework/providers/loader/loader';
import { CodigoOtpService } from 'src/_niframework/services/user/codigo-otp.service';

@Directive({
  selector: 'input[moveNextByMaxLength], textarea[moveNextByMaxLength]',
})
export class MoveNextByMaxLengthDirective {
  @HostListener('keyup', ['$event']) onKeyDown(keyboardEvent: KeyboardEvent) {
    const target = keyboardEvent.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;

    if (!target || target.maxLength !== target.value.length) return;

    keyboardEvent.preventDefault();

    const { type } = target;
    let { nextElementSibling } = target;

    while (nextElementSibling) {
      if (
        (nextElementSibling as HTMLInputElement | HTMLTextAreaElement).type ===
        type
      ) {
        (nextElementSibling as HTMLInputElement | HTMLTextAreaElement).focus();
        return;
      }

      nextElementSibling = nextElementSibling.nextElementSibling;
    }
  }
}

@Component({
  selector: 'app-sms-activation',
  templateUrl: './sms-activation.page.html',
  styleUrls: ['./sms-activation.page.scss'],
})
export class SmsActivationPage implements OnInit {
  timerResult: string = 'false';
  isWhatsapp: boolean;
  userPhoneFull: any = sessionStorage.getItem('tel');
  hidePhoneNumbersMask =
    '(' +
    this.userPhoneFull.substring(0, 2) +
    ')' +
    '*****-' +
    this.userPhoneFull.substring(7, 11);
  //hidePhoneNumbersMask = "(" + this.userPhoneFull.substring(3, 5) + ")" +  "*****-" + this.userPhoneFull.substring(10);

  code1: string = '';
  code2: string = '';
  code3: string = '';
  code4: string = '';
  codesInputsEnable: boolean = false;
  codeJoin: string = '';
  option!: string;
  mensagem: string =
    'Clique em enviar agora, para receber o código de validação.';
  formulario: FormGroup;
  dados = {
    Email: '',
    Doc: '',
    tipo: '',
    phoneNumber: this.userPhoneFull,
    codigoSms: this.codeJoin,
    ativaUsuario: true,
  };

  countSeconds: any;

  constructor(
    private route: Router,
    private alert: AlertsProvider,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private utils: Utils,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private phoneService: PhoneService,
    private loadingController: LoadingController,
    private EmailService: EmailService,
    private loader: Loader,
    private OTPservice: CodigoOtpService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.option = params.option;
      this.option === 'whatsapp'
        ? (this.isWhatsapp = true)
        : (this.isWhatsapp = false);
    });

    this.formulario = this.formBuilder.group({
      inputSms1: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)],
      ],
      inputSms2: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)],
      ],
      inputSms3: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)],
      ],
      inputSms4: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)],
      ],
    });
  }

  OTPcodeRequest(): void {
    if (this.userPhoneFull === null) {
      this.route.navigate(['register/security'], {
        queryParams: { option: 'phone' },
      });
    } else {
      this.loader.present('Enviando código...').then(() => {
        this.OTPservice.sendOTPcode(
          localStorage.getItem('userCode'),
          this.isWhatsapp ? 2 : 1
        )
          .then((response) => {
            if (response.responseCode === 'OK') {
              setTimeout(() => {
                this.mensagem =
                  'Se ainda não recebeu o código, certifique-se que há sinal da operadora em seu dispositivo.';
              }, 20000);

              this.codesInputsEnable = true;
              this.formulario.enable();

              this.isWhatsapp
                ? this.whatsappRequestHandler(response)
                : this.smsRequestHandler(response);
            } else {
              this.mensagem = 'Ocorreu um erro ao enviar o código.';
            }
          })
          .catch((err: HttpErrorResponse) => {
            console.log(err);
            if (
              err.error.responseString != null &&
              err.error.responseString != undefined
            ) {
              this.alert.showAlert('Erro.', err.error.responseString);
            } else {
              this.alert.showAlert(
                'Erro: ' + err.status,
                'Ocorreu uma falha ao tentar enviar o código.'
              );
            }
          })
          .then(() => {
            this.loader.dismiss();
          });
      });
    }
  }

  whatsappRequestHandler(response: any) {
    if (response.arg1 == 'WHATSAPP_BLOCKED') {
      this.alert.showAlert('Atenção', response.responseString);
      this.timerCount(response.arg2);
      this.mensagem = 'O código já foi enviado.';
    } else {
      this.alert.showToaster('Enviado!', 'success');
      this.mensagem = 'O código foi enviado com sucesso.';
    }
  }

  smsRequestHandler(response: any) {
    if (this.countSeconds != null) {
      clearTimeout(this.countSeconds);
    }

    this.mensagem = 'O código foi enviado com sucesso.';
    this.timerCount(30);
  }

  // enviar código OTP somente por SMS (substituído por OTPcodeRequest())
  // smsCodeRequest(): void {
  //   this.presentLoading('Enviando código SMS');
  //   if (this.userPhoneFull === null) {
  //     this.route.navigate(['register/security'], {
  //       queryParams: { option: 'phone' },
  //     });
  //   } else {
  //     this.phoneService
  //       .smsCodeRequest(this.dados.phoneNumber)
  //       .then((response) => {
  //         if (response.responseCode === 'OK') {
  //           this.codesInputsEnable = true;

  //           this.mensagem = 'O código foi enviado com sucesso.';

  //           this.timerCount(30);

  //           setTimeout(() => {
  //             this.mensagem =
  //               'Se ainda não recebeu o código, certifique-se que há sinal da operadora em seu dispositivo.';
  //           }, 20000);

  //           this.formulario.enable();
  //         } else {
  //           this.mensagem = 'Ocorreu um erro ao enviar o código.';
  //         }
  //       })
  //       .catch((response) => {
  //         this.alert.showAlert(
  //           'Erro: ' + response.status,
  //           'Ocorreu uma falha ao tentar enviar o código.'
  //         );
  //         console.log(response);
  //       });
  //   }
  // }

  verify(): void {
    console.log('entrei no option');

    switch (this.option) {
      case 'phone':
        this.validateOTPcode();
        break;

      case 'whatsapp':
        this.validateOTPcode();
        break;

      case 'recoverymail':
        this.OTPcodeVerify('recoverymail');
        break;

      case 'emailChange':
        this.OTPcodeVerify('emailChange');
        break;
    }
  }

  validateOTPcode() {
    this.loader.present().then(() => {
      let fullCode = this.code1 + this.code2 + this.code3 + this.code4;

      this.OTPservice.validateOTPcode(
        localStorage.getItem('userCode'),
        fullCode,
        true
      )
        .then((response: any) => {
          if (response.responseCode === 'OK') {
            this.timerResult = 'false';
            sessionStorage.clear();
            this.alert.showAlert('Sucesso!', 'Conta verificada!');
            this.route.navigate(['app/profile/details']);
            this.formulario.reset();
          }
        })
        .catch((err: HttpErrorResponse) => {
          console.log(err);
          if (
            err.error.responseString != undefined &&
            err.error.responseString != null
          ) {
            this.alert.showToaster(err.error.responseString, 'danger');
          } else {
            this.alert.showAlert(
              'Atenção!',
              'Ocorreu um erro ao enviar o código.'
            );
          }
        })
        .then(() => {
          this.loader.dismiss();
        });
    });
  }

  // Verifca código SMS e ativa usuário se válido (substituído por validateOTPcode())
  // smsCodeCheck() {
  //   this.presentLoading();
  //   let fullCode = this.code1 + this.code2 + this.code3 + this.code4;
  //   let userData = {
  //     phoneNumber: this.userPhoneFull,
  //     codigoSms: fullCode,
  //     ativarContaUsuario: true,
  //   };

  //   this.phoneService
  //     .smsCodeCheck(userData)
  //     .then((response) => {
  //       if (response.responseCode === 'OK') {
  //         this.timerResult = 'false';
  //         sessionStorage.removeItem('tel');
  //         this.presentLoading();
  //         this.accountActivatedModal();
  //         this.route.navigate(['/login']);
  //       }
  //     })
  //     .catch((err) => {
  //       this.alert.showAlert('Aviso', err.error.responseString);
  //     });
  // }

  // Apenas verifica se código SMS é válido
  OTPcodeVerify(param) {
    this.loader.present().then(() => {
      let optionAction = param;
      let fullCode = this.code1 + this.code2 + this.code3 + this.code4;

      this.OTPservice.validateOTPcode(
        localStorage.getItem('userCode'),
        fullCode,
        false
      )
        .then((response: any) => {
          if (response.responseCode === 'OK') {
            // atualiza e-mail
            switch (optionAction) {
              case 'recoverymail':
                let userDatas = {
                  Email: sessionStorage.getItem('email'),
                  ConfirmEmail: sessionStorage.getItem('email'),
                  Cpf: sessionStorage.getItem('doc'),
                  Telefone: '',
                  TipoAlter: 'email',
                };

                let normalizeJson = this.utils.normalizeJsonString(userDatas);
                const headers = {
                  'Content-Type': 'application/json; charset=utf8',
                };
                this.httpClient
                  .post(
                    environment.appSettings.API_ENDPOINT +
                      'Access/AtualizarDados',
                    normalizeJson,
                    { headers }
                  )
                  .subscribe((response: any) => {
                    if (response.responseCode == 'True') {
                      this.route.navigate(['/register/finally'], {
                        queryParams: { option: 'email' },
                      });
                    }
                  });
                break;

              case 'emailChange':
                let token = response.arg1;
                let newEmail: any = sessionStorage.getItem('newEmail');
                let document: any = sessionStorage.getItem('doc');

                this.EmailService.updateEmailWithToken(
                  token,
                  newEmail,
                  document
                )
                  .then((response) => {
                    this.alert.showAlert(
                      'Aviso',
                      'E-mail atualizado com sucesso.'
                    );
                  })
                  .catch((err: HttpErrorResponse) => {
                    this.alert.showAlert(
                      'Atenção!',
                      'Erro ao atualizar o e-mail.'
                    );
                  });

                this.cleanSessionsData();
                this.route.navigate(['/login']);
                break;
            }
          }
        })
        .catch((err) => {
          this.alert.showAlert('Aviso', err.error.responseString);
        })
        .then(() => {
          this.loader.dismiss();
        });
    });
  }

  // DESABILITADO POR MOTIVOS DE SEGURANÇA
  // editPhone() {
  //   this.route.navigate(['/register/security'], {
  //     queryParams: { option: 'phone' },
  //   });
  // }

  // Troca o texto do botão
  setNext(element, text) {
    element.textContent = 'Enviar novamente';
  }

  cleanSessionsData(): void {
    sessionStorage.removeItem('doc');
    sessionStorage.removeItem('emailVinculado');
    sessionStorage.removeItem('tel');
    sessionStorage.removeItem('newEmail');
  }

  // cronometro que informa se o sms expirou
  timerCount(seg: number) {
    let total = seg;
    this.timerResult = total.toString();

    this.countSeconds = setInterval(
      () => {
        total -= 1;
        this.timerResult = total.toString();

        if (total === 0) {
          clearTimeout(this.countSeconds);
          this.timerResult = 'false';
        }
      },
      this.isWhatsapp ? 60000 : 1000
    );
  }

  async accountActivatedModal() {
    const modal = await this.modalCtrl.create({
      component: ActivatedAccountBySmsComponent,
      cssClass: 'modal-accountActivated',
    });
    await modal.present();
  }
  async isActivated() {
    if (this.option === 'activated') {
      this.accountActivatedModal();
    }
  }

  async presentLoading(message?: string) {
    const loading = await this.loadingController.create({
      message: message,
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  enterBtn(event): void {
    if (event.key === 'Enter') {
      this.verify();
    }
  }
}
