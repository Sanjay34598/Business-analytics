import {

Line

} from "react-chartjs-2";

import {

Chart as ChartJS,

CategoryScale,

LinearScale,

PointElement,

LineElement,

Tooltip,

Legend

} from "chart.js";

ChartJS.register(

CategoryScale,

LinearScale,

PointElement,

LineElement,

Tooltip,

Legend

);

function ForecastChart(){

const data={

labels:["Jan","Feb","Mar","Apr","May","Jun"],

datasets:[

{

label:"Forecast",

data:[120,150,180,220,260,300],

borderColor:"#16a34a",

fill:false

}

]

};

return(

<div className="table-section">

<h2>Sales Forecast</h2>

<Line data={data}/>

</div>

);

}

export default ForecastChart;