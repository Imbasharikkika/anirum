import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

const Team = () => {
  return (
    <div>
      <h1 className='page-header space-between'>Команда 
        <div>
          
        </div>
      </h1>
        <Link as={Link} to={`/team/create-teacher` }><button className='button'>+ Добавить преподавателя</button> </Link>
        <br/>
        <br/>
        <Link as={Link} to={`/team/create-manager` }><button className='button'>+ Добавить менеджера</button> </Link>
    </div>
  )
}

export default Team