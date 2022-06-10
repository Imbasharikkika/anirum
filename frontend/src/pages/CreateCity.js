import { useState } from 'react'
import Axios from 'axios';
import { useNavigate } from "react-router-dom";




const CreateCity = () => {
    let navigate = useNavigate();
    const url = "http://localhost:1337/api/cities"
    const [data, setCity] = useState({
        title: ''
    })
    
    function submit(e) {
        e.preventDefault();
        Axios.post(url, {
            data: {
                title: data.title
            }
        })
        .then(res=>{
            console.log(res.data)
            navigate(`/dashboard`);
        })
    }

    const handle = (e) => {
        e.preventDefault();
        const newcity = {...data};
        newcity[e.target.id] = e.target.value
        setCity(newcity)
        console.log(newcity)
    }

    
    return (
    <div>CreateCity

        <form onSubmit={(e) => submit(e)}>
            <h2>Создать город</h2>
            <input 
                id="title"
                type="text" 
                required
                value={data.title}
                onChange={(e) => handle(e)}
                // onChange={(e) => setData({...data, name: e.target.value})}
            />
            <br/>
            <br/>
            <button>Создать</button>
        </form>
    </div>
  )
}

export default CreateCity