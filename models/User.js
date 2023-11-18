export default class User {
    ID = 0;
    username = "";
    bank_balance = null;
    company_data = [];
    isOwnerOfCompany() {
        return this.ID === this.company_data["owner_id"];
    }
}