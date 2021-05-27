export interface DashboardWidget {
  readonly columns: number;
  readonly left: number;
  readonly name: string;
  readonly rows: number;
  readonly top: number;
}

export type DashboardWidgets = readonly DashboardWidget[];
