import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
  imports: [CommonModule],
})
export class DashboardModule {}
