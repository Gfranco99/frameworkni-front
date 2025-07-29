import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-update-concerns-modal',
  templateUrl: './update-concerns-modal.page.html',
  styleUrls: ['./update-concerns-modal.page.scss'],
})
export class UpdateConcernsModalPage implements OnInit {

  /*ATTRIBUTES*/
  public onUpdateConcernsForm: FormGroup;
  private token: string;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private alerts: AlertsProvider,
    private navParams: NavParams,
    public modalCtrl: ModalController
  ) {

  }

  ngOnInit() {

    /*FORM*/
    this.onUpdateConcernsForm = this.formBuilder.group({
      'acceptTermOfUse': [false, UpdateConcernsModalPage.mustAccept],
      'acceptAccountCreate': [false, UpdateConcernsModalPage.mustAccept]
    });

    /*PARAM from parent*/
    this.token = this.navParams.get("ptoken");
  }

  /*
  Método que define a obrigatoriedade de selecionar o checkbox
  */
  static mustAccept(c: AbstractControl): { [key: string]: boolean } {
    let rv: { [key: string]: boolean } = {};
    if (!c.value) {
      rv['notChecked'] = true;
    }
    return rv;
  }

  /*
  Method to update user concerns
  */
  goAcceptConcerns() {

    //POST API access/login
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Token ' + this.token
      })
    };
    this.httpClient.post(environment.appSettings.API_ENDPOINT + 'usuario/AtualizarTermos', null, httpOptions)
    .subscribe({
      next: (response) => {
        this.modalCtrl.dismiss();
        this.alerts.showToaster("Consentimento atualizado com sucesso.");
      },
      error: (err: HttpErrorResponse) => {
        console.log("Erro ao atualizar o consentimento : " + JSON.stringify(err))
        this.alerts.showAlert("Erro!", err.error);
      }
    })
      // .subscribe(
      //   (response: any) => {

      //     this.modalCtrl.dismiss();
      //     this.alerts.showToaster("Consentimento atualizado com sucesso.");
      //   },
      //   (err: HttpErrorResponse) => {
      //     console.log("Erro ao atualizar o consentimento : " + JSON.stringify(err))
      //     this.alerts.showAlert("Erro!", err.error);
      //   }
      // );
  }

}
