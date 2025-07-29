import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { PopoverController, ModalController, LoadingController } from '@ionic/angular';
import { PopoverComponent } from '../components/popover/popover.component';

import { UserProtocolsComponent } from '../components/user-protocols/user-protocols.component';
import { ModalFiltroComponent } from '../components/modal-filtro/modal-filtro.component';
import { ProtocoloConsultaPage } from '../protocolo-consulta/protocolo-consulta.page';
import { MobileService } from 'src/_niframework/services/mobile/mobile.service';


@Component({
  selector: 'app-protocolo-lista',
  templateUrl: './protocolo-lista.page.html',
  styleUrls: ['./protocolo-lista.page.scss'],
})
export class ProtocoloListaPage implements OnInit {

  public isLogged;
  public isMobileDevice = false;

  @ViewChild(UserProtocolsComponent) userProt
  @ViewChild(PopoverComponent) pop


  constructor(
    private routeCtrl: Router,
    private alerts: AlertsProvider,
    private popCtrl: PopoverController,
    private modalCtrl: ModalController,
    private protocolo: ProtocoloConsultaPage,
    private mobile: MobileService
  ) { }

  ngOnInit() {

    //Valida se o usuário está logado
    this.isLogged = (localStorage.getItem('currentUser') != null);

    if (!this.isLogged) {
      this.alerts.showAlert('ATENÇÃO', 'Faça o login no aplicativo.');
      this.routeCtrl.navigate(['/login']);
    }

    this.mobile.checkIfMobile();
    this.isMobileDevice = this.mobile.isMobileDevice;

  }

  atualizar(event){
    setTimeout(()=>{
      event.target.complete();
    },2000);
  }

  //vai para a tela de adicionar protocolos
  goAdicionarProtocolo() {
      this.routeCtrl.navigate(['/app/protocolo'], { queryParams: { add: true } }).then(() => {
        this.protocolo.ngOnInit();
      });
  }

  //APENAS EM MOBILE, exibe as opções do canto superior direito
  async presentPopover(ev: any) {
    const popover = await this.popCtrl.create({
      component: PopoverComponent,
      cssClass: 'pop-meusProtocolos',
      event: ev,
      translucent: true
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();
    if(data === "add"){
      this.goAdicionarProtocolo();
    } else if(data === "filter") {
      this.orderList();
    } else if(data === "remove"){
      this.remove();
    }

  }

  //modal de filtro
  async orderList(){
    const modal = await this.modalCtrl.create({ //modal de confirmação
      component: ModalFiltroComponent,
      cssClass: 'modal-verifica'
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log(data)
    this.userProt.orderList(data);
  }

  //remover
  async remove(){
    this.userProt.presentAlert();
  }


}
