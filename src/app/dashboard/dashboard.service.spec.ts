import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    client = TestBed.inject(DashboardService);
    server = TestBed.inject(HttpTestingController);
  });

  let client: DashboardService;
  let server: HttpTestingController;

  it('should be created', async () => {
    const whenWidgets = client.getWidgets().toPromise();
    const response = server.expectOne((request) =>
      request.url.endsWith('widgets')
    );
    response.flush([]);

    expect(await whenWidgets).toEqual([
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
