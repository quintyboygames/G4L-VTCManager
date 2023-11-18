import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {LogbookUtils} from "../../utils/LogbookUtils";
import NumberFormat from "react-number-format";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import User from "../../models/User";
import {HTTPRequestUtils} from "../../utils/HTTPRequestUtils";
import {NoJobsInfo} from "../../components/logbook/NoJobsInfo";
import {DashItem} from "../../components/DashItem";
import {Breadcrumbs, Typography} from "@mui/material";
import {useAuth} from "../../contexts/AuthContext";

export default function CompanyLogbookPage() {
    const router = useRouter();
    const auth = useAuth();

    const [currentPage, setCurrentPage] = useState(router.query.page || 1);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [serverResponse, setServerResponse] = useState(null);
    const [error, setError] = useState();

    async function handlePageClick(data) {
        setIsLoaded(false);
        setItems([]);
        setServerResponse(null);
        setCurrentPage(data.selected + 1);

        await router.push("/company/logbook?page=" + (data.selected + 1), null, {shallow: true});
    }

    const loadData = useCallback((page) => {
        fetch(HTTPRequestUtils.getUrl(HTTPRequestUtils.API_routes.CompanyLogbook, "page=" + page), { headers: new Headers({'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'Accept': 'application/json'})})
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result["data"]);
                    setServerResponse(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, []);

    useEffect(() => {
        loadData(currentPage);
    }, [currentPage, loadData]);

    let response;
    if (error) {
        response = <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        response = (
            <div>Loading data...</div>
        );
    } else {
        let tableContent = [];
        items?.forEach(element => {
            tableContent.push(
                <tr key={"logbook-entry-" + element.id} className="border-t border-b border-white border-opacity-40">
                    <td className="px-5 text-center py-2">{element.id || "n/a"}</td>
                    <td className="px-5 text-center py-2">{element.city_departure.name || "n/a"}, {element.company_departure.name || "n/a"}</td>
                    <td className="px-5 text-center py-2">{element.city_destination.name || "n/a"}, {element.company_destination.name || "n/a"}</td>
                    <td className="px-5 text-center py-2"><div className="flex"><div className="flex items-center mx-auto">{LogbookUtils.getJobStatusIcon(element.status)} {LogbookUtils.getJobStatusText((element.status))}</div></div></td>
                    <td className="px-5 text-center py-2">{LogbookUtils.getCargoName(element.cargo)}</td>
                    <td className="px-5 text-center py-2">{element.cargo_damage ? element.cargo_damage + " %" : "n/a"}</td>
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
        response = (
            <div>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead>
                        <tr key="thead-logbook" className="border-b border-white border-opacity-40">
                            <th className="px-5 py-1">ID</th>
                            <th className="px-5 py-1">Departure</th>
                            <th className="px-5 py-1">Destination</th>
                            <th className="px-5 py-1">Status</th>
                            <th className="px-5 py-1">Cargo</th>
                            <th className="px-5 py-1">Cargo Damage</th>
                            <th className="px-5 py-1">Truck</th>
                            <th className="px-5 py-1">Income</th>
                            <th className="px-5 py-1"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableContent}
                        </tbody>
                    </table>
                </div>
                {tableContent.length < 1 && <NoJobsInfo variant="company" />}
                {tableContent.length > 0 &&
                    <div className={"flex justify-center mt-4"}>
                        <ReactPaginate
                            onPageChange={handlePageClick}
                            initialPage={serverResponse["current_page"]-1}
                            disableInitialCallback={true}
                            pageCount={serverResponse["last_page"]}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            containerClassName={"relative z-0 inline-flex shadow-sm -space-x-px pt-5"}
                            pageClassName={"relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"}
                            previousLabel={<div><span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                     fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                          clipRule="evenodd"/>
                                </svg></div>}
                            previousClassName={"relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"}
                            nextLabel={<div>
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                     fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                          clipRule="evenodd"/>
                                </svg>
                            </div>}
                            nextClassName={"relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"}
                            breakLabel={<span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>}
                        />
                    </div>
                }
            </div>
        );
    }

    return (
        (<div className="p-6 navbar-top-margin">
            <DashItem>
                <Breadcrumbs aria-label="breadcrumb">
                    <Typography color="inherit">{auth.user.company_data["name"]}</Typography>
                    <Typography color="text.primary">Logbook</Typography>
                </Breadcrumbs>
            </DashItem>
            <DashItem mb={0}>
                <div>
                    {response}
                </div>
            </DashItem>
        </div>)
    );
}