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
                    rightAttr: null,
                    showTargetModal: false,
                    targetEditAttr: null,
                    hasModify: false,
                    quickEdit: {
                        attrVal: '',
                        handlerVal: ''
                    }
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
                targetAdd(attr) {
                    this.targetEditAttr = attr;
                    this.showTargetModal = true;
                    this.rightModel = null;
                    this.rightAttr = null;
                },
                setTargetAttr(attr) {
                    if (this.targetEditAttr.target.some(x => x.node.id == attr.id)) {
                        return this.$Message.error('此影响点已存在');
                    }
                    api.createBusinessPlanRelationShip({
                        beginId: this.targetEditAttr.handler.id,
                        endId: attr.id
                    }).then(() => {
                        this.hasModify = true;
                        this.$Message.success('添加成功');
                        this.targetEditAttr.target.push({
                            node: attr,
                            root: this.oriData.nodes.find(n => n.id == attr.rootId)
                        })
                        this.showTargetModal = false
                    })
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

                },
                submitAttr() {
                    if (!this.quickEdit.attrVal) {
                        return this.$Message.error('请填写信息')
                    }
                    if (this.leftAttr.attrs.some(x => x.name == this.quickEdit.attrVal)) {
                        return this.$Message.error('数据已存在')
                    }
                    return api.createBusinessPlanNode({
                        name: this.quickEdit.attrVal,
                        rootId: this.leftModel.id,
                        type: 2,
                        order: 0
                    }).then(() => {
                        this.$Message.success('保存成功');
                        this.quickEdit.attrVal = ''
                        this.initData().then(() => {
                            this.onSelectedModelsLeft(this.leftModel.id)
                        })
                    }).catch(err => {
                        this.$Message.error(err.message)
                    })
                },
                submitHandler() {
                    if (!this.quickEdit.handlerVal) {
                        return this.$Message.error('请填写信息')
                    }
                    if (this.leftAttr.handlers.some(x => x.handler.name == this.quickEdit.handlerVal)) {
                        return this.$Message.error('数据已存在')
                    }
                    return window.api.createBusinessPlanNode({
                        name: this.quickEdit.handlerVal,
                        rootId: this.leftModel.id,
                        type: 3,
                        order: 0
                    }).then(() => {
                        this.$Message.success('保存成功')
                        this.quickEdit.handlerVal = ''
                        this.initData().then(() => {
                            this.onSelectedModelsLeft(this.leftModel.id)
                        })

                    }).catch(err => {
                        this.$Message.error(err.message)
                    })
                },
                initData() {
                    return api.getBusinessPlan().then(data => {
                        this.oriData = data;
                    })
                }
            },
            created() {
                // this.initJSPlumb()
                this.initData()
            }
        })
    })
})