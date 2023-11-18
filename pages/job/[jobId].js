import {useEffect, useState} from "react";
import {HTTPRequestUtils} from "../../utils/HTTPRequestUtils";
import {useRouter} from "next/router";
import NumberFormat from "react-number-format";
import {
    FaBox,
    FaMapMarkedAlt,
    FaRoad,
    FaStar,
    FaTachometerAlt,
    FaWarehouse,
    FaWeightHanging
} from "react-icons/fa";
import {FaCoins, FaTruck} from "react-icons/fa";
import {LogbookUtils} from "../../utils/LogbookUtils";
import {VictoryAxis, VictoryChart, VictoryLegend, VictoryLine, VictoryVoronoiContainer} from "victory";

export default function JobPage() {
    const router = useRouter();

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [chartSpeedData, setChartSpeedData] = useState([]);
    const [chartSpeedLimitData, setChartSpeedLimitData] = useState([]);
    const [averageSpeed, setAverageSpeed] = useState(0);
    const [maxSpeed, setMaxSpeed] = useState(0);

    let speedChartTheme = getSpeedChartTheme();

    let job_id = router.query.jobId;

    useEffect(() => {
        fetch(HTTPRequestUtils.getUrl(HTTPRequestUtils.API_routes.GetJobData, "", job_id), { headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'Accept': 'application/json' }) })
            .then(res => res.json())
            .then(
                (result) => {
                    let _SpeedData = [];
                    let _SpeedLimitData = [];
                    let _averageSpeed = 0;
                    let _averageSpeedValues = 0;
                    let _maxSpeed = 0;

                    if(result.job_data_entries){
                        if(result.job_data_entries.length > 0){

                            result.job_data_entries.forEach(function (element, index){
                                if(element.current_speed_kph > 1){
                                    _averageSpeed += element.current_speed_kph;
                                    _averageSpeedValues++;
                                }

                                if(element.current_speed_kph > _maxSpeed)
                                    _maxSpeed = element.current_speed_kph;

                                _SpeedData.push({x: new Date(element.created_at), y: element.current_speed_kph});
                                _SpeedLimitData.push({x: new Date(element.created_at), y: element.current_speed_limit_kph});
                            });

                            console.log(_SpeedData);

                            _averageSpeed = _averageSpeed/_averageSpeedValues;
                        }
                    }

                    setChartSpeedData(_SpeedData);
                    setChartSpeedLimitData(_SpeedLimitData);
                    setData(result);
                    setAverageSpeed(isNaN(_averageSpeed) ? 0 : _averageSpeed);
                    setMaxSpeed(_maxSpeed);
                    setLoading(false)
                },
                (error) => {
                }
            )
    }, [job_id]);

    console.log(averageSpeed)

    return (<div className="page-wrapper p-6 navbar-top-margin">
            <div className="w-full bg-dark-3 rounded p-5 mb-6">
                {loading ?
                    <div className="w-full flex items-center justify-center">
                        <div className="flex items-center">
                            <div className="lds-ellipsis">
                                <div/>
                                <div/>
                                <div/>
                                <div/>
                            </div>
                            <h1 className="text-3xl font-bold ml-5">Loading shipping documents...</h1>
                        </div>
                    </div>
                    : <h1 className="text-3xl text-center font-bold">Job No. {job_id} | User ID: {data.user ? data.user.id : "n/a"}</h1>}
            </div>
            {!loading &&
                <div>
                    <div className="top-stats-overview-wrapper w-full grid gap-6 sm:grid-cols-5">
                        <div className="stats-card rounded h-28 w-full bg-dark-3 p-5 flex">
                            <div className="flex-grow self-center">
                                <h1 className="text-3xl"><NumberFormat value={averageSpeed} decimalSeparator="," displayType="text" suffix=" km/h" defaultValue={0} fixedDecimalScale={true} decimalScale={2} /></h1>
                                <p className="text-opacity-70 text-white mt-1">Average Speed</p>
                            </div>
                            <div className="flex-none self-center">
                                <FaTachometerAlt size="42px" />
                            </div>
                        </div>
                        <div className="stats-card rounded h-28 w-full bg-dark-3 p-5 flex">
                            <div className="flex-grow self-center">
                                <h1 className="text-3xl"><NumberFormat value={maxSpeed} decimalSeparator="," displayType="text" suffix=" km/h" defaultValue={0} fixedDecimalScale={true} decimalScale={0} /></h1>
                                <p className="text-opacity-70 text-white mt-1">Maximum Speed</p>
                            </div>
                            <div className="flex-none self-center">
                                <FaTachometerAlt size="42px" />
                            </div>
                        </div>
                        <div className="stats-card rounded h-28 w-full bg-dark-3 p-5 flex">
                            <div className="flex-grow self-center">
                                <h1 className="text-3xl"><NumberFormat value={data.income} thousandSeparator="." decimalSeparator="," displayType="text" suffix=" €" defaultValue={0} fixedDecimalScale={true} decimalScale={2} /></h1>
                                <p className="text-opacity-70 text-white mt-1">Money Earned</p>
                            </div>
                            <div className="flex-none self-center">
                                <FaCoins size="42px" />
                            </div>
                        </div>
                        <div className="stats-card rounded h-28 w-full bg-dark-3 p-5 flex">
                            <div className="flex-grow self-center">
                                <h1 className="text-3xl"><NumberFormat value={data.planned_distance_km} thousandSeparator="." decimalSeparator="," displayType="text" suffix=" km" defaultValue={0} fixedDecimalScale={true} decimalScale={0} /></h1>
                                <p className="text-opacity-70 text-white mt-1">Planned Distance</p>
                            </div>
                            <div className="flex-none self-center">
                                <FaRoad size="42px" />
                            </div>
                        </div>
                        <div className="stats-card rounded h-28 w-full bg-dark-3 p-5 flex">
                            <div className="flex-grow self-center">
                                <h1 className="text-3xl">{LogbookUtils.getJobStatusText(data.status)}</h1>
                                <p className="text-opacity-70 text-white mt-1">Job Status</p>
                            </div>
                            <div className="flex-none self-center">
                                {LogbookUtils.getJobStatusIcon(data.status, "42px")}
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-dark-3 rounded my-6">
                        <div className={chartSpeedData.length > 0 ? "block" : "hidden"}>
                            <VictoryChart
                                theme={speedChartTheme}
                                width={1400}
                                height={500}
                                padding={{right: 25, left: 70, top: 40, bottom: 60}}
                                domainPadding={{y: 20}}
                                containerComponent={
                                <VictoryVoronoiContainer
                                    labels={({ datum }) =>
                                        datum.childName === "speed-chart-line-speed" ? `Speed: ${datum.y} km/h` : `Speed limit: ${datum.y} km/h\nTime: ${new Date(datum.x).toLocaleString()}`}
                                    voronoiDimension="x"
                                />
                            }>
                                <VictoryLegend x={125} y={50}
                                            orientation="horizontal"
                                            gutter={20}
                                            style={{ border: { stroke: "black" }, zIndex: 30 }}
                                            data={[
                                                { name: "Speed Limit", symbol: { fill: "#ff375f" } },
                                                { name: "Current Speed", symbol: { fill: "#64d2ff" } },
                                            ]}
                            />
                                <VictoryAxis dependentAxis label={"Speed"} />
                                <VictoryAxis label={"Time"} fixLabelOverlap={true} tickFormat={(t) => new Date(t).toLocaleTimeString()}/>
                                <VictoryLine
                                    style={{
                                        data: { stroke: "#64d2ff" },
                                        parent: { border: "1px solid #ccc"}
                                    }}
                                    name="speed-chart-line-speed"
                                    data={chartSpeedData}
                                    interpolation="natural"
                                />
                                <VictoryLine
                                    style={{
                                        data: { stroke: "#ff375f" },
                                        parent: { border: "1px solid #ccc"}
                                    }}
                                    name="speed-chart-line-speed-limit"
                                    data={chartSpeedLimitData}
                                />
                            </VictoryChart>
                        </div>
                        <div className={chartSpeedData.length <= 0 ? "block" : "hidden"}>
                            <h2 className="font-bold text-2xl text-white text-opacity-70 text-center py-16">Speed data is not available for this job.</h2>
                        </div>
                    </div>
                    <div className="w-full bg-dark-3 rounded px-5 py-7 my-6 grid grid-cols-4 gap-4">
                        <div className="mx-auto">
                            <h1 className="font-bold text-2xl mb-3 text-center">Truck Information</h1>
                            <div className="flex items-center mb-1">
                                <FaTruck icon="truck" size="1.25em" className="mr-3"/>
                                <p>Truck: { data.truck_model ? (data.truck_model.truck_manufacturer.name + " " + data.truck_model.name): "n/a"}</p>
                            </div>
                        </div>
                        <div className="mx-auto">
                            <h1 className="font-bold text-2xl mb-3 text-center">Route Information</h1>
                            <div className="flex items-center mb-1">
                                <FaRoad size="1.25em" className="mr-3"/>
                                <p>Planned Distance: <NumberFormat value={data.planned_distance_km} thousandSeparator="." decimalSeparator="," displayType="text" suffix=" km" defaultValue={0} fixedDecimalScale={true} decimalScale={0} /></p>
                            </div>
                            <div className="flex items-center mb-1">
                                <FaMapMarkedAlt size="1.25em" className="mr-3"/>
                                <p>Departure: { data.city_departure ? (data.city_departure.name + ", " + data.company_departure.name): "n/a"}</p>
                            </div>
                            <div className="flex items-center mb-1">
                                <FaMapMarkedAlt size="1.25em" className="mr-3"/>
                                <p>Destination: { data.city_destination ? (data.city_destination.name + ", " + data.company_destination.name): "n/a"}</p>
                            </div>
                        </div>
                        <div className="mx-auto">
                            <h1 className="font-bold text-2xl mb-3 text-center">Cargo Information</h1>
                            <div className="flex items-center mb-1">
                                <FaBox size="1.25em" className="mr-3"/>
                                <p>Cargo: { data.cargo ? LogbookUtils.getCargoName(data.cargo): "n/a"}</p>
                            </div>
                            <div className="flex items-center mb-1">
                                <FaWeightHanging size="1.25em" className="mr-3"/>
                                <p>Weight: <NumberFormat value={LogbookUtils.getCargoMass(data.cargo_mass)} thousandSeparator="." decimalSeparator="," displayType="text" suffix=" t" defaultValue={0} decimalScale={2} /></p>
                            </div>
                        </div>
                        <div className="mx-auto">
                            <h1 className="font-bold text-2xl mb-3 text-center">Job Information</h1>
                            <div className="flex items-center mb-1">
                                <FaCoins size="1.25em" className="mr-3"/>
                                <p>Earnings: <NumberFormat value={data.income} thousandSeparator="." decimalSeparator="," displayType="text" suffix=" €" defaultValue={0} fixedDecimalScale={true} decimalScale={2} /></p>
                            </div>
                            <div className="flex items-center mb-1">
                                <FaStar size="1.25em" className="mr-3"/>
                                <p>Special Job: { data.special_job ? "Yes": "No"}</p>
                            </div>
                            <div className="flex items-center mb-1">
                                <FaWarehouse size="1.25em" className="mr-3"/>
                                <p>Job Type: { LogbookUtils.getJobType(data.market_id)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>);
}

function getSpeedChartTheme(){
    // Colors
    const yellow200 = "#FFF59D";
    const deepOrange600 = "#F4511E";
    const lime300 = "#DCE775";
    const lightGreen500 = "#8BC34A";
    const teal700 = "#00796B";
    const cyan900 = "#006064";
    const colors = [
        deepOrange600,
        yellow200,
        lime300,
        lightGreen500,
        teal700,
        cyan900
    ];
    const blueGrey50 = "#ECEFF1";
    const blueGrey300 = "#90A4AE";
    const blueGrey700 = "#455A64";
    const grey900 = "#212121";

// Typography
    const sansSerif = "'Helvetica Neue', 'Helvetica', sans-serif";
    const letterSpacing = "normal";
    const fontSize = 12;

// Layout
    const padding = 8;
    const baseProps = {
        width: 350,
        height: 350,
        padding: 50
    };

// * Labels
    const baseLabelStyles = {
        fontFamily: sansSerif,
        fontSize,
        letterSpacing,
        padding,
        fill: "#FFFFFFFF",
        stroke: "transparent",
        strokeWidth: 0
    };

    const centeredLabelStyles = Object.assign({ textAnchor: "middle" }, baseLabelStyles);

// Strokes
    const strokeDasharray = "10, 5";
    const strokeLinecap = "round";
    const strokeLinejoin = "round";

// Put it all together...
    return {
        area: Object.assign(
            {
                style: {
                    data: {
                        fill: grey900
                    },
                    labels: baseLabelStyles
                }
            },
            baseProps
        ),
        axis: Object.assign(
            {
                style: {
                    axis: {
                        fill: "transparent",
                        stroke: blueGrey300,
                        strokeWidth: 2,
                        strokeLinecap,
                        strokeLinejoin
                    },
                    axisLabel: Object.assign({}, centeredLabelStyles, {
                        padding,
                        stroke: "transparent"
                    }),
                    grid: {
                        fill: "none",
                        stroke: blueGrey50,
                        strokeDasharray,
                        strokeLinecap,
                        strokeLinejoin,
                        pointerEvents: "painted"
                    },
                    ticks: {
                        fill: "transparent",
                        size: 5,
                        stroke: "#EBEBF599",
                        strokeWidth: 1,
                        strokeLinecap,
                        strokeLinejoin
                    },
                    tickLabels: Object.assign({}, baseLabelStyles, {
                        fill: "#EBEBF599"
                    })
                }
            },
            baseProps
        ),
        polarDependentAxis: Object.assign({
            style: {
                ticks: {
                    fill: "transparent",
                    size: 1,
                    stroke: "transparent"
                }
            }
        }),
        bar: Object.assign(
            {
                style: {
                    data: {
                        fill: blueGrey700,
                        padding,
                        strokeWidth: 0
                    },
                    labels: baseLabelStyles
                }
            },
            baseProps
        ),
        boxplot: Object.assign(
            {
                style: {
                    max: { padding, stroke: blueGrey700, strokeWidth: 1 },
                    maxLabels: Object.assign({}, baseLabelStyles, { padding: 3 }),
                    median: { padding, stroke: blueGrey700, strokeWidth: 1 },
                    medianLabels: Object.assign({}, baseLabelStyles, { padding: 3 }),
                    min: { padding, stroke: blueGrey700, strokeWidth: 1 },
                    minLabels: Object.assign({}, baseLabelStyles, { padding: 3 }),
                    q1: { padding, fill: blueGrey700 },
                    q1Labels: Object.assign({}, baseLabelStyles, { padding: 3 }),
                    q3: { padding, fill: blueGrey700 },
                    q3Labels: Object.assign({}, baseLabelStyles, { padding: 3 })
                },
                boxWidth: 20
            },
            baseProps
        ),
        candlestick: Object.assign(
            {
                style: {
                    data: {
                        stroke: blueGrey700
                    },
                    labels: Object.assign({}, baseLabelStyles, { padding: 5 })
                },
                candleColors: {
                    positive: "#ffffff",
                    negative: blueGrey700
                }
            },
            baseProps
        ),
        chart: baseProps,
        errorbar: Object.assign(
            {
                borderWidth: 8,
                style: {
                    data: {
                        fill: "transparent",
                        opacity: 1,
                        stroke: blueGrey700,
                        strokeWidth: 2
                    },
                    labels: baseLabelStyles
                }
            },
            baseProps
        ),
        group: Object.assign(
            {
                colorScale: colors
            },
            baseProps
        ),
        histogram: Object.assign(
            {
                style: {
                    data: {
                        fill: blueGrey700,
                        stroke: grey900,
                        strokeWidth: 2
                    },
                    labels: baseLabelStyles
                }
            },
            baseProps
        ),
        legend: {
            colorScale: colors,
            gutter: 10,
            orientation: "vertical",
            titleOrientation: "top",
            style: {
                data: {
                    type: "circle"
                },
                labels: baseLabelStyles,
                title: Object.assign({}, baseLabelStyles, { padding: 5 }),
            }
        },
        line: Object.assign(
            {
                style: {
                    data: {
                        fill: "transparent",
                        opacity: 1,
                        stroke: blueGrey700,
                        strokeWidth: 2
                    },
                    labels: baseLabelStyles
                }
            },
            baseProps
        ),
        pie: Object.assign(
            {
                colorScale: colors,
                style: {
                    data: {
                        padding,
                        stroke: blueGrey50,
                        strokeWidth: 1
                    },
                    labels: Object.assign({}, baseLabelStyles, { padding: 20 })
                }
            },
            baseProps
        ),
        scatter: Object.assign(
            {
                style: {
                    data: {
                        fill: blueGrey700,
                        opacity: 1,
                        stroke: "transparent",
                        strokeWidth: 0
                    },
                    labels: baseLabelStyles
                }
            },
            baseProps
        ),
        stack: Object.assign(
            {
                colorScale: colors
            },
            baseProps
        ),
        tooltip: {
            style: Object.assign({}, baseLabelStyles, { padding: 0, pointerEvents: "none" }),
            flyoutStyle: {
                stroke: grey900,
                strokeWidth: 1,
                fill: "#f0f0f0",
                pointerEvents: "none"
            },
            flyoutPadding: 5,
            cornerRadius: 5,
            pointerLength: 10
        },
        voronoi: Object.assign(
            {
                style: {
                    data: {
                        fill: "transparent",
                        stroke: "transparent",
                        strokeWidth: 0
                    },
                    labels: Object.assign({}, baseLabelStyles, { padding: 5, pointerEvents: "none" }),
                    flyout: {
                        stroke: grey900,
                        strokeWidth: 1,
                        fill: "#48484AFF",
                        pointerEvents: "none"
                    }
                }
            },
            baseProps
        )
    };
}