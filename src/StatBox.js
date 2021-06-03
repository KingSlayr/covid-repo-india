import { Card, CardContent, CircularProgress, Typography } from '@material-ui/core'
import React from 'react'
import './StatBox.css'
import { color } from './util'

export default function StatBox({setType,appType,type,totalCases,cases}) {
    let caseType = ''
    switch(type){
        case 'Total Cases':
            caseType='confirmed'
            break;
        case 'Recovered':
            caseType='recovered'
            break;
        case 'Death':
            caseType='deceased'
            break;
    }
    return (
        <div className='card_stats' onClick={()=>setType(caseType)}>
            <Card >
                {(caseType===appType)&&<div style={{backgroundColor:`${color[caseType]?.bgColor}`}} className='statBox_active'></div>}
                <CardContent>
                    <div className='card_statsHeading'>
                        {type}
                    </div>
                    <div className='card_statsToday'>
                        {cases?cases:<CircularProgress />}
                    </div>
                    <div className='card_statsTotal'>
                        {totalCases?totalCases:<CircularProgress />}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
