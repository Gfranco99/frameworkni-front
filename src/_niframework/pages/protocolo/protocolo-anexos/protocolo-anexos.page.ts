import { PdfService } from './../../../services/protocol/pdf.service';
import { Component, OnInit, Input } from '@angular/core';
import { Anexo } from '../protocolo-detail/protocolo-detail.model';
import { LoadingController, Platform } from '@ionic/angular';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-protocolo-anexos',
  templateUrl: './protocolo-anexos.page.html',
  styleUrls: ['./protocolo-anexos.page.scss'],
})
export class ProtocoloAnexosPage implements OnInit {

  @Input() tituloModel: any
  anexosArray: Anexo[];
  autoClose = false;

  public protocolType

  constructor(
    private pdfService: PdfService,
    private loadingCtrl: LoadingController,
    private alerts: AlertsProvider,
    private inputRoute: ActivatedRoute,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.anexosArray = [];

    //Hash: environment.appSettings.API_ENDPOINT_ANEXOS + a["Hash"],

    this.tituloModel.Anexos[0].open = true;

    this.tituloModel.Anexos.forEach(a => {
      let obj = {
        Id: a["Id"],
        Hash: a["Hash"],
        Data: a["Data"],
        Descricao: a["Descricao"],
        NumeroRegistro: a["NumeroRegistro"],
        Sequencia: a["Sequencia"]
      };

      this.anexosArray.push(obj);

    });


    this.protocolType = this.inputRoute.snapshot.params.type;


    /*this.tituloModel.Andamentos.forEach(element => {
      if(element.Anexos != []){
        element.Anexos.forEach(a => {
        let obj = {
          Id: a["Id"],
          Hash: a["Hash"],
          Data: a["Data"],
          Descricao: a["Descricao"],
          NumeroRegistro: a["NumeroRegistro"],
          Sequencia: a["Sequencia"]
        };

        this.anexosArray.push(obj);
      });
    }
    });*/

  }


  async getPDF(url: string, filename: string){

    //loader para sinalizar o usuário
    const loading = await this.loadingCtrl.create({
      message: 'Carregando o anexo...'
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
      this.pdfService.getPDFFromHTTPResponse(this.protocolType, url, localStorage.getItem('token'))
      .then(pdf => {

        if (pdf.ok === undefined || pdf.ok){
          //const source = `data:application/pdf;base64,${pdf.fileContents}`;
          //const link = document.createElement('a');
          //link.href = source;
          //link.download = `${filename}.pdf`;
          //link.click();

          // create a download anchor tag
          const downloadLink = document.createElement('a');
          downloadLink.target   = '_blank';
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
            this.alerts.showAlert('Download Iniciado!', 'Verifique se está sendo baixado em segundo plano.');
          }
        }
        else {
          this.alerts.showAlert('Alerta!', 'Status: ' + pdf.status + ' - ' + pdf.error);
        }
        loading.dismiss();

      });
    }, 3000);
  }

  toggle(index){
    this.tituloModel.Andamentos[index].open = !this.tituloModel.Andamentos[index].open;
  }

}
