import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfMake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vsf = pdfFonts.pdfMake.vfs;

import htmlToText from 'html-to-pdfmake';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { ActivatedRoute, Router } from '@angular/router';
import { Loader } from 'src/_niframework/providers/loader/loader';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { ProtocolService } from 'src/_niframework/services/protocol/protocol.service';
import { UserProtocolsComponent } from '../components/user-protocols/user-protocols.component';
import { PdfService } from 'src/_niframework/services/protocol/pdf.service';
import { MobileService } from 'src/_niframework/services/mobile/mobile.service';
import { FormControl } from '@angular/forms';
import { TiposProtocoloEnum } from 'src/_niframework/models/enum-protocolos';
import { environment } from 'src/environments/environment';
import { NotaDevolutivaDict } from './protocolo-detail.model';

@Component({
  selector: 'app-protocolo-detail',
  templateUrl: './protocolo-detail.page.html',
  styleUrls: ['./protocolo-detail.page.scss'],
})
export class ProtocoloDetailPage implements OnInit {
  public PROTOCOL_ERROR = 'Protocolo não localizado!';

  public isMobileDevice = false;

  public protocolNumber: string;
  public protocolPass: string;
  public protocolType: string;
  public protocolTypeName: string;
  public inDoAssociation: string;

  public deposito: string;
  public custas;

  public tituloModel: any;
  public isLogged: boolean;
  // private shareService: NgNavigatorShareService;
  public isRegistred: boolean;
  public isPedidoCertidao = false;
  public lastActivities: any;

  public pageReturn = localStorage.getItem('volta');
  public protocolConsultErrorView: boolean;
  public protocolConsultErrorMessage: string;

  nav_selected: string;

  activeSegment: FormControl = new FormControl('prot-details');
  segments: any[] = [
    { title: 'Detalhes', value: 'segdetails' },
    { title: 'Anexos', value: 'seganexos' },
  ];

  constructor(
    private httpClient: HttpClient,
    private alerts: AlertsProvider,
    private routeCtrl: Router,
    private inputRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private protocolService: ProtocolService,
    private componentLista: UserProtocolsComponent,
    private pdfService: PdfService,
    private platform: Platform,
    private mobile: MobileService
  ) {}

  ngOnInit() {
    this.protocolNumber = this.inputRoute.snapshot.params.id;
    this.protocolPass = this.inputRoute.snapshot.params.pass;
    this.protocolType = this.inputRoute.snapshot.params.type;
    this.inDoAssociation = this.inputRoute.snapshot.params.add;

    this.isRegistred = false;
    this.nav_selected = this.segments[0].value;
    this.isLogged = localStorage.getItem('currentUser') != null;
    this.getRegistro();
    this.protocolConsultErrorView = false;
    this.selectProtocolConsultService(this.protocolType);

    this.mobile.checkIfMobile();
    this.isMobileDevice = this.mobile.isMobileDevice;
  }

  async getRegistro() {
    this.componentLista.arrayProtocolos = [];
    if ((await this.componentLista.getProcessosFromUser()) === true) {
      this.componentLista.arrayProtocolos.forEach((element) => {
        if (
          element.dsNumeroProtocolo === this.protocolNumber &&
          element.idTipoTitulo.toString() === this.protocolType
        ) {
          this.isRegistred = true;
        } else if (element.dsProtocoloCartorio === this.protocolNumber) {
          this.isPedidoCertidao = true;
        }
      });
    }
  }

  /*
  Method that select a protocol type (prenotação, Certidão ou Exame e Cálculo)
  */
  selectProtocolConsultService(protocolService) {
    //Get API from protocol type
    let endpoint: string;
    switch (protocolService) {
      case TiposProtocoloEnum.certidao.toString():
        this.protocolType = TiposProtocoloEnum.certidao.toString();
        this.getCertidaoDetails();
        this.protocolTypeName = 'Certidão';
        break;
      case TiposProtocoloEnum.exameCalculo.toString():
        this.protocolType = TiposProtocoloEnum.exameCalculo.toString();
        this.getExameCalculoDetails();
        this.protocolTypeName = 'Exame e Cálculo';
        break;
      case TiposProtocoloEnum.prenotacao.toString():
        this.protocolType = TiposProtocoloEnum.prenotacao.toString();
        this.getPrenotacaoDetails();
        this.protocolTypeName = 'Prenotação';
        break;
      default:
        console.log('Tipo de consulta ausente!');
        break;
    }
  }

  /*
  Method that get Prenotacao details
  */
  async getCertidaoDetails() {
    const loader = await this.loadingCtrl.create({});

    const dataProtocol = {
      numero: this.protocolNumber,
      senha: this.protocolPass,
    };

    loader.present();

    //POST API consultas/CertidaoPublico
    const headers = { 'Content-Type': 'application/json; charset=utf8' };
    this.httpClient
      .post(
        environment.appSettings.API_ENDPOINT + 'consultas/CertidaoPublico',
        dataProtocol,
        { headers }
      )
      .subscribe({
        next: (response: any) => {
          this.tituloModel = response;

          if (this.tituloModel !== undefined) {
            this.formatValores();

            this.tituloModel.Andamentos.forEach((andamento) => {
              if (andamento.Nota != null) {
                let dict: NotaDevolutivaDict[] = [];
                andamento.Nota.NotaDevolutiva.forEach((notadevolutiva) => {
                  let array = {
                    index: notadevolutiva[0],
                    descricao: notadevolutiva[1],
                  };
                  dict.push(array);
                });
                andamento.Nota.NotaDevolutivaDict = dict;
              }
            });

            loader.dismiss().then(() => this.salvarAutomatico());

            //Last Andamento from título
            if (response.Andamentos.length > 0) {
              this.lastActivities =
                response.Andamentos[response.Andamentos.length - 1];
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          loader.dismiss();
          this.protocolConsultErrorView = true;
          console.log('Falha na consulta da certidão : ' + JSON.stringify(err));
        },
      });
  }

  /*
  Method that get Prenotacao details
  */
  async getPrenotacaoDetails() {
    const loader = await this.loadingCtrl.create({});

    const dataProtocol = {
      numero: this.protocolNumber,
      senha: this.protocolPass,
    };

    loader.present();

    //POST API consultas/CertidaoPublico
    const headers = { 'Content-Type': 'application/json; charset=utf8' };
    this.httpClient
      .post(
        environment.appSettings.API_ENDPOINT + 'consultas/PrenotacaoPublico',
        dataProtocol,
        { headers }
      )
      .subscribe({
        next: (response: any) => {
          this.tituloModel = response;

          if (this.tituloModel !== undefined) {
            this.formatValores();

            this.tituloModel.Andamentos.forEach((andamento) => {
              if (andamento.Nota != null) {
                let test: NotaDevolutivaDict[] = [];
                andamento.Nota.NotaDevolutiva.forEach((notadevolutiva) => {
                  let array = {
                    index: notadevolutiva[0],
                    descricao: notadevolutiva[1],
                  };
                  test.push(array);
                });
                andamento.Nota.NotaDevolutivaDict = test;
              }
            });

            loader.dismiss().then(() => this.salvarAutomatico());

            //Last Andamento from título
            if (response.Andamentos.length > 0) {
              this.lastActivities =
                response.Andamentos[response.Andamentos.length - 1];
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          loader.dismiss();
          console.log(
            'Falha na consulta da prenotação : ' + JSON.stringify(err)
          );
          this.protocolConsultErrorView = true;
        },
      });
  }

  /*
  Method that get Prenotacao details
  */
  async getExameCalculoDetails() {
    const loader = await this.loadingCtrl.create({});

    const dataProtocol = {
      numero: this.protocolNumber,
      senha: this.protocolPass,
    };

    loader.present();

    //POST API consultas/ExameCalculoPublico
    const headers = { 'Content-Type': 'application/json; charset=utf8' };
    this.httpClient
      .post(
        environment.appSettings.API_ENDPOINT + 'consultas/ExameCalculoPublico',
        dataProtocol,
        { headers }
      )
      .subscribe({
        next: (response: any) => {
          this.tituloModel = response;

          if (this.tituloModel !== undefined) {
            this.formatValores();

            this.tituloModel.Andamentos.forEach((andamento) => {
              if (andamento.Nota != null) {
                const test: NotaDevolutivaDict[] = [];
                andamento.Nota.NotaDevolutiva.forEach((notadevolutiva) => {
                  const array = {
                    index: notadevolutiva[0],
                    descricao: notadevolutiva[1],
                  };
                  test.push(array);
                });
                andamento.Nota.NotaDevolutivaDict = test;
              }
            });

            loader.dismiss().then(() => this.salvarAutomatico());

            //Last Andamento from título
            if (response.Andamentos.length > 0) {
              this.lastActivities =
                response.Andamentos[response.Andamentos.length - 1];
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          loader.dismiss();
          this.protocolConsultErrorView = true;
          console.log(
            'Falha na consulta do Exame e Calculo: ' + JSON.stringify(err)
          );
        },
      });
  }

  //formata os valores para 2 casas decimais e substitui '.' por ','
  formatValores() {
    //console.log(this.tituloModel.ValorDeposito)
    let temp = String(this.tituloModel.ValorDeposito.toFixed(2));
    this.tituloModel.ValorDeposito = temp.replace('.', ',');
    //console.log(this.tituloModel.ValorDeposito)
    //console.log(this.tituloModel.ValorCustas)
    temp = String(this.tituloModel.ValorCustas.toFixed(2));
    this.tituloModel.ValorCustas = temp.replace('.', ',');
    //console.log(this.tituloModel.ValorCustas)
  }

  async getPDF(url: string, filename: string) {
    //loader para sinalizar o usuário
    const loading = await this.loadingCtrl.create({
      message: 'Carregando o anexo...',
    });

    loading.present();

    /*   ******  EXEMPLO IMPORTANTE - NÃO APAGAR
    setTimeout(() => {
      this.pdfService.getPDF(url)
        .subscribe(
          (data: Blob) => {
            loading.dismiss();
            const file = new Blob([data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);

            // if you want to open PDF in new tab
            window.open(fileURL);
            const a       = document.createElement('a');
            a.href        = fileURL;
            a.target      = '_blank';
            a.download    = filename + '.pdf';
            document.body.appendChild(a);
            a.click();
          },
          (error) => {
            loading.dismiss();
            console.log('getPDF error: ',error);
          }
        );
    }, 3000);
    */

    setTimeout(() => {
      this.pdfService
        .getPDFFromHTTPResponse(
          this.protocolType,
          url,
          localStorage.getItem('token')
        )
        .then((pdf) => {
          if (pdf.ok === undefined || pdf.ok) {
            //const source = `data:application/pdf;base64,${pdf.fileContents}`;
            //const link = document.createElement('a');
            //link.href = source;
            //link.download = `${filename}.pdf`;
            //link.click();

            // create a download anchor tag
            const downloadLink = document.createElement('a');
            downloadLink.target = '_blank';
            downloadLink.download = `${filename}.pdf`;

            // Decode Base64 string
            const decodedData = window.atob(pdf.fileContents);

            // Create UNIT8ARRAY of size same as row data length
            const uInt8Array = new Uint8Array(decodedData.length);

            // Insert all character code into uInt8Array
            for (let i = 0; i < decodedData.length; ++i) {
              uInt8Array[i] = decodedData.charCodeAt(i);
            }

            // Return BLOB image after conversion
            const blob = new Blob([uInt8Array], { type: 'application/pdf' });

            // create an object URL from the Blob
            const URL = window.URL || window.webkitURL;
            const downloadUrl = URL.createObjectURL(blob);

            // set object URL as the anchor's href
            downloadLink.href = downloadUrl;

            // append the anchor to document body
            document.body.appendChild(downloadLink);

            // fire a click event on the anchor
            downloadLink.click();

            //window.open(downloadUrl, '_blank', '');

            if (this.platform.is('android')) {
              this.alerts.showAlert(
                'Download Iniciado!',
                'Verifique se está sendo baixado em segundo plano'
              );
            }
          } else {
            this.alerts.showAlert(
              'Alerta!',
              'Status: ' + pdf.status + ' - ' + pdf.error
            );
          }
          loading.dismiss();
        });
    }, 3000);
  }

  //verificação se o protocolo deve ser salvo de inicio
  async salvarAutomatico() {
    if (this.inDoAssociation === 'true') {
      if (this.isRegistred === false) {
        this.alertaSalvo();
      }
    }
  }

  //confirmacao para salvar protocolo na conta
  async alertaSalvo() {
    if (this.isLogged === false) {
      const alert = await this.alertController.create({
        header: "Faça login para salvar o protocolo em 'Meus Protocolos'",
        cssClass: 'buttonCss',
        buttons: [{ text: 'Ok' }],
      });

      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Deseja associar o protocolo a conta?',
        cssClass: 'buttonCss',
        buttons: [
          { text: 'Não' },
          {
            text: 'Sim',
            handler: async () => {
              await this.adicionaProtocolo();
              this.confirmaSalvo();
            },
          },
        ],
      });

      await alert.present();
    }
  }

  adicionaProtocolo() {
    this.protocolService.postAssociationProtocolAccount(
      localStorage.getItem('token'),
      this.protocolNumber,
      this.protocolPass,
      this.protocolType,
      this.tituloModel.Natureza,
      this.tituloModel.NomeApresentante,
      this.lastActivities.Descricao,
      this.lastActivities.DataAndamento
    );
    this.isRegistred = true;
  }

  //confirmacao de protocolo salvo
  async confirmaSalvo() {
    const alert = await this.alertController.create({
      header: 'Protocolo associado a conta com sucesso!',
      cssClass: 'buttonCss',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            //window.location.reload();
            this.ngOnInit(); //Chama novamente o ngInit resolvendo o Lazy Loading
          },
        },
      ],
    });
    await alert.present();
  }

  //Função para inverter a ordem de mostragem dos andamentos
  async orderList() {
    this.tituloModel.Andamentos.reverse();
  }

  atualizar(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  segmentChanged(ev: any) {
    this.nav_selected = ev.detail['value'];
  }

  navigateTo(url) {
    window.open(url, '_blank');
  }

  //compartilhar link do protocolo atual
  share() {
    // if (!this.shareService.canShare()) {
    //   alert(`Seu navagador não suporta a função de compartilhar`);
    //   return;
    // }
    // let url = this.routeCtrl.url
    // var end = url.lastIndexOf('/') +1;
    // url =  url.substring(0,end);
    // this.shareService.share({
    //   title: 'Compartilhar Protocolo',
    //   text: 'Esse é o protocolo ' + this.protocolNumber + ', de natureza: '+ this.tituloModel.Natureza,
    //   url: '/#' + url + 'false'
    // }).then(response => {
    //   console.log(response);
    // })
    // .catch(error => {
    //   console.log(error);
    // });
  }

  //gerar pdf do protocolo
  async generatePDF() {
    //imprime a partir do html
    //coleta do html
    var node = document.getElementById('pdfProtocolo');
    var conteudo = node?.innerHTML;

    /*var body = [];
    var titulos = [{text: 'Descrição', style: 'tableHeader'},{text: 'Data', style: 'tableHeader'}, {text: 'Observação', style: 'tableHeader'}];
    body.push(titulos);
    if (this.tituloModel !== undefined){
      this.tituloModel.Andamentos.slice().reverse().forEach(andamento => {
        const tableRow = [];
        tableRow.push(andamento.Descricao);
        var date = new Date(andamento.DataAndamento);
        var ds = date.toLocaleDateString();
        tableRow.push(ds);
        if(andamento.Nota){
          andamento.Nota.NotaDevolutivaDict.forEach(devolutiva => {
            tableRow.push(andamento.Observacao + '\n' + devolutiva.descricao);
          });
        }else{
          tableRow.push(andamento.Observacao);
        }
        body.push(tableRow);
      })
    };

    const tableColumnWidths = [100, 'auto', 300];*/

    //base do pdf
    const dd = {
      info: {
        title: 'protocolo_' + this.protocolNumber + '.pdf',
        filename: 'protocolo_' + this.protocolNumber + '.pdf',
      },
      content: [
        {
          image: await this.converter('../../assets/img/logo.png'),
          width: 150,
          alignment: 'center',
        },
        '\n',
        htmlToText(conteudo),
        /*{
          style: 'tableExemplo',
           table: {
            headerRows: 1,
            widths: tableColumnWidths,

            body: body
          }
        } */
      ] /*, styles: {
         tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 14,
          color: 'black',
          alignment: 'center'
        }
      }*/,
    };

    //pdfMake.createPdf(dd).open();
    pdfMake.createPdf(dd).download(this.protocolNumber + '.pdf');
  }

  //função para converter a imagem e mostra-la no pdf
  converter(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }

  //confirmacao para a remocao de protocolo da conta
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Tem certeza que deseja desassociar esse protocolo?',
      cssClass: 'buttonCss',
      buttons: [
        { text: 'Não' },
        {
          text: 'Sim',
          cssClass: 'confirma',
          handler: () => {
            this.deletaProtocolo();
          },
        },
      ],
    });
    await alert.present();
  }

  //remove protocolo da conta do usuario
  deletaProtocolo() {
    this.componentLista.arrayProtocolos.forEach((element) => {
      if (
        element.dsNumeroProtocolo === this.protocolNumber &&
        element.idTipoTitulo.toString() === this.protocolType
      ) {
        this.protocolService.postDesassociationProtocolAccount(
          localStorage.getItem('token'),
          element.dsNumeroProtocolo,
          element.idTipoTitulo
        );
        this.isRegistred = false;
        this.alertaRemovido();
      }
    });
  }

  //confirmacao de remocao de protocolo da conta
  async alertaRemovido() {
    const alert = await this.alertController.create({
      header: 'Protocolo desassociado a conta com sucesso!',
      cssClass: 'buttonCss',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.componentLista.updateUserProtocols();
            this.ngOnInit(); //Chama novamente o ngInit resolvendo o Lazy Loading
            //this.routeCtrl.navigate(['/app/meusprotocolos'])
          },
        },
      ],
    });

    await alert.present();
  }
}
