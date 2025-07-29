/* eslint-disable*/
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SharedService } from 'src/_niframework/services/shared/shared.service';

@Component({
  selector: 'app-options-modal',
  templateUrl: './options-modal.component.html',
  styleUrls: ['./options-modal.component.scss'],
})
export class OptionsModalComponent implements OnInit {   
  @Input() pendingItemsToSave: number = 0;
  @Input() keyNameItem: any;
  @Input() keyDescription: any;
  @Input() idElement: any;
  @Input() itemsFromDataBaseToModal = [];
  @Input() itemsCard: any = [];
  @Input() title: string;

  constructor(
    public modalController: ModalController,
    private sharedService: SharedService
    ) { }

  ngOnInit() {}
  
  // verifica o item selecionado e adiciona ou remove caso já exista na lista
  checkItem(obj: any) {
    
    let existsOnList = this.itemsCard
    .filter(el => el[this.idElement] === obj[this.idElement]);
    existsOnList.length > 0? this.deleteData(obj) : this.addData(obj);
  }

  // adiciona items ao usuário
  addData(obj: any) {
    this.checked(obj)
    this.itemsCard.push(obj)

  }

  // remove items do usuário
  deleteData(obj: any) {
    this.checked(obj)
    let copytArray = [...this.itemsCard];
    let indexObj = copytArray.findIndex(x => x[this.idElement] === obj[this.idElement]);
    copytArray.splice(indexObj, 1)
    this.itemsCard.splice(0, this.itemsCard.length)
    for(let i of copytArray) {
      this.itemsCard.push(i)
    }

  }
  
  // condição para marcar o checkbox
  checked(element: any) {
    let check = this.itemsCard
    .findIndex(x => x[this.idElement] === element[this.idElement])
    return check !== -1? true : false
  }
  
  closeModal(): void{
    this.modalController.dismiss();
    
    this.sharedService.sendUpdateChanges();
    this.sharedService.sendUpdateChanges(); // informa que houve mudanças
    
    
  }

}
