import {FaClipboardCheck, FaCoins, FaSignal, FaTruck, FaUsers} from "react-icons/fa";
import NumberFormat from "react-number-format";
import {useEffect, useState} from "react";
import {HTTPRequestUtils} from "../../utils/HTTPRequestUtils";
import Link from "next/link";
import {LogbookUtils} from "../../utils/LogbookUtils";
import User from "../../models/User";
import {NoJobsInfo} from "../../components/logbook/NoJobsInfo";
import {Breadcrumbs, Typography} from "@mui/material";
import {DashItem} from "../../components/DashItem";
import {useAuth} from "../../contexts/AuthContext";

export default function CompanyDashboardPage() {
    const auth = useAuth();

    const [dashboardData, setDashboardData] = useState([]);

    useEffect(() => {
        fetch(HTTPRequestUtils.getUrl(HTTPRequestUtils.API_routes.CompanyDashboard), { headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'Accept': 'application/json' }) })
            .then(res => res.json())
            .then(
                (result) => {
                    setDashboardData(result);
                },
                (error) => {
                }
            )
    }, []);

    let tableContent = [];
    if (dashboardData["latest_5_tours"]) {
        dashboardData["latest_5_tours"].forEach(element => {
            tableContent.push(
                <tr key={"logbook-entry-" + element.id} className="border-t border-b border-white border-opacity-40">
                    <td className="px-5 text-center py-2">{element.id || "n/a"}</td>
                    <td className="px-5 text-center py-2">{element.city_departure.name || "n/a"}, {element.company_departure.name || "n/a"}</td>
                    <td className="px-5 text-center py-2">{element.city_destination.name || "n/a"}, {element.company_destination.name || "n/a"}</td>
                    <td className="px-5 text-center py-2"><div className="flex"><div className="flex items-center mx-auto">{LogbookUtils.getJobStatusIcon(element.status)} {LogbookUtils.getJobStatusText((element.status))}</div></div></td>
                    <td className="px-5 text-center py-2">{LogbookUtils.getCargoName(element.cargo)}</td>
                    <td className="px-5 text-center py-2">{element.truck_model.truck_manufacturer.name || "n/a"} {element.truck_model.name || "n/a"}</td>
                    <td className="px-5 text-center py-2">{<NumberFormat value={element.income} thousandSeparator="." decimalSeparator="," displayType="text" suffix="€" defaultValue={0} fixedDecimalScale={true} decimalScale={2} />}</td>
                    <td className="px-5 text-center py-4">
                        <Link href={"/job/" + element.id}>
                            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View</a>
                        </Link>
                    </td>
                </tr>
            );
        });
    }

    return (
        <div className="page-wrapper p-6 navbar-top-margin">
            <DashItem>
                <Breadcrumbs aria-label="breadcrumb">
                    <Typography color="inherit">{auth.user.company_data["name"]}</Typography>
                    <Typography color="text.primary">Dashboard</Typography>
                </Breadcrumbs>
            </DashItem>
            <div className="top-stats-overview-wrapper w-full grid gap-6 sm:grid-cols-5">
                <DashItem sx={{display: "flex", height: "120px"}} mb={0}>
                    <div className="flex-grow self-center">
                        <h1 className="text-3xl">{dashboardData["jobs_delivered_total"] || "-"}</h1>
                        <p className="text-opacity-70 text-white mt-1">Jobs delivered (Total)</p>
                    </div>
                    <div className="flex-none self-center">
                        <FaClipboardCheck size="42px" />
                    </div>
                </DashItem>
                <DashItem sx={{display: "flex", height: "120px"}} mb={0}>
                    <div className="flex-grow self-center">
                        <h1 className="text-3xl">{dashboardData["jobs_delivered_7_days"] || "-"}</h1>
                        <p className="text-opacity-70 text-white mt-1">Jobs delivered<br />(Last 7 Days)</p>
                    </div>
                    <div className="flex-none self-center">
                        <FaTruck size="42px" />
                    </div>
                </DashItem>
                <DashItem sx={{display: "flex", height: "120px"}} mb={0}>
                    <div className="flex-grow self-center">
                        <h1 className="text-3xl"><NumberFormat value={dashboardData["bank_balance"]} thousandSeparator="." decimalSeparator="," displayType="text" suffix="€" defaultValue={0} fixedDecimalScale={true} decimalScale={2} /></h1>
                        <p className="text-opacity-70 text-white mt-1">Current Account Balance</p>
                    </div>
                    <div className="flex-none self-center">
                        <FaCoins size="42px" />
                    </div>
                </DashItem>
                <DashItem sx={{display: "flex", height: "120px"}} mb={0}>
                    <div className="flex-grow self-center">
                        <h1 className="text-3xl">{dashboardData["employees_total"]}</h1>
                        <p className="text-opacity-70 text-white mt-1">Employees</p>
                    </div>
                    <div className="flex-none self-center">
                        <FaUsers size="42px" />
                    </div>
                </DashItem>
                <DashItem sx={{display: "flex", height: "120px"}} mb={0}>
                    <div className="flex-grow self-center">
                        <h1 className="text-3xl">{dashboardData["employees_online"]}</h1>
                        <p className="text-opacity-70 text-white mt-1">Employees Online (Desktop Client)</p>
                    </div>
                    <div className="flex-none self-center">
                        <FaSignal size="42px" color="#24f23c" />
                    </div>
                </DashItem>
            </div>
            <div className="w-full bg-dark-3 rounded p-5 my-6 overflow-x-auto">
                <h1 className="font-bold text-3xl text-center mb-5">The latest 5 tours in this company</h1>
                <table className="5-latest-tours-table table-auto w-full bg-dark-3 rounded p-5">
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
                    {tableContent.length > 0 && <tbody>{tableContent}</tbody>}
                </table>
                {tableContent.length < 1 && <NoJobsInfo variant="company" />}
            </div>
        </div>
    )
}