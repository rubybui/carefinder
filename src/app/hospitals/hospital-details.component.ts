import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CommonModule } from '@angular/common';
import * as xml2js from 'xml2js';  // Import XML parser

@Component({
  selector: 'app-hospital-details',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzMessageModule, NzCardModule, NzSpinModule],  // Import necessary modules
  templateUrl: './hospital-details.component.html',
})
export class HospitalDetailsComponent implements OnInit {
  hospital: any = {}; 
  loading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');  // Get the hospital ID from the route

    const headers = new HttpHeaders({
      'X-API-KEY': '91844f287bb3071ab1f5607f7690e827',
      'Accept': 'application/xml'
    });

    // Fetch hospital data based on provider_id
    this.http.get(`https://knautzfamilywi.com/CareFinder-1.0.0/api/hospitals/id/${id}`, { headers, responseType: 'text' })
      .subscribe((data: string) => {
        // Parse the XML response
        xml2js.parseString(data, (err: any, result: any) => {
          if (err) {
            console.error('Error parsing XML:', err);
            return;
          }
          this.hospital = result.xml.item[0];  // Assign the parsed hospital data to the `hospital` variable
          this.loading = false;  // Stop the loading indicator
        });
      }, error => {
        console.error('Error fetching data:', error);
        this.loading = false;
      });
  }
  
}
