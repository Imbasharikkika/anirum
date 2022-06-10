import { useEffect, useState} from 'react'


const useFetchtwo = (url) => {
  const [datatwo, setDatatwo] = useState(null)
  const [errortwo, setErrortwo] = useState(null)
  const [loadingtwo, setLoadingtwo] = useState(true)

  useEffect(() => {
    const fetchDatatwo = async () => {
        setLoadingtwo(true)
      
        try {
            const res = await fetch(url)
            const json = await res.json()

            setDatatwo(json)
            setLoadingtwo(false)
        } catch (error) {
            setErrortwo(error)
            setLoadingtwo(false)
        }
    }
    
    fetchDatatwo()
  }, [url])

  return { loadingtwo, errortwo, datatwo }
}

export default useFetchtwo