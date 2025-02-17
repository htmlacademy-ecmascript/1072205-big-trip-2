import EventsModel from './model/events-model.js';
import HeaderPresenter from './presenter/header-presenter.js';
import EventsListPresenter from './presenter/events-list-presenter.js';

const eventsModel = new EventsModel();
const headerPresenter = new HeaderPresenter();
const eventsListPresenter = new EventsListPresenter(eventsModel);

headerPresenter.init();
eventsListPresenter.init();
