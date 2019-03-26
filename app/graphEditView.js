let api = window.api;

Vue.component('GraphEditView', (res, rej) => {
    api.getHtmlTemplate('graph-edit.html').then(html => {
        res({
            template: html,
            props: {

            },
            data() {
                return {
                    oriData: null,
                    leftModel: null,
                    rightModel: null,
                    leftAttr: null,
                    rightAttr: null
                }
            },
            computed: {
                models() {
                    return this.oriData ? this.oriData.nodes.filter(x => x.type == 1) : [];
                },
            },
            methods: {
                onSelectedModelsLeft(modelId) {
                    this.leftModel = this.models.find(x => x.id == modelId);
                    this.leftAttr = this.getAttrsByModel(modelId)
                },
                onSelectedModelsRight(modelId) {
                    this.rightModel = this.models.find(x => x.id == modelId);
                    this.rightAttr = this.getAttrsByModel(modelId)
                },
                getAttrsByModel(modelId) {
                    return {
                        attrs: this.oriData.nodes.filter(x => x.rootId == modelId && x.type == 2),
                        handlers: this.oriData.nodes.filter(x => x.rootId == modelId && x.type == 3)
                    }
                }
            },
            created() {
                api.getBusinessPlan().then(data => {
                    this.oriData = data;
                })
            }
        })
    })
})