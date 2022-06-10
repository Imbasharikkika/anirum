import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:1337/api',
   });




export const getCity = async (id) => {
    try {
     const res = await API.get(`/cities/${id}?populate[0]=districts`);
     return res.data;
    } catch (error) {
     console.log(error);
     return false;
    }
   
};





