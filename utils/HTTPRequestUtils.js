import AppConfig from "../models/AppConfig";

export class HTTPRequestUtils {
    static API_routes = Object.freeze({
        "UserLogbook":                  1,
        "UserDashboard":                2,
        "CompanyLogbook":               3,
        "CompanyDashboard":             4,
        "GetJobData":                   5,
        "CompanySearch":                6,
        "ApplyAtCompany":               7,
        "CompanyApplications":          8,
        "CompanyApplication":           9,
        "CompanyAcceptApplication":     10,
        "CompanyDeclineApplication":    11,
        "CompanyEmployees":             12,
        "CompanyKickEmployee":          13,
        "LoginRedirect":                14,
        "AuthRedirect":                 15,
        "DeleteCompany":                16,
        "CheckServiceStatus":           17,
        "LeaveCompany":                 18,
        "RenameCompany":                19,
        "GetUserMoneyTransactions":     20,
    });

    static getUrl(route, additional_params = "", id = 0){
        let isAPIRoute = true;
        let url = "";

        switch(route) {
            case this.API_routes.UserLogbook:
                url += "jobs";
                break;

            case this.API_routes.CompanyLogbook:
                url += "company/jobs";
                break;

            case this.API_routes.CompanyDashboard:
                url += "company/dashboard";
                break;

            case this.API_routes.UserDashboard:
                url += "webapp/dashboard";
                break;

            case this.API_routes.GetJobData:
                url += "jobs/" + id;
                break;

            case this.API_routes.CompanySearch:
                url += "company/search";
                break;

            case this.API_routes.ApplyAtCompany:
                url += "company/" + id + "/apply";
                break;

            case this.API_routes.CompanyApplications:
                url += "company/applications";
                break;

            case this.API_routes.CompanyApplication:
                url += "company/application/" + id;
                break;

            case this.API_routes.CompanyAcceptApplication:
                url += "company/application/" + id + "/accept";
                break;

            case this.API_routes.CompanyDeclineApplication:
                url += "company/application/" + id + "/decline";
                break;

            case this.API_routes.CompanyEmployees:
                url += "company/employees";
                break;

            case this.API_routes.CompanyKickEmployee:
                url += "company/employee/" + id + "/kick";
                break;

            case this.API_routes.AuthRedirect:
                url += "auth/vcc/web-app/redirect";
                isAPIRoute = false;
                break;

            case this.API_routes.DeleteCompany:
                url += "company";
                break;

            case this.API_routes.CheckServiceStatus:
                url += "status";
                break;

            case this.API_routes.LeaveCompany:
                url += "company/leave";
                break;

            case this.API_routes.RenameCompany:
                url += "company/rename";
                break;

            case this.API_routes.GetUserMoneyTransactions:
                url += "money-transactions";
                break;

            default:
                return;
        }

        url = AppConfig.server_url + (isAPIRoute ? "api/" + url : url)

        url += "?language_code=" + navigator.language.split("-")[0];

        if(additional_params.startsWith("?"))
            additional_params = additional_params.substring(1);

        if(!additional_params.startsWith("&"))
            additional_params = "&" + additional_params;

        url += additional_params;

        return encodeURI(url);
    }
}