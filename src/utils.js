import dayjs from 'dayjs';

const TIME_FORMAT = 'HH:mm';
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOURS = 60;

function getRandomBoolean() {
  const bool = Math.random() < 0.5;
  return bool;
}

function getRandomNumber(maxNumber) {
  return Math.floor(Math.random() * maxNumber);
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomDate(start = new Date(), end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function humanizeDate(eventDate, dateFormat) {
  const date = eventDate ? dayjs(eventDate).format(dateFormat) : '';
  const time = eventDate ? dayjs(eventDate).format(TIME_FORMAT) : '';
  return {
    date: date,
    time: time
  };
}

function eventDuration(startTime, endTime) {
  const durationDays = dayjs(endTime).diff(dayjs(startTime), 'days');
  const durationHours = dayjs(endTime).diff(dayjs(startTime), 'hours') - durationDays * HOURS_IN_DAY;
  const durationMinutes = dayjs(endTime).diff(dayjs(startTime), 'minutes') - durationDays * HOURS_IN_DAY * MINUTES_IN_HOURS - durationHours * MINUTES_IN_HOURS;

  return {
    days: durationDays ? `${durationDays}D` : '',
    hours: durationHours ? `${durationHours}H` : '',
    minutes: durationMinutes ? `${durationMinutes}M` : ''
  };
}

function isEventFavourite(isFavourite) {
  return isFavourite ? 'event__favorite-btn--active' : '';
}

export { getRandomArrayElement, humanizeDate, eventDuration, isEventFavourite, getRandomNumber, getRandomBoolean, getRandomDate };
