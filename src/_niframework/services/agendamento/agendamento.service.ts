import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  constructor(private httpClient: HttpClient) {}

  async postAssociaAgendamento(agenda, token): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        }),
      };

      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'Processo/InserirListaProcessoAgendamento',
          agenda,
          httpOptions
        )
        .subscribe({
          next: (response) => {
            resolve(true);
          },
          error: (err: HttpErrorResponse) => {
            console.log(
              'Erro ao enviar requisição Associar Agendamento : ' +
                JSON.stringify(err)
            );
          },
        });

      // this.httpClient.post(environment.appSettings.API_ENDPOINT + 'Processo/InserirListaProcessoAgendamento', agenda, httpOptions)
      //   .subscribe(
      //     (response: any) => {
      //       resolve(true);
      //     },
      //     (err: HttpErrorResponse) => {
      //       console.log('Erro ao enviar requisição Associar Agendamento : ' + JSON.stringify(err));
      //     }
      //   );
    });
  }
}
