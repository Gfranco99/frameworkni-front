import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {
  public userEmail: string;
  public confirmToken: string;
  public activated: boolean;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private alerts: AlertsProvider
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.userEmail = params['email'];
    });

    /* DEFAULT VALUES*/
    this.activated = false;

    // Execute user email confirmation
    this.confirmToken = this.route.snapshot.params.id;

    if (this.confirmToken !== undefined) this.doConfirmation();
  }

  /*
  Function to resend confirmation email
  */
  resendConfirmationEmail() {
    let doc = localStorage.getItem('doc');

    //GET API access/register
    const headers = { 'Content-Type': 'application/json; charset=utf8' };
    this.httpClient
      .get(
        environment.appSettings.API_ENDPOINT +
          'Access/RecuperarEmailConta?cpf=' +
          doc +
          '&enviarEmailConfirmacao=true'
      )
      .subscribe({
        next: (response: any) => {
          if (response.responseCode == 'OK') {
            this.alerts.showAlert(
              '',
              'Email de confirmação reenviado com sucesso.'
            );
          } else if (response.responseCode == 'ERR') {
            this.alerts.showAlert('Alerta!', response.ResponseString);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(
            'Erro ao enviar email de confirmação: ' + JSON.stringify(err)
          );
          if (err.error != null)
            this.alerts.showAlert('Erro!', err.error['responseString']);
        },
      });
  }

  /*
  Function to confirm email
  */
  doConfirmation() {
    //GET API access/confirmarUsuario
    var formData: any = new FormData();
    formData.append('token', this.confirmToken);

    this.httpClient
      .post(
        environment.appSettings.API_ENDPOINT + 'access/confirmarUsuario',
        formData
      )
      .subscribe({
        next: (response: any) => {
          if (response.responseCode == 'OK') {
            this.activated = true;
          } else if (response.responseCode == 'ERR') {
            this.alerts.showAlert('Falha!', response.ResponseString);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log('Erro ao confirmar email: ' + JSON.stringify(err));
          if (err.error != null)
            this.alerts.showAlert('Erro!', err.error['responseString']);
        },
      });
  }
}
