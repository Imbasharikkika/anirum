import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import useFetch from '../hooks/useFetch';
import useFetchtwo from '../hooks/apitwo';

const CreateManager = () => {
    let navigate = useNavigate();
    const url = "http://localhost:1337/api/team-members"
    const url2 = "http://localhost:1337/api/managers"
    const { loading, error, data } = useFetch('http://localhost:1337/api/cities')
    const { loadingtwo, errortwo, datatwo } = useFetchtwo('http://localhost:1337/api/users')
    
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
    });

    const [manager, setManager] = useState({
        users_permissions_user: '',
        cities: '',
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
            }
        })
        .then(res=>{
            console.log(res.data.data.id)
            // navigate(`/team`);
            Axios.post(url2, {
                data: {
                    cities: manager.cities,
                    users_permissions_user: manager.users_permissions_user, 
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
        const newmanager = {...manager};
        newmanager[e.target.id] = e.target.value
        setManager(newmanager)
        // console.log(newmanager)
    }

    if (loading) return <p>loading...</p>
    if (error) return <p>Error :(</p>
    if (loadingtwo) return <p>loading...</p>
    if (errortwo) return <p>Error :(</p>
    console.log(datatwo.map(x=>x.email))
    // console.log(manager.cities)
  return (
    <div>CreateManager
         <form onSubmit={(e) => submit(e)}>
            <h2>Создать менеджера</h2>
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
            <div>Город который курирует</div>
            <select id="cities"  type="checkbox"   onChange={(e) => handle(e)}>
                <option value=''>...выбрать город</option>
                {data.data.map(x=>
                <option value={x.id} key={x.id}>{x.attributes.title}</option>
                )}
            </select>
            <br/>
            <br/>
            <div>аккаунт</div>
            <select id="users_permissions_user"  type="checkbox"   onChange={(e) => handle(e)}>
                <option value=''>...привязать аккаунт</option>
                {datatwo.map(x=> 
                <option value={x.id}  key={x.id}>{x.email}</option>
                )}
            </select>
            
            <br/>
            <br/>
            <button>Создать</button>
        </form>
    </div>
  )
}

export default CreateManager