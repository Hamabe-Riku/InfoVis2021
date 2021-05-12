d3.csv("https://hamabe-riku.github.io/InfoVis2021/W08/w08_task2.csv")
    .then( data =>{
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
        };

        const linechart = new LineChart(config,data);
        linechart.update(); 
    })
    .catch( error => {
        console.log( error );
    });

class LineChart{

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
    }

    update(){
        let self = this;

        const line = d3.line()
                .x( d => d.x )
                .y( d => d.y );

        self.render();
    }

    render(){
        let self = this;

        self.svg.append('path')
            .attr('d', self.line(self.data))
            .attr('stroke', 'black')
            .attr('fill', 'none');

    }
}


