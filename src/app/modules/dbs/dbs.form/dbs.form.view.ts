import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbsService } from '../../../core/services/dbs.service';

@Component({
  selector: 'app-dbs-form',
  templateUrl: './dbs.form.view.html',
  standalone: false,
})
export class DbsFormView {
  dbForm: FormGroup;
  type : string = 'mb';
  success: boolean = false;
  failrule = false

  constructor(private fb: FormBuilder, private dbService: DbsService) {
    this.dbForm = this.fb.group({
      dbname: ['', Validators.required],
      datafilename: ['/var/opt/mssql/backups/data/', Validators.required],
      logfilename: ['/var/opt/mssql/backups/log/', Validators.required],
      datasizeMB: ['', [Validators.required, Validators.min(1)]],
      logsizeMB: ['', [Validators.required, Validators.min(1)]],
      datafilegrowthMB: [null ],
      datafilegrowthPercent: [null],
      logfilegrowthMB: [null],
      logfilegrowthPercent: [null],
      datamaxsizeMB: ['', [Validators.required, Validators.min(1),]],
      logmaxsizeMB: ['', [Validators.required, Validators.min(1)]],
    });
  }

  resetForm() {
    this.dbForm.reset();
  }

  ngOnInit(): void {}

  isFieldInvalid(fieldName: string): boolean {
    const field = this.dbForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.dbForm.valid) {
      console.log(this.dbForm.value);
      this.dbService.createDb(this.dbForm.value).subscribe(res => {
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

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }


  onGrowthTypeChange(type: 'mb' | '%') {
    this.type = type;
    
    // Resetear valores al cambiar el tipo
    if (type === 'mb') {
      this.dbForm.get('datafilegrowthPercent')?.reset();
      this.dbForm.get('logfilegrowthPercent')?.reset();
    } else {
      this.dbForm.get('datafilegrowthMB')?.reset();
      this.dbForm.get('logfilegrowthMB')?.reset();
    }
  
    // Actualizar validadores
    this.updateGrowthValidators();
  }
  
  private updateGrowthValidators() {
    const isMbType = this.type === 'mb';
    
    // Configurar validadores para MB
    const mbValidators = [Validators.required, Validators.min(1)];
    const percentValidators = [Validators.required, Validators.min(1), Validators.max(100)];
    
    // Data File Growth
    this.dbForm.get('datafilegrowthMB')?.setValidators(isMbType ? mbValidators : null);
    this.dbForm.get('datafilegrowthPercent')?.setValidators(!isMbType ? percentValidators : null);
    
    // Log File Growth
    this.dbForm.get('logfilegrowthMB')?.setValidators(isMbType ? mbValidators : null);
    this.dbForm.get('logfilegrowthPercent')?.setValidators(!isMbType ? percentValidators : null);
  
    // Actualizar estado de validación
    ['datafilegrowthMB', 'datafilegrowthPercent', 'logfilegrowthMB', 'logfilegrowthPercent']
      .forEach(control => this.dbForm.get(control)?.updateValueAndValidity());
  }
  
}
