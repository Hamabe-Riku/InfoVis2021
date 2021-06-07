class makeMap{
    constructor( config, data ,flag) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            cscale: config.cscale,
            scale: config.scale
        }
        this.data = data;
        this.flag =flag;
        this.init();
    }
    
    init(){
        let self = this;

        d3.json("https://hamabe-riku.github.io/InfoVis2021/Final/japan.geo.json").then(function(japan){
            self.projection = d3.geoMercator()
                .center([136.0,37.0])
                .translate([self.config.width/2,self.config.height/2])
                .scale(self.config.scale);

            self.path = d3.geoPath().projection(self.projection);

            self.svg = d3.select(self.config.parent).attr("width",self.config.width).attr("height",self.config.height);

            self.map = self.svg.selectAll('path').data(japan.features);

            // self.map.select('#drawing_region_japan');

            for(var i = 0; i < self.data.length; i++){
                self.dataPre = self.data[i].Prefectures;
                self.dataInfe = parseFloat(self.data[i].Infected);
                for (var j = 0; j < japan.features.length; j++) {
                    self.jsonPre = japan.features[j].properties.name;
                    if (self.dataState == self.jsonState) {
                        japan.features[j].properties.infected = self.dataInfe;
                        break;
                    }
                }
            }

            self.map.enter()
                .append('path')
                .attr('d', self.path)
                .attr('stroke', '#666')
                .attr('stroke-width', 0.5)
                .attr('fill', '#2566CC')
                .on('mouseover', (e,d) => {
                    d3.select('#tooltip')
                        .style('opacity', 1)
                        .html(`<div class="tooltip-label">${d.properties.name_local}</div>`);
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
                })
                .on('click', function(ev,d) {
                    const is_active = filter.includes(d.properties.woe_name);
                    if ( is_active ) {
                        filter = filter.filter( f => f !== d.properties.woe_name );
                    }
                    else {
                        filter.push( d.properties.woe_name );
                    }
                    Filter();
                    d3.select(this).classed('active', !is_active);
                });
            

            
        })

    }
}