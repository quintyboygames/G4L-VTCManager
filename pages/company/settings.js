import React, { useState } from "react";
import {HTTPRequestUtils} from "../../utils/HTTPRequestUtils";
import { toast } from "react-toastify";
import User from "../../models/User";
import {useAuth} from "../../contexts/AuthContext";
import {Breadcrumbs, Typography} from "@mui/material";
import {DashItem} from "../../components/DashItem";

export default function CompanySettingsPage() {
    const auth = useAuth();

    const [isDeletingCompany, setIsDeletingCompany] = useState(false);
    const [isLeavingCompany, setIsLeavingCompany] = useState(false);
    const [isRenamingCompany, setIsRenamingCompany] = useState(false);
    const [newCompanyNameInputValue, setNewCompanyNameInputValue] = useState("");

    function DeleteCompany() {
        if (isDeletingCompany)
            return;
        setIsDeletingCompany(true);
        fetch(HTTPRequestUtils.getUrl(HTTPRequestUtils.API_routes.DeleteCompany), { headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'Accept': 'application/json' }), method: 'DELETE', })
            .then(function (result) {
                if (result.status === 204) {
                    toast.success("Your company has been deleted successfully!", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        toastId: "delete-company-success",
                    });
                    window.location.href = "/";
                } else {
                    toast.error("Sorry, but we couldn't delete your company.", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        toastId: "delete-company-error",
                    });
                }
                setIsDeletingCompany(false);
            })
    }

    function RenameCompany(event) {
        event.preventDefault();

        if (isRenamingCompany)
            return;

        setIsRenamingCompany(true);
        fetch(HTTPRequestUtils.getUrl(HTTPRequestUtils.API_routes.RenameCompany),
            {
                headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'Content-Type': 'application/json', 'Accept': 'application/json' }), method: 'POST',
                body: JSON.stringify({ new_company_name: newCompanyNameInputValue }),
            })
            .then(function (result) {
                if (result.status === 204) {
                    toast.success("Your company has been renamed successfully!", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        toastId: "rename-company-success",
                    });
                    window.location.href = "/company/dashboard";
                } else {
                    toast.error("Sorry, but we couldn't change the name of your company.", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        toastId: "rename-company-error",
                    });
                }
                setIsRenamingCompany(false);
            })
    }

    function LeaveCompany() {
        if (isLeavingCompany)
            return;
        setIsLeavingCompany(true);
        fetch(HTTPRequestUtils.getUrl(HTTPRequestUtils.API_routes.LeaveCompany), { headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'Accept': 'application/json' }), method: 'DELETE', })
            .then(function (result) {
                if (result.status === 204) {
                    toast.success("You have left the company successfully!", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        toastId: "leave-company-success",
                    });
                    window.location.href = "/";
                } else {
                    toast.error("Sorry, but an error occured while removing you from the company.", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        toastId: "leave-company-error",
                    });
                }
                setIsLeavingCompany(false);
            })
    }

    return (
        (
            <div>
                <div className="page-wrapper p-6 navbar-top-margin">
                    <DashItem>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography color="inherit">{auth.user.company_data["name"]}</Typography>
                            <Typography color="text.primary">Settings</Typography>
                        </Breadcrumbs>
                    </DashItem>
                    <div className="w-full bg-dark-3 rounded p-5 mb-6">
                        {
                            auth.user.isOwnerOfCompany() &&
                            <div className="mt-10 sm:mt-0">
                                <div className="md:grid md:grid-cols-3 md:gap-6">
                                    <div className="md:col-span-1">
                                        <div className="px-4 sm:px-0">
                                            <h3 className="text-lg font-medium">Delete Company</h3>

                                            <p className="mt-1 text-sm text-white text-opacity-70">
                                                Permanently delete your company and all data related to it.
                                            </p>
                                        </div>
                                    </div>


                                    <div className="mt-5 md:mt-0 md:col-span-2">
                                        <div className="px-4 py-5 sm:p-6 bg-dark-4 shadow sm:rounded-lg">
                                            <div className="max-w-xl text-sm text-white">
                                                Once your company is deleted, all of its resources and data will be
                                                permanently deleted. This action can&apos;t be undone.
                                            </div>

                                            <div className="mt-5">
                                                <button type="button"
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-600 transition ease-in-out duration-150 disabled:opacity-50"
                                                        onClick={DeleteCompany} disabled={isDeletingCompany}>
                                                    Delete Company
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:grid md:grid-cols-3 md:gap-6 mt-10">
                                    <div className="md:col-span-1">
                                        <div className="px-4 sm:px-0">
                                            <h3 className="text-lg font-medium">Rename Company</h3>

                                            <p className="mt-1 text-sm text-white text-opacity-70">
                                                Change the name of your company.
                                            </p>
                                        </div>
                                    </div>


                                    <div className="mt-5 md:mt-0 md:col-span-2">
                                        <form className="px-4 py-5 sm:p-6 bg-dark-4 shadow sm:rounded-lg" onSubmit={RenameCompany}>
                                            <input
                                                className="shadow-inner focus:shadow rounded w-full py-2 px-3 placeholder-gray-400 bg-dark-5 focus:bg-dark-6 transition-all duration-75 outline-none mr-3" type="text"
                                                placeholder="Enter new name..." value={newCompanyNameInputValue} onChange={ (event) => setNewCompanyNameInputValue(event.target.value)} />
                                            <div className="mt-5">
                                                <button type="submit"
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-800 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-600 transition ease-in-out duration-150 disabled:opacity-50"
                                                        disabled={isRenamingCompany}>
                                                    Rename Company
                                                </button>

                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            !auth.user.isOwnerOfCompany() &&
                            <div className="mt-10 sm:mt-0">
                                <div className="md:grid md:grid-cols-3 md:gap-6">
                                    <div className="md:col-span-1">
                                        <div className="px-4 sm:px-0">
                                            <h3 className="text-lg font-medium">Leave Company</h3>
                                        </div>
                                    </div>


                                    <div className="mt-5 md:mt-0 md:col-span-2">
                                        <div className="px-4 py-5 sm:p-6 bg-dark-4 shadow sm:rounded-lg">
                                            <div className="max-w-xl text-sm text-white">
                                                Once you left the company, you won&apos;t be able to access all company-related pages, and you will lose your current position.
                                                This action can&apos;t be undone, but you can apply at the company again at any time.
                                            </div>

                                            <div className="mt-5">
                                                <button type="button"
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-600 transition ease-in-out duration-150 disabled:opacity-50"
                                                        onClick={LeaveCompany} disabled={isLeavingCompany}>
                                                    Leave Company
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    );
}
