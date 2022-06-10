import { useState } from 'react'
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

const Signup = () => {
  let navigate = useNavigate();
  const url = "http://localhost:1337/api/auth/local/register"
  const [user, setUser] = useState({
      username: '',
      email: '',
      password: ''
  })

  function submit(e) {
    e.preventDefault();
    Axios.post(url, {
            username: user.username,
            email: user.email,
            password: user.password,
    })
    .then(res=>{
        console.log(res.data)
        localStorage.setItem('token', res.data.jwt);
        navigate(`/`);
    })
  }

  const handle = (e) => {
    e.preventDefault();
    const newuser = {...user};
    newuser[e.target.id] = e.target.value
    setUser(newuser)
    console.log(newuser)
}

  return (
    <div>
      <div>
        <form onSubmit={(e) => submit(e)}>
            <h2>Регистрация</h2>
            <br/>
            <br/>
            <div>username</div>
            <input 
                id="username"
                type="text" 
                required
                value={user.username}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Почта</div>
            <input 
                id="email"
                type="email" 
                required
                value={user.email}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <div>Пароль</div>
            <input 
                id="password"
                type="password" 
                required
                value={user.password}
                onChange={(e) => handle(e)}
            />
            <br/>
            <br/>
            <button>Создать</button>
        </form>
      </div>
    </div>
  )
}

export default Signup