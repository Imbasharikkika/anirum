import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import useFetch from '../hooks/useFetch';


const CreateTeacher = () => {
    let navigate = useNavigate();
    const url = "http://localhost:1337/api/team-members"
    const url2 = "http://localhost:1337/api/teachers"


    const { loading, error, data } = useFetch('http://localhost:1337/api/users')
    
    const [team, setTeam] = useState({
        name: '',
        family: '',
        patronymic: '',
        age: '',
        phone: '',
        city: '',
        address: '',
        resume: '',
        note: '',
        email: '',
        // avatar: '',
      }); 

    const [teacher, setTeacher] = useState({
        course: '',
        portfolio: '',
        users_permissions_user: '',
        team_member: '',
        title: '',
    });

    function submit(e) {
        e.preventDefault();
        Axios.post(url, {
            data: {
                name: team.name,
                family: team.family,
                patronymic: team.patronymic,
                age: team.age,
                phone: team.phone,
                city: team.city,
                address: team.address,
                resume: team.resume,
                note: team.note,
                email: team.email,
                // avatar: team.avatar,
            }
        })
        .then(res=>{
            console.log(res.data)
            // navigate(`/team`);
            Axios.post(url2, {
                data: {
                    course: teacher.course,
                    portfolio: teacher.portfolio,
                    users_permissions_user: teacher.users_permissions_user, 
                    team_member: res.data.data.id, 
                    title: `${team.family} ${team.name} ${team.patronymic}`, 
                }
            })
            navigate(`/team`);
        })
    }

    const handle = (e) => {
        e.preventDefault();
        const newteam = {...team};
        newteam[e.target.id] = e.target.value
        setTeam(newteam)
        const newteacher = {...teacher};
        newteacher[e.target.id] = e.target.value
        setTeacher(newteacher)
        console.log(newteacher)
    }

    if (loading) return <p>loading...</p>
    if (error) return <p>Error :(</p>
  return (
    <div>CreateTeacher
         <form onSubmit={(e) => submit(e)}>
            <h2>Создать преподавателя</h2>
            <br/>
            <br/>
            <div>Имя</div>
            <input 
                id="name"
                type="text" 
                required
                value={team.name}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Фамилия</div>
            <input 
                id="family"
                type="text" 
                required
                value={team.family}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Отчество</div>
            <input 
                id="patronymic"
                type="text" 
                required
                value={team.patronymic}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Дата рождения</div>
            <input 
                id="age"
                type="date" 
                required
                value={team.age}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Телефон</div>
            <input 
                id="phone"
                type="number" 
                required
                value={team.phone}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Город</div>
            <input 
                id="city"
                type="text" 
                required
                value={team.city}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Почта</div>
            <input 
                id="email"
                type="email" 
                required
                value={team.email}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Адрес</div>
            <input 
                id="address"
                type="text" 
                required
                value={team.address}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Резюме</div>
            <input 
                id="resume"
                type="text" 
                required
                value={team.resume}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Заметки</div>
            <p><textarea rows="3" cols="45" name="text"
              id="note"
              value={team.note}
              onChange={(e) => handle(e)}
            
            ></textarea></p>
            <br/>
            <br/>
            <div>Направление</div>
            <input 
                id="course"
                type="text" 
                required
                value={teacher.course}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Портфолио</div>
            <input 
                id="portfolio"
                type="text" 
                required
                value={teacher.portfolio}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>аккаунт</div>
            <select id="users_permissions_user"  type="checkbox"   onChange={(e) => handle(e)}>
                <option value=''>...привязать аккаунт</option>
                {data.map(x=> 
                <option value={x.id}  key={x.id}>{x.email}</option>
                )}
            </select>
            {/* <br/>
            <br/>
            <div>Аватар</div>
            <input 
                id="avatar"
                type="file"
                name="avatar"
                accept="image/png, image/jpeg"
                value={team.avatar}
                onChange={(e) => handle(e)}
            /> */}
            <br/>
            <br/>
            <button>Создать</button>
        </form>
    </div>
  )
}

export default CreateTeacher