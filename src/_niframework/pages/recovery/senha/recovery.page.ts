import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatform } from '@ionic/angular';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { Loader } from 'src/_niframework/providers/loader/loader';
import { Utils } from 'src/_niframework/providers/utils/utils-functions';
import { RecoveryService } from 'src/_niframework/services/access/recovery.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.page.html',
  styleUrls: ['./recovery.page.scss'],
})
export class RecoveryPage implements OnInit {

  public PasswordRecoveryForm: FormGroup;
  public emailsent: boolean;
  public emailsentmsg: string;
  public modal = false;

  constructor(
    private formBuilder: FormBuilder,
    public utils: Utils,
    private loader: Loader,
    private recoveryService: RecoveryService,
    private alerts: AlertsProvider,
    private routerCtrl: Router
  ) { }

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

    this.PasswordRecoveryForm = this.formBuilder.group({
      email: [null, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.%+-]{1,}@[a-zA-Z0-9-_.]{2,}[.]{1}[a-zA-Z0-9-.]+$')
      ])],
      'documento': ['', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9.-]{14} || [0-9.-/]{18}'),
        Validators.minLength(14)
      ])]
    });
  }

  goRecoveryPassword(tipo: number) {
    this.loader.present().then(() => {
      let doc = String(this.PasswordRecoveryForm.controls['documento'].value);

      //remoção da mascara
      if (doc.length === 14)
      {
        doc = doc.replace('.', '').replace('.', '').replace('-', '');
      } else {
        doc = doc.replace('.', '').replace('.','').replace('/', '').replace('-', '');
      }

      const recoveryData = {
        email : this.PasswordRecoveryForm.controls.email.value,
        doc,
        tipo
      };

      const normalizeJson = this.utils.normalizeJsonString(recoveryData);

      this.recoveryService.sendRecoverPasswordEmail(normalizeJson).then(response => {
        if (response.responseCode === 'OK') {
          this.recoveryPasswordByEmail();
        }
        else {
          this.alerts.showAlert('Falha!', 'Falha na redefinição de senha.');
        }
      })
      .then(() => {
        this.loader.dismiss();
      })
    })
  }

  recoveryPasswordByEmail() {
    this.alerts.showAlert('Atenção', 'Um link de redefição de senha foi enviado para o seu e-mail cadastrado.');
    this.routerCtrl.navigate(['/login'])
    // this.emailsent = true;
    // this.emailsentmsg = 'Consulte o seu email e acesse o link de redefinição da sua senha.';
  }
}