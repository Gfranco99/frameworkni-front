import { Utils } from 'src/_niframework/providers/utils/utils-functions';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { ContatoService } from 'src/_niframework/services/contato/contato.service';

@Component({
  selector: '_niframework-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  public duvida: FormGroup;

  constructor(
    private navCtrl: Router,
    private formBuilder: FormBuilder,
    private contatoService: ContatoService,
    private alerts: AlertsProvider,
    public utils: Utils
  ) { }

  ngOnInit() {
    //formulario para cadastro
    this.duvida = this.formBuilder.group({
      'nome': [null, Validators.compose([
        Validators.required
      ])],
      'email': [null, Validators.compose([
        Validators.required,
        Validators.pattern('[A-Za-z0-9._%+-]{1,}@[a-zA-Z-_.]{2,}[.]{1}[a-zA-Z]{2,}')
      ])],
      'telefone': ['', Validators.compose([
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(15)
      ])],
      'pergunta': [null, Validators.compose([
        Validators.required
        // Validators.pattern('[A-Za-z0-9. ,?]{5,}[?]{0,}')
      ])],
    });

  }

  //Envia email de contato
  async sendEmailContato(){

    const email = {
      nome: this.duvida.controls['nome'].value,
      email: this.duvida.controls['email'].value,
      telefone: this.duvida.controls['telefone'].value.replace('(', '').replace(')', '').replace('-', ''),
      tipoContato: 'DÚVIDAS',
      protocolo: 0,
      descricao: this.duvida.controls['pergunta'].value
    };

    await this.contatoService.sendEmailContato(email, 
      ()=>{this.alerts.showAlert('Sucesso', 'E-mail enviado com sucesso!');}, 
      ()=>{this.alerts.showAlert('Erro', 'Ocorreu um erro no envio do e-mail.')});
  }

  //cancelar cadastro
  close(){
    this.navCtrl.navigate(['/_niframework/duvidas']);
  }

}
