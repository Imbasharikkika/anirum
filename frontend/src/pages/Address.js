import React from 'react'
import { useState } from 'react'
import Axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Address = () => {
  const { id, city } = useParams()
  let navigate = useNavigate();
  const url = "http://localhost:1337/api/adresses"
  const [data, setAddress] = useState({
      title: '',
      district: id
  })

  function submit(e) {
    e.preventDefault();
    Axios.post(url, {
        data: {
            title: data.title,
            district: id
        }
    })
    .then(res=>{
        console.log(res.data)
        navigate(`/city/${city}`);
    })
  }

  const handle = (e) => {
    e.preventDefault();
    const newaddress = {...data};
    newaddress[e.target.id] = e.target.value
    setAddress(newaddress)
    console.log(newaddress)
  }

  return (
    <div>Address

        <form onSubmit={(e) => submit(e)}>
            <h2>Создать адрес</h2>
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

export default Address