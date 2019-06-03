import { Message, MessageType } from '../message.model';
import { Injectable } from '@angular/core';
import { MessagesStore } from './messages.store';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(private messagesStore: MessagesStore) {}

  messageId: number = 0;

  addError(errorMessage: string) {
    this.addMessage(MessageType.ERROR, errorMessage);
  }

  addInfo(infoMessage: string) {
    this.addMessage(MessageType.INFO, infoMessage);
  }

  addMessage(messageType: MessageType, message: string) {
    let nextId = this.messageId;
    this.messageId++;
    
    this.messagesStore.add({id: nextId, type: messageType, message: message});
    
    setTimeout(() => {
      this.removeMessage(nextId);
    }, 10 * 1000);
    
  }

  removeMessage(messageId: number) {
    this.messagesStore.remove(messageId);
  }
}