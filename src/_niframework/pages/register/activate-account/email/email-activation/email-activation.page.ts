import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { Utils } from 'src/_niframework/providers/utils/utils-functions';
import { AppSettings } from 'src/_niframework/config/appSettings.prod';
import { ActivationService } from 'src/_niframework/services/access/activation.service';
import { SecurityService } from 'src/_niframework/services/security/security.service';
import { LoadingController } from '@ionic/angular';
import { UserService } from 'src/_niframework/services/user/user.service';
import { ToasterService } from 'src/_niframework/services/toaster/toaster.service';

@Component({
  selector: 'app-email-activation',
  templateUrl: './email-activation.page.html',
  styleUrls: ['./email-activation.page.scss'],
})
export class EmailActivationPage implements OnInit {
  public emailValue = { DsEmail: '' };
  formulario: FormGroup;

  constructor(
    private route: Router,
    private alerts: AlertsProvider,
    private httpClient: HttpClient,
    private utils: Utils,
    private formBuilder: FormBuilder,
    private activationService: ActivationService,
    private securityService: SecurityService,
    private loadingController: LoadingController,
    private userService: UserService,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '[A-Za-z0-9._%+-]{1,}@[a-zA-Z0-9-_.]{2,}[.]{1}[a-zA-Z]{2,}'
          ),
        ],
      ],
    });
  }

  CheckEmail() {
    //POST API access/ValidaEmail
    let email = sessionStorage.getItem('email')!;
    let document: any = sessionStorage.getItem('doc');

    if (this.formulario.controls.email.value !== email) {
      this.toasterService.presentToast(
        'O e-mail informado não é igual ao e-mail de cadastro',
        'warning',
        6
      );
      return;
    }

    this.presentLoading();

    this.userService.userValidate(email, document).then((response) => {
      if (response.responseCode == 'True') {
        this.route.navigate(['/register/finally'], {
          queryParams: { option: 'email' },
        });
        this.formulario.reset();
      } else {
        this.alerts.showToaster('O e-mail informado não consta no sistema.');
      }
    });
  }

  goToSecurity() {
    this.presentLoading();
    this.securityService.sendRequestCleanCpf();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }
}
