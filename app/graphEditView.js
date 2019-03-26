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
                    this.renderJSPlumb()
                },
                onSelectedModelsRight(modelId) {
                    this.rightModel = this.models.find(x => x.id == modelId);
                    this.rightAttr = this.getAttrsByModel(modelId)
                    this.renderJSPlumb()
                },
                getAttrsByModel(modelId) {
                    return {
                        attrs: this.oriData.nodes.filter(x => x.rootId == modelId && x.type == 2),
                        handlers: this.oriData.nodes.filter(x => x.rootId == modelId && x.type == 3)
                    }
                },
                initJSPlumb() {
                    // jsPlumb.setContainer('.js-container')
                    this.jsp = new InitJSPlumb().jsp;
                    this.jsp.setContainer('.js-container')
                },
                renderJSPlumb() {
                    this.jsp.clear();
                    this.$nextTick(() => {
                        $(this.$el).find('[target-type]').each((index, val) => {
                            let isAttr = val.getAttribute('target-type') == 'attr'
                            this.jsp.addEndpoint(val, {
                                anchors: [isAttr ? 'Left' : 'Right']
                            }, {
                                isSource: !isAttr,
                                isTarget: isAttr,
                                connector: ['Straight'],
                                endpoint: 'Dot',
                                // paintStyle: {
                                //     fill: 'white',
                                //     outlineStroke: 'black',
                                //     strokeWidth: 10,
                                // },
                                // overlays: [ ['Arrow', { width: 12, length: 12, location: 0.5 }] ],
                            })
                        })
                    })

                }
            },
            created() {
                this.initJSPlumb()
                api.getBusinessPlan().then(data => {
                    this.oriData = data;
                })
            }
        })
    })
})