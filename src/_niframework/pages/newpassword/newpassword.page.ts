import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonAccordionGroup, isPlatform } from '@ionic/angular';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { Loader } from 'src/_niframework/providers/loader/loader';
import { Utils } from 'src/_niframework/providers/utils/utils-functions';
import { RecoveryService } from 'src/_niframework/services/access/recovery.service';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.page.html',
  styleUrls: ['./newpassword.page.scss'],
})
export class NewpasswordPage implements OnInit {

  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;
  public onRedefinePasswordForm: FormGroup;
  public newpassToken: string;
  public newpass: string;
  public newpassconfirm: string;

  isVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputRoute: ActivatedRoute,
    private router: Router,
    private alerts: AlertsProvider,
    private utils: Utils,
    private recoveryService: RecoveryService,
    private loader: Loader
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

    this.onRedefinePasswordForm = this.formBuilder.group({
      senha: [null, Validators.compose([
        Validators.required,
        Validators.pattern(this.utils.RegExpStrongPassword)
      ])],
      confirmaSenha: [null, Validators.compose([
        Validators.required,
        RxwebValidators.compare({fieldName: 'senha'})
      ])]
    });

    this.newpassToken = this.inputRoute.snapshot.params.id;

    if (this.newpassToken == undefined){
      // this.alerts.showAlert("Sessão expirada.", "Solicite um novo link para redefinir sua senha.")
      this.router.navigateByUrl('/login');
      // this.router.navigateByUrl("notfound");
    }
  }

  doRedefinition() {
    this.loader.present().then(() => {
      let pass = this.onRedefinePasswordForm.controls['senha'].value;

      var formData: any = new FormData();
      formData.append("token", this.newpassToken);
      formData.append("newPassword", pass);

      this.recoveryService.resetPasswordRequest(formData).then(response => {
        if (response['responseCode'] == 'OK') {
          this.alerts.showAlert("", response['responseString']);
          this.router.navigateByUrl('/login');
          //this.router.navigateByUrl('/confirm?email=' + newuser.email);
        } else if (response['responseCode'] == 'ERR') {
          this.alerts.showAlert("Falha!", response['responseString']);
        }
      })
      .catch((error: HttpErrorResponse) => {
        console.log("Erro ao redefinir a senha: " + JSON.stringify(error))
          if (error.error != null)
            this.alerts.showAlert("Erro!", error.error);
      })
      .then(() => {
        this.loader.dismiss();
      })
    })
  }

  enterBtn() {
    this.onRedefinePasswordForm.valid ? this.doRedefinition() : '';
  }

  toggleAccordion() {
    const nativeEl = this.accordionGroup;

    if (nativeEl.value === 'second') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'second';
    }
  }
}
