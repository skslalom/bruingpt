import { isInt, isNumeric } from './numberChecks';

export function intFieldErrorChecker(item: any): boolean {
  return (!isInt(item) && item !== '') || item == '';
}

export function numericFieldErrorChecker(item: any): boolean {
  return (!isNumeric(item) && item !== '') || item == '';
}

export function intFieldHelper(item: any): string {
  return !isInt(item) && item !== ''
    ? 'Please enter an integer value.'
    : item === ''
      ? 'Required'
      : '';
}

export function numericFieldHelper(item: any): string {
  return !isNumeric(item) && item !== ''
    ? 'Please enter a numeric value.'
    : item === ''
      ? 'Required'
      : '';
}
