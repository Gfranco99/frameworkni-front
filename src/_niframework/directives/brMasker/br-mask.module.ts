import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrMaskDirective } from './br-mask';

@NgModule({
  declarations: [
    BrMaskDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BrMaskDirective
  ]
})
export class BrMaskerModule { }
