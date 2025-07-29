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
export class ProtocolService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Service Method that do an association between protocolo and user account
   */
  async postAssociationProtocolAccount(
    token,
    protNum,
    protPass,
    protType,
    protNatureza,
    protNomeApresentante,
    protStatus,
    protData
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        }),
      };
      const dataProtocolAssociation = {
        dsNumeroProtocolo: protNum,
        idTipoTitulo: Number.parseInt(protType),
        dsSenha: protPass,
        dsNatureza: protNatureza,
        dsNomeApresentante: protNomeApresentante,
        dsStatus: protStatus,
        dtAtualizacao: protData,
      };

      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'Processo/AssociarUsuarioProcesso',
          dataProtocolAssociation,
          httpOptions
        )
        .subscribe({
          next: (response: any) => {
            resolve(true);
          },
          error: (err: HttpErrorResponse) => {
            console.log(
              'Erro ao enviar requisição Associar Protocolo : ' +
                JSON.stringify(err)
            );
          },
        });
    });
  }

  async postDesassociationProtocolAccount(
    token,
    id,
    tipoProtocolo
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        }),
      };

      const dataProtocolDesssociation = {
        numeroProtocolo: id,
        idTipoProtocolo: Number.parseInt(tipoProtocolo),
      };
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'Processo/RemoverUsuarioProcessoProtocolo',
          dataProtocolDesssociation,
          httpOptions
        )
        .subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            console.log(
              'Erro ao enviar requisição Associar Protocolo : ' +
                JSON.stringify(err)
            );
          },
        });
    });
  }

  async getCertidaoUsuario(token, nrProtocolo): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        }),
      };
      this.httpClient
        .get(
          environment.appSettings.API_ENDPOINT +
            `Processo/ObterProcessoCertidao?numero=${nrProtocolo}`,
          httpOptions
        )
        .subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            console.log(
              'Erro ao enviar requisição Associar Protocolo : ' +
                JSON.stringify(err)
            );
          },
        });
    });
  }
}
