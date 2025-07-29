import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toastController: ToastController) {}

  async presentToast(message: string, color: string, seconds: number) {
    const toast = await this.toastController.create({
      color: color,
      position: 'top',
      message: message,
      duration: seconds * 1000,
    });
    toast.present();
  }
}
