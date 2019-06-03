import { Component, OnInit } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faAngry } from '@fortawesome/free-regular-svg-icons';
import { Message, MessageType } from './message.model';
import { MessagesQuery } from './store/messages.query';
import { Observable } from 'rxjs';
import { MessagesService } from './store/messages.service';
import { Order } from '@datorama/akita';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  faCheck = faCheck;
  faAngryFace = faAngry;
  faClose = faTimes;
  
  infoType = MessageType.INFO;
  errorType = MessageType.ERROR;

  messages: Observable<Message[]>;

  constructor(private messagesQuery: MessagesQuery,
              private messagesService: MessagesService) { }

  ngOnInit() {
    this.messages = this.messagesQuery.selectAll({sortBy: 'id', sortByOrder: Order.DESC});
  }

  onCloseMessage(messageId: number) {
    this.messagesService.removeMessage(messageId);
  }

}
