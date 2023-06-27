import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  formatLongNumberStr(n: number): string {

    let newStr: string = '';
    let str: string = n.toString();
    let length: number = str.length - 1;

    for(let i = length; i >= 0; i--) {
      newStr += str[i];
      if (i && (i != length) && !((length - i + 1) % 3)) 
        newStr += '\u2009';
    }

    return newStr.split('').reverse().join('');
  }
}
