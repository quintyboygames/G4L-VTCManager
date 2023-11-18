import NumberFormat from "react-number-format";
import User from "../models/User";
import {useEffect, useState} from "react";
import Link from "next/link";
import {HTTPRequestUtils} from "../utils/HTTPRequestUtils";
import {LogbookUtils} from "../utils/LogbookUtils";

import {FaClipboardCheck, FaTruck, FaCoins, FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaCircle} from "react-icons/fa";
import Log from "tailwindcss/lib/util/log";
import {NoJobsInfo} from "../components/logbook/NoJobsInfo";
import {Box, Breadcrumbs, Paper, Typography} from "@mui/material";
import {DashItem} from "../components/DashItem";
import {useAuth} from "../contexts/AuthContext";

export default function UserDashboardPage() {
    const auth = useAuth();

    const [dashboardData, setDashboardData] = useState([]);

    useEffect(() => {
        // ToDo: retrieve default headers from HTTPRequestUtils
        let options = {
            headers: new Headers(
                {
                'Authorization': 'Bearer ' + localStorage.getItem('authtoken'),
                'Accept': 'application/json'
                })
        };

        fetch(HTTPRequestUtils.getUrl(HTTPRequestUtils.API_routes.UserDashboard), options)
            .then(res => res.json())
            .then(
                (result) => {
                    setDashboardData(result);
                }
            )
    }, []);

    let tableContent = [];
    if (dashboardData["latest_5_tours"]) {
        dashboardData["latest_5_tours"].forEach(element => {
            tableContent.push(
                <tr key={"logbook-entry-" + element.id} className="border-t border-b border-white border-opacity-40">
                    <td className="px-5 text-center py-2">{element.id || "n/a"}</td>

                    <td className="px-5 text-center py-2">
                        {element.city_departure.name || "n/a"}, {element.company_departure.name || "n/a"}
                    </td>

                    <td className="px-5 text-center py-2">
                        {element.city_destination.name || "n/a"}, {element.company_destination.name || "n/a"}
                    </td>

                    <td className="px-5 text-center py-2">
                        <div className="flex">
                            <div className="flex items-center mx-auto">
                                {LogbookUtils.getJobStatusIcon(element.status)} {LogbookUtils.getJobStatusText((element.status))}
                            </div>
                        </div>
                    </td>

                    <td className="px-5 text-center py-2">{LogbookUtils.getCargoName(element.cargo)}</td>

                    <td className="px-5 text-center py-2">
                        {element.truck_model.truck_manufacturer.name || "n/a"} {element.truck_model.name || "n/a"}
                    </td>

                    <td className="px-5 text-center py-2">
                        {<NumberFormat value={element.income} thousandSeparator="." decimalSeparator="," displayType="text"
                                       suffix="€" defaultValue={0} fixedDecimalScale={true} decimalScale={2} />}
                    </td>

                    <td className="px-5 text-center py-4">
                        <Link href={"/job/" + element.id}>
                            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View</a>
                        </Link>
                    </td>
                </tr>
            );
        });
    }

    let online_status_text = "";
    let online_status_icon;
    switch (dashboardData["online_status"]) {
        case "ClientOnline":
            online_status_text = "Online (Client)";
            online_status_icon = <FaTruck color={"#24f23c"} size="42px" />;
            break;
        case "Online":
            online_status_text = "Online (WebApp)";
            online_status_icon = <FaCircle color={"#24f23c"} size="42px" />;
            break;
        default:
            online_status_text = "n/a";
            online_status_icon = <FaQuestionCircle color={"#c2c2c2"} size="42px" />;
            break;
    }


    return (
        <div className="page-wrapper p-6 navbar-top-margin">
            <DashItem>
                <Breadcrumbs aria-label="breadcrumb">
                    <Typography color="inherit">{auth.user.username}</Typography>
                    <Typography color="text.primary">Dashboard</Typography>
                </Breadcrumbs>
            </DashItem>
           <DashItem transparent={true} padding={0}>
               <div className="top-stats-overview-wrapper w-full grid gap-6 md:grid-cols-4 xl:grid-cols-5">
                   <DashItem sx={{display: "flex", height: "120px"}} mb={0}>
                       <div className="flex-grow self-center">
                           <h1 className="text-3xl">{dashboardData["jobs_delivered_total"] || "-"}</h1>
                           <p className="text-opacity-70 text-white mt-1">Jobs delivered (Total)</p>
                       </div>
                       <div className="flex-none self-center ml-3">
                           <FaClipboardCheck size="42px" />
                       </div>
                   </DashItem>
                   <DashItem sx={{display: "flex", height: "120px"}} mb={0}>
                       <div className="flex-grow self-center">
                           <h1 className="text-3xl">{dashboardData["jobs_delivered_7_days"] || "-"}</h1>
                           <p className="text-opacity-70 text-white mt-1">Jobs delivered<br />(Last 7 Days)</p>
                       </div>
                       <div className="flex-none self-center ml-3">
                           <FaTruck size="42px" />
                       </div>
                   </DashItem>
                   <DashItem sx={{display: "flex", height: "120px"}} mb={0}>
                       <div className="flex-grow self-center">
                           <h1 className="text-3xl">
                               <NumberFormat value={auth.user.bank_balance} thousandSeparator="." decimalSeparator="," displayType="text"
                                             suffix=" €" defaultValue={0} fixedDecimalScale={true} decimalScale={2} />
                           </h1>
                           <p className="text-opacity-70 text-white mt-1">Current Account Balance</p>
                       </div>
                       <div className="flex-none self-center ml-3">
                           <FaCoins size="42px" />
                       </div>
                   </DashItem>
                   <DashItem sx={{display: "flex", height: "120px"}} mb={0}>
                       <div className="flex-grow self-center">
                           <h1 className="text-3xl">{LogbookUtils.getJobStatusText(dashboardData["latest_tour_status"])}</h1>
                           <p className="text-opacity-70 text-white mt-1">Latest Tour Status</p>
                       </div>
                       <div className="flex-none self-center ml-3">
                           {LogbookUtils.getJobStatusIcon(dashboardData["latest_tour_status"], "42px")}
                       </div>
                   </DashItem>
                   <DashItem sx={{display: "flex", height: "120px"}} mb={0}>
                       <div className="flex-grow self-center">
                           <h1 className="text-xl">{online_status_text}</h1>
                           <p className="text-opacity-70 text-white mt-1">Online Status</p>
                       </div>
                       <div className="flex-none self-center ml-3">
                           {online_status_icon}
                       </div>
                   </DashItem>
               </div>
           </DashItem>
            <DashItem sx={{overflowX: "auto"}}>
                <h1 className="font-bold text-3xl text-center mb-5">Your 5 Latest Tours</h1>
                <table className="5-latest-tours-table table-auto w-full rounded p-5">
                    <thead>
                    <tr key="thead-logbook" className="border-b border-white border-opacity-40">
                        <th className="px-5 py-1">ID</th>
                        <th className="px-5 py-1">Departure</th>
                        <th className="px-5 py-1">Destination</th>
                        <th className="px-5 py-1">Status</th>
                        <th className="px-5 py-1">Cargo</th>
                        <th className="px-5 py-1">Truck</th>
                        <th className="px-5 py-1">Income</th>
                        <th className="px-5 py-1"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableContent}
                    </tbody>
                </table>
                {tableContent.length < 1 && <NoJobsInfo variant="user" />}
            </DashItem>
        </div>
    );
}