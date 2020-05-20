import { Injectable } from '@angular/core';
import { ID, Store, StoreConfig } from '@datorama/akita';

import { DateRange } from '../../shared/datepicker/date-range-selector/date-range.model';
import { DateSelectionMode } from '../date-selector.model';
import { ReportFilters } from '../reports-data.service';

export interface ReportsState {
  ui: ReportsUIState;
}

export interface ReportsUIState {
  selectedDates: DateRange;
  dateSelectionMode: DateSelectionMode;
  reportType: string;
  filters: ReportFilters;
}

const initialUiState = {
  selectedDates: null,
  dateSelectionMode: DateSelectionMode.WEEKLY,
  reportType: 'hours',
  filters: { projects: [] }
};

@Injectable({ providedIn: 'root' })
@StoreConfig({name: 'reports'})
export class ReportsStore extends Store<ReportsState> {

  constructor() {
    super({ ui: initialUiState });
  }

  updateSelectedDates(selectedDates: DateRange) {
    this.update({ui: { ...this._value().ui, selectedDates }});
  }

  updateDateSelectionMode(dateSelectionMode: DateSelectionMode) {
    this.update({ui: {...this._value().ui, dateSelectionMode}});
  }

  updateReportType(reportType: string) {
    this.update({ui: {...this._value().ui, reportType}});
  }

  updateFilterProjects(filterProjects: ID[]) {
    this.update({ui: {...this._value().ui, filters: {...this._value().ui.filters, projects: filterProjects}}});
  }
}
