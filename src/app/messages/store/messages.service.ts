import { Injectable } from '@angular/core';

import { MessageType } from '../message.model';
import { MessagesStore } from './messages.store';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(private messagesStore: MessagesStore) {}

  nextMessageId = 0;

  addError(errorMessage: string) {
    this.addMessage(MessageType.ERROR, errorMessage);
  }

  addInfo(infoMessage: string) {
    this.addMessage(MessageType.INFO, infoMessage);
  }

  addMessage(messageType: MessageType, message: string) {
    const messageId = this.nextMessageId;
    this.nextMessageId++;

    this.messagesStore.add({id: messageId, type: messageType, message});

    setTimeout(() => {
      this.removeMessage(messageId);
    }, 10 * 1000);
  }

  removeMessage(messageId: number) {
    this.messagesStore.remove(messageId);
  }
}
