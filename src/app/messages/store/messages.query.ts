import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';

import { MessagesStore, MessagesState } from './messages.store';
import { Message } from '../message.model';

@Injectable({
  providedIn: 'root'
})
export class MessagesQuery extends QueryEntity<MessagesState, Message> {
  constructor(protected store: MessagesStore) {
    super(store);
  }
}