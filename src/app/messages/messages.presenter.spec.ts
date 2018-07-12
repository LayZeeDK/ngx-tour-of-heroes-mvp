import { MessagesPresenter } from './messages.presenter';

describe(MessagesPresenter.name, () => {
  let presenter: MessagesPresenter;

  beforeEach(() => {
    presenter = new MessagesPresenter();
  });

  it('lists messages', () => {
    expect(presenter.messages).toEqual(jasmine.any(Array));
  });

  it('indicates whether it has any messages', () => {
    presenter.messages = [];

    expect(presenter.hasMessages).toBe(
      false,
      'it must not indicate that it has any messages');
    presenter.messages = [
      'The city is flying, we’re fighting an army of robots and I have a bow and arrow. None of this makes sense.',
      'There is nothing more reassuring than realizing the world is crazier than you are.',
      'You know who I am. You don’t know where I am. And you’ll never see me coming.',
    ];

    expect(presenter.hasMessages).toBe(
      true,
      'it must indicate that it has messages');
  });
});
