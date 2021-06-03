import numeral from 'numeral';
import React, { useEffect, useState } from 'react'
import { indian_states_code } from './util';
import './Table.css'
import { Button } from '@material-ui/core';

export default function Table({type,setType,setState,stateData}) {

    const data = {}
    const [typeName, setTypeName] = useState('Cases')

    useEffect(() => {
        switch(type){
            case 'confirmed':
                setTypeName('Cases')
                break;
            case 'recovered':
                setTypeName('Recovered')
                break;
            case 'deceased':
                setTypeName('Deaths')
                break;
            default:
                break;
        }
    }, [type])

    Object.keys(stateData).sort((a,b)=>{
        if(stateData[a]?.total[type]>stateData[b]?.total[type]){
            return -1
        }else{
            return 1
        }
    }).forEach((key)=> {
        data[key] = stateData[key];
      });

    return (
        <>
            <div className='btns_table'>
                <Button active onClick={()=>setType('confirmed')} color="primary">Cases</Button>
                <Button onClick={()=>setType('recovered')} color="secondary">Recovered</Button>
                <Button onClick={()=>setType('deceased')} color="primary">Deaths</Button>
            </div>
            <div className='table'>
                <tr>
                    <th>State</th>
                    <th>{typeName}</th>
                </tr>
                <tr onClick={()=>setState('TT')}>
                    <td>India</td>
                    <td>{numeral(stateData['TT']?.total[type]).format('0.0a')}</td>
                </tr>
                {
                    Object.keys(data).map(state=>{
                        if(state!=='TT'){
                            return(
                                <tr onClick={()=>setState(state)}>
                                    <td>{indian_states_code[state]}</td>
                                    <td>{numeral(data[state]?.total[type]).format('0.0a')}</td>
                                </tr>
                            )
                        }
                        return null
                    })
                }
            </div>
        </>
    )
}
