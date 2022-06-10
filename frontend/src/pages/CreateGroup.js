import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import useFetch from '../hooks/useFetch';

const CreateGroup = () => {
  const { id, city } = useParams()
  let navigate = useNavigate();
  const url = "http://localhost:1337/api/groups"
  const url2 = "http://localhost:1337/api/days"
  const { loading, error, data } = useFetch('http://localhost:1337/api/teachers?populate[0]=team_member')
  
  const [group, setGroup] = useState({
    title: 'Группа',
    start_day: '',
    end_day: '',
    office: id,
    start_time: '',
    end_time: '',
    days_week: '',
    break: '',
    capacity: '',
    age_start: '',
    age_end: '',
    recalculation: false,
    level: 'Начинающие',
    provision_of_inventory: false,
    course: '',
    soft: '',
    group_messenger: '',
    note: '',
    trial_lesson: 0,
    price_lesson: 0,
    teacher: '',
  });  
  const [days, setDays] = useState({
      title: '',
      group: '',
      trial_price: '',
      price_lesson: '',
  });  
  
  const start_time = moment(group.start_time,'HH:mm').format('HH:mm:ss')
  const end_time = moment(group.end_time,'HH:mm').format('HH:mm:ss')
  const breaks = moment(group.break,'HH:mm').format('HH:mm:ss')
  const checkList = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
  const [checked, setChecked] = useState([]);
  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };
  
  const wd = checked.join(' ')
  const startDate = moment(group.start_day, 'YYYY-MM-DD');
  const endDate = moment(group.end_day, 'YYYY-MM-DD');
  const daysOfWeek = [];
  const daysOfWeek2 = [];
  const weekdaysChecked = []
  let i = 0;
  let weekdays = []

  if(checked.includes('Понедельник')) {
    weekdays.push(1) 
  } 
  if (checked.includes('Вторник')) {
    weekdays.push(2)
  } 
  if (checked.includes('Среда')) {
    weekdays.push(3)
  } 
  if (checked.includes('Четверг')) {
    weekdays.push(4)
  } 
  if (checked.includes('Пятница')) {
    weekdays.push(5)
  } 
  if (checked.includes('Суббота')) {
    weekdays.push(6)
  } 
  if (checked.includes('Воскресенье')) {
    weekdays.push(0)
  }
  

  while (startDate < endDate ) {
    daysOfWeek.push(startDate.day());
    daysOfWeek2.push(startDate.format('DD.MM.YYYY'));
    startDate.add(1, "day");
  }

  while (i < daysOfWeek.length ) {
      if (daysOfWeek[i] === weekdays[0] || 
        daysOfWeek[i] === weekdays[1] || 
        daysOfWeek[i] === weekdays[2] || 
        daysOfWeek[i] === weekdays[3] ||
        daysOfWeek[i] === weekdays[4] ||
        daysOfWeek[i] === weekdays[5] ||
        daysOfWeek[i] === weekdays[6] ){
        weekdaysChecked.push(daysOfWeek2[i])
      }
    i++
  }

  function submit(e) {
      e.preventDefault();
      Axios.post(url, {
          data: {
              title: group.title,
              start_day: group.start_day,
              end_day: group.end_day,
              office: id,
              start_time: start_time,
              end_time: end_time,
              days_week: wd,
              break: breaks,
              capacity: group.capacity,
              age_start: group.age_start,
              age_end: group.age_end,
              recalculation: group.recalculation,
              level: group.level,
              provision_of_inventory: group.provision_of_inventory,
              course: group.course,
              soft: group.soft,
              group_messenger: group.group_messenger,
              note: group.note,
              trial_lesson: group.trial_lesson,
              price_lesson: group.price_lesson,
              teacher: group.teacher,
          }
      })
      .then(res=>{

          // console.log(res.data.data.id)
          let d = 0;
            while (d < weekdaysChecked.length ) {
              Axios.post(url2, {
                data: {
                  title: moment(weekdaysChecked[d], 'DD.MM.YYYY').format('YYYY-MM-DD'),
                  group: res.data.data.id,
                  price_lesson: group.price_lesson, 
                  trial_price: group.trial_lesson, 
                }
              })
              d++
            }
            navigate(`/group/${res.data.data.id}`);
      }) 
  }
  
 

  const handle = (e) => {
      e.preventDefault();
      const newgroup = {...group};
      newgroup[e.target.id] = e.target.value
      setGroup(newgroup)
      const newday = {...days};
      newday[e.target.id] = e.target.value
      setDays(newday)
      
      console.log(newgroup)
  }
  
  if (loading) return <p>loading...</p>
  if (error) return <p>Error :(</p>
  console.log(data.data.map(x=>x.attributes.title))
  return (
    <div>
      <form onSubmit={(e) => submit(e)}>
            <h2>Создать группу</h2>
            <div>Название группы</div>
            <input 
                id="title"
                type="text" 
                required
                value={group.title}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Направление</div>
            <input 
                id="course"
                type="text" 
                required
                value={group.course}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Cофт</div>
            <input 
                id="soft"
                type="text" 
                value={group.soft}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Количество мест</div>
            <input 
                id="capacity"
                type="number" 
                required
                value={group.capacity}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Цена пробного занятия</div>
            <input 
                id="trial_lesson"
                type="number" 
                required
                value={group.trial_lesson}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Цена одного занятия</div>
            <input 
                id="price_lesson"
                type="number" 
                required
                value={group.price_lesson}
                onChange={(e) => handle(e)}
            />
            
            <br/>
            <br/>
            <div>Возраст</div>
            <div>c</div>
            <input 
                id="age_start"
                type="number" 
                required
                value={group.age_start}
                onChange={(e) => handle(e)}
            />
            <div>до</div>
            <input 
                id="age_end"
                type="number" 
                required
                value={group.age_end}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Перерасчет</div>
            <select id="recalculation"  type="checkbox"   onChange={(e) => handle(e)}>
              <option value={false}>Невозможен</option>
              <option value={true}>Возможен</option>
            </select>
            <br/>
            <br/>
            <div>Инветарь</div>
            <select id="provision_of_inventory"  type="checkbox"  onChange={(e) => handle(e)}>
              <option value={false}>Не предоставляем</option>
              <option value={true}>Предоставляем</option>
            </select>
            <br/>
            <br/>
            <div>Уровень</div>
            <select id="level"  type="checkbox"   onChange={(e) => handle(e)}>
              <option value='Начинающие'>Начинающие</option>
              <option value='Продвинутый'>Продвинутый</option>
            </select>
            <br/>
            <br/>
            <div>Преподавтель</div>
            <select id="teacher"  type="checkbox"   onChange={(e) => handle(e)}>
                <option value=''>...указать преподавателя</option>
                {data.data.map(x=> 
                <option value={x.id}  key={x.id}> 
                {x.attributes.title}
                </option>
                )}
            </select>
            <br/>
            <br/>
            <div>Дата начала занятия</div>
            <input 
                id="start_day"
                type="date" 
                required
                value={group.start_day}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Дата последнего занятия</div>
            <input 
                id="end_day"
                type="date" 
                required
                value={group.end_day}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            Время начала занятий
            <br/>
            <input 
                id="start_time"
                type="time" 
                required
                value={group.start_time}
                onChange={(e) => handle(e)}
            />
            
            <br/>
            <br/>
            Время конца занятия
            <br/>
            <br/>
            <input 
                  id="end_time"
                  type="time" 
                  required
                  value={group.end_time}
                  onChange={(e) => handle(e)}
             />
            <br/>
            <br/>
            Перерыв
            <br/>
            <br/>
            <input 
                  id="break"
                  type="time" 
                  value={group.break}
                  onChange={(e) => handle(e)}
             />
            <br/>
            <br/>
            <div>Дни недели</div>
            <div >
            {checkList.map((item, index) => (
              <div key={index}>
                <input value={item} type="checkbox" onChange={handleCheck} />
                <span>{item}</span>
              </div>
            ))}
            </div>
            <br/>
            <br/>
            <div>Группа в мессенджере</div>
            <input 
                id="group_messenger"
                type="text" 
                value={group.group_messenger}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Заметки</div>
            <p><textarea rows="3" cols="45" name="text"
              id="note"
              value={group.note}
              onChange={(e) => handle(e)}
            
            ></textarea></p>
            <br/>
            <br/>
            <button>Создать</button>
        </form>
    </div>
  )
}

export default CreateGroup