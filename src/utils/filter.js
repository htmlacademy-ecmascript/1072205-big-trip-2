
// function generateFilter(events) {
  //   return FILTERS.map(({ type, filter, isChecked }) => ({
    //     type,
    //     filter,
    //     count: filter(events).length,
    //     isChecked,
    //   }));
    // }

    import { FILTERS } from '../const';
// function generateFilter(events) {
//   return FILTERS.map(({ type, filter }) => {
//     const filteredEvents = filter(events);
//     console.log(`Фильтр: ${type}, событий: ${filteredEvents.length}`);

//     return {
//       type,
//       filter,
//       count: filteredEvents.length,
//       isChecked: false, // Правильное состояние задаётся позже
//     };
//   });
// }

// export { generateFilter };

function generateFilter(events) {
  return FILTERS.map(({ type, filter }) => {
    const filteredEvents = filter(events);  // Фильтрация событий для каждого фильтра

    return {
      type,
      filter,
      count: filteredEvents.length,
      isDisabled: filteredEvents.length === 0, // Отключение фильтра, если нет событий
      isChecked: false,  // состояние будет обновляться позже
    };
  });
}

export { generateFilter };

