import UserTitleView from '../view/user-title-view.js';
import { render } from '../framework/render.js';

export default class UserPresenter {
  #pageHeaderSection = null;

  #userComponent = new UserTitleView();

  constructor(pageHeaderSection) {
    this.#pageHeaderSection = pageHeaderSection;
  }

  init = () => render(this.#userComponent, this.#pageHeaderSection);
}
