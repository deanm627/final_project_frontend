import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Barchart() {
    const bps = [140/80, 120/75, 130/81, 125/67, 122/77]

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
                // font: {
                //     size: 22,
                // }
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
        labels: ["May 23", "Apr 23", "Mar 23", "Feb 23", "Jan 23"],
        datasets: [
            {
                label: ['Systolic'],
                data: [140, 120, 130, 125, 122],
                backgroundColor: "rgba(0, 153, 51, 0.5)",
            },
            {
                label: ['Diastolic'],
                data: [80, 75, 81, 67, 77],
                backgroundColor: "rgba(0, 153, 255, 0.5)",
            },
        ],

    };

    return (
        <Bar options={options} data={data} />
    );
}