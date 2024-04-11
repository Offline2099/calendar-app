import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

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

  addNumberSuffix(n: number): string {

    let suffix: string;

    let nstr: string = n.toString();
    let lastChar: string = nstr.charAt(nstr.length - 1);
    let secondLastChar: string = nstr.charAt(nstr.length - 2);

    if (lastChar == '1' && secondLastChar != '1') 
      suffix = 'st';
    else if (lastChar == '2' && secondLastChar != '1') 
      suffix = 'nd';
    else if (lastChar == '3' && secondLastChar != '1') 
      suffix = 'rd';
    else suffix = 'th';

    return nstr + suffix;
  }

  skipZero(current: number, incr: number): number {
    let target = current + incr;
    return target || target + incr;
  }
}
