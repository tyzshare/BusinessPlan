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
                links() {
                    let fn = x => (this.leftAttr.handlers.some(h => h.id == x.beginId) && this.rightAttr.attrs.some(h => h.id == x.endId))
                    return (this.oriData && this.leftModel && this.rightModel) ? this.oriData.ships.filter(fn) : [];
                },
            },
            methods: {
                onSelectedModelsLeft(modelId) {
                    this.leftModel = this.models.find(x => x.id == modelId);
                    this.leftAttr = this.getAttrsByModel(modelId)
                    // this.renderJSPlumb()
                },
                onSelectedModelsRight(modelId) {
                    this.rightModel = this.models.find(x => x.id == modelId);
                    this.rightAttr = this.getAttrsByModel(modelId)
                    // this.renderJSPlumb()
                },
                getAttrsByModel(modelId) {
                    return {
                        attrs: this.oriData.nodes.filter(x => x.rootId == modelId && x.type == 2),
                        handlers: this.oriData.nodes.filter(x => x.rootId == modelId && x.type == 3).map(h => {
                            return {
                                handler: h,
                                target: this.oriData.ships.filter(x => x.beginId == h.id).map(x => {
                                    let node = this.oriData.nodes.find(n => n.id == x.endId);
                                    let root = this.oriData.nodes.find(n => n.id == node.rootId)
                                    return {
                                        root,
                                        node
                                    }
                                })
                            }
                        })
                    }
                },
                initJSPlumb() {
                    this.jsp = new InitJSPlumb().jsp;
                },
                renderJSPlumb(links) {
                    //j.repaintEverything()
                    this.jsp.clear();
                    this.$nextTick(() => {
                        let endPoints = Array.from($(this.$el).find('[target-type]')).map((val) => {
                            let isAttr = val.getAttribute('target-type') == 'attr'
                            let endPoint = this.jsp.addEndpoint(val, {
                                anchors: [isAttr ? 'Left' : 'Right']
                            }, {
                                isSource: !isAttr,
                                isTarget: isAttr,
                                connector: ['Straight'],
                                endpoint: 'Dot',
                            })
                            return {
                                endPoint,
                                attrId: val.getAttribute('target-attr-id')
                            }
                        })

                        this.links.forEach(link => {
                            this.jsp.connect({
                                source: endPoints.find(x => x.attrId == link.beginId),
                                target: endPoints.find(x => x.attrId == link.beginId),
                            })
                        })
                    })

                }
            },
            created() {
                // this.initJSPlumb()
                api.getBusinessPlan().then(data => {
                    this.oriData = data;
                })
            }
        })
    })
})