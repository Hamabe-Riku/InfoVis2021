let input_data;
let scatter_plot;
let bar_chart;
let filter = [];

d3.csv("https://hamabe-riku.github.io/InfoVis2021/Final/Corona_num_pop.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.Code = +d.Code;
            d.Infected = +d.Infected;
            d.Population = +d.Population;
        });

        const color_scale = d3.scaleLinear();
        color_scale.domain([d.Code]).range(['red','yellow','green','blue']);

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
    })
    .catch( error => {
        console.log( error );
    });

d3.csv("https://hamabe-riku.github.io/InfoVis2021/Final/Corona_num_tour.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.Code = +d.Code;
            d.Infected = +d.Infected;
            d.Population = +d.Guests;
        });

        const color_scale = d3.scaleLinear();
        color_scale.domain([d.Code]).range(['red','yellow','green','blue']);

        scatter_plot_2 = new ScatterPlot( {
            parent: '#drawing_region_scatterplot',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Sepal length [cm]',
            ylabel: 'Sepal width [cm]',
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
