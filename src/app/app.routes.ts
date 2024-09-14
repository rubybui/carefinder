import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HospitalTableComponent } from './hospitals/hospital-table.component';
import { HospitalDetailsComponent } from './hospitals/hospital-details.component';

export const routes: Routes = [
    { path: 'hospitals', component: HospitalTableComponent,  pathMatch: 'full' },
    { path: 'hospitals/:id', component: HospitalDetailsComponent }
 ];

@NgModule({
    imports: [ RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
