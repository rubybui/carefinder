import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { CommonModule } from '@angular/common'; // Import CommonModule for *ngFor
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import * as xml2js from "xml2js";

@Component({
  selector: 'app-hospital-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NzFormModule, NzTableModule, NzDividerModule, NzInputModule, ReactiveFormsModule],
  templateUrl: './hospital-table.component.html',
})

export class HospitalTableComponent implements OnInit {
  dataSet: any[] = [];

  pageSize: number = 10;  // Number of rows per page
  currentPage: number = 1;
  validateForm: FormGroup;
  querySummary: string = "";


  ngOnDestroy(): void {
    console.log('HospitalTableComponent Destroyed');
  }
  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      city: [''],
      state: [''],
      county: [''],
      name: ['']
    });
  }
  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const formValues = this.validateForm.value;
    let url = 'https://knautzfamilywi.com/CareFinder-1.0.0/api/hospitals';
    let queryParts: string[] = [];

    // Check if both city and state exist together
    if (formValues.city && formValues.state) {
      url = `https://knautzfamilywi.com/CareFinder-1.0.0/api/hospitals/citystate/${formValues.city}/${formValues.state}`;
      queryParts.push(`${formValues.city} city and ${formValues.state} state`);
    } else if (formValues.city) {
      url = `https://knautzfamilywi.com/CareFinder-1.0.0/api/hospitals/city/${formValues.city}`;
      queryParts.push(`${formValues.city} city`);
    } else if (formValues.state) {
      url = `https://knautzfamilywi.com/CareFinder-1.0.0/api/hospitals/state/${formValues.state}`;
      queryParts.push(`${formValues.state} state`);
    } else if (formValues.county) {
      url = `https://knautzfamilywi.com/CareFinder-1.0.0/api/hospitals/county/${formValues.county}`;
      queryParts.push(`${formValues.county} county`);
    } else if (formValues.name) {
      url = `https://knautzfamilywi.com/CareFinder-1.0.0/api/hospitals/name/${formValues.name}`;
      queryParts.push(`hospitals with name ${formValues.name}`);
    }

    this.querySummary = queryParts.join(", ") || "all hospitals"; // Form a human-readable summary

    const headers = new HttpHeaders({
      'X-API-KEY': '91844f287bb3071ab1f5607f7690e827',
      'Accept': 'application/xml'
    });

    this.http.get(url, { headers, responseType: 'text' })
      .subscribe((data: string) => {
        xml2js.parseString(data, (err: any, result: any) => {
          if (err) {
            console.error('Error parsing XML', err);
            return;
          }
          this.dataSet = result.xml.item.slice(0, 50).map((hospital: any) => {
            return {
              provider_id: hospital.provider_id ? hospital.provider_id[0] : '',
              hospital_name: hospital.hospital_name ? hospital.hospital_name[0] : '',
              address: hospital.address ? hospital.address[0] : '',
              city: hospital.city ? hospital.city[0] : '',
              state: hospital.state ? hospital.state[0] : '',
              zip_code: hospital.zip_code ? hospital.zip_code[0] : '',
              county_name: hospital.county_name ? hospital.county_name[0] : '',
              emergency_services: hospital.emergency_services ? hospital.emergency_services[0] : '',
              latitude: hospital.latitude ? hospital.latitude[0] : '',
              longitude: hospital.longitude ? hospital.longitude[0] : ''
            };
          });
        });
      }, error => {
        console.error('Error fetching data', error);
      });

    this.validateForm.reset();
  }

  goToHospitalDetails(providerId: string): void {
    // console.log('Navigating to hospital details for ID:', providerId);
    this.router.navigate(['/hospitals', providerId]);
  }

}
