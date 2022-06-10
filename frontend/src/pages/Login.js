import { useContext, useState } from 'react'
import Axios from 'axios';
import {AuthContext } from '../components/AuthContext'


const Login = () => {
  const { login } = useContext(AuthContext)
  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  function submit(e) {
    e.preventDefault();
    login(user)
  }

  const handle = (e) => {
    e.preventDefault();
    const newuser = {...user};
    newuser[e.target.id] = e.target.value
    setUser(newuser)
  }

  return (
    <div>
      <div>
        <form onSubmit={(e) => submit(e)}>
            <h2>Login</h2>
            <br/>
            <br/>
            <div>Почта</div>
            <input 
                id="email"
                type="email" 
                required
                value={user.identifier}
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
            <button>Войти</button>
        </form>
      </div>
    </div>
  )
}

export default Login