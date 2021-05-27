import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardWidgets } from './dashboard-widget';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getWidgets(): Observable<DashboardWidgets> {
    return this.http.get<DashboardWidgets>('widgets');
  }
}
