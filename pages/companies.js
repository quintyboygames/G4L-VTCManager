import {useRouter} from "next/router";
import User from "../models/User";
import ReactPaginate from "react-paginate";
import {useCallback, useEffect, useState} from "react";
import {HTTPRequestUtils} from "../utils/HTTPRequestUtils";
import {toast} from "react-toastify";
import {useAuth} from "../contexts/AuthContext";
import {Breadcrumbs, Typography} from "@mui/material";
import {DashItem} from "../components/DashItem";

export default function CompaniesSearchPage() {
    const router = useRouter();
    const auth = useAuth();

    const [currentPage, setCurrentPage] = useState(router.query.page || 1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [disableModalButtons, setDisableModalButtons] = useState(false);
    const [applyModalDescriptionContent, setApplyModalDescriptionContent] = useState("");
    const [applyModalCurrentCompanyID, setApplyModalCurrentCompanyID] = useState(0);
    const [applyModalCompanyName, setApplyModalCompanyName] = useState("");
    const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);
    const [companyName, setCompanyName] = useState("");

    const loadData = useCallback((searchName, page) => {
        setLoading(true);
        fetch(HTTPRequestUtils.getUrl(HTTPRequestUtils.API_routes.CompanySearch, "page=" + page + "&q=" + encodeURI(searchName)), { headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'Accept': 'application/json' }) })
            .then(res => res.json())
            .then(
                (result) => {
                    setData(result);
                    setLoading(false);
                },
                (error) => {
                    console.error(error);
                    toast.error('An error occurred while loading the search results.', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        toastId: "load-companies-error",
                    });
                }
            )
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        setCompanyName(event.target.elements.namedItem('search_name').value);
    }

    async function handlePageClick(data) {
        setData([]);
        setCurrentPage((data.selected + 1));
        await router.push("/companies?page=" + (data.selected + 1))
    }

    function showApplyModal(company_id, company_name){
        setIsApplyModalVisible(true);
        setApplyModalCompanyName(company_name);
        setApplyModalCurrentCompanyID(company_id);
        setApplyModalDescriptionContent("");
    }

    function closeApplyModal(){
        if(disableModalButtons)
            return;

        setIsApplyModalVisible(false);
        setApplyModalCompanyName("");
        setApplyModalCurrentCompanyID(0);
        setApplyModalDescriptionContent("");
    }

    function handleApplyModalDescriptionChange(event){
        setApplyModalDescriptionContent(event.target.value);
    }

    function handleApplyModalSubmit(event){
        event.preventDefault();

        if(disableModalButtons)
            return;

        setDisableModalButtons(true);

        const requestOptions = {
            method: 'POST',
            headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'Accept': 'application/json', 'Content-Type': 'application/json' }),
            body: JSON.stringify({ application_text: applyModalDescriptionContent })
        };

        fetch(HTTPRequestUtils.getUrl(HTTPRequestUtils.API_routes.ApplyAtCompany, "", applyModalCurrentCompanyID), requestOptions)
            .then(function(response) {
                if(response.status !== 201){
                    toast.error('An error occurred while sending the application.', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        toastId: "send-application-error",
                    });
                    return response.json();
                }
                toast.success('Your application has been sent successfully!', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    toastId: "send-application-success",
                });
                setDisableModalButtons(false);
                closeApplyModal();
            })
            .then(
                (result) => {
                    console.log(result);
                    setDisableModalButtons(false);
                }
            )
    }

    useEffect(() => {
        loadData(companyName, currentPage);
    }, [companyName, currentPage, loadData]);

    let found_companies = [];
    if(data["data"]){
        data["data"].forEach(function(element, index) {
            found_companies.push(
                <div key={element.id} className={"py-4 flex w-full justify-between items-center border-white border-opacity-40 " + (index === 0 ? "" : "border-t-2")}>
                    <div>
                        <h2 className="text-2xl font-bold">{element.name}</h2>
                        <p>{element.about_us || "No description available"}</p>
                    </div>
                    <div>
                        { element.id === (auth.user.company_data ? auth.user.company_data.id : 0) ? "" : <button onClick={ () => showApplyModal(element.id, element.name) } className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Apply</button> }
                    </div>
                </div>
            );
        })
    }

    return (
        (
            <div className="navbar-top-margin">
                <div className={"fixed z-10 inset-0 overflow-y-auto " + (isApplyModalVisible ? "block" : "hidden")}>
                    <form
                        onSubmit={ handleApplyModalSubmit }
                        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-black opacity-75"/>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"
                              aria-hidden="true">&#8203;</span>
                        <div
                            className="inline-block align-bottom bg-dark-3 text-white rounded text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                            <div className="bg-dark-3 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div>
                                    <div className="mt-3 text-center sm:mt-0">
                                        <h3 className="text-lg leading-6 font-medium mb-4" id="modal-headline">
                                            Apply at <span id="nameOfCompany">{applyModalCompanyName}</span>
                                        </h3>
                                        <div className="mt-2">
                                                <textarea className="resize-none shadow-inner focus:shadow rounded w-full py-2 px-3 placeholder-gray-400 bg-dark-4 focus:bg-dark-5 transition-all duration-75 outline-none w-full"
                                                          placeholder="Description"
                                                          onChange={handleApplyModalDescriptionChange}
                                                          value={applyModalDescriptionContent}
                                                />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-dark-3 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={disableModalButtons}>
                                    Apply
                                </button>
                                <button type="button"
                                        onClick={closeApplyModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={disableModalButtons}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="page-wrapper p-6">
                    <DashItem>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography color="text.primary">Explore Companies</Typography>
                        </Breadcrumbs>
                    </DashItem>
                    <DashItem sx={{padding: 3}}>
                        <div className="mb-4">
                            <form onSubmit={handleSubmit} className="flex">
                                <input name="search_name"
                                    className="shadow-inner focus:shadow rounded w-full py-2 px-3 placeholder-gray-400 bg-dark-4 focus:bg-dark-5 transition-all duration-75 outline-none mr-3" type="text"
                                    placeholder="Search for company..." defaultValue={companyName} />
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
                            </form>
                        </div>
                        {!loading && found_companies }
                        <div className={loading ? "block" : "hidden"}>
                            <h1 className="font-bold text-2xl text-center p-4">Loading...</h1>
                        </div>
                        <div className={"flex justify-center"}>
                            {data["data"]?.length > 0 &&
                                <ReactPaginate
                                    onPageChange={handlePageClick}
                                    initialPage={data["current_page"]-1}
                                    disableInitialCallback={true}
                                    pageCount={data["last_page"]}
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
                            }
                        </div>
                    </DashItem>
                </div>
            </div>
        )
    );
}