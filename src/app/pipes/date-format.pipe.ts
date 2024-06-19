import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

/**
 * Formats a date to a string with the following format:
 *
 * Usage: value | dateFormat: formater
 *
 * Example: `{{ '2017-01-07 12:35:52' | dateFormat: 'yyyy-MM-dd' }}`
 *
 * Output: `07 Jan 2017`
 */
@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  transform(date: string, formater = 'dd MMM yyyy'): string {
    return format(new Date(date.replace(/-/g, '/')), formater, { locale: fr });
  }
}
