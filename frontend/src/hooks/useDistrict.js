import React from 'react'
import useFetch from '../hooks/useFetch'

const useDistrict = () => {
    const { loading, error, data } = useFetch('http://localhost:1337/api/cities/' + id)  
    if (loading) return <p>loading...</p>
    if (error) return <p>Error :(</p>


    return (
        <div>

        </div>
  )
}

export default useDistrict