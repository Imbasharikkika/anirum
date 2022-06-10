import React from "react";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const { loading, error, data } = useFetch("http://localhost:1337/api/cities");

  if (loading) return <p>loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data?.data) return null;

  console.log(data.data.map((x) => x.attributes.title));

  return (
    <div>
      <h1 className="page-header space-between">
        Финансы{" "}
        <Link as={Link} to="/create-city">
          <button className="button">+ Добавить город</button>
        </Link>
      </h1>
      <div className="container_dashboard">
        <div className="container_dashboard_box">
          <div className="container_dashboard_box1 city_color1">
            <div className="container_dashboard_text1">Чистая прибыль</div>
            <div className="container_dashboard_text2">1 232 213</div>
            <div className="container_dashboard_text3">выручка - расходы</div>
          </div>

          <div className="container_dashboard_box2">
            <div className="container_dashboard_box3">
              <div className="container_dashboard_text4">Выручка</div>
              <div className="container_dashboard_text4_2">1 233 534</div>
            </div>
            <div className="container_dashboard_box3">
              <div className="container_dashboard_text4">Должны оплатить</div>
              <div className="container_dashboard_text4_2">1 233 534</div>
            </div>
            <div className="container_dashboard_box3">
              <div className="container_dashboard_text4">Предварительно</div>
              <div className="container_dashboard_text4_2">1 233 534</div>
            </div>
          </div>
        </div>
        <div className="container_dashboard_box">
          <div className="container_dashboard_box1 city_color2">
            <div className="container_dashboard_text1">Расходы</div>
            <div className="container_dashboard_text2">1 232 213</div>
            <div className="container_dashboard_text3">
              зарплата + аренда + реклама + прочее
            </div>
          </div>
          <div className="container_dashboard_box2">
            <div className="container_dashboard_box3">
              <div className="container_dashboard_text4">Оплатили</div>
              <div className="container_dashboard_text4_2">1 233 534</div>
            </div>
            <div className="container_dashboard_box3">
              <div className="container_dashboard_text4">Планируется</div>
              <div className="container_dashboard_text4_2">1 233 534</div>
            </div>
          </div>
        </div>
        <div className="container_dashboard_box">
          <div className="container_dashboard_box1 city_color3">
            <div className="container_dashboard_text1">Клиенты</div>
            <div className="container_dashboard_text2">2 213</div>
            <div className="container_dashboard_text3">все клиенты</div>
          </div>
          <div className="container_dashboard_box2">
            <div className="container_dashboard_box3">
              <div className="container_dashboard_text4">Оплатили</div>
              <div className="container_dashboard_text4_2">534</div>
            </div>
            <div className="container_dashboard_box3">
              <div className="container_dashboard_text4">Должны оплатить</div>
              <div className="container_dashboard_text4_2">34</div>
            </div>
            <div className="container_dashboard_box3">
              <div className="container_dashboard_text4">Свободные места</div>
              <div className="container_dashboard_text4_2">134</div>
            </div>
          </div>
        </div>
        <div className="container_dashboard_box">
          <div className="container_dashboard_box1 city_color4">
            <div className="container_dashboard_text1">Преподаватели</div>
            <div className="container_dashboard_text2">16</div>
            <div className="container_dashboard_text3">обучают</div>
          </div>
          <div className="container_dashboard_box2">
            <div className="container_dashboard_box3">
              <div className="container_dashboard_text4">Групп</div>
              <div className="container_dashboard_text4_2">20</div>
            </div>
            <div className="container_dashboard_box3">
              <div className="container_dashboard_text4">Менеджеры</div>
              <div className="container_dashboard_text4_2">3</div>
            </div>
          </div>
        </div>
      </div>
      <div className="container_dashboard">
        <div className="card">
          <h4 className="card_header_dashboard">Информация</h4>
          <li className="box_dashboard">
            <ul className="box_dashboard_city"></ul>
            <ul className="box_dashboard_income">Доходы</ul>
            <ul className="box_dashboard_income">Расходы</ul>
            <ul className="box_dashboard_income">Прибыль</ul>
            <ul className="box_dashboard_income">Предв.</ul>
            <ul className="box_dashboard_income">Клиентов</ul>
            <ul className="box_dashboard_income">Оплатили</ul>
            <ul className="box_dashboard_income">
              Должны <br /> оплатить
            </ul>
            <ul className="box_dashboard_income">Пробные</ul>
            <ul className="box_dashboard_income">Отказались</ul>
            {/* <ul className='text_dashboard'>Расходы</ul>
          <ul className='text_dashboard'>Зарплата</ul>
          <ul className='text_dashboard'>Аренда</ul>
          <ul className='text_dashboard'>Реклама</ul> */}
          </li>
          {data?.data?.map((citys) => (
            <li className="box_dashboard" key={citys.id}>
              <ul className="box_dashboard_city">
                <div key={citys.id}>
                  <Link as={Link} to={`/city/${citys.id}`}>
                    {citys.attributes.title}
                  </Link>
                </div>
              </ul>
              <ul className="box_dashboard_income">0</ul>
              <ul className="box_dashboard_income">0</ul>
              <ul className="box_dashboard_income">0</ul>
              <ul className="box_dashboard_income">0</ul>
              <ul className="box_dashboard_income">0</ul>
              <ul className="box_dashboard_income">0</ul>
              <ul className="box_dashboard_income">0</ul>
              <ul className="box_dashboard_income">0</ul>
              <ul className="box_dashboard_income">0</ul>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
