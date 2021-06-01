let input_data;
let scatter_plot;
let bar_chart;
let filter = [];

d3.csv("https://hamabe-riku.github.io/InfoVis2021/Final/Corona_num_pop.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.sepal_length = +d.sepal_length;
            d.sepal_width = +d.sepal_width;
        });

        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        color_scale.domain(['setosa','versicolor','virginica']);

        scatter_plot_1 = new ScatterPlot( {
            parent: '#drawing_region_scatterplot',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Sepal length [cm]',
            ylabel: 'Sepal width [cm]',
            cscale: color_scale
        }, input_data );
        scatter_plot_1.update();

        scatter_plot_2 = new ScatterPlot( {
            parent: '#drawing_region_barchart',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Species',
            cscale: color_scale
        }, input_data );
        scatter_plot_2.update();
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot1.data = input_data;
    }
    else {
        scatter_plot1.data = input_data.filter( d => filter.includes( d.species ) );
    }
    scatter_plot1.update();
}