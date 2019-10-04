import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'filterString'})
export class FilterStringPipe implements PipeTransform {
  transform(value: string, filterString: string): string {
    if (!filterString) {
      return value;
    }

    const filterStringStart = value.toLowerCase().indexOf(filterString.toLowerCase());
    if (filterStringStart >= 0) {
      const result = value.substring(0, filterStringStart) +
               '<b><u>' +
               value.substr(filterStringStart, filterString.length) +
               '</u></b>' +
               value.substring(filterStringStart + filterString.length);
      return result;
    } else {
      return value;
    }
  }

}
