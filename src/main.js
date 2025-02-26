import EventsModel from './model/events-model.js';
import PagePresenter from './presenter/page-presenter.js';
import EventsListPresenter from './presenter/events-list-presenter.js';

const eventsModel = new EventsModel();
const pagePresenter = new PagePresenter(eventsModel);
const eventsListPresenter = new EventsListPresenter(eventsModel);

pagePresenter.init();
eventsListPresenter.init();
