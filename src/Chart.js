import React, { useEffect, useState } from 'react'
import {Line,Chart as ourChart} from 'react-chartjs-2'
import zoomPlugin from 'chartjs-plugin-zoom';

import './Chart.css'
import { color,indian_states_code } from './util'


export default function Chart({type,stateCurrent}) {

    const labels=[]
    const dataState=[]
    const [chartData, setChartData] = useState([])
    ourChart.register(zoomPlugin);

    useEffect(() => {
        const getChartData = async () => {
            await fetch('https://api.covid19india.org/v4/min/timeseries.min.json')
            .then((res)=>res.json())
            .then(data=>setChartData(data))
        }
        getChartData()
    }, [])

    Object.keys(chartData).forEach(state=>{
        if(state===stateCurrent){
            Object.keys(chartData[state]?.dates).forEach(date=>labels.push(date))
            let prevDayCases = 0
            Object.keys(chartData[state]?.dates).forEach(date=>{
                dataState.push(chartData[state]?.dates[date].total[type]-prevDayCases)
                prevDayCases=chartData[state]?.dates[date].total[type]
            })
        }
    })
    const data = {
        labels: labels,
        datasets: [
            {
                label: `${type} per day in ${indian_states_code[stateCurrent]}  (scroll/pinch to zoom)`,
                data: dataState,
            },
        ],
    };
    
    const options = {
        responsive: true,
        scales: {
        yAxes: [
            {
            ticks: {
                beginAtZero: true,
            },
            },
        ],
        },
        elements:{
            line:{
                borderWidth:0.7,
                fill: false,
                backgroundColor: color[type]?.bgColor,
                borderColor: color[type]?.borderColor,
                tension:1,
            },
            point:{            
                radius:2,
                hoverRadius:5,
                opacity:1
            }
        },
        plugins:{
            tooltip:{
                enabled:true,
                backgroundColor:color[type]?.bgColor
            },
            zoom: {
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true
                  },
                  mode: 'xy',
                },
                pan: {
                    enabled: true,
                    mode: 'xy',
                    speed:10
                },

              }
        },
    };

    return (
        <div className='chart'>
            <Line data={data} options={options} />
        </div>
    )
}
