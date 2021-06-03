import { FormControl, MenuItem, Select } from '@material-ui/core';
import numeral from 'numeral';
import { useEffect, useState } from 'react';
import './App.css';
import Chart from './Chart';
import Map from './Map';
import StatBox from './StatBox';
import Table from './Table';
import { indian_states_code } from './util';
import "leaflet/dist/leaflet.css";


function App() {
  const [state, setState] = useState('TT')
  const [type, setType] = useState('confirmed')
  const [stateData, setStateData] = useState({})

  useEffect(() => {
      const getStatesData = async () => {
      await fetch('https://api.covid19india.org/v4/min/data.min.json')
      .then((res)=>res.json())
      .then(data=>(
        setStateData(data)
      ))
    }
    getStatesData()
  }, [])


  return (
    <div className="app">
      <div className="app_header">
        <h1>Covid Tracker</h1>
        <FormControl>
          <Select
            value={state}
            onChange={(e)=>setState(e.target.value)}
          >
            <MenuItem value='TT'>India</MenuItem>
          {Object.keys(stateData).map((state)=>{
              if(state!=="TT"){
                return <MenuItem value={state}>{indian_states_code[state]}</MenuItem>
              }
              return 0
            }
          )}
          </Select>
        </FormControl>
      </div>
      <div className="body">
        <div className="app_left">
          <div className="app_statsBox">
            <StatBox 
              setType={setType}
              appType={type}
              type='Total Cases' 
              totalCases={numeral(stateData[state]?.total.confirmed).format('0.0a')} cases={numeral(stateData[state]?.delta7.confirmed).format('0 a')} />
            <StatBox 
              setType={setType}
              appType={type}
              type='Recovered' 
              totalCases={numeral(stateData[state]?.total.recovered).format('0.0a')} 
              cases={numeral(stateData[state]?.delta7.recovered).format('0 a')} />
            <StatBox 
              setType={setType}
              appType={type}
              type='Death' 
              totalCases={numeral(stateData[state]?.total.deceased).format('0.0a')} 
              cases={numeral(stateData[state]?.delta7.deceased).format('0 a')} />
            <StatBox 
              setType={setType}
              appType={type}
              type='Vaccinated' 
              totalCases={numeral(stateData[state]?.total.vaccinated).format('0.0a')} 
              cases={numeral(stateData[state]?.delta7.vaccinated).format('0 a')} />
          </div>
          <div className="app_map"><Map type={type} stateData={stateData}/></div>
          {/* <Chart type={type} stateData={stateData} stateCurrent={state}/> */}
        </div>
        <div className="app_right">
          <div className="app_table">
            <Table type={type} setType={setType} setState={setState} stateData={stateData}/>
          </div>
          <div className="app_chart">
            <Chart type={type} stateData={stateData} stateCurrent={state}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
