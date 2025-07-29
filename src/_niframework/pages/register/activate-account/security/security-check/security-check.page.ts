import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { Utils } from 'src/_niframework/providers/utils/utils-functions';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { CpfValidationService } from 'src/_niframework/services/user/cpf-validation.service';
import { PhoneService } from 'src/_niframework/services/user/phone.service';
import { EmailService } from 'src/_niframework/services/user/email.service';
import { SecurityService } from 'src/_niframework/services/security/security.service';
import { LoadingController } from '@ionic/angular';
import { UserService } from 'src/_niframework/services/user/user.service';
import { ToasterService } from 'src/_niframework/services/toaster/toaster.service';

@Component({
  selector: 'app-security-check',
  templateUrl: './security-check.page.html',
  styleUrls: ['./security-check.page.scss'],
})
export class SecurityCheckPage implements OnInit {
  dados = { cpfNumber: '', email: '' };
  option: string;
  formulario: FormGroup;
  lockIcon: boolean = false;

  // cpfUnmasked = this.dados.cpfNumber
  // .replace('.', '')
  // .replace('.', '')
  // .replace('-', '');

  constructor(
    private rotaAtiva: ActivatedRoute,
    private rota: Router,
    private alerts: AlertsProvider,
    private httpClient: HttpClient,
    private route: Router,
    public utils: Utils,
    private formBuilder: FormBuilder,
    private cpfValidationService: CpfValidationService,
    private phoneService: PhoneService,
    private emailService: EmailService,
    private securityService: SecurityService,
    private loadingController: LoadingController,
    private userService: UserService,
    private toasterService: ToasterService
  ) {
    securityService.getRequestCleanCpf().subscribe(() => {
      this.cleanCpfValue();
      this.lockIcon = false;
    });
  }

  ngOnInit() {
    this.rotaAtiva.queryParams.subscribe((params) => {
      this.option = params.option;
    });

    this.formulario = this.formBuilder.group({
      cpf: ['', [Validators.required, Validators.minLength(14)]],
    });
  }

  validaCpf(): void {
    // Chama a API
    // this.presentLoading();
    this.cpfValidationService
      .cpfCheck(this.dados.cpfNumber)
      .then((response) => {
        if (response.responseCode == 'True') {
          setTimeout(() => {
            switch (this.option) {
              case 'email':
                this.lockIcon = true; //troca icone do cadeado
                this.route.navigate(['/register/data-profile-update'], {
                  queryParams: {
                    option: this.option,
                    cpf: this.cpfNormalize(this.dados.cpfNumber),
                  },
                });
                break;

              case 'whatsapp':
                let cpfUsuario = this.cpfNormalize(this.dados.cpfNumber);

                this.userService
                  .userValidate(sessionStorage.getItem('email')!, cpfUsuario)
                  .then((response) => {
                    if (response.responseCode === 'True') {
                      this.phoneService
                        .getPhone(this.dados.cpfNumber)
                        .then((response) => {
                          sessionStorage.setItem(
                            'tel',
                            response.responseString
                          );
                          this.route.navigate(['/register/sms-activation'], {
                            queryParams: {
                              option: this.option
                            },
                          });
                        });
                      this.lockIcon = true; //troca icone do cadeado
                    } else {
                      this.toasterService.presentToast(
                        'O CPF informado não é válido.',
                        'warning',
                        4
                      );
                    }
                  });
                break;

              case 'phone':
                let cpfUser = this.cpfNormalize(this.dados.cpfNumber);

                this.userService
                  .userValidate(sessionStorage.getItem('email')!, cpfUser)
                  .then((response) => {
                    if (response.responseCode === 'True') {
                      this.phoneService
                        .getPhone(this.dados.cpfNumber)
                        .then((response) => {
                          sessionStorage.setItem(
                            'tel',
                            response.responseString
                          );
                          this.route.navigate(['/register/sms-activation'], {
                            queryParams: {
                              option: this.option,
                              cpf: this.cpfNormalize(this.dados.cpfNumber),
                            },
                          });
                        });
                      this.lockIcon = true; //troca icone do cadeado
                    } else {
                      this.toasterService.presentToast(
                        'O CPF informado não é válido.',
                        'warning',
                        4
                      );
                    }
                  });
                break;

              case 'recoverymail':
                sessionStorage.setItem(
                  'doc',
                  this.cpfNormalize(this.dados.cpfNumber)
                );

                this.phoneService
                  .getPhone(this.dados.cpfNumber)
                  .then((response) => {
                    sessionStorage.setItem('tel', response.responseString);
                  })
                  .then(() => {
                    this.lockIcon = true; //troca icone do cadeado
                    this.emailService
                      .getEmail(sessionStorage.getItem('doc')!)
                      .then((response) => {
                        sessionStorage.setItem(
                          'emailVinculado',
                          response.responseString
                        );
                        this.route.navigate(['/register/data-profile-update'], {
                          queryParams: {
                            option: 'email',
                            cpf: sessionStorage.getItem('doc'),
                          },
                        });
                      });
                  });
                break;

              case 'recoverymaillogin':
                sessionStorage.setItem(
                  'doc',
                  this.cpfNormalize(this.dados.cpfNumber)
                );

                this.phoneService
                  .getPhone(this.dados.cpfNumber)
                  .then((response) => {
                    sessionStorage.setItem('tel', response.responseString);
                  })
                  .then(() => {
                    this.emailService
                      .getEmail(sessionStorage.getItem('doc')!)
                      .then((response) => {
                        sessionStorage.setItem(
                          'emailVinculado',
                          response.responseString
                        );
                        this.route.navigate(['/register/data-profile-update'], {
                          queryParams: {
                            option: 'emaillogin',
                            cpf: sessionStorage.getItem('doc'),
                          },
                        });
                      });
                  });
                break;

              case 'email-activate':
                this.dados.email = sessionStorage.getItem('email')!;
                this.userService
                  .userValidate(
                    this.dados.email,
                    this.cpfNormalize(this.dados.cpfNumber)
                  )
                  .then((response) => {
                    if (response.responseCode == 'True') {
                      sessionStorage.clear();
                      this.securityService.sendRequestCleanCpf();
                      this.route.navigate(['/register/finally'], {
                        queryParams: { option: 'email' },
                      });
                    } else {
                      this.toasterService.presentToast(
                        'O documento informado não é válido',
                        'warning',
                        3
                      );
                    }
                  });
                break;
            }
          }, 2000);
        } else {
          this.toasterService.presentToast(
            'O CPF informado não é válido.',
            'warning',
            4
          );
        }
      });
  }

  cpfNormalize(cpf: string): string {
    let cpfUnmasked = cpf.replace('.', '').replace('.', '').replace('-', '');

    return cpfUnmasked;
  }

  cleanCpfValue(): void {
    this.dados.cpfNumber = '';
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  // back(): void {
  //   window.history.back();
  // }

  enterBtn(event) {
    if (event.key === 'Enter') {
      this.validaCpf();
    }
  }
}
