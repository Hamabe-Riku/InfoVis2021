d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:20, right:10, bottom:30, left:20}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,//指定がなければ256
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width + self.config.margin.left + self.config.margin.right)
            .attr('height', self.config.height + self.config.margin.top + self.config.margin.bottom);
        
        self.svg.append("text")
            .attr("x",self.config.width/3)
            .attr("y",self.config.margin.top)
            .attr("font-size","20px")
            .attr("font-weight",1000)
            .text("Scatter Plot");

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [self.config.margin.left , self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [0, self.inner_height] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(10);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(10);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(${self.config.margin.left}, 0)`);
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [xmin - self.config.margin.left, xmax + self.config.margin.right] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [ ymax + self.config.margin.bottom , ymin - self.config.margin.top] );

        self.render();
    }

    render() {
        let self = this;

        let circles = self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            .attr('class','circle');

        self.xaxis_group
            .call( self.xaxis )
            .append("text")
            .text("X-label")
            .attr("stroke","#000")
            .attr("fill","#000")
            .attr("x",self.config.width/2)
            .attr("y",self.config.margin.bottom)
            .attr("font-size","15px")
            .attr("font-weight",700);

        self.yaxis_group
            .call( self.yaxis )
            .append("text")
            .text("Y-label")
            .attr("stroke","#000")
            .attr("fill","#000")
            .attr("x",self.config.margin.left * (-1.5))
            .attr("y",self.config.height/2)
            .attr("font-size","15px")
            .attr("font-weight",700)
            .attr("writing-mode","tb");

            circles
                .on('mouseover', (e,d) => {
                    d3.select('#tooltip')
                        .style('opacity', 1)
                        .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);
                })
                .on('mousemove', (e) => {
                    const padding = 10;
                    d3.select('#tooltip')
                        .style('left', (e.pageX + padding) + 'px')
                        .style('top', (e.pageY + padding) + 'px');
                })
                .on('mouseleave', () => {
                    d3.select('#tooltip')
                        .style('opacity', 0);
                });

    }
}
