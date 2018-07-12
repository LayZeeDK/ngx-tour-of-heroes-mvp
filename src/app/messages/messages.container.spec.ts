import { MessageService } from '../message.service';
import { MessagesContainerComponent } from './messages.container';

describe(MessagesContainerComponent.name, () => {
  let container: MessagesContainerComponent;
  let service: MessageService;

  beforeEach(() => {
    service = new MessageService();
    spyOn(service, 'clear');
    container = new MessagesContainerComponent(service);
  });

  it('lists messages', () => {
    service.add('And a one...');
    service.add('And a two...');
    service.add('And a three...');

    expect(container.messages.length).toEqual(3);
    container.messages.forEach(message =>
      expect(message).toEqual(jasmine.any(String)));
  });

  it('clears messages', () => {
    container.clearMessages();

    expect(service.clear).toHaveBeenCalledTimes(1);
  });
});
