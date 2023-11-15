import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import styled from 'styled-components';

const OuterWrapper = styled.div`
    border: 2px solid black;
    margin: 40px auto;
    background-color: white;
    height: 300px;
    width: 600px;
    box-shadow: 5px 5px 5px gray;
`

export default function Barchart({dataset, timeInterval}) {
    if (dataset) {
        const timeLabels = Object.keys(dataset);
        const sysData = [];
        Object.keys(dataset).forEach(key => {sysData.push(dataset[key]['sys_avg'])});
        const diaData = [];
        Object.keys(dataset).forEach(key => {diaData.push(dataset[key]['dia_avg'])});

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#030712',
                    } 
                },
                title: {
                    display: true,
                    text: "Average Blood Pressures by " + timeInterval,
                    color: '#030712',
                    font: {
                        size: 20,
                    }
                },
            },
            scales: {
                y: {
                    ticks: {
                        color: '#030712',
                    },
                    title: {
                        display: true,
                        text: 'Average BP (mmHg)',
                        color: '#030712',
                    },
                    grid: {
                        color: function(context) {
                            if (context.tick.value === 120) {
                                return 'rgb(0, 153, 51)'
                            }
                            if (context.tick.value === 80) {
                                return 'rgb(0, 153, 255)'
                            }
                            return 'rgba(0,0,0,0.2)'
                        },
                        lineWidth: function(context) {
                            if (context.tick.value === 120 || context.tick.value === 80) {
                                return 3
                            }
                            return 1
                        }
                        },
                },
                x: {
                    ticks: {
                        color: '#030712',
                    }
                }
            }
        };
            
        const data = {
            labels: timeLabels,
            datasets: [
                {
                    label: ['Systolic'],
                    data: sysData,
                    backgroundColor: "rgba(0, 153, 51, 0.5)",
                },
                {
                    label: ['Diastolic'],
                    data: diaData,
                    backgroundColor: "rgba(0, 153, 255, 0.5)",
                },
            ],

        };

        return (
            <OuterWrapper>
                <Bar options={options} data={data} />
            </OuterWrapper> 
        );
        }
}