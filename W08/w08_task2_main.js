d3.csv("https://hamabe-riku.github.io/InfoVis2021/W08/w08_task2.csv")
    .then( data =>{
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
            margin: {top:10, right:20, bottom:20, left:30}
        };

        const areachart = new AreaChart(config,data);
        areachart.update(); 
    })
    .catch( error => {
        console.log( error );
    });

class AreaChart{

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

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width )
            .attr('height', self.config.height );

        self.svg.append("text")
            .attr("x",self.config.width/3)
            .attr("y",self.config.margin.top)
            .attr("font-size","15px")
            .attr("font-weight",1000)
            .text("Area Graph");

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([0, self.inner_height]);

        self.area = d3.area()
            .x( d => self.xscale(d.x) )
            .y1( d => self.yscale(d.y) )
            .y0( d3.max(self.data, d => d.y))

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);

        self.xaxis_group = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.inner_height+self.config.margin.top})`);
        
        self.yaxis_group = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
    }

    update(){
        let self = this;
        const xmin = d3.min(self.data, d => d.x);
        const xmax = d3.max(self.data, d => d.x);
        const ymin = d3.min(self.data, d => d.y);
        const ymax = d3.max(self.data, d => d.y);

        self.xscale.domain([xmin,xmax]);
        self.yscale.domain([0,ymax]);
        self.render();
    }

    render(){
        let self = this;

        self.svg.append('path')
            .attr('d', self.area(self.data))
            .attr('stroke', 'black')
            .attr('fill', '#888')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.xaxis_group
            .call( self.xaxis)

        self.yaxis_group
            .call( self.yaxis);

    }
}


