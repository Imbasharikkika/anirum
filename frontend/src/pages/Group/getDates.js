import moment from "moment";

export function getDates({ data, checkedMonths }) {
  if (!data?.data) {
    return {
      months: [],
      dayFilterMonth: [],
      monthsGroup: [],
      actualDayGroupFormatDay: [],
    };
  }

  // Все месяцы группы// начало
  const starDay = moment(data.data.attributes.start_day, "YYYY-MM-DD");
  const endDay = moment(data.data.attributes.end_day, "YYYY-MM-DD"); //дата конца занятий в YYYY-MM-DD группы
  const allDayGroup = []; //все дни группы
  while (starDay <= endDay) {
    allDayGroup.push(starDay.format("YYYY-MM-DD"));
    starDay.add(1, "months");
  }

  const allMonthsGroup = allDayGroup.map((x) =>
    moment(x, "YYYY-MM-DD").format("MMMM YYYY")
  ); // все дни в месяцах
  const allMonthsGroupSecunds = allDayGroup.map((x) =>
    moment(x, "YYYY-MM").format("x")
  ); // все дни в секундах
  const todayMonthSecunds = moment(checkedMonths, "MMMM YYYY").format("x");
  const startMonths = [];
  const endMonths = [];

  let a = 0;
  while (a < allMonthsGroup.length) {
    if (allMonthsGroupSecunds[a] >= todayMonthSecunds) {
      startMonths.push(allMonthsGroup[a]);
    }
    a++;
  }
  let b = 0;
  while (b < allMonthsGroup.length) {
    if (allMonthsGroupSecunds[b] < todayMonthSecunds) {
      endMonths.push(allMonthsGroup[b]);
    }
    b++;
  }

  const monthsGroup = endMonths.concat(startMonths); // все месяцы
  // конец
  // Все дни группы за весь месяц (с учетом прошедших) //начало
  const daysOfMonths = data.data.attributes.days.data.map((x) =>
    moment(x.attributes.title, "YYYY-MM-DD").format("MMMM YYYY")
  ); //дни переводят в месяцы 5.2022
  const priceLesson = data.data.attributes.days.data.map(
    (x) => x.attributes.price_lesson
  );
  const trialPrice = data.data.attributes.days.data.map(
    (x) => x.attributes.trial_price
  );
  const daysGroup = data.data.attributes.days.data.map((x) =>
    moment(x.attributes.title, "YYYY-MM-DD").format("DD.MM.YYYY")
  ); //дни переводят в 05.05.2022

  const dayFilterMonth = []; // дни выбранного месяца
  const countPriceLessonMonth = [];
  const countPriceTrialMonth = [];
  let c = 0;

  while (c < daysOfMonths.length) {
    if (daysOfMonths[c] === checkedMonths) {
      dayFilterMonth.push(daysGroup[c]);
      countPriceLessonMonth.push(priceLesson[c]);
      countPriceTrialMonth.push(trialPrice[c]);
    }
    c++;
  }
  //конец
  //  Актуальные дни группы за весь месяц // начало

  const actualDayGroupSecunds = []; // в секундах
  const allDayGroupSecunds = data.data.attributes.days.data.map((x) =>
    moment(x.attributes.title, "YYYY-MM-DD").format("x")
  ); // дни сохраняет в секунды
  const alldayGroupFormat = data.data.attributes.days.data.map((x) =>
    moment(x.attributes.title, "YYYY-MM-DD").format("YYYY-MM-DD")
  ); // дни сохраняет в опр формате
  let d = 0;

  while (d < allDayGroupSecunds.length) {
    if (alldayGroupFormat[d] >= moment().format("YYYY-MM-DD")) {
      actualDayGroupSecunds.push(allDayGroupSecunds[d]);
    }
    d++;
  }

  actualDayGroupSecunds.sort((a, b) => a - b);
  const actualDayGroupFormatDay = actualDayGroupSecunds.map((x) =>
    moment(x, "x").format("DD.MM.YYYY")
  );
  const actualDayGroupFormatMonth = actualDayGroupSecunds.map((x) =>
    moment(x, "x").format("MMMM YYYY")
  );
  const months = [];
  let e = 0;

  while (e < actualDayGroupFormatDay.length) {
    if (actualDayGroupFormatMonth[e] === checkedMonths) {
      months.push(actualDayGroupFormatDay[e]);
    }
    e++;
  }

  return {
    months,
    dayFilterMonth,
    monthsGroup,
    actualDayGroupFormatDay,
  };
}
