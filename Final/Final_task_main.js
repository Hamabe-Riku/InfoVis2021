let input_data;
let scatter_plot;
let bar_chart;
let filter = [];

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
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Population [人]',
            ylabel: 'Infected [人]',
            cscale: color_scale
        }, input_data );
        scatter_plot_population.update_population();

        scatter_plot_guests = new ScatterPlot( {
            parent: '#drawing_region_scatterplot_guests',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Guests [人]',
            ylabel: 'Infected [人]',
            cscale: color_scale
        }, input_data );
        scatter_plot_guests.update_guests();
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot_population.data = input_data;
    }
    else {
        scatter_plot_population.data = input_data.filter( d => filter.includes( d.Prefectures ) );
    }
    scatter_plot1.update_population();
}
