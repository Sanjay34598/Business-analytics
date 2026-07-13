import {
    Bar
} from "react-chartjs-2";

import {

Chart as ChartJS,

CategoryScale,

LinearScale,

BarElement,

Tooltip,

Legend,

Title

} from "chart.js";

ChartJS.register(

CategoryScale,

LinearScale,

BarElement,

Tooltip,

Legend,

Title

);

function SalesChart({sales}){

const regions={};

sales.forEach(item=>{

regions[item.Region]=(regions[item.Region]||0)+Number(item.Sales_Amount);

});

const data={

labels:Object.keys(regions),

datasets:[

{

label:"Sales by Region",

data:Object.values(regions),

backgroundColor:"#2563eb"

}

]

};

return(

<div className="table-section">

<h2>Sales by Region</h2>

<Bar data={data}/>

</div>

);

}

export default SalesChart;