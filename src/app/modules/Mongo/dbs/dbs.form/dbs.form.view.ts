import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbsService } from '../../../../core/services/Mongo/dbs.service';

@Component({
  selector: 'app-dbs.form',
  standalone: false,
  templateUrl: './dbs.form.view.html',
})
export class DbsFormView {
  dbForm: FormGroup;
  type : string = 'mb';
  success: boolean = false;
  failrule = false

  constructor(private fb: FormBuilder, private dbService: DbsService) {
    this.dbForm = this.fb.group({
      dbName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      collectionName: ['dummy']
    });
  }


  onSubmit(): void {
    console.log(this.dbForm.value);
    if (this.dbForm.valid) {
      console.log(this.dbForm.value);
      this.dbService.createDatabase(this.dbForm.value).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 5000);
        }
      });
      this.resetForm();
    } else {
      this.failrule = true;
      setTimeout(() => {
        this.failrule = false;
      }, 5000);
      this.markFormGroupTouched(this.dbForm);
    }
  }

  //#region Form Helpers

  resetForm() {
    this.dbForm.reset();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.dbForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  //#endregion

}
