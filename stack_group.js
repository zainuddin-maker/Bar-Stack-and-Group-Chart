var w = 800,
    h = 846,
    padding_left = 40,
    // padding_right = 40,
    padding_bottom = 40;
    var padding = 40;

var tick_range = 100;
var miny = 0;
var maxy = 1000;

var booleandisplayticklineandlabel = true

var configuratin_data_temp = [
    {
        list_type: "NPT,PT",
        list_color: "#003800,#f6682e",
    },
    {
        list_type: "PT",
        list_color: "#f6db0f",
    },
    // {
    //     list_type: "type1,type3,type2",
    //     list_color: "#003800,#f6682e,#f6db0f",
    // },
    // {
    //     list_type: "type2,type1",
    //     list_color: "#f6db0f,#00ff00",
    // },
    // {
    //     list_type: "type3",
    //     list_color: "#00ffee",
    // },
    // {
    //     list_type: "type3",
    //     list_color: "#00ff00",
    // },
    // {
    //     list_type: "type3",
    //     list_color: "#00ffaa",
    // },
    // {
    //     list_type: "type3",
    //     list_color: "#00ffcc",
    // },
    // {
    //     list_type: "type3",
    //     list_color: "#00ffea",
    // },
];
var datax = [
    {
        Category: "111",

        NPT: 32.2,
        PT:67.8,
       
    },
    {
        Category: "P2",
        NPT: 68.63,
        PT:31.37,
    },
    {
        Category: "P3",
        NPT: 100,
        PT:0,
    },
    {
        Category: "P4",
        NPT: 100,
        PT:0,
    },
    {
        Category: "P5",
        NPT: 100,
        PT:0,
    },
    {
        Category: "P6",
        NPT: 100,
        PT:0,
    },
    // {
    //     Category: "P7",
    //     type1: 0,
    //     type2: 0,
    //     type3: 0,
    // },
    // {
    //     Category: "P8",
    //     type1: 0,
    //     type2: 0,
    //     type3: 0,
    // },
    // {
    //     Category: "P9",
    //     type1: 0,
    //     type2: 0,
    //     type3: 0,
    // },

];

let lenthofdata = datax.length;

var datatemp = JSON.parse(JSON.stringify(datax));

if (lenthofdata > 0 && lenthofdata < 9) {
    for (let index = lenthofdata; index < 9; index++) {
        let objtemp = {};



        for (const key in datatemp[0]) {
           
            if (key == "Category") {

                
                objtemp[key] =
                    index + Math.floor(Math.random() * Date.now()).toString();
            } else {
                objtemp[key] = 0;
            }
        }
        datatemp.push(objtemp)
      
    }
}
console.log("data");
console.log(datax);
console.log("datatemp");
console.log(datatemp);

//tooltip

var fontsizetooltipstring = "normal";
var backgroundcolortooltip = "#0f0";
let textcolortooltip = "#000";

//x axis

var boolean_bold_y = true;

// y axis

var boolean_bold_x = true;

 //x axis
 var fontsizelinechartx = "normal";
 var fontcolorlinechartx = "#000";

 // y0 axis
 var fontsizelinecharty0 = "normal";
 let fontcolorlinecharty0 =
 "#000";

// batas input



const convertFontSize = (textSize) => {
    var result = textSize;
    switch (textSize) {
        case "xsmall":
            result = "9px";
            break;
        case "small":
            result = "10px";
            break;
        case "normal":
            result = "11px";
            break;
        case "large":
            result = "12px";
            break;
        case "xlarge":
            result = "14px";
            break;
        case "xxl":
            result = "16px";
            break;
        case "2xl":
            result = "18px";
            break;
        case "3xl":
            result = "22px";
            break;
        default:
            result = "22px";
    }

    return result;
};

var configuratin_data_new = [];

configuratin_data_temp.forEach((data, i) => {
    configuratin_data_new.push({
        list_type: data.list_type.split(","),
        list_color: data.list_color.split(","),
    });
});

var configuratin_data = configuratin_data_new;

var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

var tooltipdiv = d3.select("body").append("div").attr("id", "tooltippie");

tooltipdiv.append("p").attr("id", "name");
tooltipdiv.append("p").attr("id", "value");

// var stack = d3.stack().keys(["type1", "type2", "type3", "type4"]);

var datasets = [];

var accent = [];

configuratin_data.forEach((dataconfig, i) => {
    datasets.push(d3.stack().keys(dataconfig.list_type)(datatemp));
    accent.push(d3.scaleOrdinal(dataconfig.list_color));
});

var num_groups = datasets.length;

var xlabels = datatemp.map(function (d) {
    return d["Category"];
});

var x = d3.scaleBand().domain(xlabels).range([0, w]).padding([0.2]);

var xscale = d3
    .scaleBand()
    .domain(xlabels)
    .range([padding_left, w])
    //   .paddingInner(0.1)
    .padding(0.2);

var ydomain_min = d3.min(
    datasets.flat().map(function (row) {
        return d3.min(
            row.map(function (d) {
                return d[1];
            })
        );
    })
);
var ydomain_max = d3.max(
    datasets.flat().map(function (row) {
        return d3.max(
            row.map(function (d) {
                return d[1];
            })
        );
    })
);

var yscale = d3
    .scaleLinear()
    .domain([miny, maxy])

    .range([h - padding_bottom, padding]);

var xaxis = d3.axisBottom(xscale);
var yaxis = d3
    .axisLeft(yscale)
    .tickValues(d3.range(miny, maxy + 1, tick_range));

d3.range(num_groups).forEach(function (gnum) {
    svg.selectAll("g.group" + gnum)
        .data(datasets[gnum])
        .enter()
        .append("g")
        .attr("fill", accent[gnum])
        .attr("class", "group" + gnum)
        .selectAll("rect")

        .data((d) => d)
        .enter()
        .append("rect")
        .attr(
            "x",
            (d, i) =>
                xscale(xlabels[i]) + (xscale.bandwidth() / num_groups) * gnum
        )
        .attr("y", (d) => yscale(d[1]))

        .attr("width", xscale.bandwidth() / num_groups)
        .attr("height", (d) => yscale(d[0]) - yscale(d[1]))
        .on("mouseenter", function (d, i) {
            //

            var BreakException = {};

            var sum = 0;
            var type = "";

            try {
                configuratin_data[gnum].list_type.forEach(function (el) {
                    //  console.log(d.data[el])
                    if (Number(d.data[el])) {
                        sum += Number(d.data[el]);
                    }
                    if (sum === Number(d[1])) {
                        type = el;
                        throw BreakException;
                    }
                });
            } catch (e) {
                if (e !== BreakException) throw e;
            }


            tooltipdiv.style("left", d3.event.offsetX + 10 + "px");
            tooltipdiv.style("top", d3.event.offsetY - 15 + "px");

            tooltipdiv
                .style("display", function (e) {
                    // if (showTooltip && !isNaN(newobj[d.data.key])) {
                    return "inline-block";
                    // } else
                    // {
                    //     return "none";
                    // }
                })
                .style("font-size", convertFontSize(fontsizetooltipstring))
                .style("background-color", backgroundcolortooltip)
                .style("color", textcolortooltip);

            tooltipdiv.html(type + "    :" + (d[1] - d[0]));
        })
        .on("mousemove", function (d) {
            console.log(d);
            // console.log(d.data);
            //

            var BreakException = {};

            var sum = 0;
            var type = "";

            try {
                configuratin_data[gnum].list_type.forEach(function (el) {
                    // console.log(el)
                    //  console.log(d.data[el])
                  
                    if (Number(d.data[el])) {
                        sum += Number(d.data[el]);
                    }
                    // console.log(sum)
                    // console.log("")
                    if (sum === Number(d[1])) {
                        type = el;
                        throw BreakException;
                    }
                });
            } catch (e) {
                if (e !== BreakException) throw e;
            }

            // console.log(configuratin_data[gnum].list_type);
            // console.log(d);
            // console.log(type);
            tooltipdiv.style("left", d3.event.offsetX + 10 + "px");
            tooltipdiv.style("top", d3.event.offsetY - 15 + "px");

            tooltipdiv
                .style("display", function (e) {
                    // if (showTooltip && !isNaN(newobj[d.data.key])) {
                    return "inline-block";
                    // } else
                    // {
                    //     return "none";
                    // }
                })
                .style("font-size", convertFontSize(fontsizetooltipstring))
                .style("background-color", backgroundcolortooltip)
                .style("color", textcolortooltip);

            tooltipdiv.html(type + "    :" + d.data[type]);
        })
        .on("mouseleave", function (d, i) {
            // console.log("d")
            // console.log(i)
            // if (d){
            //   tooltipdiv.style("display", "inline-block")
            // }else {
            tooltipdiv.style("display", "none");
            // }
        });

    // svg.selectAll("g.text" + gnum)
    // .data(datasets[gnum])
    // .enter()
    // .append("g")
    // // .attr("display","none")
    // // .attr("fill", accent[gnum])
    // // .attr("class", "text" + gnum)
    // .selectAll("text")

    // .data((d) => d)
    // .enter()
    // .append("text")
    // .attr("text-anchor", "middle")
    // .text(function (d ,i) {
    //     console.log("d")
    //     console.log(d)

    //     return (d[1] - d[0])
    // } )
    // .attr(
    //     "x",
    //     (d, i) =>
    //         xscale(xlabels[i]) + (xscale.bandwidth() / num_groups) * gnum +  (xscale.bandwidth() / num_groups/2)
    // )
    // .attr("y", (d) => yscale(d[1]) - 10)
});

svg.append("g")
    .attr("class", "axis x")
    .attr("transform", "translate(0," + (h - padding_bottom) + ")")
    
    .style("font-weight", function (d) {
        return boolean_bold_x ? "bold" : "normal";
    })
    .call(xaxis)

const clickxaxis=(d)=>{

    console.log("run",d)
    this.setProperty("XaxisValue", d);
    this.jqElement.triggerHandler("OnClickXaxis");
}

svg.selectAll(".axis.x .tick")
    .style("opacity", function (d, i, t) {
        if (lenthofdata < 9 && i >= lenthofdata) {
            return 0;
        }
        return 1;
    })
    .attr("opacity", function (d, i, t) {
        if (lenthofdata < 9 && i >= lenthofdata) {
            return 0;
        } else {
            return 1;
        }
    })
    .attr("cursor", function (d, i, t) {
        if (lenthofdata < 9 && i >= lenthofdata) {
            return "default";
        }
        return "pointer";
    })
    .on("click", function (d, i) {
        if (lenthofdata < 9 && i >= lenthofdata) {
            return console.log("not run");
        }
        return clickxaxis(d);
    });

    svg.select(".x.axis")
    .selectAll("text")
    .style("fill", fontcolorlinechartx)
    .style("font-size",convertFontSize(fontsizelinechartx))

if (!booleandisplayticklineandlabel){
    svg.select(".axis.x")
    .selectAll("path")
    .style("opacity", 0
    )

    svg.select(".axis.x")
    .selectAll("line")
    .style("opacity", 0
    )
}


    // .style("fill", "none")
    // .style("stroke", colorlinechartx)

svg.append("g")
    .attr("class", "axis y")
    .style("font-weight", function (cui, e, f, g) {
        return boolean_bold_y ? "bold" : "normal";
    })
    .attr("transform", "translate(" + padding_left + ",0)")
    .call(yaxis)

    .append("text")
    //  .attr("transform", "rotate(-90)")
    .attr("y", padding - 10)
    .attr("x", 20)
    //  .attr("dy", "-5.1em")
    //  .attr("text-anchor", "end")
    .style("fill", "#000000")

    .text( function () {
        if (!booleandisplayticklineandlabel){
            return ""
        }

        return "Time (Min)"
    });

    if (!booleandisplayticklineandlabel){
        svg.select(".axis.y")
        .selectAll("path")
        .style("opacity", 0
        )
    
        svg.select(".axis.y")
        .selectAll("line")
        .style("opacity", 0
        )

    }

    svg.select(".y.axis")
    .selectAll("text")
    .style("fill", fontcolorlinecharty0)
    .style("font-size",convertFontSize(fontsizelinecharty0))

   
