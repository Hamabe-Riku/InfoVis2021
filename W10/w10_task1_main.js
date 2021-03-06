d3.csv("https://hamabe-riku.github.io/InfoVis2021/W08/w08_task1.csv")
    .then( data =>{

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:20, right:10, bottom:50, left:60}
        };
        const barchart = new BarChart(config,data);
        barchart.update(); 
        
        d3.select('#reverse')
            .on('click', d => {
                data.reverse();
                barchart.update(data);
            });

        d3.select('#descend')
            .on('click', d => {
                data.sort(barchart.descend);
                barchart.update(data);
            });
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

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.svg.append("text")
            .attr("x",self.config.width/3)
            .attr("y",self.config.margin.top)
            .attr("font-size","15px")
            .attr("font-weight",1000)
            .text("Food Weight");

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top*2})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .range([0, self.inner_height]);

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');
  
    }

    update(){
        let self = this;
        const xmin = 0;
        const xmax = d3.max(self.data, d => Number(d.value));
        self.xscale.domain([xmin,xmax]);
        self.yscale.domain(self.data.map(d => d.label)).paddingInner(0.1);

        self.render();
    }

    render(){
        let self = this;

        self.chart.selectAll("rect")
            .data(self.data)
            .join("rect")
            .transition().duration(1000)
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth());

        self.xaxis_group
            .call( self.xaxis)

        self.yaxis_group
            .call( self.yaxis);
    }

    descend(a,b) {
        return b.value-a.value;
    }
   
}
