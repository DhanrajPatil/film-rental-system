import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {Observable} from "rxjs";

export class StringValidators {
  static emptyStringCheck(control: AbstractControl): ValidationErrors | Observable<ValidationErrors> | null {
    if (!control.value) {
      return { emptyString: true };
    } else {
      const val = control.value.trim();
      return val.length === 0 ? { emptyString: true } : null;
    }
  }

  static passwordMatchCheck(matchingControl: FormControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = control.value;
      const matchingControlValue = matchingControl?.value;
      return controlValue === matchingControlValue ? null : { passwordMatch: true };
    };
  }
}
