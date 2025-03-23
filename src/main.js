import EventsModel from './model/events-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PagePresenter from './presenter/page-presenter.js';

// Создаем экземпляры всех моделей
const eventsModel = new EventsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

// Создаем и инициализируем PagePresenter с передачей всех моделей
const pagePresenter = new PagePresenter(eventsModel, destinationsModel, offersModel);
pagePresenter.init();
