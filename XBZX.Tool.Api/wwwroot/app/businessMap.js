let config = window.config;

// 节点配置信息
var typeSettings = {
    1: {
        name: '对象',
        linkValue: 3,
        symbolType: 'circle',
        symbolSize: 60
    },
    2: {
        name: '属性',
        linkValue: 6,
        symbolType: 'circle',
        symbolSize: 25
    },
    3: {
        name: '事件',
        linkValue: 10,
        symbolType: 'rect',
        symbolSize: 25
    },
}

let tpls = null;
let tplsGetter = ((tplMaps, rootPath) => {
    return Promise.all(Object.keys(tplMaps).map(x => $.get(rootPath + tplMaps[x]).then(data => {
        tplMaps[x] = data;
    }))).then(() => {
        tpls = tplMaps;
    });
})({
    modelToolTipTpl: 'model-tooltip.html',
    contextmenu: 'contextmenu.html',
    graphEdit: 'graph-edit.html',
}, './tpl/')

// 对象toolTip展示模板
let modelViewTpl = (allNodes, node) => {
    if (node._data.type == 1) {
        // 对象
        let nodes = allNodes.filter(x => x.rootId == node._data.id || x.id == node._data.id);

        var modelToolTipTpl = `
            <div style="display: inline-block; border: 2px solid #ddd; border-radius: 6px; background-color: #fff; max-height: 80vh; overflow: auto; color: #000; opacity: .8;">
                <div style="text-align: center; padding: 5px; font-size: 16px;">
                    <strong>${nodes.find(x => x.type == 1).name}</strong>
                </div>
                <div style="text-align: left; font-size: 14px; border-top: 2px solid #ddd; padding: 5px 0;">
                    <ul style="list-style: none; margin: 0; padding: 0 10px 0 25px;">
                        ${nodes.filter(x => x.type == 2).map(x => `<li><span>${x.id}.${x.name}</span></li>`).join('') || '<li>暂无属性</li>'}
                    </ul>
                </div>
                <div style="text-align: left; font-size: 14px; border-top: 2px solid #ddd; padding: 5px 0;">
                    <ul style="list-style: none; margin: 0; padding: 0 10px 0 25px;">
                        ${nodes.filter(x => x.type == 3).map(x => `<li><span>${x.id}.${x.name}</span></li>`).join('') || '<li>暂无事件</li>'}
                    </ul>
                </div>
            </div>`;
        return modelToolTipTpl;
    } else {
        // 属性 / 事件
        return `<div style="display: inline-block; padding: 2px 5px; border: 1px solid #ddd; border-radius: 5px; background-color: #fff; color: #000;">
                    <span>${typeSettings[node._data.type].name}: ${node._data.name}</span>
                </div>`;
    }
}

let linkViewTpl = (allNodes, link) => {
    if (!link.$toolTips) {
        let sourceNode = allNodes.find(x => x.id == link.source),
        sourceRootNode = allNodes.find(x => x.id == sourceNode.rootId),
        targetNode = allNodes.find(x => x.id == link.target),
        targetRootNode = allNodes.find(x => x.id == targetNode.rootId);

        link.$toolTips = `${sourceRootNode ? `<strong>[${sourceRootNode.name}]</strong>` : ''}${sourceNode.name} → ${targetRootNode ? `<strong>[${targetRootNode.name}]</strong>` : ''}${targetNode.name}`;
    }

    return `<div style="display: inline-block; padding: 2px 5px; border: 1px solid #ddd; border-radius: 5px; background-color: #fff; color: #000;">
                <span>${link.$toolTips}</span>
            </div>`;
}

var vm = new Vue({
    el: "#app",
    data: {
        myChart: null,
        graph: null, // 原始数据
        models: null, //
        links: null,
        drawNodes: null,
        showGraphEditView: false,
        currentUser: null,
        loginModel: {
            showLogin: false,
            user: {
                username: '',
                password: ''
            }
        }
    },
    computed: {

    },
    methods: {
        queryData() {
            return Promise.all([
                window.api.getBusinessPlan().then(data => {
                    this.graph = data;
                    this.models = this.graph.nodes.filter(x => x.type == 1);
                    this.links = this.graph.ships.map(x => {
                        return {
                            source: `${x.beginId}`,
                            target: `${x.endId}`,
                            value: typeSettings[1].linkValue,
                            symbol: ['none', 'arrow'],
                            emphasis: {
                                lineStyle: {
                                    width: 10
                                }
                            }
                        }
                    });

                    // 所有需渲染节点
                    let isLinkedNode = x => x.type == 1 || this.graph.ships.some(s => s.beginId == x.id || s.endId == x.id);
                    this.drawNodes = this.graph.nodes.filter(isLinkedNode).map(x => {
                        if (x.type != 1) {
                            this.links.push({
                                source: `${x.rootId}`,
                                target: `${x.id}`,
                                value: typeSettings[x.type].linkValue
                            });
                        }

                        return {
                            _data: x,
                            id: x.id,
                            name: x.id,
                            fixed: false,
                            value: x.type,
                            symbol: typeSettings[x.type].symbolType,
                            symbolSize: typeSettings[x.type].symbolSize,
                            category: this.models.findIndex(c => c.id == x.id || c.id == x.rootId),
                            label: {
                                position: 'inside'
                            },
                        }
                    });
                }),
                tplsGetter
            ]).then(() => {
                this.render();
            }).catch(err => {
                console.log(err)
            })
        },
        render() {
            let option = {
                title: {
                    text: 'SIS业务大图',
                    subtext: 'Default layout',
                    top: 'bottom',
                    left: 'right'
                },
                tooltip: {},
                legend: [{
                    data: this.models.map(x => x.name)
                }],
                animationDuration: 1500,
                animationEasingUpdate: 'quinticInOut',
                symbolRotate: 45,
                series: [{
                    name: 'model',
                    type: 'graph',
                    layout: 'force',
                    data: this.drawNodes,
                    links: this.links,
                    categories: this.models,
                    roam: true,
                    focusNodeAdjacency: true,
                    draggable: false,
                    force: {
                        // initLayout: 'circular',
                        repulsion: 340,
                        gravity: 0.1,
                        // edgeLength: [50, 200]
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 1,
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    },
                    label: {
                        show: true,
                        position: 'inside',
                        color: '#fff',
                        padding: 5,
                        formatter: ({ data }) => {
                            let node = data._data;
                            return node.type == 1 ? node.name : node.id;
                        }
                    },
                    tooltip: {
                        formatter: (x) => {
                            switch (x.dataType) {
                                case 'node':
                                    return modelViewTpl(this.graph.nodes, x.data);
                                case 'edge':
                                    return linkViewTpl(this.graph.nodes, x.data)
                                default:
                                    return ''
                            }
                        },
                        // extraCssText: 'background-color: rgba(50, 50, 50, 0.7); color:'
                        extraCssText: 'border: none; padding: 0; background-color: transparent;'
                    },
                    lineStyle: {
                        color: 'source',
                        curveness: 0.3
                    },
                    emphasis: {
                        lineStyle: {
                            width: 5
                        }
                    }
                }]
            };


            this.initChart();
            this.myChart.setOption(option);

        },
        initChart() {
            if (!this.myChart) {
                this.myChart = echarts.init($('#container')[0]);

                let callContextmenu = (() => {
                    let originalData;
                    let menu = $(tpls.contextmenu).appendTo(document.body);
                    $(window).on('click', (e) => {
                        // if (!menu[0].contains(e.target)) {
                        menu.removeClass('show');
                        // }
                    })

                    let menuHandler = {
                        editGraph: () => {
                            if (!this.validityLogin()) {
                                return;
                            }
                            // let graph = new GraphEditView(tpls.graphEdit);
                            // graph.render();
                            this.showGraphEditView = true;
                        },
                        addAttr: () => {
                            if (!this.validityLogin()) {
                                return;
                            }
                            let name = '';
                            this.$Modal.confirm({
                                title: `请输入[${originalData.name}]属性名称`,
                                render: (h) => {
                                    return [
                                        h('Input', {
                                            props: {
                                                value: name,
                                                autofocus: true,
                                                placeholder: 'Please enter your name...'
                                            },
                                            on: {
                                                input: (val) => {
                                                    name = val;
                                                },
                                            },
                                        })
                                    ]
                                },
                                onOk() {
                                    return window.api.createBusinessPlanNode({
                                        name,
                                        rootId: originalData.id,
                                        type: 2,
                                        order: 0
                                    }).then(() => {
                                        this.$Message.success('保存成功');
                                        window.location.reload();
                                    }).catch(err => {
                                        this.$Message.error(err.message)
                                    })
                                }
                            })
                        },
                        addHandler: () => {
                            if (!this.validityLogin()) {
                                return;
                            }
                            let name = '';
                            this.$Modal.confirm({
                                title: `请输入[${originalData.name}]事件名称`,
                                render: (h) => {
                                    return [
                                        h('Input', {
                                            props: {
                                                value: name,
                                                autofocus: true,
                                                placeholder: 'Please enter your name...'
                                            },
                                            on: {
                                                input: (val) => {
                                                    name = val;
                                                },
                                            },
                                        })
                                    ]
                                },
                                onOk() {
                                    return window.api.createBusinessPlanNode({
                                        name,
                                        rootId: originalData.id,
                                        type: 3,
                                        order: 0
                                    }).then(() => {
                                        this.$Message.success('保存成功');
                                        window.location.reload();
                                    }).catch(err => {
                                        this.$Message.error(err.message)
                                    })
                                }
                            })
                        },
                        addModel: () => {
                            if (!this.validityLogin()) {
                                return;
                            }
                            let name = '';
                            this.$Modal.confirm({
                                title: `请输入模型名称`,
                                render: (h) => {
                                    return [
                                        h('Input', {
                                            props: {
                                                value: name,
                                                autofocus: true,
                                                placeholder: 'Please enter your name...'
                                            },
                                            on: {
                                                input: (val) => {
                                                    name = val;
                                                },
                                            },
                                        })
                                    ]
                                },
                                onOk() {
                                    return window.api.createBusinessPlanNode({
                                        name,
                                        rootId: 0,
                                        type: 1,
                                        order: 0
                                    }).then(() => {
                                        this.$Message.success('保存成功');
                                        window.location.reload();
                                    }).catch(err => {
                                        this.$Message.error(err.message)
                                    })
                                }
                            })
                        }
                    }

                    menu.find('[xb-click]').each((index, x) => {
                        x.attributes['xb-click'] && $(x).on('click', menuHandler[x.attributes['xb-click'].nodeValue]);
                    })

                    return (e, type, _originalData) => {
                        e.cancelBubble = true;
                        e.preventDefault();
                        if (![99].some(x => x == type)) { // 99,1,2,3 控制哪些类型会响应右键
                            menu.removeClass('show');
                            return;
                        }

                        originalData = _originalData;
                        menu.css({
                            left: `${e.clientX}px`,
                            top: `${e.clientY}px`
                        }).addClass('show');
                        menu.children(`[itemtype="${type}"]`).show();
                        menu.children(`[itemtype!="${type}"]`).hide();
                    }
                })()

                $("#app").on('contextmenu', (e) => {
                    callContextmenu(e, 99)
                })

                this.myChart.on('click', (params) => {
                    let originalData = params.data._data;

                    if (params.nodeType == 'node') {

                    } else if (params.nodeType == 'edge') {

                    }
                });

                this.myChart.on('contextmenu', function (params) {
                    let originalEvent = params.event.event;
                    let originalData = params.data._data;

                    callContextmenu(params.event.event, params.dataType == 'edge' ? 0 : originalData.type, originalData)
                });


                $(window).on('resize', () => {
                    this.myChart.resize();
                })
            }
        },
        exitEdit() {
            window.location.reload();
        },
        validityLogin() {
            if (!this.currentUser || !this.currentUser.isAuthenticated) {
                this.loginModel.user = {
                    username: '',
                    password: ''
                }
                this.loginModel.showLogin = true
                return false;
            }
            return this.currentUser
        },
        login() {
            window.api.login(this.loginModel.user).then(() => {
                this.$Message.success('登录成功')
                this.loginModel.showLogin = false
                this.getCurrentUser()
            }).catch(err => {
                this.$Message.error(err.message);
            })
        },
        getCurrentUser() {
            window.api.getCurrentUser().then((data) => {
                this.currentUser = data
            })
        }
    },
    created() {
        this.queryData()
        this.getCurrentUser()
    },
});

