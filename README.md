
<h1 align="center"  style="font-weight:bold;" >
  <br>
  <!-- <a href="http://www.amitmerchant.com/electron-markdownify"><img src="https://raw.githubusercontent.com/amitmerchant1990/electron-markdownify/master/app/img/markdownify.png" alt="Markdownify" width="200"></a> -->
  <br>
  Pie Chart
  <br>
</h1>

> Data input from thingworx application .

<!-- <h4 align="center">A minimal Markdown Editor desktop app built on top of <a target="_blank">Electron</a>.</h4> -->

![Chat Preview](https://github.com/zainuddin-maker/Pie-Chart-/blob/master/test.PNG?raw=true)
<!-- ![screenshot](https://github.com/zainuddin-maker/Double-Y-Bar-With-Line-Chart-/blob/master/test.gif?raw=true) -->


This application is used to  
make a pie chart with the value (in percent) and also the legend of each element , this chart generate from  data and the data from  thingworx platform .

## Example Data
- Data Value

        [
            {
                "id": 1,
                "value": "2"
            },
            {
                "id": 2,
                "value": "5"
            },
            {
                "id": 1,
                "value": "2"
            },
            {
                "id": 2,
                "value": "9"
            }
        ]

- Data Option

        {
            "color":  [
                    {
                        "id": 1,
                        "value": "#00ff00"
                    },
                    {
                        "id": 2,
                        "value": "#ff00ff"
                    }
                ]
            ,
            "type": 
                [
                    {
                        "id": 1,
                        "value": "Example 1"
                    },
                    {
                        "id": 2,
                        "value": "Example 2"
                    }
                ]
            
        }

## Usage example

<table>
<tr>
<td>



after the data is inputted into the chart, we can see what the data is, and the percentage value is automatically calculated, so enter the name and value values, then the application will immediately automatically calculate the data. we can also hover over the chart and then the data name and value in percent will appear

Every pop up is automatic so it doesn't cross the limit of the given div container


</td>
</tr>
</table>


<!-- ## BIND DATA

1.  JSONDocinformation , input - JSON - Data for Doc Information in header

   
        {
            name: (STRING),
            value: (STRING),
        }



2.  JSONHeaderinformation, input - JSON - Data for Headerinformation in header.

       
        {
            name: (STRING),
            value: (STRING),
        }

3.  ConfigurationWidth, input - INFOTABLE - Configuration widht each of column in excel.

       
        {
            width: (STRING),
        }


4.  BooleanDisplayButton , input -BOOLEAN - Input for button seen or not 
5.  Filename , input - STRING - name of file after exported
6.  Headername , input - STRING - the title in template document.
4.  LabourProductivity , input - INFOTABLE - Data for Labour Productuvity

        {
            name: (STRING),
            value: (STRING),
            unit:  (STRING),
         }

5.  DataAddChangeMaintanance , input - INFOTABLE - List of Change of Maintanance .

        datashape :
        {
            changefrom : (DATE),
            idmaintanance : (NUMBER),
        }

6.  DataClickMaintanance , output - INFOABLE - Data out after click maintanance .

        datashape :
        {
            form : (DATE) ,
            to : (DATE),
            id : (STRING),
            idmaintanance : (NUMBER),
            imgstatus : (STRING),
            status : (STRING),
            text : (STRING),
        }

7.  idRandom , input - STRING - Random ID for Application
8.  HeightOfHeader , input - NUMBER - change height of header tittle

## BIND TRIGGER

1. clickMaintanance, out - "Event triggered when clicked the maintanance"
1. updateMaintanance, in - "Event triggered when maintanance updated"


 -->





## Built with 

- [D3.js](https://d3js.org/) - D3.js is a JavaScript library for manipulating documents based on data.
- [html](https://www.w3schools.com/html/) - HTML is the standard markup language for Web pages.
- [css](https://www.w3schools.com/css/) - CSS is the language we use to style an HTML document














