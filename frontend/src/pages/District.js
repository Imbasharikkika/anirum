import React from 'react'
import { useState } from 'react'
import Axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const District = () => {
    const { id } = useParams()
    let navigate = useNavigate();
    const url = "http://localhost:1337/api/districts"
    const [data, setDistrict] = useState({
        title: '',
        city: id
    })

    function submit(e) {
        e.preventDefault();
        Axios.post(url, {
            data: {
                title: data.title,
                city: id
            }
        })
        .then(res=>{
            console.log(res.data)
            navigate(`/city/${id}`);
        })
    }

    const handle = (e) => {
        e.preventDefault();
        const newdistrict = {...data};
        newdistrict[e.target.id] = e.target.value
        setDistrict(newdistrict)
        console.log(newdistrict)
    }

    
    return (
    <div>District

        <form onSubmit={(e) => submit(e)}>
            <h2>Создать район</h2>
            <input 
                id="title"
                type="text" 
                required
                value={data.title}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <button>Создать</button>
        </form>
    </div>
  )
}

export default District