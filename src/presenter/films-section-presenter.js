import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListSectionView from '../view/films-list-section-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';

import { render } from '../render.js';

export default class FilmsSectionPresenter {
  filmsSectionComponent = new FilmsSectionView();
  filmsListComponent = new FilmsListSectionView();
  filmsListContainer = new FilmsListContainerView();

  init = (filmsSectionContainer, filmCardsModel) => {
    this.filmsSectionContainer = filmsSectionContainer;
    this.filmCardsModel = filmCardsModel;
    this.filmCards = [...this.filmCardsModel.getCards()];

    render(this.filmsSectionComponent, this.filmsSectionContainer);
    render(this.filmsListComponent, this.filmsSectionComponent.getElement());
    render(this.filmsListContainer, this.filmsListComponent.getElement());

    for (let i = 0; i < this.filmCards.length; i++) {
      render(new FilmCardView(this.filmCards[i]), this.filmsListContainer.getElement());
    }
    render(new ShowMoreButtonView(), this.filmsListComponent.getElement());
  };
}
