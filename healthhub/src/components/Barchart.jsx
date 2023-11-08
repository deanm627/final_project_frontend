import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Barchart({dataset}) {
    if (dataset) {
        console.log(dataset)
        const timeLabels = Object.keys(dataset);
        const sysData = [];
        Object.keys(dataset).forEach(key => {sysData.push(dataset[key]['sys_avg'])});
        const diaData = [];
        Object.keys(dataset).forEach(key => {diaData.push(dataset[key]['dia_avg'])});
        console.log(sysData)
        console.log(diaData)

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: "Average Blood Pressures over Time",
                    font: {
                        size: 18,
                    }
                },
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Average BP (mmHg)'
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
            <Bar options={options} data={data} />
        );
        }
}