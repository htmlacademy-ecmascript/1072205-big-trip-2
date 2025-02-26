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

export { getRandomArrayElement, getRandomNumber, getRandomBoolean, getRandomDate };
