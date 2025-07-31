import { TiposProtocoloEnum } from './../../models/enum-protocolos';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { NoticiasComponent } from '../noticias/noticias/noticias.component';
import { ProtocoloConsultaPage } from '../protocolo/protocolo-consulta/protocolo-consulta.page';
import { MobileService } from 'src/_niframework/services/mobile/mobile.service';
import { Location } from '@angular/common';
import { ValidadocsServiceService } from 'src/_niframework/services/validadocs/validadocs.service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public dados: any = null;
  public retornoValidadocs: any = null;
  public certificados: string[] = [];
  public assinaturas: any[] = [];
  public todosCertificadosValidos: boolean = false;

  public showFullDetails: boolean = false;
  public showPreview: boolean = false;

  public formattedSignerNames: string = 'Não identificado'; // Valor padrão

  constructor(
    private navctrl: Router,
    private alerts: AlertsProvider,
    private noticiaComponent: NoticiasComponent,
    private protocolo: ProtocoloConsultaPage,
    private mobile: MobileService,
    private changeDetector: ChangeDetectorRef,
    private location: Location,
    private validadocsservice: ValidadocsServiceService
  ) {
    this.resetValidador();
  }

  ngOnInit() {
    // Coloque aqui qualquer inicialização que precise ser feita na criação do componente
  }

  ionViewWillEnter() {
    this.resetValidador();
  }

  resetValidador() {
    this.dados = null;
    this.retornoValidadocs = null;
    this.certificados = [];
    this.assinaturas = [];
    this.todosCertificadosValidos = false;
    this.showFullDetails = false;
    this.showPreview = false;
    this.formattedSignerNames = 'Não identificado'; // Resetar também
  }

  /* MÉTODO PARA LER E VALIDAR O DOCUMENTO VIA SERVIÇO */
  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) {
      this.alerts.showAlert('Erro', 'Nenhum arquivo selecionado.');
      return;
    }

     event.target.value = '';//Me permite selecionar o mesmo tipo de arquivo seguido 

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.vdoc') && !fileName.endsWith('.pdf')) {
      await this.alerts.showAlert('Atenção', 'Os arquivos selecionados não podem ser utilizados no sistema.');
      this.resetValidador(); // Reseta o estado para limpar qualquer dado anterior
      return; // Interrompe o processo para arquivos .vdoc
    }

    // O restante do código só será executado se o arquivo NÃO for .vdoc
    await this.alerts.showLoading('Validando documento...');

    try {

      if(fileName.endsWith('.vdoc')) {
         
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const json = JSON.parse(e.target.result);

            this.mostraNaTela(file, json);

          } catch (err) {
            console.error('Erro ao ler arquivo .vdoc', err);
            this.alerts.showAlert('Erro', 'O arquivo não está no formato esperado ou está corrompido.');
            this.resetValidador();
          }
        };
        reader.readAsText(file);
        
      }
      else if (fileName.endsWith('.pdf')){

        const jsonResponse = await this.validadocsservice.postPdf(file);

        console.log('DEBUG JSON PDF:', jsonResponse);

        this.retornoValidadocs = jsonResponse;
        console.log('Resposta da validação:', this.retornoValidadocs);

        this.mostraNaTela(file, jsonResponse);
      
      }    
      
      await this.alerts.dismissLoading();
      this.changeDetector.detectChanges();

    } catch (err: any) {
      console.error('❌ Erro ao validar documento:', err);
      await this.alerts.dismissLoading();

      let errorMessage = 'Ocorreu um erro ao validar o documento.';
      if (err.error && err.error.detail) {
        errorMessage = err.error.detail;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.status) {
        errorMessage = `Erro ${err.status}: ${err.statusText || 'Falha na requisição.'}`;
        if (err.error && typeof err.error === 'object') {
          try {
            const errorBody = JSON.stringify(err.error);
            errorMessage += ` Detalhes: ${errorBody}`;
          } catch (e) { /* ignore */ }
        }
      }

      this.alerts.showAlert('Erro', errorMessage);
      this.resetValidador();
    }
  }


  mostraNaTela(file: File, conteudoJson: any) {
    const json = conteudoJson;

      this.dados = {
        fileName: json.fileName || file.name,
        validationTime: json.validationTime || '#',
        isValid: json.isValid === true && json.status === 'OK',
        softwareVersion: json.softwareVersion || '---',
        // softwareVersion: json.softwareVersion || json.validaDocsReturn?.softwareVersion || '---',
        signaturePolicy: json.signaturePolicy || '---',
        lpaValid: json.lpaValid === true,
        signatureType: json.signatureType || '---',
        pdfValid: json.validaDocsReturn?.pdfValidations?.isPDFACompliant === true
      };

      if (Array.isArray(json.validaDocsReturn?.digitalSignatureValidations)) {
        this.certificados = json.validaDocsReturn.digitalSignatureValidations.map((item: any) => item.endCertSubjectName || 'Certificado Desconhecido');
        
        this.assinaturas = json.validaDocsReturn.digitalSignatureValidations.map((item: any) => {
          return {
            signatureValid: item.signatureValid ?? false,
            signatureErrors: item.signatureErrors || '---',
            endCertSubjectName: item.endCertSubjectName || '---',
            isICP: item.isICP ?? false,
            iseGov: item.iseGov ?? false,
            rootIssuer: item.rootIssuer || '---',
            certificateStartDate: item.certificateStartDate || null,
            certificateEndDate: item.certificateEndDate || null,
          };
        });

        this.todosCertificadosValidos = this.assinaturas.every(assinatura => assinatura.signatureValid);

        if (this.assinaturas.length > 0) {
          this.formattedSignerNames = this.assinaturas
            .map(a => this.formatCertName(a?.endCertSubjectName))
            .filter(name => name && name.trim() !== '' && name !== 'Não identificado')
            .join(', ');

          if (this.formattedSignerNames.trim() === '') {
            this.formattedSignerNames = 'Não identificado';
          }
        } else {
          this.formattedSignerNames = 'Não identificado';
        }

      } else {
        this.certificados = [];
        this.assinaturas = [];
        this.todosCertificadosValidos = false;
        this.formattedSignerNames = 'Não identificado';
      }

      this.showPreview = true;
      this.showFullDetails = false;

  } 


  formatCertName(name: string | undefined): string {
    if (name) {
      const parts = name.split('CN=');
      if (parts.length > 1) {
        return parts[1].trim();
      }
      return name.trim();
    }
    return 'Não identificado';
  }

  showAllDetails() {
    this.showFullDetails = true;
    this.showPreview = false;
  }

  showPreviewAgain() {
    this.showPreview = true;
    this.showFullDetails = false;
  }
}