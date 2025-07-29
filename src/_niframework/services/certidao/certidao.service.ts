import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
// import {Certidao, ValidaCertidao, PedidoCertidao } from 'src/_niframework/models/certidao.model';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CertidaoService {
  constructor(
    private navCtrl: Router,
    private httpClient: HttpClient,
    private loadingCtrl: LoadingController,
    private alertaCtrl: AlertController,
    private alerts: AlertsProvider
  ) {}

  public retorno: any;
  public isLogged;

  async checkLogin() {
    //Valida se o usuário está logado
    this.isLogged = localStorage.getItem('currentUser') != null;

    if (!this.isLogged) {
      await this.alerts.showAlert('ATENÇÃO', 'Faça o login no aplicativo.');
      localStorage.setItem('fromTermo', 'true');
      await this.navCtrl.navigate(['/login']);
      return;
    }
  }

  //faz o post da requisicao com a lista e dados do cliente, retorna com o get da validacao
  async requisicao(pedido: any): Promise<any> {
    //loader enquanto faz o post
    const loading = await this.loadingCtrl.create({
      duration: 5000,
    });

    return new Promise(async (resolve, reject) => {
      //Retorno da validação
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'PedidoCertidao/ValidarCertidao',
          pedido
        )
        .subscribe({
          next: (response) => {
            console.log(response);
            loading.dismiss();
            resolve(response);
          },
          error: (error) => {
            console.log(error);
            this.alerta();
            loading.dismiss();
          },
        });

      loading.present();
      // this.httpClient.post(environment.appSettings.API_ENDPOINT + 'PedidoCertidao/ValidarCertidao', pedido).subscribe((response: any) => {
      //   console.log(response);
      //   loading.dismiss();
      //   resolve(response)
      // },
      // error => {
      //   console.log(error);
      //   this.alerta();
      //   loading.dismiss();
      // });
    });
  }

  //Requisição do pedido
  async sendPedido(pedido: any): Promise<any> {
    const date = localStorage.getItem('dataTermo'); //data que o termo foi aceito
    //localStorage.removeItem('dataTermo');
    const termos: any[] = [];
    if (JSON.parse(localStorage.getItem('termos')!) !== null) {
      termos.push(JSON.parse(localStorage.getItem('termos')!));
    }
    pedido.DtAceiteTermo = date;
    //loader enquanto faz o post
    const loading = await this.loadingCtrl.create({
      duration: 5000,
    });

    return new Promise(async (resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Token ' + localStorage.getItem('token'),
        }),
      };

      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'Processo/InserirProcessoCertidao',
          pedido,
          httpOptions
        )
        .subscribe({
          next: (response: any) => {
            let termo = {
              DtAceiteTermo: date,
              protocolo: response.dsProtocoloInterno,
            };

            termos.push(termo);
            // guarda no localStorage a data aceita e os valores de qrCode
            localStorage.setItem('termos', JSON.stringify(termos));
            localStorage.setItem('txtQRCode', response.pagamento.txtQRCode);
            localStorage.setItem('baseQRCode', response.pagamento.base64QRCode);
            loading.dismiss();
            resolve(true);
          },
          error: (error) => {
            console.log(error);
            this.alerta();
            loading.dismiss();
          },
        });

      // this.httpClient
      //   .post(
      //     environment.appSettings.API_ENDPOINT +
      //       'Processo/InserirProcessoCertidao',
      //     pedido,
      //     httpOptions
      //   )
      //   .subscribe(
      //     (response: any) => {
      //       let termo = {
      //         DtAceiteTermo: date,
      //         protocolo: response.dsProtocoloInterno,
      //       };
      //       termos.push(termo);

      //       //guarda no localStorage a data aceita e os valores de qrCode
      //       localStorage.setItem('termos', JSON.stringify(termos));
      //       localStorage.setItem('txtQRCode', response.pagamento.txtQRCode);
      //       localStorage.setItem('baseQRCode', response.pagamento.base64QRCode);
      //       loading.dismiss();
      //       resolve(true);
      //     },
      //     (error) => {
      //       console.log(error);
      //       this.alerta();
      //       loading.dismiss();
      //     }
      //   );

      loading.present();
    });

    /*this.httpClient.post(this.api + 'requisicao', this.pedido, httpOptions).subscribe((response: any) => {
      console.log(response);
    });*/
  }

  //Alerta de erro no retorno
  async alerta() {
    const alertRepetidos = await this.alertaCtrl.create({
      header: 'OCORREU UM ERRO',
      message: `Desculpe, houve um erro no processamento do seu pedido.<br> Entre em contato com Cartório ou tente novamente mais tarde`,

      buttons: [{ text: 'Ok' }],
    });
    await alertRepetidos.present();
  }
}
