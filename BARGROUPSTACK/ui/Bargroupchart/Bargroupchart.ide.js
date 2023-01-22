TW.IDE.Widgets.Bargroupchart = function () {
    // this.widgetIconUrl = function () {
    //     return "http://localhost:8015/Thingworx/Common/thingworx/widgets/mashup/mashup.ide.png";
    // };

    this.widgetProperties = function () {
        var properties = {
            name: "Bargroupchart",
            description: "Bargroupchart Chart",
            category: ["Common"],
            isExtension: true,
            supportsAutoResize: true,
            properties: {
                WidthChart: {
                    baseType: "NUMBER",
                    defaultValue: 500,
                },
                HeightChart: {
                    baseType: "NUMBER",
                    defaultValue: 500,
                },
                PaddingLeft: {
                    baseType: "NUMBER",
                    defaultValue: 40,
                },
                PadingBottom: {
                    baseType: "NUMBER",
                    defaultValue: 40,
                },
                PadingTop: {
                    baseType: "NUMBER",
                    defaultValue: 40,
                },
                TickRange: {
                    baseType: "NUMBER",
                    defaultValue: 500,
                    isBindingTarget: true
                },
                MinyChart: {
                    baseType: "NUMBER",
                    defaultValue: 0,
                    isBindingTarget: true
                },
                Maxychart: {
                    baseType: "NUMBER",
                    defaultValue: 1000,
                    isBindingTarget: true
                },
                TableData: {
                    baseType: "INFOTABLE",
                    isBindingTarget: true,
                },
                ConfigurationData: {
                    baseType: "INFOTABLE",
                    isBindingTarget: true,
                },
                BooleanTickandLabel: {
                    baseType: "BOOLEAN",
                    isBindingTarget: true,
                },

                XaxisValue: {
                    baseType: "STRING",
                    isBindingSource: true,
                },

                StyleTooltip: {
                    baseType: "STYLEDEFINITION",
                    defaultValue: "DefaultTooltipStyle",
                },
                StyleXaxis: {
                    baseType: "STYLEDEFINITION",
                    defaultValue: "DefaultChartStyle1",
                },
                StyleYaxis: {
                    baseType: "STYLEDEFINITION",
                    defaultValue: "DefaultChartStyle10",
                },
            },
        };

        return properties;
    };

    // The function is called before any property is updated in the ThingWorx Composer. You can perform validations on the new property value before it is committed. If the validation fails, you can return a message string to inform the user about the invalid input. The new property value is not be committed. If nothing is returned during the validation, then the value is assumed valid.
    //  this.beforeSetProperty = function (name, value) {
    //     // Validate Input Properties

    // };

    this.afterSetProperty = function (name, value) {
        this.updatedProperties();
        return true;
    };

    this.afterLoad = function () {};

    this.renderHtml = function () {
        return '<div class="widget-content widget-Bargroupchart"></div>';
    };

    // this.afterRender = function () {
    //     // NOTE: this.jqElement is the jquery reference to your html dom element
    //     // 		 that was returned in renderHtml()

    //     // get a reference to the value element
    //     valueElem = this.jqElement.find(".HelloWorld-property");
    //     // update that DOM element based on the property value that the user set
    //     // in the mashup bHelloWorldlder
    //     valueElem.text(this.getProperty("Name"));
    // };

    this.afterRender = function () {
        this.setupWidget();
    };

    this.setupWidget = function () {
        var widgetID = this.jqElementId;

        d3v4.select(`#${widgetID}`).selectAll("*").remove();
        // Handle Properties
        try {
            var allWidgetProps = this.allWidgetProperties().properties;

            var widgetProps = {};

            for (const [key, value] of Object.entries(allWidgetProps)) {
                if (key.includes("Style")) {
                    widgetProps[key] = TW.getStyleFromStyleDefinition(
                        this.getProperty(key)
                    );
                } else {
                    widgetProps[key] = this.getProperty(key);
                }
            }

            console.log("widgetProps idle bar group chart");
            console.log(widgetProps);
        } catch (error) {
            console.log("error");
            console.log(error);
        }

        var w = widgetProps.WidthChart,
            h = widgetProps.HeightChart,
            padding_left = widgetProps.PaddingLeft,
            padding_bottom = widgetProps.PadingBottom;

        var miny = widgetProps.MinyChart;
        var maxy = widgetProps.Maxychart;

        var configuratin_data_temp = widgetProps.ConfigurationData || [];
        var data = widgetProps.TableData || [];

        //tooltip

        var fontsizetooltipstring = widgetProps.StyleTooltip.textSize;
        var backgroundcolortooltip = widgetProps.StyleTooltip.backgroundColor;
        let textcolortooltip = widgetProps.StyleTooltip.foregroundColor;

        //x axis

        var boolean_bold_y = widgetProps.StyleYaxis.fontEmphasisBold;

        // y axis

        var boolean_bold_x = widgetProps.StyleXaxis.fontEmphasisBold;

        // batas input

        var padding = 40;

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

        var svg = d3v4
            .select(`#${widgetID}`)
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        var tooltipdiv = d3v4
            .select(`#${widgetID}`)
            .append("div")
            .attr("id", "tooltippie");

        tooltipdiv.append("p").attr("id", "name");
        tooltipdiv.append("p").attr("id", "value");

        // var stack = d3v4.stack().keys(["type1", "type2", "type3", "type4"]);

        var datasets = [];

        var accent = [];

        configuratin_data.forEach((dataconfig, i) => {
            datasets.push(d3v4.stack().keys(dataconfig.list_type)(data));
            accent.push(d3v4.scaleOrdinal(dataconfig.list_color));
        });

        var num_groups = datasets.length;

        var xlabels = data.map(function (d) {
            return d["Category"];
        });

        var x = d3v4.scaleBand().domain(xlabels).range([0, w]).padding([0.2]);

        var xscale = d3v4
            .scaleBand()
            .domain(xlabels)
            .range([padding_left, w])
            //   .paddingInner(0.1)
            .padding(0.2);

        var ydomain_min = d3v4.min(
            datasets.flat().map(function (row) {
                return d3v4.min(
                    row.map(function (d) {
                        return d[1];
                    })
                );
            })
        );
        var ydomain_max = d3v4.max(
            datasets.flat().map(function (row) {
                return d3v4.max(
                    row.map(function (d) {
                        return d[1];
                    })
                );
            })
        );

        var yscale = d3v4
            .scaleLinear()
            .domain([miny, maxy])
            .range([h - padding_bottom, padding]);

        var xaxis = d3v4.axisBottom(xscale);
        var yaxis = d3v4.axisLeft(yscale);

        d3v4.range(num_groups).forEach(function (gnum) {
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
                        xscale(xlabels[i]) +
                        (xscale.bandwidth() / num_groups) * gnum
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
                        configuratin_data[gnum].list_type.forEach(function (
                            el
                        ) {
                            sum += d.data[el];

                            if (sum === d[1]) {
                                type = el;
                                throw BreakException;
                            }
                        });
                    } catch (e) {
                        if (e !== BreakException) throw e;
                    }

                    tooltipdiv.style("left", d3v4.event.offsetX + 10 + "px");
                    tooltipdiv.style("top", d3v4.event.offsetY - 15 + "px");

                    tooltipdiv
                        .style("display", function (e) {
                            // if (showTooltip && !isNaN(newobj[d.data.key])) {
                            return "inline-block";
                            // } else
                            // {
                            //     return "none";
                            // }
                        })
                        .style(
                            "font-size",
                            convertFontSize(fontsizetooltipstring)
                        )
                        .style("background-color", backgroundcolortooltip)
                        .style("color", textcolortooltip);

                    tooltipdiv.html(type + "<br>" + "%");
                })
                .on("mousemove", function (d) {
                    var BreakException = {};

                    var sum = 0;
                    var type = "";

                    try {
                        configuratin_data[gnum].list_type.forEach(function (
                            el
                        ) {
                            sum += d.data[el];

                            if (sum === d[1]) {
                                type = el;
                                throw BreakException;
                            }
                        });
                    } catch (e) {
                        if (e !== BreakException) throw e;
                    }

                    tooltipdiv.style("left", d3v4.event.offsetX + 10 + "px");
                    tooltipdiv.style("top", d3v4.event.offsetY - 15 + "px");

                    tooltipdiv
                        .style("display", function (e) {
                            // if (showTooltip && !isNaN(newobj[d.data.key])) {
                            return "inline-block";
                            // } else
                            // {
                            //     return "none";
                            // }
                        })
                        .style(
                            "font-size",
                            convertFontSize(fontsizetooltipstring)
                        )
                        .style("background-color", backgroundcolortooltip)
                        .style("color", textcolortooltip);

                    tooltipdiv.html(
                        type + "    :" + (d[1] - d[0])
                        //  +
                        //       "<br>" +

                        //       "%"
                    );
                })
                .on("mouseleave", function (d, i) {
                    tooltipdiv.style("display", "none");
                });
        });

        svg.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(0," + (h - padding_bottom) + ")")
            .style("font-weight", function (c) {


                return boolean_bold_x ? "bold" : "normal"
            } )
            .call(xaxis);
        svg.append("g")
            .attr("class", "axis y")
            .style("font-weight", function (c) {


                return boolean_bold_y ? "bold" : "normal"
            } )
            .attr("transform", "translate(" + padding_left + ",0)")
            .call(yaxis)
            .append("text")
            //  .attr("transform", "rotate(-90)")
            .attr("y", padding - 10)
            .attr("x", 20)
            //  .attr("dy", "-5.1em")
            //  .attr("text-anchor", "end")
            .style("fill", "#000000")
            .text("Time (Min)");
    };

    this.widgetEvents = function () {
        return {
            OnClickXaxis: {
                description:
                    "Event triggered when clicked x axis",
            },
            // Clicked: {
            //     description: "Event triggered when a row has been clicked",
            // },
        };
    };
};
