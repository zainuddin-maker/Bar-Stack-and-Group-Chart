TW.Runtime.Widgets.Bargroupchart = function () {
    this.renderHtml = function () {
        // return any HTML you want rendered for your widget
        // If you want it to change depending on properties that the user
        // has set, you can use this.getProperty(propertyName). In
        // this example, we'll just return static HTML
        return '<div class="widget-content widget-Bargroupchart"></div>';
    };

    // };

    this.updateProperty = function (updatePropertyInfo) {
        this.setProperty(
            updatePropertyInfo.TargetProperty,
            updatePropertyInfo.SinglePropertyValue
        );
        // TargetProperty tells you which of your bound properties changed
        if (updatePropertyInfo.TargetProperty === "TableData") {
            this.setProperty(
                "TableData",
                updatePropertyInfo.RawDataFromInvoke.rows
            );
        }

        if (updatePropertyInfo.TargetProperty === "ConfigurationData") {
            this.setProperty(
                "ConfigurationData",
                updatePropertyInfo.RawDataFromInvoke.rows
            );
        }

        this.setupWidget();
    };

    this.afterRender = function () {
        const changeResize = () => {
            console.log("changeResize");
            var widgetID = this.jqElementId;

            var parentwidgetID =
                document.getElementById(widgetID).parentElement.id;
            console.log(parentwidgetID);

            var parentparentwidgetID =
                document.getElementById(parentwidgetID).parentElement.id;

            var widhtparent =
                document.getElementById(parentparentwidgetID).clientWidth;
            var heightparent =
                document.getElementById(parentparentwidgetID).clientHeight;
            // const ElementID = document.getElementById(ElementIDValue);
            this.setProperty("WidthChart", widhtparent);
            this.setProperty("HeightChart", heightparent);

            this.setupWidget();
        };

        window.addEventListener("resize", changeResize);
        changeResize();
    };

    this.setupWidget = function () {
        var widgetID = this.jqElementId;
        // Remove all old/existing DOM element
        d3v4.select(`#${widgetID}`).selectAll("*").remove();
        // Handle Properties
        try {
            var allWidgetProps = this.properties;

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

            console.log("widgetProps rungging bar group stack");
            console.log(widgetProps);
        } catch (error) {
            console.log("error");
            console.log(error);
        }

        var parentwidgetID = document.getElementById(widgetID).parentElement.id;

        var parentparentwidgetID =
            document.getElementById(parentwidgetID).parentElement.id;

        var widhtparent =
            document.getElementById(parentparentwidgetID).clientWidth;
        var heightparent =
            document.getElementById(parentparentwidgetID).clientHeight;

        var w = widgetProps.WidthChart
                ? widgetProps.WidthChart - 20
                : widhtparent - 20,
            h = widgetProps.HeightChart
                ? widgetProps.HeightChart - 10
                : heightparent - 10,
            padding_left = widgetProps.PaddingLeft,
            padding_bottom = widgetProps.PadingBottom;
         var padding = widgetProps.PadingTop;
        var tick_range = parseInt(widgetProps.TickRange);
        var miny = parseInt(widgetProps.MinyChart);
        var maxy = parseInt(widgetProps.Maxychart);
        var booleandisplayticklineandlabel =
            widgetProps.BooleanTickandLabel || false;

        var configuratin_data_temp = widgetProps.ConfigurationData || [];
        var datax = widgetProps.TableData || [];

        //tooltip

        var fontsizetooltipstring = widgetProps.StyleTooltip.textSize;
        var backgroundcolortooltip = widgetProps.StyleTooltip.backgroundColor;
        let textcolortooltip = widgetProps.StyleTooltip.foregroundColor;

        //x axis

        var boolean_bold_y = widgetProps.StyleYaxis.fontEmphasisBold;

        // y axis

        var boolean_bold_x = widgetProps.StyleXaxis.fontEmphasisBold;

        //x axis
        var fontsizelinechartx =  widgetProps.StyleXaxis.textSize;
        var fontcolorlinechartx =  widgetProps.StyleXaxis.foregroundColor;

        // y0 axis
        var fontsizelinecharty0 =  widgetProps.StyleYaxis.textSize;
        let fontcolorlinecharty0 =  widgetProps.StyleYaxis.foregroundColor;

        // batas input

       

        let lenthofdata = datax.length;

        var datatemp = JSON.parse(JSON.stringify(datax));

        if (lenthofdata > 0 && lenthofdata < 9) {
            for (let index = lenthofdata; index < 9; index++) {
                let objtemp = {};

                for (const key in datatemp[0]) {
                    if (key == "Category") {
                        objtemp[key] =
                            index +
                            Math.floor(Math.random() * Date.now()).toString();
                    } else {
                        objtemp[key] = 0;
                    }
                }
                datatemp.push(objtemp);
            }
        }

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
            datasets.push(d3v4.stack().keys(dataconfig.list_type)(datatemp));
            accent.push(d3v4.scaleOrdinal(dataconfig.list_color));
        });

        var num_groups = datasets.length;

        var xlabels = datatemp.map(function (d) {
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
        var yaxis = d3v4
            .axisLeft(yscale)
            .tickValues(d3.range(miny, maxy + 1, tick_range));

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

                    tooltipdiv.html(type + "    :" + d.data[type]);
                })
                .on("mousemove", function (d) {
                    var BreakException = {};

                    var sum = 0;
                    var type = "";

                    try {
                        configuratin_data[gnum].list_type.forEach(function (
                            el
                        ) {
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

                    tooltipdiv.html(type + "    :" + d.data[type]);
                })
                .on("mouseleave", function (d, i) {
                    tooltipdiv.style("display", "none");
                    // }
                });
        });

        svg.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(0," + (h - padding_bottom) + ")")
            .style("font-weight", function (c) {
                return boolean_bold_x ? "bold" : "normal";
            })
            .call(xaxis);

        const clickxaxis = (d) => {
            console.log("run", d);
            this.setProperty("XaxisValue", d);
            this.jqElement.triggerHandler("OnClickXaxis");
        };

        svg.selectAll(".axis.x .tick")
            .style("opacity", function (d, i, t) {
                if (lenthofdata < 9 && i >= lenthofdata) {
                    return 0;
                } else {
                    return 1;
                }
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
                } else {
                    return "pointer";
                }
            })
            .on("click", function (d, i) {
                if (lenthofdata < 9 && i >= lenthofdata) {
                    return console.log("not run");
                } else {
                    return clickxaxis(d);
                }
            });

        svg.select(".x.axis")
            .selectAll("text")
            .style("fill", fontcolorlinechartx)
            .style("font-size", convertFontSize(fontsizelinechartx));

        if (!booleandisplayticklineandlabel) {
            svg.select(".axis.x").selectAll("path").style("opacity", 0);

            svg.select(".axis.x").selectAll("line").style("opacity", 0);
        }

        svg.append("g")
            .attr("class", "axis y")
            .style("font-weight", function (c) {
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

            .text(function () {
                if (!booleandisplayticklineandlabel) {
                    return "";
                }

                return "Time (Min)";
            });

        if (!booleandisplayticklineandlabel) {
            svg.select(".axis.y").selectAll("path").style("opacity", 0);

            svg.select(".axis.y").selectAll("line").style("opacity", 0);
        }
        svg.select(".y.axis")
            .selectAll("text")
            .style("fill", fontcolorlinecharty0)
            .style("font-size", convertFontSize(fontsizelinecharty0));
    };
};
