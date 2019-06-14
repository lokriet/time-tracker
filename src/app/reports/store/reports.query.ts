import { Injectable } from '@angular/core';
import { Query, QueryConfig } from '@datorama/akita';

import { ReportsState, ReportsStore } from './reports.store';

@Injectable({
  providedIn: 'root'
})
@QueryConfig({})
export class ReportsQuery extends Query<ReportsState> {
  constructor(protected store: ReportsStore) {
    super(store);
  }
}
