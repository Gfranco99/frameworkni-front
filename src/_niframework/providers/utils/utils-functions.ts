import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class Utils {

  /* CONSTANTS */
  //public RegExpStrongPassword = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%#_*?&])[A-Za-z0-9\d#_@$!%*?&].{7,}';
  public RegExpStrongPassword = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9\d].{7,}';
  public RegExpCelularFixo = '';



  constructor() { }

  public normalizeJsonString(json: any): string {
    return JSON.stringify(json, function (key, value) {
      if (typeof value === 'number') {
        return value.toString();
      } else {
        return value;
      }
    });
  }

  public base64ToArrayBuffer(base64: any) {

    let binary_string =  window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  public numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  // Copia o texto para a area de transferência
  public copyToClipboard(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      navigator.clipboard.writeText(text)
        .then(() => {          
          resolve();
        })
        .catch((err) => {          
          reject(err);
        });
    });
  }

}
