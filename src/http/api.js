import axios from "./index.js"
const base = {
    url: "http://m.haoio.com:5000",
    wxp: "http://47.75.183.154:5000"
};
const interfaces = {
    getTableData(obj) {
        return axios.get(`${base.url}/api/getList`, {
            params: obj
        })
    },
    getHomeData() {
        return axios.get(`${base.wxp}/api/getIndexData`)
    },
    getFormData() {
        return axios.get(`${base.wxp}/api/getAllFilterData`)
    }
    
}
export default interfaces;