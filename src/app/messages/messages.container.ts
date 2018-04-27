import { Component } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.container.html',
})
export class MessagesContainerComponent {
  get messages(): string[] {
    return this.messageService.messages;
  }

  constructor(private messageService: MessageService) {}

  clearMessages(): void {
    this.messageService.clear();
  }
}
