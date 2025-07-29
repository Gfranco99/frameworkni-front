import { Component, OnInit, Query } from '@angular/core';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from 'src/_niframework/providers/utils/utils-functions';
import { AppSettings } from 'src/_niframework/config/appSettings';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EmailService } from 'src/_niframework/services/user/email.service';
import { ActivationService } from 'src/_niframework/services/access/activation.service';
import { Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-email-edit',
  templateUrl: './email-edit.component.html',
  styleUrls: ['./email-edit.component.scss'],
})
export class EmailEditComponent implements OnInit {
  dados = {
    email: '',
    confirmEmail: '',
    cpf: '',
    telefone: '',
    tipoAlter: 'email',
  };
  option: string = '';
  formulario: FormGroup;
  emailvinc: any;
  public api = environment.appSettings.API_ENDPOINT + 'Access/RecuperarEmailConta?cpf=';

  constructor(
    private alert: AlertsProvider,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private utils: Utils,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private emailService: EmailService,
    private activationService: ActivationService
    ) {
      this.goRecoveryEmail();   
    }
    
    
  ngOnInit() {


    this.activatedRoute.queryParams.subscribe((params) => {
      this.option = params.option;
      this.dados.cpf = params.cpf;
    });
    this.formulario = this.formBuilder.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '[A-Za-z0-9._%+-]{1,}@[a-zA-Z0-9-_.]{2,}[.]{1}[a-zA-Z]{2,}'
          ),
        ]),
      ],

      emailToCompare: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '[A-Za-z0-9._%+-]{1,}@[a-zA-Z0-9-_.]{2,}[.]{1}[a-zA-Z]{2,}'
          ),
        ]),
      ],
    });
  }

  goRecoveryEmail(): void {
    let doc = sessionStorage.getItem('emailVinculado');
    this.emailvinc = doc;
  }

   updateEmail() {
    this.presentLoading();
    if (this.dados.email !== this.dados.confirmEmail) {
      this.alert.showToaster("Os e-mails não combinam.")
    }
    else {
      sessionStorage.setItem('newEmail', this.dados.email)
      this.route.navigate(['/register/sms-activation'], { queryParams: { option: "emailChange" } })


    //   this.emailService.emailUpdate(this.dados).then(response => {
    //     if(response.responseCode === "True") {
    //       this.cleanDataSession();
    //       this.CheckEmail(this.dados.email);
    //       console.log(this.dados.email);
    //       this.alert.showAlert("Atualização", "E-mail atualizado com sucesso.")
    //       // this.route.navigate(['/register/email-activation']);
    //     }
    //   })
    }
  }

  // updateEmail() {
  //   this.presentLoading();
  //   if (this.dados.email !== this.dados.confirmEmail) {
  //     this.alert.showToaster("Os e-mails não combinam.")
  //   }
  //   else {
  //     this.emailService.emailUpdate(this.dados).then(response => {
  //       if(response.responseCode === "True") {
  //         this.cleanDataSession();
  //         this.CheckEmail(this.dados.email);
  //         console.log(this.dados.email);
  //         this.alert.showAlert("Atualização", "E-mail atualizado com sucesso.")
  //         // this.route.navigate(['/register/email-activation']);
  //       }
  //     })
  //   }
  // }

  cleanDataSession(): void {
    sessionStorage.removeItem('emailVinculado');
    sessionStorage.removeItem('tel');
    sessionStorage.removeItem('doc');
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  CheckEmail(email: string) {
    //POST API access/ValidaEmail
    this.presentLoading();
    this.activationService.emailValidate(email).then(response => {
      if(response.responseCode == "True") {
        let paramRedirect;
        
        this.activatedRoute.queryParams.subscribe((param) => {
          paramRedirect = param.option;
        })

        switch(paramRedirect) {
          case 'email':
            this.route.navigate(['/register/finally'], { queryParams: { option: "email" } })
          break;

          case 'emaillogin':
            this.route.navigate(['/login']);
          break;
        }
      }
    })
  }

  enterBtn(event): void {
    if(event.key === 'Enter') {
      this.updateEmail();
    }
  }
}
