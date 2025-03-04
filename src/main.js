import EventsModel from './model/events-model.js';
import PagePresenter from './presenter/page-presenter.js';

const eventsModel = new EventsModel();
const pagePresenter = new PagePresenter(eventsModel);

pagePresenter.init();
