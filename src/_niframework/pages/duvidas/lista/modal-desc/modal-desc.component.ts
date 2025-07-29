import { Component, Input, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import htmltoText from 'html-to-pdfmake';
import { Duvida } from 'src/_niframework/models/duvidas-model';
import { Router } from '@angular/router';
import { Loader } from 'src/_niframework/providers/loader/loader';
import { ContatoService } from 'src/_niframework/services/contato/contato.service';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { AlertController, ModalController } from '@ionic/angular';
import { MobileService } from 'src/_niframework/services/mobile/mobile.service';

@Component({
  selector: 'app-modal-desc',
  templateUrl: './modal-desc.component.html',
  styleUrls: ['./modal-desc.component.scss'],
})
export class ModalDescComponent implements OnInit {
  @Input() duvida: Duvida;
  emailTo: string;
  public isMobileDevice = false;

  constructor(
    private navCtrl: Router,
    private loader: Loader,
    private contatoService: ContatoService,
    private alerts: AlertsProvider,
    private modalCtrl: ModalController,
    private mobile: MobileService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.mobile.checkIfMobile();
    this.isMobileDevice = this.mobile.isMobileDevice;
  }

  async sendEmail() {
    await this.loader.present().then(async () => {
      const email = {
        id: this.duvida.Id,
        pergunta: this.duvida.Pergunta,
        texto: this.duvida.Texto,
        tipoDuvidaDescricao: this.duvida.TipoDuvida.Descricao,
        tipoDuvidaId: this.duvida.TipoDuvidaId,
        titulo: this.duvida.Titulo,
        emailDestinatario: this.emailTo,
      };

      await this.contatoService.sendEmailFAQ(email, () => {
        this.alerts.showAlert('Sucesso', 'E-mail enviado com sucesso!');
        this.loader.dismiss();
      });
    });
  }

  compartilhar() {
    var texto = document.createElement('span');
    texto.innerHTML = this.duvida.Texto;

    let share = {
      title: 'Dúvidas Frequentes - ' + this.duvida.Titulo,
      text:
        this.duvida.Pergunta +
        '\n\n' +
        texto.innerText +
        '\n Para mais informações ou qualquer outra dúvida acessar:',
      url: '#' + this.navCtrl.url,
    }

    console.log(share)

    if (!navigator.canShare(share)) {
      // alert(`Seu navegador não suporta a função de compartilhar`);
      this.alerts.showAlert("Atenção!", "Seu navegador não suporta a função de compartilhar");
      return;
    }

    navigator
      .share(share)
      .then((response) => {
        this.alerts.showAlert("Boa!", "Deu certo!");
      })
      .catch((error) => {
        // console.log(error);
        this.alerts.showAlert("Ops!", "Deu errado");
      });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'buttonCss',
      header: 'Insira o destinatário',
      inputs:[
        {
          name: 'email',
          type: 'email',
        }
      ],
      buttons: [{
        text: 'Continue',
        handler: username => {
          if (typeof username != null) {
            let validateObj = this.contatoService.validateEmail(username);

            if (!validateObj.isValid) {
              this.alerts.showAlert("Erro", "Endereço de email inválido");
              return false;
            } else {
              this.emailTo = username.email;
              console.log(this.emailTo);
              this.sendEmail();
            }
          }
        }
      }]
    })

    await alert.present();
  }

  async print() {
    var node = document.getElementById('pdfDuvida');
    var conteudo = node!.innerHTML;

    const dd = {
      info: {
        title: this.duvida.Pergunta,
        filename: this.duvida.Pergunta + '.pdf'
      },
      content:[
        {
          image: await this.converter('../../assets/img/logo.png'),
          width: 150,
          alignment: 'center'
        },
        '\n',
        htmltoText(conteudo),
        '\n',
      ]
    }

    pdfMake.createPdf(dd).download(this.duvida.Pergunta + '.pdf');
  }

  converter(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    })
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
