export class StringValidators {
  static emptyStringCheck(control: any) {
    if (!control.value) {
      return { emptyString: true };
    } else {
      const val = control.value.trim();
      return val.length === 0 ? { emptyString: true } : null;
    }
  }
}
