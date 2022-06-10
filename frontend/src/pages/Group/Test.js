import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useFetch from "../../hooks/useFetch";
import "moment/locale/ru";
import "./Group.css";


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


const Test = () => {
  const { id } = useParams();

  const url = "http://localhost:1337/api/students";
  const url2 = "http://localhost:1337/api/presences";
  const { loading, error, data } = useFetch(
    `http://localhost:1337/api/groups/${id}?populate[0]=teacher&populate[1]=days&populate[2]=office&populate[3]=office.address&populate[4]=office.address.district&populate[5]=office.address.district.city`
  );

  const [student, setStudent] = useState({
    groups: id,
    name: '',
    family: '',
    patronymic: '',
    age: '',
    city: '',
    district: '',
    address: '',
    phone_student: '',
    parents_1: '',
    phone_parents_1: '',
    parents_2: '',
    phone_parents_2: '',
    level: '',
    note: '',
    days: '',
    age_number: '',
    payment_status: '',
  });
  const [checked, setChecked] = useState({
    months: moment().format("MMMM YYYY"),
    status: "trial",
    sale: 0,
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
          city: data.data.attributes.office.data.attributes.address.data.attributes.district.data.attributes.city.data.attributes.title,
          district: data.data.attributes.office.data.attributes.address.data.attributes.district.data.attributes.title,
          // address: data.data.attributes.office.data.attributes.address.data.attributes.title,
        }
    })
    .then(res=>{
        console.log(res);
        let d = 0;
        while (d < TrialOrLessonPresences.length ) {
        Axios.post(url2, {
          data: {
            student: res.data.data.id,
            day: TrialOrLessonPresences[d],
            price_lesson: pricePresenceLesson[d],
            trial_price: pricePresenceTrial,
            
        }})
        d++
        }

    })
  }
  const {
    months,
    dayFilterMonth,
    monthsGroup,
    actualDayGroupFormatDay
  } = useMemo(() => {
    if (!data?.data) {
      return {
        months: [],
        dayFilterMonth: [], 
        monthsGroup: [],
        actualDayGroupFormatDay: [],
      }
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
    }
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
    const newstudent = {...student};
    newstudent[e.target.id] = e.target.value
    setStudent(newstudent);
  }

  // актуальные дни
  const actualDaysMonthSort = []
    let q = 0
    while (q < months.length  ) {
      if (months[q] >= moment(student.days, "DD.MM.YYYY").format("DD.MM.YYYY")
      ){
        actualDaysMonthSort.push(months[q])
      }
      q++
  }

   // Все дни группы за весь месяц (с учетом прошедших) //начало
   const daysOfMonths = data.data.attributes.days.data.map(x => moment(x.attributes.title, 'YYYY-MM-DD').format("MMMM YYYY")) //дни переводят в месяцы 5.2022
   const AllDays = data.data.attributes.days.data.map(x => x)
   
   const days = [] 
   let i = 0

   while (i < daysOfMonths.length ) {
     if (daysOfMonths[i] === checked.months ){ 
      days.push(AllDays[i])
     }
     i++
   }
   //конец
   days.sort((a,b)=> a.id > b.id ? 1 : -1) 
  const priceLessonNow = []
  
  let z = 0
  while (z < months.length  ) {
    if (moment(months[z], 'DD.MM.YYYY').format('DD.MM.YYYY') >=  moment(student.days, 'DD.MM.YYYY').format('DD.MM.YYYY')){
      priceLessonNow.push(days[z])
    } 
    z++
  }


  const priceLessonFilter = priceLessonNow.map(x=>x.attributes.price_lesson)
  const priceTrial = priceLessonNow.map(x=>x.attributes.trial_price)

  const sumprise = priceLessonFilter.reduce((acc,rec) => acc+=rec,0)
  let priceTrialF = 0

  if ('trial' ===  checked.status){
    priceTrialF = priceTrial[0]
  } 
  
  if ('lesson' ===  checked.status){
    priceTrialF = sumprise
  }
  const pocet = checked.sale
  const result = priceTrialF / 100 * pocet
  const result2 = priceTrialF - result
  const idDay = data.data.attributes.days.data.map(x => moment(x.attributes.title, 'YYYY-MM-DD').format('DD.MM.YYYY'))
  const idDayd = data.data.attributes.days.data.map(x => x.id)
  const dayResult = []
  const dayResultTrial = []
  const dayAllActual = []
  let j = 0
  while (j < actualDayGroupFormatDay.length){
    if ( moment(student.days, 'DD.MM.YYYY').format('x') <= moment(actualDayGroupFormatDay[j], 'DD.MM.YYYY').format('x') ){
        dayAllActual.push(actualDayGroupFormatDay[j])
  }
  j++
  }

  let g = 0
  while (g < dayAllActual.length){
    if (idDay.includes(dayAllActual[g])){
    let index = idDay.indexOf(dayAllActual[g])
    dayResult.push(idDayd[index])
  }
  g++
  }

    if (idDay.includes(student.days)){
    let index = idDay.indexOf(student.days)
    dayResultTrial.push(idDayd[index])
  }



  let TrialOrLesson = []

  if ('trial' ===  checked.status){
    TrialOrLesson = dayResultTrial
  } 
  
  if ('lesson' ===  checked.status){
    TrialOrLesson = dayResult
  }
  const presencesDays = []
  const dayResultTrialPresences = []
  const dayAllActualPresences = []
  let f = 0
  while (f < months.length){
    if ( moment(student.days, 'DD.MM.YYYY').format('x') <= moment(months[f], 'DD.MM.YYYY').format('x') ){
        presencesDays.push(months[f])
  }
  f++
  }


  let y = 0
  while (y < presencesDays.length){
    if (idDay.includes(presencesDays[y])){
    let index = idDay.indexOf(presencesDays[y])
    dayResultTrialPresences.push(idDayd[index])
  }
  y++
  }

  if (idDay.includes(student.days)){
    let index = idDay.indexOf(student.days)
    dayAllActualPresences.push(idDayd[index])
  }

  let TrialOrLessonPresences = []

  if ('trial' ===  checked.status){
    TrialOrLessonPresences = dayAllActualPresences
  } 
  
  if ('lesson' ===  checked.status){
    TrialOrLessonPresences = dayResultTrialPresences
  }

  const result4 = priceTrial[0] / 100 * pocet
  const result5 = priceTrial[0] - result4

  const sumprise2 = priceLessonFilter.reduce((acc,rec) => acc+=rec,0)
  const result6 = sumprise2 / 100 * pocet
  const result7 = sumprise2 - result6
  const sumprise3 =  result7 / priceLessonFilter.length
  
  const priceSaleCours = []

  let m = 0
  while (m < priceLessonFilter.length){
   priceSaleCours.push(Math.floor(sumprise3))
    m++
  }

  let pricePresenceTrial = ''
  let pricePresenceLesson = []
  if ('trial' ===  checked.status){
    pricePresenceTrial = Math.floor(result5)
  } 
  
  if ('lesson' ===  checked.status){
    if (!checked.sale || checked.sale === '0'){
      pricePresenceLesson = priceLessonFilter
    } else {
      pricePresenceLesson = priceSaleCours
    }
  }


  console.log()
  return (
    <div className='container_group'>
      
      <div className='box_goup'>
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
        <br/>
        <div >Уровень: {data.data.attributes.level}</div>
        <div >Направление: {data.data.attributes.course}</div>
        <div >Мест: {data.data.attributes.capacity}</div>
        <div >Преподавтель: {data.data.attributes.teacher.data.attributes.title}</div>
        <br/>
        <br/>
          <div>Check:{checked.months}</div>
          <div>Student:{student.days}</div>
          <div>Выбранный день:{student.days}</div>
          <br/>
          <br/>
          <div>Дни:{dayFilterMonth.map(x => 
          <div key={x}>{moment(x, 'DD.MM.YYYY').format('D')}</div>
          )}
          </div>
        </div>
        {months.length >= 1 &&
        <div className="form">
          <form className='form_container' onSubmit={(e) => submit(e)}>
          <h3 className='form_title'>Добавить студента</h3>

          <div className='formbox2'>
          <div className='box_input'>
                <div className='form_tilte'>Имя</div>
                <input  
                  className='form_inpuit2'
                  id="name"
                  type="text" 
                  required
                  value={student.name}
                  onChange={onChangeStudent}
                />
              </div>

              <div className='box_input2'>
                <div className='form_tilte'>Фамилия</div>
                <input 
                    className='form_inpuit2'
                    id="family"
                    type="text" 
                    required
                    value={student.family}
                    onChange={onChangeStudent}
                />
              </div>
            </div>

            <div className='formbox2'>
              <div className='box_input input_3'>
                <div className='form_tilte'>Отчество</div>
                <input 
                  className='form_inpuit2'
                  id="patronymic"
                  type="text" 
                  required
                  value={student.patronymic}
                  onChange={onChangeStudent}
                />
              </div>

              <div className='box_input2 input_4'>
                <div className='form_tilte'>Возраст</div>
                <input 
                  className='form_inpuit2'
                  id="age_number"
                  type="number" 
                  required
                  value={student.age_number}
                  onChange={onChangeStudent}
                />
              </div>
            </div>


            <div className='formbox2'>
              <div className='box_input input_3'>
                <div className='form_tilte'>Дата рождения</div>
                <input 
                  className='form_inpuit2'
                  id="age"
                  type="date" 
                  required
                  value={student.age}
                  onChange={onChangeStudent}
                />
              </div>

              <div className='box_input2 input_4'>
                <div className='form_tilte'>Телефон ученика</div>
                <input 
                    className='form_inpuit2'
                    id="phone_student"
                    type="tel" 
                    required
                    value={student.phone_student}
                    onChange={onChangeStudent}
                />
              </div>
            </div>


            <div className='formbox2'>
              <div className='box_input input_3 input_all'>
                <div className='form_tilte'>ФИО родителя 1</div>
                <input 
                  className='form_inpuit2'
                  id="parents_1"
                  type="text" 
                  required
                  value={student.parents_1}
                  onChange={onChangeStudent}
                />
              </div>
            </div>
            <div className='formbox2'>
              <div className='box_input input_3 input_all'>
                <div className='form_tilte'>ФИО родителя 2</div>
                <input 
                  className='form_inpuit2'
                  id="parents_2"
                  type="text" 
                  required
                  value={student.parents_2}
                  onChange={onChangeStudent}
                />
              </div>
            </div>
                         
            <div className='formbox2'>
              <div className='box_input input_3'>
                <div className='form_tilte'>Телефон родителя 1</div>
                <input 
                    className='form_inpuit2'
                    id="phone_parents_1"
                    type="tel" 
                    required
                    value={student.phone_parents_1}
                    onChange={onChangeStudent}
                />
              </div>

              <div className='box_input2 input_4'>
                <div className='form_tilte'>Телефон родителя 2</div>
                <input 
                    className='form_inpuit2'
                    id="phone_parents_2"
                    type="tel" 
                    required
                    value={student.phone_parents_2}
                    onChange={onChangeStudent}
                />
              </div>
            </div>            

            <div className='formbox2'>
              <div className='box_input input_3 input_all'>
                <div className='form_tilte'>Заметки</div>
                <textarea 
                  className='form_note'
                  rows="3" 
                  cols="45" 
                  name="text"
                  id="note"
                  value={student.note}
                  onChange={onChangeStudent}
                />
              </div>
              </div>
              <div className='formbox2'>
              <div className='box_input input_3'>
                <div className='form_tilte'>Запись</div>
                <select className='form_inpuit2' value={checked.status} onChange={handleTwo}>
                  <option value={"trial"}>Пробное</option>
                  <option value={"lesson"}>Курс</option>
                </select>
              </div>

              <div className='box_input2 input_4'>
                <div className='form_tilte'>Дата начала</div>
                <select className='form_inpuit2' id='days' value={student.days} onChange={onChangeStudent}>
                  {months.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='formbox2'>
              <div className='box_input input_3'>
                <div className='form_tilte'>Скидка</div>
                <input 
                  className='form_inpuit2 pocent'
                  type="number" 
                  min="0" 
                  max="100"
                  required
                  value={checked.sale}
                  onChange={handleSale}
                />%
              </div>

              <div className='box_input2 input_4'>
                <div className='form_tilte'>Уровень</div>
                <select  className='form_inpuit2' id="level" type="checkbox" value={student.level}  onChange={onChangeStudent}> 
                  <option value={'Начинающий'}>Начинающий</option>
                  <option value={'Продвинутый'}>Продвинутый</option>
                  <option value={'Резидент'}>Резидент</option>
                </select>
              </div>
            </div>  
            <div className='form_sum'>В этом месяце {months.length} занятия(ий)</div>
            {checked.status === "trial" && <div>Выбрано 1 пробное занятие</div>}
            {checked.status === "lesson" && <div>Выбрано {actualDaysMonthSort.length} занятия(ий)</div>}

            <div className='form_sum space-between'>
                <div>Цена</div>
                <div>{priceTrialF}</div>
              </div>
              <div className='form_sum space-between'>
                <div>Скидка</div>
                <div>{Math.floor(result).toString()}</div>
              </div>
              <div className='form_sum space-between'>
                <div>Итого</div>
                <div>{Math.floor(result2).toString()}</div>
              </div>
              <button>Создать</button>
        </form>

      </div>
       }
      </div>
     
    </div>
  );
};

export default Test;
