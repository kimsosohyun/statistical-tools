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
    },
    deleteFormData(id) {
        return axios.get(`${base.wxp}/api/delItem`,{
            params:{
                id
            }
        })
    },
    getAgntIdList(obj) {
        return axios.get(`${base.wxp}/api/getAgentIdList`, {
            params: obj
        })
    },
    insertAgentId(obj) {
        return axios.post(`${base.wxp}/api/insertAgentId`,obj)
    },
    updateAgengId(obj) {
        return axios.post(`${base.wxp}/api/updateAgengId`,obj)
    },
    login(obj) {
        return axios.post(`${base.wxp}/api/login`,obj)
    },
    
}
export default interfaces;