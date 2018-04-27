import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages-ui',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  @Input() messages: string[];
  @Output() clear: EventEmitter<void> = new EventEmitter();

  get hasMessages(): boolean {
    return this.messages.length > 0;
  }
}
