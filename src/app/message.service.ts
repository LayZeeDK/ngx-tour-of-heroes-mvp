import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  messages: string[] = [];

  add(message: string) {
    this.messages = [...this.messages, message];
  }

  clear() {
    this.messages = [];
  }
}
