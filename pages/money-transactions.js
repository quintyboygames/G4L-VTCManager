import NumberFormat from "react-number-format";
import User from "../models/User";
import {useEffect, useState} from "react";
import Link from "next/link";
import {HTTPRequestUtils} from "../utils/HTTPRequestUtils";
import {LogbookUtils} from "../utils/LogbookUtils";

import {FaClipboardCheck, FaTruck, FaCoins, FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaCircle} from "react-icons/fa";
import {NoJobsInfo} from "../components/logbook/NoJobsInfo";
import {Box, Breadcrumbs, Button, Paper, Typography, useTheme} from "@mui/material";
import {DashItem} from "../components/DashItem";
import {useAuth} from "../contexts/AuthContext";
import {CreateMoneyTransactionModal} from "../components/modals/CreateMoneyTransactionModal";

export default function UserMoneyTransactionsPage() {
    const auth = useAuth();
    const theme = useTheme();

    const [data, setData] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        let options = {
            headers: new Headers(
                {
                    'Authorization': 'Bearer ' + localStorage.getItem('authtoken'),
                    'Accept': 'application/json'
                })
        };

        fetch(HTTPRequestUtils.getUrl(HTTPRequestUtils.API_routes.GetUserMoneyTransactions), options)
            .then(res => res.json())
            .then(
                (result) => {
                    setData(result);
                    console.log(result);
                }
            )
    }, []);


    return (
        <>
            <CreateMoneyTransactionModal isOpen={isCreateModalOpen} setIsOpen={setIsCreateModalOpen} />
            <div className="page-wrapper p-6 navbar-top-margin">
                <DashItem sx={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography color="inherit">{auth.user.username}</Typography>
                        <Typography color="text.primary">Money Transactions</Typography>
                    </Breadcrumbs>
                    <Button variant="contained" color="success" style={{backgroundColor: theme.palette.success.main}} onClick={() => setIsCreateModalOpen(true)}>
                        Create
                    </Button>
                </DashItem>
                <DashItem sx={{overflowX: "auto"}}>
                    <table className="5-latest-tours-table table-auto w-full rounded p-5">
                        <thead>
                        <tr key="thead-logbook" className="border-t border-b border-white border-opacity-40">
                            <th className="px-5 py-1">Sender</th>
                            <th className="px-5 py-1">Receiver</th>
                            <th className="px-5 py-1">Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((transaction) => (
                            <tr key={"logbook-entry-" + transaction.id} className="border-t border-b border-white border-opacity-40">
                                <td className="px-5 text-center py-2">{transaction.id}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </DashItem>
            </div>
        </>
    );
}