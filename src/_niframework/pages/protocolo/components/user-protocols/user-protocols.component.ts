// import { element } from 'protractor';
import { protocoloResponseModel } from './../../../../models/protocol.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
// import { AppSettings } from 'src/_niframework/config/appSettings';
import { ProtocolService } from 'src/_niframework/services/protocol/protocol.service';
import { ModalFiltroComponent } from '../modal-filtro/modal-filtro.component';

// import { meusProtocolosModel } from 'src/_niframework/models/protocol.model';
import { meusProtocolosModel } from './../../../../models/protocol.model';

import { ListarCertidaoComponent } from '../listarCertidao/listarCertidao.component';
import { UserService } from 'src/_niframework/services/user/user.service';
// import { identifierModuleUrl } from '@angular/compiler';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-protocols',
  templateUrl: './user-protocols.component.html',
  styleUrls: ['./user-protocols.component.scss'],
})
export class UserProtocolsComponent implements OnInit {
  /** ATTRIBUTES

  size -  define a quantidade a ser mostrada-->
  custom -
    1 - Os protocolos com mudanças de estado mais recentes e data descrecente de registro
    2- Os protocolos por ordem de data decrescente de registro
    3- Protocolos por estado
  */

  @Input() public searchParam: boolean;
  @Input() public size: number;
  @Input() public custom: number;
  @Output() ocultaElemento = new EventEmitter();

  // Filtro e Pesquisa
  public search: any[];
  public filterSearch: any[];
  public clear: string;
  public idUser: number;

  public sizeProtocolo = 0;
  public sizeAgendamento = 0;
  public sizeCertidao = 0;

  //Ordenação
  public ordem = [
    'ORDEM PADRÃO',
    'ADICIONADO RECENTEMENTE',
    'DATA ATUALIZADO',
    'STATUS ANDAMENTO',
  ];

  //Protocolos registrados na conta do usuário
  public arrayProtocolos: any[] = [];
  public hasProtocol = false;

  constructor(
    private routeCtrl: Router,
    private http: HttpClient,
    public alertController: AlertController,
    private protocolService: ProtocolService,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private userservice: UserService
  ) {}

  async ngOnInit() {
    //SearchParam mesmo não sendo colocado no codigo com undefined a barra de pesquisa vai ficar oculta na home
    if (this.searchParam === undefined) {
      this.searchParam = false;
    }

    //Chamada do back-end para consultar protocolos da lista na barra de pesquisa
    this.search = this.arrayProtocolos;
    this.filterSearch = this.search;

    //console.log(this.arrayProtocolos)

    //Consulta no back os protocolos do usuário somente se estiver logado
    if (localStorage.getItem('currentUser') != null) {
      //await this.getProtocolFromUser();
      await this.getProcessosFromUser();
    }

    localStorage.setItem('volta', '/app/meusprotocolos');
    localStorage.removeItem('baseQRCode');
    localStorage.removeItem('txtQRCode');
  }

  /**  METHODS */

  /*Função para atualizar os protocolos registrados na conta do usuário no componente */
  updateUserProtocols() {
    this.hasProtocol = this.arrayProtocolos.length > 0;

    if (this.arrayProtocolos) {
      //Tratamento do Input 'size'
      if (this.size === 0) {
        if (this.arrayProtocolos.length) {
          this.size = this.arrayProtocolos.length;
        }
      }

      //Define quando tiver protocolos ele mostrar botão ver mais, se não tiver protocolos ele deve ser oculto
      if (this.arrayProtocolos.length === 0) {
        this.ocultaElemento.emit({ ocultar: 'false' });
      } else {
        this.ocultaElemento.emit({ ocultar: 'true' });
      }
    }
  }

  /*Função para tratar o filtro de protocolos pelo atributo 'número do protocolo'  */
  async filterList(event: any) {
    this.search = this.arrayProtocolos;
    const searchTerm = event.srcElement.value;

    if (searchTerm) {
      this.search = this.search.filter((item: any): any => {
        if (item.dsNumero && searchTerm) {
          return item.dsNumero.indexOf(searchTerm.toLowerCase()) > -1;
        }
      });
    }
  }

  /*Função para recuperar os protocolos do usuário via API */
  /*async getProtocolFromUser() {
    const loading = await this.loadingCtrl.create({
      duration: 8000
    });

    //chama o back
    return new Promise((resolve, reject) => {
      //POST /api/Processo/ListarProtocolosPorUsuario
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Token ' + localStorage.getItem('token')
        }),
      };
      this.http.get(environment.appSettings.API_ENDPOINT + 'Processo/ListarProtocolosPorUsuario', httpOptions)
        .subscribe(
          (response: any[]) => {
              response.forEach(element => {

                //Adaptação para URL base64
                element.dsSenha = encodeURIComponent(element.dsSenha);

                this.arrayProtocolos.push(element);
              });
              resolve(true)
              this.updateUserProtocols();
              loading.dismiss();
        },
          (err: HttpErrorResponse) => {
            console.log('Erro ao recuperar os protocolos do usuário: ' + JSON.stringify(err));
            resolve(null);
          }
        );
         loading.present();

    });

  }*/

  async getProcessosFromUser() {
    const loading = await this.loadingCtrl.create({
      duration: 8000,
    });

    //chama o back
    return new Promise((resolve, reject) => {
      //POST /api/Processo/ListarProtocolosPorUsuario
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Token ' + localStorage.getItem('token'),
        }),
      };
      this.http
        .get(
          environment.appSettings.API_ENDPOINT +
            'Processo/ListarMeusProtocolos',
          httpOptions
        )
        .subscribe({
          next: (response: any) => {
            response.listaProtocolo.forEach((element: any) => {
              //Adaptação para URL base64
              element.dsSenha = encodeURIComponent(element.dsSenha);

              this.arrayProtocolos.push(element);
              this.sizeProtocolo += 1;
            });

            this.sizeAgendamento = this.sizeProtocolo;

            response.listaAgendamento.forEach((element: any) => {
              this.arrayProtocolos.push(element);
              this.sizeAgendamento += 1;
            });

            this.sizeCertidao = this.sizeAgendamento;

            response.listaCertidao.forEach((element: any) => {
              //Adaptação para URL base64
              element.dsSenhaProtocoloCartorio = encodeURIComponent(
                element.dsSenhaProtocoloCartorio
              );

              this.arrayProtocolos.push(element);
              this.sizeCertidao += 1;
            });

            //console.log(response);
            //console.log(this.arrayProtocolos);

            resolve(true);
            this.updateUserProtocols();
            loading.dismiss();
          },
          error: (err: HttpErrorResponse) => {
            console.log(
              'Erro ao recuperar os agendamentos do usuário: ' +
                JSON.stringify(err)
            );
            resolve(null);
          },
        });
      loading.present();
    });
  }

  async listarCertidoes(itens: any, protocolo: any, event: any) {
    event.preventDefault();
    //console.log(itens);
    const modal = await this.modalCtrl.create({
      //modal de confirmação
      component: ListarCertidaoComponent,
      componentProps: {
        dados: itens,
        nrProtocolo: protocolo,
      },
      cssClass: 'modal-detalhes',
    });
    await modal.present();
  }

  //Ordenação da lista de protocolos registrados
  orderList(ev: any) {
    let filter = ev.filtro;
    let order = ev.ordem;
    this.search = this.arrayProtocolos;
    //console.log(ev)
    //FILTRO
    //Caso deseje todos os processos
    if (filter === 'TODOS') {
      this.search.sort((a, b) => (a.id < b.id ? -1 : 1));
      this.search = this.arrayProtocolos;
      //console.log(this.arrayProtocolos);
    }

    if (filter === 'PROTOCOLO') {
      this.search.sort((a, b) => (a.id < b.id ? -1 : 1));
      this.search = this.arrayProtocolos.slice(0, this.sizeProtocolo);
    }

    if (filter === 'AGENDA') {
      this.search.sort((a, b) => (a.id < b.id ? -1 : 1));
      this.search = this.arrayProtocolos.slice(
        this.sizeProtocolo,
        this.sizeAgendamento
      );
    }

    if (filter === 'CERTIDAO') {
      this.search.sort((a, b) => (a.id < b.id ? -1 : 1));
      this.search = this.arrayProtocolos.slice(
        this.sizeAgendamento,
        this.sizeCertidao
      );
    }

    //ORDENACAO
    //Caso deseje organizar por ordem de incluido
    if (order === 'ORDEM PADRÃO') {
      this.search.sort((a, b) => (a.id < b.id ? -1 : 1));
      //console.log(this.arrayProtocolos);
    }
    //Caso deseje organizar por ordem de adicionados recentemente
    if (order === 'ADICIONADO RECENTEMENTE') {
      this.search.sort((b, a) => (a.id < b.id ? -1 : 1));
      //console.log(this.arrayProtocolos);
    }
    //Caso deseje organizar por ordem de data de alteração do status
    if (order === 'DATA ATUALIZADO') {
      this.arrayProtocolos.sort((b, a) =>
        a.dtAtualizacao < b.dtAtualizacao ? -1 : 1
      );
      this.arrayProtocolos.sort((b, a) =>
        a.dtAtualizacao < b.dtAgenda ? -1 : 1
      );
      this.arrayProtocolos.sort((b, a) => (a.dtAgenda < b.dtAgenda ? -1 : 1));
      //console.log(this.arrayProtocolos);
    }
    //Caso deseje organizar por ordem de status do andamento
    if (order === 'STATUS ANDAMENTO') {
      this.arrayProtocolos.sort((b, a): any => {
        //console.log("a: " + a.dsStatusAndamento + " || b: " + b.dsStatusAndamento)
        if (
          a.dsStatusAndamento === 'Retirado' &&
          b.dsStatusAndamento != 'Retirado'
        ) {
          //troca
          return -1;
        }

        if (
          a.dsStatusAndamento === 'Registrado' &&
          b.dsStatusAndamento === 'Pronto'
        ) {
          //troca
          return -1;
        }

        if (
          b.dsStatusAndamento === 'Registrado' &&
          a.dsStatusAndamento === 'Pronto'
        ) {
          //não troca
          return 1;
        }

        if (
          a.dsStatusAndamento === 'Registrado' &&
          b.dsStatusAndamento === 'Pronto Registrado'
        ) {
          //não troca
          return 1;
        }

        if (
          b.dsStatusAndamento === 'Registrado' &&
          a.dsStatusAndamento === 'Pronto Registrado'
        ) {
          //troca
          return -1;
        }

        if (
          a.dsStatusAndamento === 'Entrada' &&
          b.dsStatusAndamento === 'Pronto'
        ) {
          //não troca
          return 1;
        }

        if (
          b.dsStatusAndamento === 'Entrada' &&
          a.dsStatusAndamento === 'Pronto'
        ) {
          //troca
          return -1;
        }

        if (
          a.dsStatusAndamento === 'Registrado' &&
          b.dsStatusAndamento === 'Prenotado'
        ) {
          //troca
          return -1;
        }

        if (
          b.dsStatusAndamento === 'Registrado' &&
          a.dsStatusAndamento === 'Prenotado'
        ) {
          //não troca
          return 1;
        }

        if (
          a.dsStatusAndamento === 'Registrado' &&
          b.dsStatusAndamento === 'Entrada'
        ) {
          //troca
          return -1;
        }

        if (
          b.dsStatusAndamento === 'Registrado' &&
          a.dsStatusAndamento === 'Entrada'
        ) {
          //não troca
          return 1;
        }

        if (
          a.dsStatusAndamento === 'Entrada' &&
          b.dsStatusAndamento != 'Entrada'
        ) {
          //não troca
          return 1;
        }

        if (
          b.dsStatusAndamento === 'Entrada' &&
          a.dsStatusAndamento != 'Entrada'
        ) {
          //troca
          return -1;
        }

        if (
          a.dsStatusAndamento === 'Prenotado' &&
          b.dsStatusAndamento != 'Prenotado'
        ) {
          //não troca
          return 1;
        }

        if (
          b.dsStatusAndamento === 'Prenotado' &&
          a.dsStatusAndamento != 'Prenotado'
        ) {
          //troca
          return -1;
        }
      });
    }
  }

  //alerta para apagar múltiplos protocolos
  async presentAlert() {
    const loader = await this.loadingCtrl.create({});

    let value = 'retirados';
    const alert = await this.alertController.create({
      cssClass: 'buttonCss',
      header: 'Desassociar Múltiplos Protocolos ',
      message: 'Escolha o metodo para desassociar.',
      inputs: [
        {
          name: 'retirados',
          type: 'radio',
          label: 'Todos os Retirados',
          handler: () => {
            value = 'retirados';
            console.log('Checkbox 1 selected');
          },
          checked: true,
        },

        {
          name: 'data',
          type: 'radio',
          label: 'Com mais de 60 dias',
          handler: () => {
            value = 'data';
            console.log('Checkbox 2 selected');
          },
        },
      ],
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Confirmar',
          cssClass: 'confirma',
          handler: () => {
            console.log('confirmado');
            loader.present();
            for (let i = 0; i < this.arrayProtocolos.length; i++) {
              if (value === 'retirados') {
                if (this.arrayProtocolos[i].dsStatusAndamento === 'Retirado') {
                  //console.log('Removido ' + this.arrayProtocolos[i].dsNumero);
                  this.protocolService.postDesassociationProtocolAccount(
                    localStorage.getItem('token'),
                    this.arrayProtocolos[i].dsNumero,
                    this.arrayProtocolos[i].idTipoProtocolo
                  );
                }
              } else if (value === 'data') {
                //60 dias antes de hoje
                let data = new Date();
                data.setDate(data.getDate() - 60);
                console.log(
                  'protocolo: ' +
                    this.arrayProtocolos[i].dtAtualizacao +
                    ' || hoje: ' +
                    data.toISOString()
                );
                console.log(
                  this.arrayProtocolos[i].dtAtualizacao < data.toISOString()
                );
                if (
                  this.arrayProtocolos[i].dtAtualizacao < data.toISOString()
                ) {
                  //console.log('Removido ' + this.arrayProtocolos[i].dsNumero);
                  this.protocolService.postDesassociationProtocolAccount(
                    localStorage.getItem('token'),
                    this.arrayProtocolos[i].dsNumero,
                    this.arrayProtocolos[i].idTipoProtocolo
                  );
                }
              }
            }
            loader.dismiss().then(() => {
              this.alertaRemovido();
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async alertaRemovido() {
    const alert = await this.alertController.create({
      header: 'Protocolos desassociados a conta com sucesso!',
      cssClass: 'buttonCss',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.routeCtrl.navigate(['/app/meusprotocolos']).then(() => {
              window.location.reload();
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async goDetalhe(id: number) {
    const modal = await this.modalCtrl.create({
      //modal de confirmação
      component: ModalFiltroComponent,
      cssClass: 'modal-detalhes',
    });
    await modal.present();
  }

  pedidoPago(
    event: any,
    protocoloCartorio: any,
    senha: any,
    protocoloInterno: any
  ) {
    if (protocoloCartorio === '' && senha === '') {
      if (event.srcElement.classList.contains('button') === true) {
        return;
      }
      event.preventDefault();
      this.protocolService
        .getCertidaoUsuario(localStorage.getItem('token'), protocoloInterno)
        .then((dados) => {
          localStorage.setItem('baseQRCode', dados.pagamento.base64QRCode);
          localStorage.setItem('txtQRCode', dados.pagamento.txtQRCode);
          this.routeCtrl.navigate(['/app/pagamento/pix']);
        });
    }
  }
}
