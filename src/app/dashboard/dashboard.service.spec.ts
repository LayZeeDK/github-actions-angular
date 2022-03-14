import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DashboardService);
  });

  it('should be created', async () => {
    const widgets = await service.getWidgets().toPromise();

    expect(widgets).toEqual([
      {
        columns: 1,
        left: 0,
        name: 'First',
        rows: 1,
        top: 0,
      },
    ]);
  });
});
