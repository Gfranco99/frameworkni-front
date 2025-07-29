import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Utils } from 'src/_niframework/providers/utils/utils-functions';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';

import { DocumentoService } from 'src/_niframework/services/user/documento.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-email',
  templateUrl: './email-recovery.page.html',
  styleUrls: ['./email-recovery.page.scss'],
})
export class EmailRecoveryPage implements OnInit {
  public onRecoveyForm: FormGroup;
  public emailvinc: boolean;
  public emailvincmsg: string;

  public api =
    environment.appSettings.API_ENDPOINT +
    'Access/recuperarEmailConta?documento=';

  constructor(
    private formBuilder: FormBuilder,
    private routeCtrl: Router,
    public utils: Utils,
    private httpClient: HttpClient,
    private alerts: AlertsProvider,
    private loadingCtrl: LoadingController,
    public docServ: DocumentoService
  ) {}

  ngOnInit() {
    this.onRecoveyForm = this.formBuilder.group({
      doc: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9.-]{14}'),
          Validators.maxLength(14),
        ]),
      ],
    });
  }

  async goRecoveryEmail(): Promise<boolean> {
    let doc = this.onRecoveyForm.controls['doc'].value
      .replace('.', '')
      .replace('.', '')
      .replace('-', '');

    const loading = await this.loadingCtrl.create({
      duration: 8000,
    });

    return new Promise(async (resolve, reject) => {
      this.httpClient
        .get(this.api + doc + '&enviarEmailConfirmacao=true')
        .subscribe({
          next: (response: any) => {
            this.emailvinc = response.responseString;
            resolve(true);
            loading.dismiss();
          },
          error: (err: HttpErrorResponse) => {
            console.log('Erro ao enviar requisição : ' + JSON.stringify(err));
            this.alerts.showAlert(
              'Erro!',
              'Este CPF não está vinculado a nenhuma conta.'
            );
            resolve(false);
            loading.dismiss();
          },
        });
      loading.present();
    });

    /*let email_test = "teste@albacore.com.br"
    
    //variavel index
    let i=2
    //loop de censura
    while(email_test[i+1]!='@'){
      email_test = this.setCharAt(email_test, i, '*')
      console.log(email_test)
      i++;
    }
    i=i+5;
    while(email_test[i]!='.'){
      email_test = this.setCharAt(email_test, i, '*')
      console.log(email_test)
      i++;
    }
    
    this.emailvincmsg = email_test;
    this.emailvinc = true;*/
  }

  setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  //Validador de CPF
  validaCPF(eve: any) {
    let valida = this.docServ.validaCPF(eve);
    if (!valida) {
      this.onRecoveyForm.controls['doc'].setValue('');
    }
  }
}
