d3.csv("https://hamabe-riku.github.io/InfoVis2021/W08/w08_task1.csv")
    .then( data =>{

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            radius : Math.min( 256, 256 ) / 2
            // margin: {top:20, right:10, bottom:50, left:60}
        };
        const piechart = new PieChart(config,data);
    
        piechart.update(); 
    })
    .catch( error => {
        console.log( error );
    });

class PieChart{

    constructor( config, data ){
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            radius: config.radius || 128
            // margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init(){
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            .append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);

        self.color = d3.scaleOrdinal()
            .range(['#F00','#0F0','#00F','#FF0','#F0F','#0FF','#880','#808','#404']);
        
        self.pie = d3.pie();

        self.arc = d3.arc();
    }

    update(){
        let self = this;

        self.pie.value( d => Number(d.value) );

        self.arc.innerRadius( self.config.radius/2 )
                .outerRadius( self.config.radius );

        self.render();
    }

    render(){
        let self = this;

        self.PieElement = self.svg.selectAll('g')
            .data(self.pie(self.data))
            .enter()
            .append('g');

        self.PieElement.append('path')
            .attr('d', self.arc)
            .attr('fill',function(d){return self.color(d.index)})
            .attr('stroke', 'white')
            .style('stroke-width', '2px');
        // console.log(self.data.map(d =>d.label));
        // console.log(self.data.map(d =>d.value));
        self.PieElement.append('text')
            .attr('fill', '#FFF')
            .attr('transform', function(d) { return 'translate(' + self.arc.centroid(d) + ')'; })
            .attr('dy', '5px')
            .attr('font', '10px')
            .attr('text-anchor', 'middle')
            .text(function(d){return d.data.label;});
    }
}
