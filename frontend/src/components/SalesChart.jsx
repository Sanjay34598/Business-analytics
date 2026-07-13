import React from "react";

import {
    Bar
} from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function SalesChart({ sales }) {

    if (!sales || sales.length === 0) {

        return (
            <div className="table-section">

                <h2>Sales by Region</h2>

                <p>No sales data available.</p>

            </div>
        );

    }

    const regionSales = {};

    sales.forEach((item) => {

        const region = item.Region || "Unknown";

        const amount = Number(item.Sales_Amount || 0);

        if (!regionSales[region]) {

            regionSales[region] = 0;

        }

        regionSales[region] += amount;

    });

    const data = {

        labels: Object.keys(regionSales),

        datasets: [

            {

                label: "Sales Amount",

                data: Object.values(regionSales),

                backgroundColor: [

                    "#2563EB",
                    "#16A34A",
                    "#F59E0B",
                    "#DC2626",
                    "#8B5CF6",
                    "#06B6D4"

                ],

                borderRadius: 8

            }

        ]

    };

    const options = {

        responsive: true,

        plugins: {

            legend: {

                position: "top"

            },

            title: {

                display: true,

                text: "Sales by Region"

            }

        }

    };

    return (

        <div className="table-section">

            <Bar

                data={data}

                options={options}

            />

        </div>

    );

}

export default SalesChart;