import React, { useEffect, useState } from 'react'
import { MapContainer,GeoJSON, Circle, LayerGroup } from 'react-leaflet'
import './Map.css'
import mapDataStates from './mapData/india_states.json'
import { color, indian_states_code } from './util'
import { centerOfMass } from "@turf/turf";

export default function Map({type,stateData}) {

    const [center, setcenter] = useState([22.5937, 77.7])
    const [map, setmap] = useState(null)
    const [zoom, setzoom] = useState(5)
    const [presentMap, setPresentMap] = useState(null)

    useEffect(() => {
        setPresentMap(mapDataStates)
    }, [])

    if (map) {
        map.setView(center,zoom);
    }

    const fillBlueOptions = { 
        fillColor: (type!=='deceased')?color[type]?.bgColor:'white',
        color:(type!=='deceased')?color[type]?.bgColor:'white',
        fillOpacity:0.08,
        opacity:0.6,
        weight:1 
    }

    const geoJsonStyle = {
        fillColor:'black',
        fillOpacity:0,
        weight:1,
        dashArray:5,
        color:(type!=='deceased')?color[type]?.bgColor:'white'
    }

    const clicked = (e,l) => {
        let ourCenter = centerOfMass(e)?.geometry.coordinates
        let x = ourCenter[0]
        ourCenter[0]=ourCenter[1]
        ourCenter[1]=x
        setcenter(ourCenter)
        setzoom(7)
        console.log('click');
    }
    
    const onEachState = async (state,layer) => {

        layer.bindTooltip(indian_states_code[(state?.properties.HASC_1).slice(3,5)])  
        layer.options.pane='shadowPane'
        console.log(indian_states_code[(state?.properties.HASC_1).slice(3,5)]);
        
        layer.on(
            'click',()=>{
                clicked(state,layer)
            }
        )
        layer.on(
            'mouseover',(event)=>{
                event.target.setStyle({
                    fillColor:`${(type!=='deceased')?color[type]?.bgColor:'white'}`,
                    fillOpacity:0.3
                })
            }
        )
        layer.on(
            'mouseout',(event)=>{
                event.target.setStyle({
                    fillColor:'black',
                    fillOpacity:0
                })
            }
        )
    }

    let ourCircles={}

    if(Object.keys(stateData).length!==0){
        ourCircles = presentMap?.features.map((state)=>{
             let ourCenter = centerOfMass(state)?.geometry.coordinates
             let x = ourCenter[0]
             ourCenter[0]=ourCenter[1]
             ourCenter[1]=x



             const circle =  <Circle 
                center={ourCenter} 
                pathOptions={fillBlueOptions} 
                radius={
                    // stateData[(state?.properties.HASC_1).slice(3,5)]?.delta7[type]||0
                    Math.sqrt(stateData[(state?.properties.HASC_1).slice(3,5)]?.total[type])*color[type]?.multiplier||0
                    } ></Circle>
            return circle
        })
    }

    return (
        <div className='map'>
            <MapContainer  center={center} zoom={zoom} scrollWheelZoom={true} whenCreated={setmap}>
                {/* <Pane style={{zIndex:1}}> */}
                    <LayerGroup>
                        {Object.keys(ourCircles).length && ourCircles}
                    </LayerGroup>
                {/* </Pane> */}
                {/* <Pane style={{zIndex:2}}> */}
                {(Object.keys(stateData).length!==0)&&<GeoJSON style={geoJsonStyle} data={presentMap?.features} onEachFeature={(e,l)=>onEachState(e,l)}/>}
                {/* </Pane> */}
                {/* <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                ></TileLayer> */}
            </MapContainer>
        </div>
    )
}
