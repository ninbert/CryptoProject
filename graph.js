createGraph = (arr, crydata, array) => {
    arr = JSON.parse(localStorage.graphCryptoArray);
    console.log(arr);
    $("#chartContainer").css("display", "block");

    const myUrl = `https://min-api.cryptocompare.com/data/pricemulti`;
    let extensionUrl = `?fsyms=${arr}&tsyms=USD`;
    /// new arr here

    let apiKey = `&api_key={d12efeef789b33f28935b5841c4387c64ada766ebae436ab0f6229a105b8febb}`;
    // let array2 = arr.map(function(x) {
    //   return x.toUpperCase();
    // });
    let cryData = new Object();
    // console.log(array2);
    function fetchData() {
        $.ajax({
            type: "GET",
            datatype: "json",
            url: myUrl + extensionUrl + apiKey,

            success: function(data7) {
                console.log(data7);
                cryData = data7;
                console.log(cryData);
                updateChart();
            },
            error: function(err) {
                console.log("error : ", err);
            }
        });
    }

    $(document).ready(function() {
        setInterval(fetchData, 1000);
    });
    fetchData();

    let coin0 = 0;
    let coin1 = 0;
    let coin2 = 0;
    let coin3 = 0;
    let coin4 = 0;


    console.log(coin0);
    console.log(coin1);
    console.log(coin2);
    console.log(coin3);
    console.log(coin4);

    var dataPoints1 = [];
    var dataPoints2 = [];
    var dataPoints3 = [];
    var dataPoints4 = [];
    var dataPoints5 = [];

    console.log(coin0);

    var options = {
        title: {
            text: `${arr} to USD`
        },
        axisX: {
            title: "chart updates every 1 second"
        },
        axisY: {
            suffix: "$",
            includeZero: false
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            fontSize: 22,
            fontColor: "dimGrey",
            itemclick: toggleDataSeries
        },
        data: [
            {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.000000000000$",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: false,
                name: arr[0],
                dataPoints: dataPoints1
            },
            {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.000000000000$",
                showInLegend: false,
                name: arr[1],
                dataPoints: dataPoints2
            },
            {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.000000000000$",
                showInLegend: false,
                name: arr[2],
                dataPoints: dataPoints3
            },
            {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.000000000000$",
                showInLegend: false,
                name: arr[3],
                dataPoints: dataPoints4
            },
            {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.000000000000$",
                showInLegend: false,
                name: arr[4],
                dataPoints: dataPoints5
            }
        ]
    };

    var chart = $("#chartContainer").CanvasJSChart(options);

    function toggleDataSeries(e) {
        if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

    var updateInterval = 1000;
    // initial value
    var yValue1 = coin0;
    var yValue2 = coin1;
    var yValue3 = coin2;
    var yValue4 = coin3;
    var yValue5 = coin4;

    var time = new Date();
    console.log(time);

    function updateChart() {
        time.setTime(time.getTime() + updateInterval);
        for (i = 0; i < arr.length; i++) {
            if (cryData[arr[i]]) {
                var str = `coin${i} = cryData[arr[${i}]].USD`;
                eval(str);
            } else {
                str = `coin${i} = 0`;
                eval(str);
            }
        }

        // adding random value and rounding it to two digits.
        yValue1 = coin0; //Math.round((yValue1 + deltaY1) * 100) / 100;
        yValue2 = coin1; //Math.round((yValue2 + deltaY2) * 100) / 100;
        yValue3 = coin2; //Math.round((yValue3 + deltaY3) * 100) / 100;
        yValue4 = coin3; //Math.round((yValue3 + deltaY3) * 100) / 100;
        yValue5 = coin4; //Math.round((yValue3 + deltaY3) * 100) / 100;
        // pushing the new values
        dataPoints1.push({
            x: time.getTime(),
            y: yValue1
        });
        dataPoints2.push({
            x: time.getTime(),
            y: yValue2
        });
        dataPoints3.push({
            x: time.getTime(),
            y: yValue3
        });
        dataPoints4.push({
            x: time.getTime(),
            y: yValue4
        });
        dataPoints5.push({
            x: time.getTime(),
            y: yValue5
        });

        // updating legend text with  updated with y Value
        options.data[0].legendText = `${arr[0]}  ${yValue1}`;
        options.data[1].legendText = `${arr[1]}  ${yValue2}`;
        options.data[2].legendText = `${arr[2]}  ${yValue3}`;
        options.data[3].legendText = `${arr[3]}  ${yValue4}`;
        options.data[4].legendText = `${arr[4]}  ${yValue5}`;
        $("#chartContainer")
            .CanvasJSChart()
            .render();
    }

    // generates first set of dataPoints
    // updateChart(1000);
    // setInterval(function() {
    //     updateChart();
    // }, updateInterval);

    //console.log(extensionUrl);
};

