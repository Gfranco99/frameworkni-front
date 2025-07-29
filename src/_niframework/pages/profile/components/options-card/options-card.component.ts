/*eslint-disable*/ 
import { Component, OnInit, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OptionsModalComponent } from '../options-modal/options-modal.component';
import { SystemProfilesService } from 'src/_niframework/services/system-profiles/user-profiles.service';
import { GroupService } from 'src/_niframework/services/group/group.service';
import { PermissionsService } from 'src/_niframework/services/permissions/permissions.service';
import { ToasterService } from 'src/_niframework/services/toaster/toaster.service';
// import { LoaderService } from 'src/_niframework/services/loader/loader.service';
import { SharedService } from 'src/_niframework/services/shared/shared.service';
import { Subscription } from 'rxjs';
import { Loader } from 'src/_niframework/providers/loader/loader';

@Component({
  selector: 'app-options-card',
  templateUrl: './options-card.component.html',
  styleUrls: ['./options-card.component.scss'],
})
export class OptionsCardComponent implements OnInit {

  // atributos utilizados para gerar notificação caso dados não estejam salvos
  // *******************************************************************************//
  updateChanges: Subscription;
  cleanChanges: Subscription;
  changes: boolean = false;
  getCurrentDataAttributes: boolean = true;
  initialValues: any = [];
  // *******************************************************************************//
  
  @Input() unlockFunctions: boolean = false;
  @Input() keyNameItem: string;
  @Input() keyDescriptionItem: any;
  @Input() idElement: any;
  @Input() currentDataAttributes: any = []; //atributos atuais do usuário
  @Input() itemsFromDataBaseToModal = [];
  @Input() cardTitle: string = "";
  @Input() currentUser = [];
    
  constructor(
    public modalController: ModalController,
    private systemProfilesService : SystemProfilesService,
    private groupService: GroupService,
    private permissionsService: PermissionsService,
    private toast: ToasterService,
    private loader: Loader,
    private sharedService: SharedService
    ) {
      this.updateChanges = sharedService.getRequestChanges().subscribe(res => {
        this.attributesChanges();
      })

      this.cleanChanges = sharedService.getCleanChanges().subscribe(res => {
        this.attributesChanges('end');
      })
    }

  ngOnInit() {
  }

  // Modal com checklist para adicionar ou remover itens do card
  async editCategory() {
    this.attributesChanges();

    const modal = await this.modalController.create({
      component: OptionsModalComponent,
      componentProps: {
        itemsFromDataBaseToModal: this.itemsFromDataBaseToModal, //lista de itens do back
        itemsCard: this.currentDataAttributes, //itens adicionados
        idElement: this.idElement,
        keyNameItem: this.keyNameItem,
        keyDescription:  this.keyDescriptionItem,
        title: this.cardTitle,
      },

      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }

  // salva as alterações realizadas no card
  saveData(): void {

    this.loader.present("Salvando as alterações").then(() => {
      
      let idUser = this.currentUser['codigoUsuario'];
      let stringRequest = "";
      // let fullDataTemp = []
      
      switch (this.idElement) {
  
  
        case 'idPerfil':
          this.currentDataAttributes.forEach(el => {
            stringRequest += "&idPerfil=" + el.idPerfil   
          })
  
          this.systemProfilesService.setProfileToUser(idUser, stringRequest).then(response => {
            this.attributesChanges('end');
            this.presentToaster(true);
          }).catch(err => {
            this.presentToaster(false);
          })
          break;
  
        case 'idGrupo':
          this.currentDataAttributes.forEach(el => {
            stringRequest += "&idGrupo=" + el.idGrupo   
          })
  
          this.groupService.setGroupToUser(idUser, stringRequest)
          .then(response => {
            this.attributesChanges('end');
          this.presentToaster(true);
          
          }).catch(err => {
            this.presentToaster(false);
          })
          break;
  
        case 'idPermissao':
          this.currentDataAttributes.forEach(el => {
            stringRequest += "&idPermissao=" + el.idPermissao   
          })
  
          this.permissionsService.setPermissionsToUser(idUser, stringRequest)
          .then(response => {
            this.attributesChanges('end');
            this.presentToaster(true);
          
          }).catch(err => {
            this.presentToaster(false)
          })
          break;
          
          default:
            break;
      }
    }).then(() => {
      this.loader.loadingController.dismiss();
    })

  }

  // apresenta notificação para salvar dados alterados no card
  attributesChanges(options?: string):void {
    
    if(options === 'end') {
      length = this.initialValues.length
      this.getCurrentDataAttributes = true;
      this.changes = false;
      this.initialValues.splice(0, length);
      return;
    }

    if(this.getCurrentDataAttributes) {
      this.initialValues = [...this.currentDataAttributes]
      this.getCurrentDataAttributes = false
    }

    // ordena pelo ID antes de comparar as arrays
    let a = this.initialValues.sort((a, b) => a[this.idElement] - b[this.idElement]);
    let b = this.currentDataAttributes.sort((a, b) => a[this.idElement] - b[this.idElement]);

    if(JSON.stringify(a) === JSON.stringify(b)) {
      this.changes = false;
      return

    } else {
      this.changes = true;
      return;
    }
    
  }
  
  // informa a situação após tentar salvar os dados
  presentToaster(situation: boolean): void {
    if(situation) {
      this.toast.presentToast("Alterações salvas com sucesso", "success", 2);
    } else {
      this.toast.presentToast("Ocorreu uma falha", "danger", 2);
    }
  }
  
};
