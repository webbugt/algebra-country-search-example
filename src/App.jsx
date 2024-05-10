import { useState } from 'react'
import './App.css'
import useSWR from 'swr'

// 1. nađi zemlju i ispiši podatke (neke)
// https://restcountries.com/v3.1/name/{name}
// https://restcountries.com/v3.1/name/germany
// 2. ako smo našli zemlju, ispiši sve druge zemlje iz iste regije
// https://restcountries.com/v3.1/region/{region}
// https://restcountries.com/v3.1/region/europe


function CountryInput({onComplete}){
  return <form onSubmit={(event)=>{
    event.preventDefault()
    const formElement = event.target
    const inputElement =  formElement.search
    const inputValue = inputElement.value
    if(!inputValue) return
    onComplete(inputValue)
  }}>
    <input id="search" type="text" />
    <button type="submit" >Search</button>
  </form>
}

const fetcher = (...args) => fetch(...args).then(response=>response.json())

function CountriesInRegion({region}){
  const { data, error, isLoading } = useSWR(`https://restcountries.com/v3.1/region/${region.toLowerCase()}`, fetcher)
  
  if(isLoading){
    return <p>Loading info about {region}...</p>
  }
  if(error){
    return <p>There was an error loading {region}, please check your input</p>
  }

  if(data.status === 404){
    return <p>{region} not found! Try another input</p>
  }
  return <>
    <h3>Other countries in the region of {region}:</h3>
    <ul>
    {data.map(country=><li key={country.name.official}>{country.name.official}</li>)}
    </ul>
  </>
}

function CountryInfo({countryName}){
  const { data, error, isLoading } = useSWR(`https://restcountries.com/v3.1/name/${countryName.toLowerCase()}`, fetcher)
  if(isLoading){
    return <p>Loading info about {countryName}...</p>
  }
  if(error){
    return <p>There was an error loading {countryName}, please check your input</p>
  }

  if(data.status === 404){
    return <p>{countryName} not found! Try another input</p>
  }

  const {name, region, capital, altSpellings} = data[0]
  const {common, official} = name
  return <div style={{textAlign: "left"}}>
    <p>Name: <b>{common} {official}</b></p>
    <p>region: <b>{region}</b></p>
    <p>capital: <b>{capital}</b></p>
    <p>other names: <b>{altSpellings?.join(", ")}</b></p>
    {region && <CountriesInRegion region={region}/>}
  </div>
}

function App() {
  const [currentSearch,  setCurrentSearch] = useState(null)
  return (
    <>
      <h1>Search Countries</h1>
      <CountryInput onComplete={inputValue=>{setCurrentSearch(inputValue)}}/>
      {currentSearch && <CountryInfo countryName={currentSearch} />}

    </>
  )
}

export default App
