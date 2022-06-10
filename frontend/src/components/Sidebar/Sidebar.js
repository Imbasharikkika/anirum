import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import "./Sidebar.css";

const Sidebar = () => {

  return (
    <div className={'box_sidebar'}>
      <div className={'box2_sidebar'}>
        <Link as={Link}  className='container_sidebar' to="/dashboard">Финансы</Link>
        <Link as={Link} className='container_sidebar' to="/team" >Команда</Link>
        <Link as={Link} className='container_sidebar' to="/time-table">Расписание</Link>
        <Link as={Link} className='container_sidebar' to="/chat">Чат</Link>
      </div>
    </div>
  )
}

export default Sidebar