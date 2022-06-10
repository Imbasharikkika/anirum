import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getCity } from '../../hooks/api';
import useFetch from '../../hooks/useFetch'
import "./City.css";


const City = () => {
  const { id } = useParams()
  const { loading, error, data, fetchData } = useFetch(`http://localhost:1337/api/cities/${id}?populate[0]=districts&populate[1]=districts.addresses&populate[2]=districts.addresses.offices&populate[3]=districts.addresses.offices.groups`)

  useEffect(() => {
    const interval = setInterval(fetchData, 10000)
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  // if (loading) return <p>loading...</p>
  if (!data) return null
  if (error) return <p>Error :(</p>

  
  
  return (
    <div>  

      <h1 className='page-header space-between'>{data.data.attributes.title}<Link as={Link} to={`/district/${id}` }><button className='button'>+ Добавить район</button></Link></h1> 
      
      <div className='container_dashboard'>
          <div className='container_dashboard_box'>
            <div className='container_dashboard_box1 city_color1'>
              <div className='container_dashboard_text1'>Чистая прибыль</div>
              <div className='container_dashboard_text2'>1 232 213</div>
              <div className='container_dashboard_text3'>выручка - расходы</div>
            </div>

            <div className='container_dashboard_box2'>
              <div className='container_dashboard_box3'>
                <div className='container_dashboard_text4'>Выручка</div>
                <div className='container_dashboard_text4_2'>1 233 534</div>
              </div>
              <div className='container_dashboard_box3'>
                <div className='container_dashboard_text4'>Должны оплатить</div>
                <div className='container_dashboard_text4_2'>1 233 534</div>
              </div>
              <div className='container_dashboard_box3'>
                <div className='container_dashboard_text4'>Предварительно</div>
                <div className='container_dashboard_text4_2'>1 233 534</div>
              </div>
            </div>

          </div>
          <div className='container_dashboard_box'>
            <div className='container_dashboard_box1 city_color2'>
              <div className='container_dashboard_text1'>Расходы</div>
              <div className='container_dashboard_text2'>1 232 213</div>
              <div className='container_dashboard_text3'>зарплата + аренда + реклама + прочее</div>
            </div>
            <div className='container_dashboard_box2'>
              <div className='container_dashboard_box3'>
                <div className='container_dashboard_text4'>Оплатили</div>
                <div className='container_dashboard_text4_2'>1 233 534</div>
              </div>
              <div className='container_dashboard_box3'>
                <div className='container_dashboard_text4'>Планируется</div>
                <div className='container_dashboard_text4_2'>1 233 534</div>
              </div>
            </div>
          </div>
          <div className='container_dashboard_box'>
            <div className='container_dashboard_box1 city_color3'>
              <div className='container_dashboard_text1'>Клиенты</div>
              <div className='container_dashboard_text2'>2 213</div>
              <div className='container_dashboard_text3'>все клиенты</div>
            </div>
            <div className='container_dashboard_box2'>
              <div className='container_dashboard_box3'>
                <div className='container_dashboard_text4'>Оплатили</div>
                <div className='container_dashboard_text4_2'>534</div>
              </div>
              <div className='container_dashboard_box3'>
                <div className='container_dashboard_text4'>Должны оплатить</div>
                <div className='container_dashboard_text4_2'>34</div>
              </div>
              <div className='container_dashboard_box3'>
                <div className='container_dashboard_text4'>Свободные места</div>
                <div className='container_dashboard_text4_2'>134</div>
              </div>
            </div>
          </div>
          <div className='container_dashboard_box'>
            <div className='container_dashboard_box1 city_color4'>
              <div className='container_dashboard_text1'>Преподаватели</div>
              <div className='container_dashboard_text2'>16</div>
              <div className='container_dashboard_text3'>обучают</div>
            </div>
            <div className='container_dashboard_box2'>
              <div className='container_dashboard_box3'>
                <div className='container_dashboard_text4'>Групп</div>
                <div className='container_dashboard_text4_2'>20</div>
              </div>
              <div className='container_dashboard_box3'>
                <div className='container_dashboard_text4'>Менеджеры</div>
                <div className='container_dashboard_text4_2'>3</div>
              </div>
            </div>
          </div>
      </div>

      <div className='container_city'>
      {data.data.attributes.districts.data.map(x =>
        <div key={x.id} className='district_city'>
          <div className='district_city_box'>{x.attributes.title}
          <Link className='district_city_title' as={Link} to={`/address/${x.id}/${id}`}>+ cоздать адрес</Link>
          </div>

          {x.attributes.addresses.data.map(x=>
          <div className='address_city_box' key={x.id}> {x.attributes.title}  
            <Link className='district_city_title' as={Link} to={`/office/${x.id}/${id}`}>+ добавить кабинет</Link>
            
            {x.attributes.offices.data.map(x=>
            <div key={x.id}>
              {x.attributes.title} 
              <Link className='district_city_title' as={Link} to={`/create-group/${x.id}/${id}`}> <br/>+ создать группу</Link>
              {x.attributes.groups.data.map(x=>
              <Link  as={Link} to={`/group/${x.id}`} key={x.id}>
                <div className='district_city_title'>
                {x.attributes.days_week} &nbsp;
                {moment(x.attributes.start_time, 'hh:mm:ss').format('HH:mm')} - 
                {moment(x.attributes.end_time, 'hh:mm:ss').format('HH:mm')}  &nbsp;
                от {x.attributes.age_start} - {x.attributes.age_end} лет
                </div>
              </Link>
              )}
              <div className='district_city_title'>Групп: {x.attributes.groups.data.length} </div>
              <div className='district_city_title'>822 233 доход</div>
            </div>
            )}

          </div>
          )}
        </div>
        )}
      </div>
  
        
    </div>
  )
}

export default City