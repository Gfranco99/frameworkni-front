import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'celular' })
export class CelularPipe implements PipeTransform {
    transform(value) {
        if (value != null) {
        var cell = value.substring(0,0)+'('+value.substring(0,2)+') '+value.substring(2,7)+'-'+value.substring(7);
        return cell;
        } else {
            return value;
        }
    }
}