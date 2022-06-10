import React from 'react'
import { useState } from 'react'
import Axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Office = () => {

  const { id, city } = useParams()
  let navigate = useNavigate();
  const url = "http://localhost:1337/api/offices"
  const [data, setAddress] = useState({
      title: '',
      address: id
  })

  function submit(e) {
    e.preventDefault();
    Axios.post(url, {
        data: {
            title: data.title,
            address: id
        }
    })
    .then(res=>{
        console.log(res.data)
        navigate(`/city/${city}`);
    })
  }
  const handle = (e) => {
    e.preventDefault();
    const newoffice = {...data};
    newoffice[e.target.id] = e.target.value
    setAddress(newoffice)
    console.log(newoffice)
  }

  return (
    <div>Office

      <form onSubmit={(e) => submit(e)}>
            <h2>Создать кабинет или переговорную</h2>
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

export default Office