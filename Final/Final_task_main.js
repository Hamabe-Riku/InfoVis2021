// import geoJson from "~/assets/japan.geo.json";

let input_data;
let scatter_plot_population;
let scatter_plot_guests;
let make_map;
let filter = [];
var flag =true;

d3.csv("https://hamabe-riku.github.io/InfoVis2021/Final/Corona_num.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.Code = +d.Code;
            d.Infected = +d.Infected;
            d.Population = +d.Population;
            d.Guests = +d.Guests;
        });

        const color_scale = d3.scaleSequential(d3.interpolateRainbow);
        color_scale.domain([0,46]);

        scatter_plot_population = new ScatterPlot( {
            parent: '#drawing_region_scatterplot_population',
            width: 512,
            height: 512,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Population [千人]',
            ylabel: 'Infected [人]',
            cscale: color_scale
        }, input_data );
        scatter_plot_population.update_population();

        scatter_plot_guests = new ScatterPlot( {
            parent: '#drawing_region_scatterplot_guests',
            width: 512,
            height: 512,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Guests [千人]',
            ylabel: 'Infected [人]',
            cscale: color_scale
        }, input_data );
        scatter_plot_guests.update_guests();

        make_map = new makeMap({
            parent: '#drawing_region_japan',
            width: 512,
            height: 512,
            margin: {top:10, right:10, bottom:50, left:50},
            label: '日本地図(都道府県をクリックしてください)',
            cscale: color_scale,
            scale: 1000
        },input_data,flag);
        // make_map.update_map();
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot_population.data = input_data;
        scatter_plot_guests.data = input_data;
    }
    else {
        scatter_plot_population.data = input_data.filter( d => filter.includes( d.Prefectures ) );
        scatter_plot_guests.data = input_data.filter( d => filter.includes( d.Prefectures ) );
    }
    scatter_plot_population.update_population();
    scatter_plot_guests.update_guests();
}
