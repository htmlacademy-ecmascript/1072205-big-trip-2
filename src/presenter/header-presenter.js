import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import FiltersView from '../view/filters-view.js';

const tripMainElement = document.querySelector('.trip-main');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');

export default class HeaderPresenter {
  init() {
    render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
    render(new FiltersView(), filtersElement);
  }
}
