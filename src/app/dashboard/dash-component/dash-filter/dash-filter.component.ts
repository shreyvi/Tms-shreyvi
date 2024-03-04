import { Component, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { DashDataService } from '../../dash-data-service/dash-data.service';
import { AuthService } from '../../../login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common'; 
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-filter',
  templateUrl: './dash-filter.component.html',
  styleUrls: ['./dash-filter.component.css']
})
export class DashFilterComponent {

  CompanyEmail!: string | null;
  selectedDevice = new FormControl('', [Validators.required]);
  selectedDeviceInterval!: string;
  deviceOptions: any[] = [];

  selectedRadioButton!: string;
  currentDate: Date = new Date();
  startDate!: Date;
  endDate: Date = this.currentDate;
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);
  CompanyId!: string | null;
  deviceUID!:string;
  deviceType!:string;
  deviceName!:string;
  deviceInterval!:string;
  disconnectedDevices: any[];
  activeDevices: any[];
  
  constructor(
    private DashDataService: DashDataService,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DashFilterComponent>,
    private datePipe: DatePipe
  ) {
    // Populate deviceOptions array with data
    // Filter devices based on status
    this.activeDevices = this.deviceOptions.filter(device => device.deviceStatus === 'active');
    this.disconnectedDevices = this.deviceOptions.filter(device => device.deviceStatus === 'disconnected');
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if(this.selectedRadioButton==='Custom'){
      if(this.start_date.valid && this.end_date.valid){
        setTimeout(() => {
          this.DashDataService.setDeviceId(this.deviceUID);
          this.DashDataService.setDeviceName(this.deviceName);
          this.DashDataService.setInterval('Custom');
          this.DashDataService.setDeviceType(this.deviceType);
          const start = this.datePipe.transform(this.start_date.value, 'yyyy-M-d')!;
          this.DashDataService.setStartDate(start);
          const end = this.datePipe.transform(this.end_date.value, 'yyyy-M-d')!;
          this.DashDataService.setEndDate(end);
          this.dialogRef.close();
        }, 100);
      }
      else{
        this.snackBar.open('Please Select appropriate values!', 'Dismiss', {
          duration: 2000
        });
      }      
    }
    else if(this.selectedRadioButton==='Last'){
      setTimeout(() => {
        this.DashDataService.setDeviceId(this.deviceUID);
        this.DashDataService.setDeviceName(this.deviceName);
        this.DashDataService.setInterval(this.selectedDeviceInterval);
        this.DashDataService.setDeviceType(this.deviceType);
        this.DashDataService.setStartDate('');
        this.DashDataService.setEndDate('');
        this.dialogRef.close();
      }, 100);
    } 
  }    
}
