// import geoJson from "../japan.json";
let input_data;
let scatter_plot_population;
let scatter_plot_guests;
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
    })
    .catch( error => {
        console.log( error );
    });

// japan = json.loads(japan.json);
var map_width = 1024,
    map_height = 1024,
    scale = 1600;
d3.json("japan.geojson").then(function(error,japan){
    if(error != null){
        return;
    }
    console.log(japan);
    var projection = d3.geoMercator()
        .center([136.0,37.0])
        .translate([map_width/2,map_height/2])
        .scale(scale);

    var path = d3.geoPath().projection(projection);

    var svg = d3.select('#drawing_region_japan')
        .append('svg')
        // .attr('viewBox','0 0 ${map_width} ${map_height}')
        .attr('width','100%')
        .attr('height','100%');

    svg
        .selectAll(`path`)
        .data(japan.features)
        .enter()
        .append(`path`)
        .attr(`d`, path)
        .attr(`stroke`, `#666`)
        .attr(`stroke-width`, 0.25)
        .attr(`fill`, `#2566CC`)
        .attr(`fill-opacity`, (item) => {
          return Math.random();
        })
        .on("mousemove", function(item) {
            // テキストのサイズ情報を取得
            const textSize = svg
              .select("#label-text")
              .node()
              .getBBox();
      
            // マウス位置からラベルの位置を指定
            const labelPos = {
              x: d3.event.offsetX - textSize.width,
              y: d3.event.offsetY - textSize.height
            };
      
            // ラベルの位置を移動
            svg
              .select("#label-group")
              .attr(`transform`, `translate(${labelPos.x}, ${labelPos.y})`);
          })
      
          /**
           * 都道府県領域の MouseOut イベントハンドラ
           */
          .on(`mouseout`, function(item) {
            // ラベルグループを削除
            svg.select("#label-group").remove();
      
            // マウス位置の都道府県領域を青色に戻す
            d3.select(this).attr(`fill`, `#2566CC`);
            d3.select(this).attr(`stroke-width`, `0.25`);
          });
})


function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot_population.data = input_data;
    }
    else {
        scatter_plot_population.data = input_data.filter( d => filter.includes( d.Prefectures ) );
    }
    scatter_plot1.update_population();
}
