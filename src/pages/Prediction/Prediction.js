import styled from "styled-components";
import Navbar from "../../components/Navbar/Navbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import Switch from "../../components/Switch/Switch";
import LCTable from "../../components/Table/LCTable";
import FluxTable from '../../components/Table/FluxTable'
import MultiRangeSlider from '../../components/MultiRangeSlider/MultiRangeSlider';
import { useState, useEffect } from 'react';
import axios from "axios";

const CustomizedDot = (props) => {
    const { cx, cy, stroke, payload, value } = props;
    if (props.payload.peak == true) {
        return (
            <svg x={cx - 10} y={cy - 10} width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" fill="#FFCA00" />
            </svg>
        );
    }
    return (
        <svg x={cx - 2} y={cy - 2} height="5" width="5">
            <circle r="40" stroke="black" strokeWidth="3" fill="red" />
        </svg>
    );
};

function Prediction() {
    const [lcload, setlcLoad] = useState(null);
    const [fluxload, setfluxLoad] = useState(null);
    const [lcDatapoints, setlcDatapoints] = useState(null)
    const [mapChangeButtonValue, setMapChangeButtonValue] = useState('');
    const [classFluxShow, setClassFluxShow] = useState(false)
    const [classAreaShow, setClassAreaShow] = useState(false)
    const [classDurationShow, setClassDurationShow] = useState(false)
    const [classFluxByBCShow, setClassFluxByBCShow] = useState(false)
    const [classificationData, setClassificationData] = useState([])
    const lcdata = [];
    const fluxdata = [];
    useEffect(() => {
        axios.get('http://172.20.10.2:8080/api/data/lc').then(res => {
            console.log(JSON.parse(res.data));
            setlcLoad(JSON.parse(res.data));
        })
        axios.get('http://172.20.10.2:8080/api/data/flux').then(res => {
            setfluxLoad(JSON.parse(res.data));
            console.log(JSON.parse(res.data));
        })
        axios.get('http://172.20.10.2:8080/api/data/lcfull').then(res => {
            setlcDatapoints(JSON.parse(res.data));
            console.log(JSON.parse(res.data));
        })
    }, [])
    useEffect(() => {
        if (lcload) {
            classification()
        }


    }, [classAreaShow, classDurationShow, classFluxShow,classFluxByBCShow])
    const [filter, setFilter] = useState(false);
    function filterVisibility() {
        setFilter(!filter);
        console.log(filter);
    }
    const [map, changeMap] = useState('false');
    function changeMapVisibility() {
        changeMap(!map);
        // console.log('I ran!')
        // if (map == 'Rate vs Time') {
        //     changeMap('Flux vs Time')
        // } else if (map == 'Flux vs Time') {
        //     changeMap('Rate vs Time')
        // }
    }

    if (lcload) {
        for (var i = 0; i < Object.keys(lcload.start_coordinate__x_).length; i++) {
            lcdata.push(
                {
                    x: lcload.start_coordinate__x_[`${i}`],
                    y: lcload.start_coordinate__y_[`${i}`],
                    peak: false
                }
            )
            lcdata.push(
                {
                    x: lcload.peak_coordinate__x_[`${i}`],
                    y: lcload.peak_coordinate__y_[`${i}`],
                    classfication_by_area: lcload.classfication_by_area[`${i}`],
                    classification_by_duration: lcload.classification_by_duration[`${i}`],
                    peak: true,
                }
            )
            lcdata.push(
                {
                    x: lcload.end_coordinate__x_[`${i}`],
                    y: lcload.end_coordinate__y_[`${i}`],
                    peak: false
                }
            )
        }
        console.log(lcdata)
    }

    const classification = () => {
        var data = []
        if (lcload) {
            if (classFluxShow) {
                var flux = fluxload.Peak_Flux__y_
                var fluxClass = fluxload.Classification_by_Flux_Peak
                data.push({ 'peak flux': flux, 'flux_class': fluxClass })
            }
            if (classAreaShow) {

                var tempArea = lcload.area_under_curve
                var tempAreaClass = lcload.classfication_by_area
                data.push({ 'area_under_curve': tempArea, 'area_class': tempAreaClass })

            }
            if (classDurationShow) {
                var duration = lcload.total_burst_time
                var durationClass = lcload.classification_by_duration
                data.push({ 'duration': duration, 'duration_class': durationClass })
            }
            if(classFluxByBCShow){
                var flux = fluxload.Peak_Flux__y_
                var bc = fluxload.background_count_Flux_vs_Time
                var fluxbcclass = fluxload.Classification_by_Flux_Peak_By_Background_Count
                data.push({ 'peak flux': flux,'background_count':bc, 'flux_bc_class': fluxbcclass })
            }
            setClassificationData(data)
            console.log(data)
        }
    }
    // if (fluxload) {
    //     for (var i = 0; i < Object.keys(fluxload.start_coordinate__x_).length; i++) {
    //         fluxdata.push(
    //             {
    //                 x: fluxload.start_coordinate__x_[`${i}`],
    //                 y: fluxload.start_coordinate__y_[`${i}`],
    //             }
    //         )
    //         fluxdata.push(
    //             {
    //                 x: fluxload.peak_coordinate__x_[`${i}`],
    //                 y: fluxload.peak_coordinate__y_[`${i}`],
    //                 classfication_by_area: fluxload.classfication_by_area[`${i}`],
    //                 classification_by_duration: fluxload.classification_by_duration[`${i}`],
    //             }
    //         )
    //         fluxdata.push(
    //             {
    //                 x: fluxload.end_coordinate__x_[`${i}`],
    //                 y: fluxload.end_coordinate__y_[`${i}`],
    //             }
    //         )
    //     }
    // }

    return (
        <>
            <Navbar />
            <MainWrapper>
                <UpperWrapper>
                    <AreaPlotWrapper>
                        <SwitchButtonWrapper>
                            <MapTitle>Map 1</MapTitle>
                            <MapChangeButton onClick={changeMapVisibility}>{map ? "Change to Flux" : "Change to Rate"}</MapChangeButton>
                        </SwitchButtonWrapper>
                        {lcload ? (<ResponsiveContainer>
                            <LineChart
                                width={500}
                                height={400}
                                data={lcdata}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <CartesianGrid />
                                <XAxis dataKey="x">
                                    <Label value="Time" fill="#F6C96F" offset={0} position="insideBottom" />
                                </XAxis>
                                <YAxis label={{ value: 'Rate', fill: "#F6C96F", angle: -90, position: 'insideLeft', textAnchor: 'middle' }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="y" stroke="#FFCA00" dot={<CustomizedDot />} />
                            </LineChart>
                        </ResponsiveContainer>) : <p>Loading...</p>}
                    </AreaPlotWrapper>
                    <InformationCard>
                        <InformationTitle>Information</InformationTitle>
                    </InformationCard>
                </UpperWrapper>
                <TableWrapper>
                    <FilterWrapper>
                        <FilterButton onClick={filterVisibility}>Filter</FilterButton>
                    </FilterWrapper>
                    <FilterOptions style={filter ? { display: 'flex' } : { display: 'none' }}>
                        <BR>
                            <div style={{ width: '100%', paddingTop: '25.69px', paddingBottom: '25.69px' }}>
                                <p style={{ fontWeight: '500', fontSize: '24px', marginBottom: '23px' }}>Burst time</p>
                                <MultiRangeSlider min={0} max={1000} onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)} />
                            </div>
                            <div style={{ width: '100%', paddingTop: '25.69px', paddingBottom: '25.69px' }}>
                                <p style={{ fontWeight: '500', fontSize: '24px', marginBottom: '23px' }}>Rise time</p>
                                <MultiRangeSlider min={0} max={1000} onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)} />
                            </div>
                        </BR>
                        <DP>
                            <div style={{ width: '100%', paddingTop: '25.69px', paddingBottom: '25.69px' }}>
                                <p style={{ fontWeight: '500', fontSize: '24px', marginBottom: '23px' }}>Burst time</p>
                                <MultiRangeSlider min={0} max={1000} onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)} />
                            </div>
                            <div style={{ width: '100%', paddingTop: '25.69px', paddingBottom: '25.69px' }}>
                                <p style={{ fontWeight: '500', fontSize: '24px', marginBottom: '23px' }}>Rise time</p>
                                <MultiRangeSlider min={0} max={1000} onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)} />
                            </div>
                        </DP>
                        <Classification>
                            <div style={{ width: '100%', paddingTop: '25.69px', paddingBottom: '25.69px', display: 'flex', flexDirection: 'column' }}>
                                <p style={{ fontWeight: '500', fontSize: '24px', marginBottom: '23px' }}>Classification</p>
                                <span style={{ display: 'flex', flexDirection: 'row', gap: '17px' }}>
                                    <input type="checkbox" id="Option1" name="Option1" value="Option 1" onClick={() => {
                                        setClassFluxShow(!classFluxShow)
                                        console.log(classFluxShow)
                                    }} style={{ marginBottom: '24px', width: '24px', height: '24px' }} />
                                    <label for="Option1" style={{ fontSize: '24px' }}>Classification by Peak Flux</label>
                                </span>
                                <span style={{ display: 'flex', flexDirection: 'row', gap: '17px' }}>
                                    <input type="checkbox" id="Option2" name="Option2" value={classAreaShow} onClick={() => {
                                        setClassAreaShow(!classAreaShow)
                                        console.log(classAreaShow)

                                    }} style={{ marginBottom: '24px', width: '24px', height: '24px' }} />
                                    <label for="Option2" style={{ fontSize: '24px' }}>Classification by Area</label>
                                </span>
                                <span style={{ display: 'flex', flexDirection: 'row', gap: '17px' }}>
                                    <input type="checkbox" id="Option3" name="Option3" value="Option 3" onClick={() => {
                                        setClassDurationShow(!classDurationShow)
                                        console.log(classDurationShow)
                                    }} style={{ marginBottom: '24px', width: '24px', height: '24px' }} />
                                    <label for="Option3" style={{ fontSize: '24px' }}>Classification by Burst Duration</label>
                                </span>
                                <span style={{display: 'flex', flexDirection: 'row', gap: '17px'}}>
                                    <input type="checkbox" id="Option4" name="Option4" value="Option 4" onClick={() => {
                                        setClassFluxByBCShow(!classFluxByBCShow)
                                        console.log(classFluxByBCShow)
                                    }} style={{marginBottom: '24px', width: '24px', height: '24px'}} />
                                    <label for="Option4" style={{fontSize: '24px'}}>Classification By Ratio of Flux Peak and Background Count</label>
                                </span>
                            </div>
                        </Classification>
                    </FilterOptions>
                    {!map ? (<TableMenu>
                        <p style={{ color: '#F6C96F' }}>Peak flux coordinate (x)</p>
                        <p style={{ color: '#F6C96F' }}>Peak flux coordinate (y)</p>
                        <p style={{ color: '#F6C96F' }}>Peak flux/ average ratio</p>
                        <p style={{ color: '#F6C96F' }}>Category by peak flux</p>
                    </TableMenu>) : (<TableMenu>
                        <p style={{ color: '#F6C96F' }}>Burst start coordinate (x)</p>
                        <p style={{ color: '#F6C96F' }}>Burst start coordinate (y)</p>
                        <p style={{ color: '#F6C96F' }}>Burst peak coordinate (x)</p>
                        <p style={{ color: '#F6C96F' }}>Burst peak coordinate (y)</p>
                        <p style={{ color: '#F6C96F' }}>Burst end coordinate (x)</p>
                        <p style={{ color: '#F6C96F' }}>Burst end coordinate (y)</p>
                        <p style={{ color: '#F6C96F' }}>Total burst time</p>
                        <p style={{ color: '#F6C96F' }}>Rise time</p>
                        <p style={{ color: '#F6C96F' }}>Decay time</p>
                    </TableMenu>)}
                    {/* {lcload ? <p>{lcload.start_coordinate__x_['0']}</p> : <p>Loading...</p>} */}
                    {lcload ? (map ? (<LCTable props={lcload} />) : (<FluxTable props={fluxload} />)) : <p>Loading...</p>}
                </TableWrapper>
            </MainWrapper>
        </>
    )
}

export default Prediction;

const MainWrapper = styled.div`
    width: 100vw;
    height: fit-content;
`
const UpperWrapper = styled.div`
    margin-left: 118px;
    margin-right: 118px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 64px;
`

const AreaPlotWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:  center;
    width: 75%;
    height: 550px;
    background: rgba(237, 237, 237, 0.2);
    padding: 36px 49px;
    gap: 25px;
    border-radius: 18.56px;
`

const SimpleAreaChart = {
    width: '66.66%',
    height: '400px',
    padding: '10px'
}

const InformationCard = styled.div`
    width: 33.3%;
    height: 585px;
    background: rgba(237, 237, 237, 0.3);
    padding-top: 37px;
    padding-left: 29px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
`

const SwitchButtonWrapper = styled.div`
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const MapTitle = styled.div`
    font-size: 36px;
    font-weight: 500;
    color: #F6C96F;
`

const InformationTitle = styled.div`
    color: #F6C96F;
    font-size: 36px;
    font-weight: 500;
`

const TableWrapper = styled.div`
    margin-left: 120px;
    margin-right: 120px;
    margin-top: 36px;
`

const FilterWrapper = styled.div`
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    margin-bottom: 36px;
`

const FilterButton = styled.button`
    width: fit-content;
    height: fit-content;
    padding: 18px 20px;
    border-radius: 8px;
    background: #F6C96F;
    border: none;
    cursor: pointer;
    &:hover {
        /* border: 1px solid white; */
        background: #F6C96Fe1;
    }
`

const TableMenu = styled.div`
    background: rgba(237, 237, 237, 0.3);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 63px;
    padding: 26px 36px;
    border-radius: 12px;
    margin-bottom: 12px;
`

const FilterOptions = styled.div`
    height: fit-content;
    padding: 30px;
    display: flex;
    flex-direction: row;
    gap: 178px;
    justify-content: space-between;
    align-items: center;
    background: rgba(237, 237, 237, 0.3);
    margin-bottom: 77px;
    border-radius: 18.5px;
`

const BR = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 56.5px;
`
const DP = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 56.5px;
`
const Classification = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 56.5px;
    padding-right: 168px;
`

const MapChangeButton = styled.button`
    width: fit-content;
    height: fit-content;
    padding: 18px 20px;
    border-radius: 8px;
    background: #F6C96F;
    border: none;
    cursor: pointer;
    &:hover {
        background: #F6C96Fe1;
    }
`