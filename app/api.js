((window) => {
    const netApi = axios.create({
        withCredentials: true,
        headers: {},
    });

    netApi.defaults.headers.post['Content-Type'] = 'application/json';

    netApi.interceptors.response.use(
        response => {
            return response.data;
        }
    )

    window.api = window.api || {
        getBusinessPlan() {
            // test
            return netApi.get('/api/BusinessPlan')
        },
        /**
         * @description 创建一个大图节点
         * @param {*} data
         * @returns
         */
        createBusinessPlanNode(data) {
            // {
            //     "name": "string",
            //     "rootId": 0,
            //     "type": 1,
            //     "order": 0
            //   }
            return netApi.post('./api/BusinessPlan/CreateBusinessPlanNode', data);
        },
        /**
         * @description 批量创建业务大图节点
         * @param {*} data
         * @returns
         */
        batchCreateBusinessPlanNode(data) {
            // [
            //     {
            //       "name": "string",
            //       "order": 0,
            //       "list": [
            //         {
            //           "name": "string",
            //           "type": 1,
            //           "order": 0
            //         }
            //       ]
            //     }
            //   ]
            return netApi.post('./api/BusinessPlan/BatchCreateBusinessPlanNode', data);
        },
        /**
         * @description 创建一个大图节点关系
         * @param {*} data
         * @returns
         */
        createBusinessPlanRelationShip(data) {
            // {
            //     "beginId": 0,
            //     "endId": 0
            //   }
            return netApi.post('./api/BusinessPlan/CreateBusinessPlanRelationShip', data);
        },
        /**
         * @description 获取模板
         * @param {*} tpl
         * @returns
         */
        getHtmlTemplate(tpl) {
            return netApi.get(`./tpl/${tpl}`);
        },
    }
})(window);