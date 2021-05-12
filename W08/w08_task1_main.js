var data = [
    {label:'Apple', value:100},
    {label:'Banana', value:200},
    {label:'Cookie', value:50},
    {label:'Doughnut', value:120},
    {label:'Egg', value:80}
];
d3.then( data =>{
        data.forEach( d => { d.label = +d.label; d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
            margin: {top:10, right:10, bottom:20, left:60}
        };

        const barchart = new BarChart(config,data);
        barchart.update(); 
    })
    .catch( error => {
        console.log( error );
    });

class BarChart{

    constructor( config, data ){
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init(){
        let self = this;

        self.svg = d3.select('#drawing_region')
        .attr('width', width)
        .attr('height', height);

        self.chart = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        self.inner_width = width - margin.left - margin.right;
        self.inner_height = height - margin.top - margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, inner_width]);

        self.yscale = d3.scaleBand()
            .range([0, inner_height])
            .paddingInner(0.1);

        self.xaxis = d3.axisBottom( xscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft( yscale )
            .tickSizeOuter(0);

        self.xaxis_group = chart.append('g')
            .attr('transform', `translate(0, ${inner_height})`);

        self.yaxis_group = chart.append('g');
  
    }

    update(){
        let self = this;

        const xmin = 0;
        const xmax = d3.max(self.data, d => d.value);
        self.xscale.domain([xmin,xmax]);

        self.yscale.domain(self.data.map(d => d.label));

        self.render();
    }

    render(){
        let self = this;

        self.chart.selectAll("rect").data(data).enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => yscale(d.label))
            .attr("width", d => xscale(d.value))
            .attr("height", yscale.bandwidth());

        self.xaxis_group
            .call( self.xaxis);

        self.yaxis_group
            .call( self.yaxis);

    }
}

