import PagePresenter from './presenter/page-presenter.js';
import EventsModel from './model/events-model.js';

const eventsModel = new EventsModel();
const pagePresenter = new PagePresenter(eventsModel);

pagePresenter.init();
