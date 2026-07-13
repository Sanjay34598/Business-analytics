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

function SalesChart({sales}){

const regionSales={};

sales.forEach(item=>{

const region=item.Region;

const amount=Number(item.Sales_Amount);

regionSales[region]=(regionSales[region]||0)+amount;

});

const data={

labels:Object.keys(regionSales),

datasets:[

{

label:"Sales",

data:Object.values(regionSales)

}

]

};

return(

<div className="chart-card">

<Bar data={data}/>

</div>

);

}

export default SalesChart;