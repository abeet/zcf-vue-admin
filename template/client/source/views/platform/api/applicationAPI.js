/* global axios */
const applicationAPI = {
    getTopMenu() {
        return axios.get('/api/application/topmenus').then(res => res.data)
    },
    getRouters() {
        return axios.get('/api/application/routers').then(res => res.data)
    },
    getPrivs() {
        return axios.get('/api/application/privs').then(res => res.data)
    },
    getI18n(){
        return axios.get('/api/application/i18ns').then(res => res.data)    	
    }
};

export default applicationAPI;