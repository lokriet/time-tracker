import { Injectable } from '@angular/core';

import { EntityState, ActiveState, StoreConfig, EntityStore } from '@datorama/akita';

import { Message } from '../message.model';

export interface MessagesState extends EntityState<Message>, ActiveState {}

@Injectable({ providedIn: 'root' })
@StoreConfig({name: 'messages'})
export class MessagesStore extends EntityStore<MessagesState, Message> {
  constructor() {
    super();
  }
}