import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useFetch from "../../hooks/useFetch";
import "moment/locale/ru";
import "./Group.css";

//  const students =  [ a , b , [3, 4]]
//
//  const date = [ 1 2 3 4]
//
// const stundentsMonths = [ [0] [0]  [записан[id]  записан[id] ]]
//  while
//  let st = 0
//  while ( st < studnents.lenght) {
//    if(date.includes(stundets[st])){
//
// }
// }

// function Component () {
//   const [b] = useState(2);

//   const month = (2 + b);

//   const month = useMemo(() => {
//     return 2 + b
//   }, [b])

//   return <div>{a}</div>
// }

// function Component() {
//   const [a, setA] = useState(0);
//   const [b, setB] = useState(0);

//   useEffect(() => {
//     if (a + b === 4) {
//       alert('!!!')
//     }
//   }, [a, b])

//   return (
//     <div>
//       <button onClick={() => setA(a + 1)}>a + 1</button>
//       <button onClick={() => setB(b + 1)}>b + 1</button>
//       <div>{a + b}</div>
//     </div>
//   )
// }

// Как только меняется месяц, ставь 0 элемент массива months
// useEffect(() => {
//   // if (months?.length) {
//     setStudent({ ...student, days: months[0] });
//   // }
// }, [setStudent, months]);

const Group = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const url = "http://localhost:1337/api/students";
  const url2 = "http://localhost:1337/api/presences";
  const { loading, error, data, fetchData } = useFetch(
    `http://localhost:1337/api/groups/${id}?populate[0]=teacher&populate[1]=days&populate[2]=office&populate[3]=office.address&populate[4]=office.address.district&populate[5]=office.address.district.city&populate[6]=students&populate[7]=students.presences&populate[8]=students.presences.day`
  );

  const [student, setStudent] = useState({
    groups: id,
    name: "",
    family: "",
    patronymic: "",
    age: undefined,
    city: undefined,
    district: undefined,
    address: undefined,
    phone_student: undefined,
    parents_1: undefined,
    phone_parents_1: undefined,
    parents_2: undefined,
    phone_parents_2: undefined,
    level: undefined,
    note: undefined,
    days: undefined,
    age_number: undefined,
    payment_status: undefined,
  });
  const [checked, setChecked] = useState({
    months: moment().format("MMMM YYYY"),
    status: "trial",
    sale: 0,
  });
  const [precents, setPrecents] = useState({
    status: "",
    id: "",
  });
  function submit(e) {
    e.preventDefault();
    Axios.post(url, {
      data: {
        groups: id,
        name: student.name,
        family: student.family,
        patronymic: student.patronymic,
        age: student.age,
        phone_student: student.phone_student,
        parents_1: student.parents_1,
        phone_parents_1: student.phone_parents_1,
        parents_2: student.parents_2,
        phone_parents_2: student.phone_parents_2,
        level: data.data.attributes.level,
        note: student.note,
        age_number: student.age_number,
        days: TrialOrLesson,
        city: data.data.attributes.office.data.attributes.address.data
          .attributes.district.data.attributes.city.data.attributes.title,
        district:
          data.data.attributes.office.data.attributes.address.data.attributes
            .district.data.attributes.title,
        // address: data.data.attributes.office.data.attributes.address.data.attributes.title,
      },
    }).then((res) => {
      console.log(res);
      let d = 0;
      while (d < TrialOrLessonPresences.length) {
        Axios.post(url2, {
          data: {
            student: res.data.data.id,
            day: TrialOrLessonPresences[d],
            price_lesson: pricePresenceLesson[d],
            trial_price: pricePresenceTrial,
            status: "придут",
          },
        });
        d++;
      }
      fetchData();
    });
  }
  const { months, dayFilterMonth, monthsGroup, actualDayGroupFormatDay } =
    useMemo(() => {
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
      const todayMonthSecunds = moment(checked.months, "MMMM YYYY").format("x");
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
        if (daysOfMonths[c] === checked.months) {
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
        if (actualDayGroupFormatMonth[e] === checked.months) {
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
    }, [data, checked.months]);

  useEffect(() => {
    setStudent({ ...student, days: months[0] });
  }, [setStudent, months]);

  if (loading) return <p>loading...</p>;
  if (error) return <p>Error :(</p>;

  function handle(e) {
    setChecked({ ...checked, months: e.target.value });
    // setStudent({ ...student, days: months[e.target.value][0] });
  }

  function handleTwo(e) {
    setChecked({ ...checked, status: e.target.value });
  }
  function handleSale(e) {
    setChecked({ ...checked, sale: e.target.value });
  }
  function onChangeStudent(e) {
    const newstudent = { ...student };
    newstudent[e.target.id] = e.target.value;
    setStudent(newstudent);
  }

  // актуальные дни
  const actualDaysMonthSort = [];
  let q = 0;
  while (q < months.length) {
    if (months[q] >= moment(student.days, "DD.MM.YYYY").format("DD.MM.YYYY")) {
      actualDaysMonthSort.push(months[q]);
    }
    q++;
  }

  // Все дни группы за весь месяц (с учетом прошедших) //начало
  const daysOfMonths = data.data.attributes.days.data.map((x) =>
    moment(x.attributes.title, "YYYY-MM-DD").format("MMMM YYYY")
  ); //дни переводят в месяцы 5.2022
  const AllDays = data.data.attributes.days.data.map((x) => x);

  const days = [];
  let i = 0;

  while (i < daysOfMonths.length) {
    if (daysOfMonths[i] === checked.months) {
      days.push(AllDays[i]);
    }
    i++;
  }
  //конец
  days.sort((a, b) => (a.id > b.id ? 1 : -1));
  const priceLessonNow = [];

  let z = 0;
  while (z < months.length) {
    if (
      moment(months[z], "DD.MM.YYYY").format("DD.MM.YYYY") >=
      moment(student.days, "DD.MM.YYYY").format("DD.MM.YYYY")
    ) {
      priceLessonNow.push(days[z]);
    }
    z++;
  }

  const priceLessonFilter = priceLessonNow.map(
    (x) => x.attributes.price_lesson
  );
  const priceTrial = priceLessonNow.map((x) => x.attributes.trial_price);

  const sumprise = priceLessonFilter.reduce((acc, rec) => (acc += rec), 0);
  let priceTrialF = 0;

  if ("trial" === checked.status) {
    priceTrialF = priceTrial[0];
  }

  if ("lesson" === checked.status) {
    priceTrialF = sumprise;
  }
  const pocet = checked.sale;
  const result = (priceTrialF / 100) * pocet;
  const result2 = priceTrialF - result;
  const idDay = data.data.attributes.days.data.map((x) =>
    moment(x.attributes.title, "YYYY-MM-DD").format("DD.MM.YYYY")
  );
  const idDayd = data.data.attributes.days.data.map((x) => x.id);
  const dayResult = [];
  const dayResultTrial = [];
  const dayAllActual = [];
  let j = 0;
  while (j < actualDayGroupFormatDay.length) {
    if (
      moment(student.days, "DD.MM.YYYY").format("x") <=
      moment(actualDayGroupFormatDay[j], "DD.MM.YYYY").format("x")
    ) {
      dayAllActual.push(actualDayGroupFormatDay[j]);
    }
    j++;
  }

  let g = 0;
  while (g < dayAllActual.length) {
    if (idDay.includes(dayAllActual[g])) {
      let index = idDay.indexOf(dayAllActual[g]);
      dayResult.push(idDayd[index]);
    }
    g++;
  }

  if (idDay.includes(student.days)) {
    let index = idDay.indexOf(student.days);
    dayResultTrial.push(idDayd[index]);
  }
  let TrialOrLesson = [];

  if ("trial" === checked.status) {
    TrialOrLesson = dayResultTrial;
  }

  if ("lesson" === checked.status) {
    TrialOrLesson = dayResult;
  }
  const presencesDays = [];
  const dayResultTrialPresences = [];
  const dayAllActualPresences = [];
  let f = 0;
  while (f < months.length) {
    if (
      moment(student.days, "DD.MM.YYYY").format("x") <=
      moment(months[f], "DD.MM.YYYY").format("x")
    ) {
      presencesDays.push(months[f]);
    }
    f++;
  }

  let y = 0;
  while (y < presencesDays.length) {
    if (idDay.includes(presencesDays[y])) {
      let index = idDay.indexOf(presencesDays[y]);
      dayResultTrialPresences.push(idDayd[index]);
    }
    y++;
  }

  if (idDay.includes(student.days)) {
    let index = idDay.indexOf(student.days);
    dayAllActualPresences.push(idDayd[index]);
  }

  let TrialOrLessonPresences = [];

  if ("trial" === checked.status) {
    TrialOrLessonPresences = dayAllActualPresences;
  }

  if ("lesson" === checked.status) {
    TrialOrLessonPresences = dayResultTrialPresences;
  }

  const result4 = (priceTrial[0] / 100) * pocet;
  const result5 = priceTrial[0] - result4;

  const sumprise2 = priceLessonFilter.reduce((acc, rec) => (acc += rec), 0);
  const result6 = (sumprise2 / 100) * pocet;
  const result7 = sumprise2 - result6;
  const sumprise3 = result7 / priceLessonFilter.length;

  const priceSaleCours = [];

  let m = 0;
  while (m < priceLessonFilter.length) {
    priceSaleCours.push(Math.floor(sumprise3));
    m++;
  }

  let pricePresenceTrial = "";
  let pricePresenceLesson = [];
  if ("trial" === checked.status) {
    pricePresenceTrial = Math.floor(result5);
    pricePresenceLesson = [];
  }

  if ("lesson" === checked.status) {
    if (!checked.sale || checked.sale === "0") {
      pricePresenceLesson = priceLessonFilter;
      pricePresenceTrial = 0;
    } else {
      pricePresenceLesson = priceSaleCours;
      pricePresenceTrial = 0;
    }
  }
  const students = data.data.attributes.students.data;
  const dayallsec = dayFilterMonth.map((x) =>
    moment(x, "DD.MM.YYYY").format("x")
  );
  dayallsec.sort((a, b) => a - b);
  const dayall = dayallsec.map((x) => moment(x, "x").format("DD.MM.YYYY"));

  const studentsTable = students.map((x) => {
    const studentDates = x.attributes.presences.data.map((x) =>
      moment(x.attributes.day.data.attributes.title, "YYYY-MM-DD").format(
        "DD.MM.YYYY"
      )
    );
    const studentDates2 = x.attributes.presences.data.map((x) => x.attributes);
    const studentDates3 = x.attributes.presences.data.map((x) => x);
    // console.log(studentDates2)
    return {
      id: x.id,
      name:
        x.attributes.family +
        " " +
        x.attributes.name +
        " " +
        x.attributes.patronymic,
      age: x.attributes.age_number,
      phone_student: x.attributes.phone_student,
      course: studentDates2
        .map((x) => x.price_lesson)
        .reduce((acc, rec) => (acc += rec), 0),
      trial: studentDates2
        .map((x) => x.trial_price)
        .reduce((acc, rec) => (acc += rec), 0),
      dates: dayall.map((day) => ({
        day,
        value: studentDates.includes(day) ? "записан" : "не записан",
        status: studentDates2
          .filter(
            (s) =>
              moment(s.day.data.attributes.title, "YYYY-MM-DD").format(
                "DD.MM.YYYY"
              ) === day
          )
          .map((x) => x.status)[0]
          ? studentDates2
              .filter(
                (s) =>
                  moment(s.day.data.attributes.title, "YYYY-MM-DD").format(
                    "DD.MM.YYYY"
                  ) === day
              )
              .map((x) => x.status)[0]
          : undefined,
        trial: studentDates2
          .filter(
            (s) =>
              moment(s.day.data.attributes.title, "YYYY-MM-DD").format(
                "DD.MM.YYYY"
              ) === day
          )
          .map((x) => x.status)[0]
          ? studentDates2
              .filter(
                (s) =>
                  moment(s.day.data.attributes.title, "YYYY-MM-DD").format(
                    "DD.MM.YYYY"
                  ) === day
              )
              .map((x) => x.trial_price)[0]
          : undefined,
        course: studentDates2
          .filter(
            (s) =>
              moment(s.day.data.attributes.title, "YYYY-MM-DD").format(
                "DD.MM.YYYY"
              ) === day
          )
          .map((x) => x.status)[0]
          ? studentDates2
              .filter(
                (s) =>
                  moment(s.day.data.attributes.title, "YYYY-MM-DD").format(
                    "DD.MM.YYYY"
                  ) === day
              )
              .map((x) => x.price_lesson)[0]
          : undefined,
        id: studentDates3.filter(
          (s) =>
            moment(s.attributes.day.data.attributes.title, "YYYY-MM-DD").format(
              "DD.MM.YYYY"
            ) === day
        )[0]
          ? studentDates3.filter(
              (s) =>
                moment(
                  s.attributes.day.data.attributes.title,
                  "YYYY-MM-DD"
                ).format("DD.MM.YYYY") === day
            )[0].id
          : undefined,
      })),
    };
  });

  // console.log(studentsTable)

  const handleChange = (e) => {
    setPrecents({
      ...precents,
      status: e.target.value,
      id: e.target.getAttribute(`data-id`),
    });
  };

  return (
    <div className="container_group">
      <select onChange={handleChange}>
        <option value={"1"} data-id={1}>
          1
        </option>
        <option value={"2"} data-id={2}>
          2
        </option>
      </select>
      <div className="box_goup">
        <div>
          <div>Месяц </div>
          <div>
            <select value={checked.months} onChange={handle}>
              {monthsGroup.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="box_goup2">
        <div>
          <h2>{data.data.attributes.title}</h2>
          <br />
          <div>Уровень: {data.data.attributes.level}</div>
          <div>Направление: {data.data.attributes.course}</div>
          <div>Мест: {data.data.attributes.capacity}</div>
          <div>
            Преподавтель: {data.data.attributes.teacher.data.attributes.title}
          </div>
          <br />
          <br />
          <div>Check:{checked.months}</div>
          <div>Student:{student.days}</div>
          <div>Выбранный день:{student.days}</div>
          <br />
          <br />

          <div>
            {" "}
            подошел
            <svg
              width="25"
              height="26"
              viewBox="0 0 25 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.4998 5.14575L4.9477 8.66658C4.9477 8.66658 4.16645 20.8541 12.4998 20.8541C20.8331 20.8541 20.0519 8.66658 20.0519 8.66658L12.4998 5.14575Z"
                stroke="#27B035"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.1563 13.8125L11.4583 15.4375L14.8438 10.5625"
                stroke="#3FB37B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            {" "}
            пропуск
            <svg
              width="25"
              height="26"
              viewBox="0 0 25 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.4998 5.14575L4.9477 8.66658C4.9477 8.66658 4.16645 20.8541 12.4998 20.8541C20.8331 20.8541 20.0519 8.66658 20.0519 8.66658L12.4998 5.14575Z"
                stroke="#D92F39"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            {" "}
            придут
            <svg
              width="25"
              height="26"
              viewBox="0 0 25 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.4998 5.14575L4.9477 8.66658C4.9477 8.66658 4.16645 20.8541 12.4998 20.8541C20.8331 20.8541 20.0519 8.66658 20.0519 8.66658L12.4998 5.14575Z"
                stroke="#4682DC"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12.5 9V16" stroke="#4682DC" />
              <path d="M9 12.5H16" stroke="#4682DC" />
            </svg>
          </div>

          <div>
            {" "}
            пробное
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 20.5C5 20.6326 4.94732 20.7598 4.85355 20.8536C4.75979 20.9473 4.63261 21 4.5 21H4V21.5C4 21.6326 3.94732 21.7598 3.85355 21.8536C3.75979 21.9473 3.63261 22 3.5 22C3.36739 22 3.24021 21.9473 3.14645 21.8536C3.05268 21.7598 3 21.6326 3 21.5V21H2.5C2.36739 21 2.24021 20.9473 2.14645 20.8536C2.05268 20.7598 2 20.6326 2 20.5C2 20.3674 2.05268 20.2402 2.14645 20.1464C2.24021 20.0527 2.36739 20 2.5 20H3V19.5C3 19.3674 3.05268 19.2402 3.14645 19.1464C3.24021 19.0527 3.36739 19 3.5 19C3.63261 19 3.75979 19.0527 3.85355 19.1464C3.94732 19.2402 4 19.3674 4 19.5V20H4.5C4.63261 20 4.75979 20.0527 4.85355 20.1464C4.94732 20.2402 5 20.3674 5 20.5ZM6.5 22C6.40111 22 6.30444 22.0293 6.22221 22.0843C6.13999 22.1392 6.0759 22.2173 6.03806 22.3087C6.00022 22.4 5.99031 22.5006 6.00961 22.5975C6.0289 22.6945 6.07652 22.7836 6.14645 22.8536C6.21637 22.9235 6.30546 22.9711 6.40245 22.9904C6.49945 23.0097 6.59998 22.9998 6.69134 22.9619C6.7827 22.9241 6.86079 22.86 6.91573 22.7778C6.97068 22.6956 7 22.5989 7 22.5C7 22.3674 6.94732 22.2402 6.85355 22.1464C6.75979 22.0527 6.63261 22 6.5 22ZM22.5 2H22V1.5C22 1.36739 21.9473 1.24021 21.8536 1.14645C21.7598 1.05268 21.6326 1 21.5 1C21.3674 1 21.2402 1.05268 21.1464 1.14645C21.0527 1.24021 21 1.36739 21 1.5V2H20.5C20.3674 2 20.2402 2.05268 20.1464 2.14645C20.0527 2.24021 20 2.36739 20 2.5C20 2.63261 20.0527 2.75979 20.1464 2.85355C20.2402 2.94732 20.3674 3 20.5 3H21V3.5C21 3.63261 21.0527 3.75979 21.1464 3.85355C21.2402 3.94732 21.3674 4 21.5 4C21.6326 4 21.7598 3.94732 21.8536 3.85355C21.9473 3.75979 22 3.63261 22 3.5V3H22.5C22.6326 3 22.7598 2.94732 22.8536 2.85355C22.9473 2.75979 23 2.63261 23 2.5C23 2.36739 22.9473 2.24021 22.8536 2.14645C22.7598 2.05268 22.6326 2 22.5 2ZM19.92 6.87C17.4088 6.46601 15.0643 5.35617 13.16 3.67C13.1083 3.6189 13.0426 3.58418 12.9713 3.57017C12.8999 3.55616 12.826 3.56348 12.7588 3.59122C12.6916 3.61895 12.6341 3.66588 12.5934 3.72613C12.5527 3.78639 12.5306 3.85729 12.53 3.93L12.61 20.15C12.6133 20.2131 12.6322 20.2744 12.6651 20.3283C12.698 20.3822 12.7438 20.4271 12.7984 20.4589C12.853 20.4906 12.9146 20.5083 12.9778 20.5102C13.0409 20.5122 13.1035 20.4983 13.16 20.47C15.6842 19.3961 17.7634 17.4886 19.0502 15.066C20.337 12.6435 20.7535 9.8527 20.23 7.16C20.2162 7.08386 20.1789 7.01396 20.1232 6.96015C20.0676 6.90633 19.9966 6.87131 19.92 6.86V6.87Z"
                fill="#FFB400"
              />
              <path
                d="M14.39 8.32C14.2615 7.9364 14.0156 7.60289 13.6873 7.3666C13.3589 7.13031 12.9645 7.00318 12.56 7.00318C12.1554 7.00318 11.7611 7.13031 11.4327 7.3666C11.1044 7.60289 10.8585 7.9364 10.73 8.32L8.30999 13.17C8.0324 13.6602 7.89408 14.2169 7.90999 14.78C7.94122 15.3613 8.18619 15.9105 8.59782 16.3222C9.00945 16.7338 9.5587 16.9788 10.14 17.01C11.0444 16.9449 11.8989 16.5706 12.56 15.95C13.2211 16.5706 14.0756 16.9449 14.98 17.01C15.5613 16.9788 16.1105 16.7338 16.5222 16.3222C16.9338 15.9105 17.1788 15.3613 17.21 14.78C17.2259 14.2169 17.0876 13.6602 16.81 13.17L14.39 8.32ZM11.67 12.7C11.67 12.65 11.68 11.47 12.56 11.47C13.44 11.47 13.44 12.65 13.44 12.7C13.3496 13.3883 13.0413 14.0296 12.56 14.53C12.0751 14.031 11.7631 13.3895 11.67 12.7ZM14.98 16.01C14.3408 15.9483 13.7398 15.6777 13.27 15.24C13.9321 14.5473 14.3439 13.6534 14.44 12.7C14.4677 12.436 14.4431 12.1692 14.3676 11.9147C14.2921 11.6602 14.1672 11.4231 14.0001 11.217C13.8329 11.0108 13.6267 10.8396 13.3934 10.7131C13.16 10.5867 12.904 10.5075 12.64 10.48L12.56 10.47C12.2945 10.4865 12.035 10.5553 11.7961 10.6724C11.5573 10.7895 11.344 10.9527 11.1684 11.1524C10.9928 11.3522 10.8584 11.5847 10.7728 11.8365C10.6873 12.0883 10.6524 12.3546 10.67 12.62L10.68 12.7C10.7753 13.6536 11.1872 14.5478 11.85 15.24C11.3802 15.6777 10.7792 15.9483 10.14 16.01C9.82358 15.981 9.52732 15.842 9.30263 15.6174C9.07795 15.3927 8.93903 15.0964 8.90999 14.78C8.89392 14.3736 8.99455 13.971 9.19999 13.62L11.62 8.77C11.95 8.12 12.17 8.01 12.56 8.01C12.95 8.01 13.17 8.12 13.5 8.77L15.92 13.62C16.1254 13.971 16.2261 14.3736 16.21 14.78C16.1809 15.0964 16.042 15.3927 15.8174 15.6174C15.5927 15.842 15.2964 15.981 14.98 16.01ZM21.99 5.66C21.9697 5.55649 21.9171 5.46206 21.8399 5.39021C21.7627 5.31837 21.6647 5.27279 21.56 5.26C18.1818 4.92552 15.0675 3.28586 12.88 0.689996C12.8313 0.636309 12.7718 0.59341 12.7055 0.564053C12.6392 0.534697 12.5675 0.519531 12.495 0.519531C12.4225 0.519531 12.3508 0.534697 12.2845 0.564053C12.2182 0.59341 12.1587 0.636309 12.11 0.689996C9.92243 3.28586 6.80817 4.92552 3.42999 5.26C3.32529 5.27279 3.22731 5.31837 3.15008 5.39021C3.07284 5.46206 3.02031 5.55649 2.99999 5.66C1.41999 13.85 4.54999 19.68 12.3 22.97C12.3617 22.9961 12.428 23.0096 12.495 23.0096C12.562 23.0096 12.6283 22.9961 12.69 22.97C20.44 19.68 23.56 13.86 21.99 5.66ZM12.5 21.96C5.39999 18.87 2.58999 13.71 3.92999 6.2C7.22181 5.78699 10.2595 4.21677 12.5 1.77C14.7405 4.21677 17.7782 5.78699 21.07 6.2C22.4 13.71 19.59 18.87 12.5 21.96Z"
                fill="#484848"
              />
            </svg>
          </div>

          <div>
            {" "}
            пробное подошел
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 20.5C5 20.6326 4.94732 20.7598 4.85355 20.8536C4.75979 20.9473 4.63261 21 4.5 21H4V21.5C4 21.6326 3.94732 21.7598 3.85355 21.8536C3.75979 21.9473 3.63261 22 3.5 22C3.36739 22 3.24021 21.9473 3.14645 21.8536C3.05268 21.7598 3 21.6326 3 21.5V21H2.5C2.36739 21 2.24021 20.9473 2.14645 20.8536C2.05268 20.7598 2 20.6326 2 20.5C2 20.3674 2.05268 20.2402 2.14645 20.1464C2.24021 20.0527 2.36739 20 2.5 20H3V19.5C3 19.3674 3.05268 19.2402 3.14645 19.1464C3.24021 19.0527 3.36739 19 3.5 19C3.63261 19 3.75979 19.0527 3.85355 19.1464C3.94732 19.2402 4 19.3674 4 19.5V20H4.5C4.63261 20 4.75979 20.0527 4.85355 20.1464C4.94732 20.2402 5 20.3674 5 20.5ZM6.5 22C6.40111 22 6.30444 22.0293 6.22221 22.0843C6.13999 22.1392 6.0759 22.2173 6.03806 22.3087C6.00022 22.4 5.99031 22.5006 6.00961 22.5975C6.0289 22.6945 6.07652 22.7836 6.14645 22.8536C6.21637 22.9235 6.30546 22.9711 6.40245 22.9904C6.49945 23.0097 6.59998 22.9998 6.69134 22.9619C6.7827 22.9241 6.86079 22.86 6.91573 22.7778C6.97068 22.6956 7 22.5989 7 22.5C7 22.3674 6.94732 22.2402 6.85355 22.1464C6.75979 22.0527 6.63261 22 6.5 22ZM22.5 2H22V1.5C22 1.36739 21.9473 1.24021 21.8536 1.14645C21.7598 1.05268 21.6326 1 21.5 1C21.3674 1 21.2402 1.05268 21.1464 1.14645C21.0527 1.24021 21 1.36739 21 1.5V2H20.5C20.3674 2 20.2402 2.05268 20.1464 2.14645C20.0527 2.24021 20 2.36739 20 2.5C20 2.63261 20.0527 2.75979 20.1464 2.85355C20.2402 2.94732 20.3674 3 20.5 3H21V3.5C21 3.63261 21.0527 3.75979 21.1464 3.85355C21.2402 3.94732 21.3674 4 21.5 4C21.6326 4 21.7598 3.94732 21.8536 3.85355C21.9473 3.75979 22 3.63261 22 3.5V3H22.5C22.6326 3 22.7598 2.94732 22.8536 2.85355C22.9473 2.75979 23 2.63261 23 2.5C23 2.36739 22.9473 2.24021 22.8536 2.14645C22.7598 2.05268 22.6326 2 22.5 2V2ZM19.92 6.87C17.4088 6.46601 15.0643 5.35617 13.16 3.67C13.1083 3.6189 13.0426 3.58418 12.9713 3.57017C12.8999 3.55616 12.826 3.56348 12.7588 3.59122C12.6916 3.61895 12.6341 3.66588 12.5934 3.72613C12.5527 3.78639 12.5306 3.85729 12.53 3.93L12.61 20.15C12.6133 20.2131 12.6322 20.2744 12.6651 20.3283C12.698 20.3822 12.7438 20.4271 12.7984 20.4589C12.853 20.4906 12.9146 20.5083 12.9778 20.5102C13.0409 20.5122 13.1035 20.4983 13.16 20.47C15.6842 19.3961 17.7634 17.4886 19.0502 15.066C20.337 12.6435 20.7535 9.8527 20.23 7.16C20.2162 7.08386 20.1789 7.01396 20.1232 6.96015C20.0676 6.90633 19.9966 6.87131 19.92 6.86V6.87Z"
                fill="#27B035"
              />
              <path
                d="M14.39 8.32C14.2615 7.9364 14.0156 7.60289 13.6873 7.3666C13.3589 7.13031 12.9645 7.00318 12.56 7.00318C12.1554 7.00318 11.7611 7.13031 11.4327 7.3666C11.1044 7.60289 10.8585 7.9364 10.73 8.32L8.30999 13.17C8.0324 13.6602 7.89408 14.2169 7.90999 14.78C7.94122 15.3613 8.18619 15.9105 8.59782 16.3222C9.00945 16.7338 9.5587 16.9788 10.14 17.01C11.0444 16.9449 11.8989 16.5706 12.56 15.95C13.2211 16.5706 14.0756 16.9449 14.98 17.01C15.5613 16.9788 16.1105 16.7338 16.5222 16.3222C16.9338 15.9105 17.1788 15.3613 17.21 14.78C17.2259 14.2169 17.0876 13.6602 16.81 13.17L14.39 8.32ZM11.67 12.7C11.67 12.65 11.68 11.47 12.56 11.47C13.44 11.47 13.44 12.65 13.44 12.7C13.3496 13.3883 13.0413 14.0296 12.56 14.53C12.0751 14.031 11.7631 13.3895 11.67 12.7ZM14.98 16.01C14.3408 15.9483 13.7398 15.6777 13.27 15.24C13.9321 14.5473 14.3439 13.6534 14.44 12.7C14.4677 12.436 14.4431 12.1692 14.3676 11.9147C14.2921 11.6602 14.1672 11.4231 14.0001 11.217C13.8329 11.0108 13.6267 10.8396 13.3934 10.7131C13.16 10.5867 12.904 10.5075 12.64 10.48L12.56 10.47C12.2945 10.4865 12.035 10.5553 11.7961 10.6724C11.5573 10.7895 11.344 10.9527 11.1684 11.1524C10.9928 11.3522 10.8584 11.5847 10.7728 11.8365C10.6873 12.0883 10.6524 12.3546 10.67 12.62L10.68 12.7C10.7753 13.6536 11.1872 14.5478 11.85 15.24C11.3802 15.6777 10.7792 15.9483 10.14 16.01C9.82358 15.981 9.52732 15.842 9.30263 15.6174C9.07795 15.3927 8.93904 15.0964 8.90999 14.78C8.89392 14.3736 8.99455 13.971 9.19999 13.62L11.62 8.77C11.95 8.12 12.17 8.01 12.56 8.01C12.95 8.01 13.17 8.12 13.5 8.77L15.92 13.62C16.1254 13.971 16.2261 14.3736 16.21 14.78C16.1809 15.0964 16.042 15.3927 15.8174 15.6174C15.5927 15.842 15.2964 15.981 14.98 16.01V16.01ZM21.99 5.66C21.9697 5.55649 21.9171 5.46206 21.8399 5.39021C21.7627 5.31837 21.6647 5.27279 21.56 5.26C18.1818 4.92552 15.0675 3.28586 12.88 0.689996C12.8313 0.636309 12.7718 0.59341 12.7055 0.564053C12.6392 0.534697 12.5675 0.519531 12.495 0.519531C12.4225 0.519531 12.3508 0.534697 12.2845 0.564053C12.2182 0.59341 12.1587 0.636309 12.11 0.689996C9.92243 3.28586 6.80817 4.92552 3.42999 5.26C3.32529 5.27279 3.22731 5.31837 3.15008 5.39021C3.07284 5.46206 3.02031 5.55649 2.99999 5.66C1.41999 13.85 4.54999 19.68 12.3 22.97C12.3617 22.9961 12.428 23.0096 12.495 23.0096C12.562 23.0096 12.6283 22.9961 12.69 22.97C20.44 19.68 23.56 13.86 21.99 5.66V5.66ZM12.5 21.96C5.39999 18.87 2.58999 13.71 3.92999 6.2C7.22181 5.78699 10.2595 4.21677 12.5 1.77C14.7405 4.21677 17.7782 5.78699 21.07 6.2C22.4 13.71 19.59 18.87 12.5 21.96V21.96Z"
                fill="#484848"
              />
            </svg>
          </div>
        </div>
        {months.length >= 1 && (
          <div className="form">
            <form className="form_container" onSubmit={(e) => submit(e)}>
              <h3 className="form_title">Добавить студента</h3>

              <div className="formbox2">
                <div className="box_input">
                  <div className="form_tilte">Имя</div>
                  <input
                    className="form_inpuit2"
                    id="name"
                    type="text"
                    required
                    value={student.name}
                    onChange={onChangeStudent}
                  />
                </div>

                <div className="box_input2">
                  <div className="form_tilte">Фамилия</div>
                  <input
                    className="form_inpuit2"
                    id="family"
                    type="text"
                    required
                    value={student.family}
                    onChange={onChangeStudent}
                  />
                </div>
              </div>

              <div className="formbox2">
                <div className="box_input input_3">
                  <div className="form_tilte">Отчество</div>
                  <input
                    className="form_inpuit2"
                    id="patronymic"
                    type="text"
                    required
                    value={student.patronymic}
                    onChange={onChangeStudent}
                  />
                </div>

                <div className="box_input2 input_4">
                  <div className="form_tilte">Возраст</div>
                  <input
                    className="form_inpuit2"
                    id="age_number"
                    type="number"
                    required
                    value={student.age_number}
                    onChange={onChangeStudent}
                  />
                </div>
              </div>

              <div className="formbox2">
                <div className="box_input input_3">
                  <div className="form_tilte">Дата рождения</div>
                  <input
                    className="form_inpuit2"
                    id="age"
                    type="date"
                    value={student.age}
                    onChange={onChangeStudent}
                  />
                </div>

                <div className="box_input2 input_4">
                  <div className="form_tilte">Телефон ученика</div>
                  <input
                    className="form_inpuit2"
                    id="phone_student"
                    type="tel"
                    value={student.phone_student}
                    onChange={onChangeStudent}
                  />
                </div>
              </div>

              <div className="formbox2">
                <div className="box_input input_3 input_all">
                  <div className="form_tilte">ФИО родителя 1</div>
                  <input
                    className="form_inpuit2"
                    id="parents_1"
                    type="text"
                    value={student.parents_1}
                    onChange={onChangeStudent}
                  />
                </div>
              </div>
              <div className="formbox2">
                <div className="box_input input_3 input_all">
                  <div className="form_tilte">ФИО родителя 2</div>
                  <input
                    className="form_inpuit2"
                    id="parents_2"
                    type="text"
                    value={student.parents_2}
                    onChange={onChangeStudent}
                  />
                </div>
              </div>

              <div className="formbox2">
                <div className="box_input input_3">
                  <div className="form_tilte">Телефон родителя 1</div>
                  <input
                    className="form_inpuit2"
                    id="phone_parents_1"
                    type="tel"
                    value={student.phone_parents_1}
                    onChange={onChangeStudent}
                  />
                </div>

                <div className="box_input2 input_4">
                  <div className="form_tilte">Телефон родителя 2</div>
                  <input
                    className="form_inpuit2"
                    id="phone_parents_2"
                    type="tel"
                    value={student.phone_parents_2}
                    onChange={onChangeStudent}
                  />
                </div>
              </div>

              <div className="formbox2">
                <div className="box_input input_3 input_all">
                  <div className="form_tilte">Заметки</div>
                  <textarea
                    className="form_note"
                    rows="3"
                    cols="45"
                    name="text"
                    id="note"
                    value={student.note}
                    onChange={onChangeStudent}
                  />
                </div>
              </div>
              <div className="formbox2">
                <div className="box_input input_3">
                  <div className="form_tilte">Запись</div>
                  <select
                    className="form_inpuit2"
                    value={checked.status}
                    onChange={handleTwo}
                  >
                    <option value={"trial"}>Пробное</option>
                    <option value={"lesson"}>Курс</option>
                  </select>
                </div>

                <div className="box_input2 input_4">
                  <div className="form_tilte">Дата начала</div>
                  <select
                    className="form_inpuit2"
                    id="days"
                    value={student.days}
                    onChange={onChangeStudent}
                  >
                    {months.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="formbox2">
                <div className="box_input input_3">
                  <div className="form_tilte">Скидка</div>
                  <input
                    className="form_inpuit2 pocent"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={checked.sale}
                    onChange={handleSale}
                  />
                  %
                </div>

                <div className="box_input2 input_4">
                  <div className="form_tilte">Уровень</div>
                  <select
                    className="form_inpuit2"
                    id="level"
                    type="checkbox"
                    value={student.level}
                    onChange={onChangeStudent}
                  >
                    <option value={"Начинающий"}>Начинающий</option>
                    <option value={"Продвинутый"}>Продвинутый</option>
                    <option value={"Резидент"}>Резидент</option>
                  </select>
                </div>
              </div>
              <div className="form_sum">
                В этом месяце {months.length} занятия(ий)
              </div>
              {checked.status === "trial" && (
                <div>Выбрано 1 пробное занятие</div>
              )}
              {checked.status === "lesson" && (
                <div>Выбрано {actualDaysMonthSort.length} занятия(ий)</div>
              )}

              <div className="form_sum space-between">
                <div>Цена</div>
                <div>{priceTrialF}</div>
              </div>
              <div className="form_sum space-between">
                <div>Скидка</div>
                <div>{Math.floor(result).toString()}</div>
              </div>
              <div className="form_sum space-between">
                <div>Итого</div>
                <div>{Math.floor(result2).toString()}</div>
              </div>
              <button>Создать</button>
            </form>
          </div>
        )}
      </div>

      <br />
      <br />
      <div className="container_dashboard">
        <div className="card">
          <div className="group_number">
            <div className="title_number_table2">№</div>
            <div className="title_fio_table">ФИО</div>
            <div className="title_age_table">возраст</div>
            <div className="title_phone_table">телефон</div>
            <div className="title_age_table">курс</div>
            <div className="title_age_table">пробное</div>
            <div className="title_day_table">
              {dayall.map((x) => (
                <div key={x} className="table_day">
                  {moment(x, "DD.MM.YYYY").format("D")}
                </div>
              ))}
            </div>
            <div className="title_age_table">прочее</div>
          </div>
          {studentsTable.map((x, index) => (
            <div className="group_number2" key={x.id}>
              <div className="title_number_table2">{index + 1}</div>
              <div className="title_fio_table">{x.name}</div>
              <div className="title_age_table">{x.age}</div>
              <div className="title_phone_table">{x.phone_student}</div>
              <div className="title_age_table">{x.course}</div>
              <div className="title_age_table">{x.trial}</div>
              <div className="title_day_table">
                {x.dates.map((s, index) => (
                  <div className="table_day" key={index}>
                    <div>
                      {s.trial ? (
                        <div className="row">
                          <div>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5 20.5C5 20.6326 4.94732 20.7598 4.85355 20.8536C4.75979 20.9473 4.63261 21 4.5 21H4V21.5C4 21.6326 3.94732 21.7598 3.85355 21.8536C3.75979 21.9473 3.63261 22 3.5 22C3.36739 22 3.24021 21.9473 3.14645 21.8536C3.05268 21.7598 3 21.6326 3 21.5V21H2.5C2.36739 21 2.24021 20.9473 2.14645 20.8536C2.05268 20.7598 2 20.6326 2 20.5C2 20.3674 2.05268 20.2402 2.14645 20.1464C2.24021 20.0527 2.36739 20 2.5 20H3V19.5C3 19.3674 3.05268 19.2402 3.14645 19.1464C3.24021 19.0527 3.36739 19 3.5 19C3.63261 19 3.75979 19.0527 3.85355 19.1464C3.94732 19.2402 4 19.3674 4 19.5V20H4.5C4.63261 20 4.75979 20.0527 4.85355 20.1464C4.94732 20.2402 5 20.3674 5 20.5ZM6.5 22C6.40111 22 6.30444 22.0293 6.22221 22.0843C6.13999 22.1392 6.0759 22.2173 6.03806 22.3087C6.00022 22.4 5.99031 22.5006 6.00961 22.5975C6.0289 22.6945 6.07652 22.7836 6.14645 22.8536C6.21637 22.9235 6.30546 22.9711 6.40245 22.9904C6.49945 23.0097 6.59998 22.9998 6.69134 22.9619C6.7827 22.9241 6.86079 22.86 6.91573 22.7778C6.97068 22.6956 7 22.5989 7 22.5C7 22.3674 6.94732 22.2402 6.85355 22.1464C6.75979 22.0527 6.63261 22 6.5 22ZM22.5 2H22V1.5C22 1.36739 21.9473 1.24021 21.8536 1.14645C21.7598 1.05268 21.6326 1 21.5 1C21.3674 1 21.2402 1.05268 21.1464 1.14645C21.0527 1.24021 21 1.36739 21 1.5V2H20.5C20.3674 2 20.2402 2.05268 20.1464 2.14645C20.0527 2.24021 20 2.36739 20 2.5C20 2.63261 20.0527 2.75979 20.1464 2.85355C20.2402 2.94732 20.3674 3 20.5 3H21V3.5C21 3.63261 21.0527 3.75979 21.1464 3.85355C21.2402 3.94732 21.3674 4 21.5 4C21.6326 4 21.7598 3.94732 21.8536 3.85355C21.9473 3.75979 22 3.63261 22 3.5V3H22.5C22.6326 3 22.7598 2.94732 22.8536 2.85355C22.9473 2.75979 23 2.63261 23 2.5C23 2.36739 22.9473 2.24021 22.8536 2.14645C22.7598 2.05268 22.6326 2 22.5 2ZM19.92 6.87C17.4088 6.46601 15.0643 5.35617 13.16 3.67C13.1083 3.6189 13.0426 3.58418 12.9713 3.57017C12.8999 3.55616 12.826 3.56348 12.7588 3.59122C12.6916 3.61895 12.6341 3.66588 12.5934 3.72613C12.5527 3.78639 12.5306 3.85729 12.53 3.93L12.61 20.15C12.6133 20.2131 12.6322 20.2744 12.6651 20.3283C12.698 20.3822 12.7438 20.4271 12.7984 20.4589C12.853 20.4906 12.9146 20.5083 12.9778 20.5102C13.0409 20.5122 13.1035 20.4983 13.16 20.47C15.6842 19.3961 17.7634 17.4886 19.0502 15.066C20.337 12.6435 20.7535 9.8527 20.23 7.16C20.2162 7.08386 20.1789 7.01396 20.1232 6.96015C20.0676 6.90633 19.9966 6.87131 19.92 6.86V6.87Z"
                                fill="#FFB400"
                              />
                              <path
                                d="M14.39 8.32C14.2615 7.9364 14.0156 7.60289 13.6873 7.3666C13.3589 7.13031 12.9645 7.00318 12.56 7.00318C12.1554 7.00318 11.7611 7.13031 11.4327 7.3666C11.1044 7.60289 10.8585 7.9364 10.73 8.32L8.30999 13.17C8.0324 13.6602 7.89408 14.2169 7.90999 14.78C7.94122 15.3613 8.18619 15.9105 8.59782 16.3222C9.00945 16.7338 9.5587 16.9788 10.14 17.01C11.0444 16.9449 11.8989 16.5706 12.56 15.95C13.2211 16.5706 14.0756 16.9449 14.98 17.01C15.5613 16.9788 16.1105 16.7338 16.5222 16.3222C16.9338 15.9105 17.1788 15.3613 17.21 14.78C17.2259 14.2169 17.0876 13.6602 16.81 13.17L14.39 8.32ZM11.67 12.7C11.67 12.65 11.68 11.47 12.56 11.47C13.44 11.47 13.44 12.65 13.44 12.7C13.3496 13.3883 13.0413 14.0296 12.56 14.53C12.0751 14.031 11.7631 13.3895 11.67 12.7ZM14.98 16.01C14.3408 15.9483 13.7398 15.6777 13.27 15.24C13.9321 14.5473 14.3439 13.6534 14.44 12.7C14.4677 12.436 14.4431 12.1692 14.3676 11.9147C14.2921 11.6602 14.1672 11.4231 14.0001 11.217C13.8329 11.0108 13.6267 10.8396 13.3934 10.7131C13.16 10.5867 12.904 10.5075 12.64 10.48L12.56 10.47C12.2945 10.4865 12.035 10.5553 11.7961 10.6724C11.5573 10.7895 11.344 10.9527 11.1684 11.1524C10.9928 11.3522 10.8584 11.5847 10.7728 11.8365C10.6873 12.0883 10.6524 12.3546 10.67 12.62L10.68 12.7C10.7753 13.6536 11.1872 14.5478 11.85 15.24C11.3802 15.6777 10.7792 15.9483 10.14 16.01C9.82358 15.981 9.52732 15.842 9.30263 15.6174C9.07795 15.3927 8.93903 15.0964 8.90999 14.78C8.89392 14.3736 8.99455 13.971 9.19999 13.62L11.62 8.77C11.95 8.12 12.17 8.01 12.56 8.01C12.95 8.01 13.17 8.12 13.5 8.77L15.92 13.62C16.1254 13.971 16.2261 14.3736 16.21 14.78C16.1809 15.0964 16.042 15.3927 15.8174 15.6174C15.5927 15.842 15.2964 15.981 14.98 16.01ZM21.99 5.66C21.9697 5.55649 21.9171 5.46206 21.8399 5.39021C21.7627 5.31837 21.6647 5.27279 21.56 5.26C18.1818 4.92552 15.0675 3.28586 12.88 0.689996C12.8313 0.636309 12.7718 0.59341 12.7055 0.564053C12.6392 0.534697 12.5675 0.519531 12.495 0.519531C12.4225 0.519531 12.3508 0.534697 12.2845 0.564053C12.2182 0.59341 12.1587 0.636309 12.11 0.689996C9.92243 3.28586 6.80817 4.92552 3.42999 5.26C3.32529 5.27279 3.22731 5.31837 3.15008 5.39021C3.07284 5.46206 3.02031 5.55649 2.99999 5.66C1.41999 13.85 4.54999 19.68 12.3 22.97C12.3617 22.9961 12.428 23.0096 12.495 23.0096C12.562 23.0096 12.6283 22.9961 12.69 22.97C20.44 19.68 23.56 13.86 21.99 5.66ZM12.5 21.96C5.39999 18.87 2.58999 13.71 3.92999 6.2C7.22181 5.78699 10.2595 4.21677 12.5 1.77C14.7405 4.21677 17.7782 5.78699 21.07 6.2C22.4 13.71 19.59 18.87 12.5 21.96Z"
                                fill="#484848"
                              />
                            </svg>
                          </div>
                          {/* <select onChange={handleChange}>
                    <option value={'1'} data-id={1}>1</option>
                    <option value={'2'} data-id={2}>2</option>
                  </select> */}
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                    <div>{s.course ? <div>+c</div> : <div></div>}</div>
                  </div>
                ))}
              </div>
              <div className="title_age_table">прочее</div>
            </div>
          ))}
        </div>
      </div>
      <br />
      <br />
      <div className="container_dashboard">
        <div className="card">
          <div className="group_number">
            <div className="title_number_table2">№</div>
            <div className="title_fio_table">ФИО</div>
            <div className="title_age_table">возраст</div>
            <div className="title_phone_table">телефон</div>
            <div className="title_age_table">курс</div>
            <div className="title_age_table">пробное</div>
            {/* <div className='title_day_table'>
              {dayall.map(x => 
              <div  key={x}></div>
              )}
            </div> */}
            <div className="title_age_table">прочее</div>
          </div>

          <div className="flex_row2">
            <div className="flex_column">
              {/* {studentsTable.map((x, index) =>
        <div className='box_dashboard_table' key={index}>
          <div className='title_number_table'>{index + 1}</div>
          <div className='title_fio_table2' >{x.name}</div>
          <div className='title_age_table'>{x.age}</div>
          <div className='title_phone_table'>{x.phone_student}</div>
          <div className='title_age_table'>{x.course}</div>
          <div className='title_age_table'>{x.trial}</div>
         
          {x.dates.map(x => 
          <div > 
          
          <div>{x.trial ? 
          <div>

          {x.status === 'придут' && 
          
          <div> 
          <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.4998 5.14575L4.9477 8.66658C4.9477 8.66658 4.16645 20.8541 12.4998 20.8541C20.8331 20.8541 20.0519 8.66658 20.0519 8.66658L12.4998 5.14575Z" stroke="#4682DC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.5 9V16" stroke="#4682DC"/>
            <path d="M9 12.5H16" stroke="#4682DC"/>
          </svg>
          </div>
          
          }  
          <select className='form_inpuit2' id="level" type="checkbox" > 
            <option value={x.status}>придут </option>
            <option value={'подошел'}>подошел</option>
            <option value={'отсутствовал'}>отсутствовал</option>
            <option value={'заболел'}>заболел</option>
            <option value={'пропустят'}>пропустят</option>
          </select>
          </div>
          : 
          <div>-</div>
          }
          </div>
          <div>{x.course ? 
          <div >курс
          <select className='form_inpuit2' id="level" type="checkbox" > 
            <option value={x.status}>{x.status}</option>
            <option value={'подошел'}>подошел</option>
            <option value={'отсутствовал'}>отсутствовал</option>
            <option value={'заболел'}>заболел</option>
            <option value={'пропустят'}>пропустят</option>
          </select>
        </div>
          : 
          <div>-</div>
          }
          </div>
          
          
          </div>
          )}
        </div>
        )} */}
            </div>
          </div>

          {/* {studentPrecents.map(x => 
         <div className='title_day_table2' >
           {x.map(s=>
           <div className="box_dashboard_table2" >
             {s}
             <select  className='form_inpuit2' id="level" type="checkbox" > 
                    <option value={'придут'}>придут</option>
                    <option value={'подошел'}>подошел</option>
                    <option value={'отсутствовал'}>отсутствовал</option>
                    <option value={'заболел'}>заболел</option>
                    <option value={'пропустят'}>пропустят</option>
              </select>
              <select onChange={handleChange}>
                  {options.map((option, key) => (
                      <option value={option.id} key={key}>{option.name}</option>
                  ))}
              </select>
           </div>
           )}
        </div>
         )} */}
        </div>
      </div>
    </div>
  );
};

export default Group;
