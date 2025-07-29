import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContatoService {
  constructor(private httpClient: HttpClient) {}

  validateEmail(data) {
    if (/(.+)@(.+){2,}\.(.+){2,}/.test(data.email)) {
      return {
        isValid: true,
      };
    } else {
      return {
        isValid: false,
      };
    }
  }

  /**
   * Service Method that send email about FAQ
   */
  async sendEmailFAQ(emailModel, callbackSuccess): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT + 'generico/EnviarEmailFAQ',
          emailModel
        )
        .subscribe({
          next: () => {
            callbackSuccess();
            resolve(true);
          },
          error: (err: HttpErrorResponse) => {
            console.log('Erro ao enviar email FAQ : ' + JSON.stringify(err));
          },
        });
      // this.httpClient.post(environment.appSettings.API_ENDPOINT + 'generico/EnviarEmailFAQ', emailModel)
      //   .subscribe(
      //     () => {
      //       callbackSuccess();
      //       resolve(true);
      //     },
      //     (err: HttpErrorResponse) => {
      //       console.log('Erro ao enviar email FAQ : ' + JSON.stringify(err));
      //     }
      //   );
    });
  }

  /**
   * Service Method that send email de Contato
   */
  async sendEmailContato(
    emailModel,
    callbackSuccess,
    callbackError
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT + 'generico/EnviarEmailContato',
          emailModel
        )
        .subscribe({
          next: () => {
            callbackSuccess();
            resolve(true);
          },
          error: (err: HttpErrorResponse) => {
            console.log(
              'Erro ao enviar email de contato : ' + JSON.stringify(err)
            );
            callbackError();
            resolve(false);
          },
        });

      // this.httpClient
      //   .post(
      //     environment.appSettings.API_ENDPOINT + 'generico/EnviarEmailContato',
      //     emailModel
      //   )
      //   .subscribe(
      //     () => {
      //       callbackSuccess();
      //       resolve(true);
      //     },
      //     (err: HttpErrorResponse) => {
      //       console.log(
      //         'Erro ao enviar email de contato : ' + JSON.stringify(err)
      //       );
      //       callbackError();
      //       resolve(false);
      //     }
      //   );
    });
  }

  /**
   * Service Method that get Contact List
   */
  async getListaContatos(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.httpClient
        .get(environment.appSettings.API_ENDPOINT + 'parameter/ListarContatos')
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            console.log(
              'Erro ao obter a lista de contatos : ' + JSON.stringify(err)
            );
          },
        });

      // this.httpClient
      //   .get(environment.appSettings.API_ENDPOINT + 'parameter/ListarContatos')
      //   .subscribe(
      //     (response) => {
      //       resolve(response);
      //     },
      //     (err: HttpErrorResponse) => {
      //       console.log(
      //         'Erro ao obter a lista de contatos : ' + JSON.stringify(err)
      //       );
      //     }
      //   );
    });
  }

  //Service de enviar Agendamento Presencial
  async sendEmailAgendamentoP(emailModel, callbackSuccess): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'generico/EnviarEmailAgendamentoP',
          emailModel
        )
        .subscribe({
          next: () => {
            callbackSuccess();
            resolve(true);
          },
          error: (err: HttpErrorResponse) => {
            console.log(
              'Erro ao enviar email Agendamento : ' + JSON.stringify(err)
            );
          },
        });

      // this.httpClient
      //   .post(
      //     environment.appSettings.API_ENDPOINT +
      //       'generico/EnviarEmailAgendamentoP',
      //     emailModel
      //   )
      //   .subscribe(
      //     () => {
      //       callbackSuccess();
      //       resolve(true);
      //     },
      //     (err: HttpErrorResponse) => {
      //       console.log(
      //         'Erro ao enviar email Agendamento : ' + JSON.stringify(err)
      //       );
      //     }
      //   );
    });
  }

  //Service de enviar Agendamento Domicilio
  async sendEmailAgendamentoD(emailModel, callbackSuccess): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'generico/EnviarEmailAgendamentoD',
          emailModel
        )
        .subscribe({
          next: () => {
            callbackSuccess();
            resolve(true);
          },
          error: (err: HttpErrorResponse) => {
            console.log(
              'Erro ao enviar email Agendamento : ' + JSON.stringify(err)
            );
          },
        });
      // this.httpClient
      //   .post(
      //     environment.appSettings.API_ENDPOINT +
      //       'generico/EnviarEmailAgendamentoD',
      //     emailModel
      //   )
      //   .subscribe(
      //     () => {
      //       callbackSuccess();
      //       resolve(true);
      //     },
      //     (err: HttpErrorResponse) => {
      //       console.log(
      //         'Erro ao enviar email Agendamento : ' + JSON.stringify(err)
      //       );
      //     }
      //   );
    });
  }
}
