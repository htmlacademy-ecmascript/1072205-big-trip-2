import AbstractView from '../framework/view/abstract-view';

function createNoEventTemplate() {
  return (
    '<p class="trip-events__msg">Click New Event to create your first point</p>'
  );
}

export default class NoEventView extends AbstractView {
  get template() {
    return createNoEventTemplate();
  }
}
