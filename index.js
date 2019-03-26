// 需要用框架重写...

// https://github.com/wangduanduan/jsplumb-chinese-tutorial

(() => {

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
                            ${nodes.filter(x => x.type == 2).map(x => `<li><span>${x.id}.${x.name}</span></li>`).join('')}
                        </ul>
                    </div>
                    <div style="text-align: left; font-size: 14px; border-top: 2px solid #ddd; padding: 5px 0;">
                        <ul style="list-style: none; margin: 0; padding: 0 10px 0 25px;">
                            ${nodes.filter(x => x.type == 3).map(x => `<li><span>${x.id}.${x.name}</span></li>`).join('')}
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

    function GraphEditView(tpl) {
        this.el = $(tpl).hide().appendTo(document.body);
        this.el.find('.js-content').on('click', (e) => {
            e.stopPropagation();
        });
        this.el.on('click', (e) => {
            this.close();
        })
    }
    GraphEditView.prototype.destroy = function () {
        this.el.remove();
        this.destroyed = true;
    }
    GraphEditView.prototype.close = function () {
        this.destroy();
    }
    GraphEditView.prototype.render = function (model) {


        this.el.show();
    }



    function BusinessMap(container, apiUrl) {
        if (!container || !apiUrl) {
            throw new Error('缺少参数');
        }
        this.el = $(container)[0];
        this.api = apiUrl;
    }

    BusinessMap.prototype.init = function (cb) {
        Promise.all([
            $.ajax({
                url: this.api,
                type: "get",
                dataType: "json",
                success: (data) => {
                    this.$data = data;
                }
            }),
            tplsGetter
        ]).then(() => {
            this.render();
        })
        return this;
    }

    BusinessMap.prototype.render = function () {

        // 所有业务对象
        let models = this.$data.nodes.filter(x => x.type == 1);

        // 业务关系
        let links = this.$data.ships.map(x => {
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

        // 影响节点
        let isLinkedNode = x => x.type == 1 || this.$data.ships.some(s => s.beginId == x.id || s.endId == x.id);
        /**
         * 所有需渲染节点
         */
        let nodes = this.$data.nodes.filter(isLinkedNode).map(x => {
            if(x.type != 1) {
                links.push({
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
                category: models.findIndex(c => c.id == x.id || c.id == x.rootId),
                label: {
                    position: 'inside'
                },
            }
        });

        let option = {
            title: {
                text: 'SIS业务大图',
                subtext: 'Default layout',
                top: 'bottom',
                left: 'right'
            },
            tooltip: {},
            legend: [{
                data: models.map(x => x.name)
            }],
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            symbolRotate: 45,
            series: [{
                name: 'model',
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                categories: models,
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
                        switch(x.dataType) {
                            case 'node':
                                return modelViewTpl(this.$data.nodes, x.data);
                            case 'edge':
                                return linkViewTpl(this.$data.nodes, x.data)
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

        var myChart = echarts.init(this.el);
        myChart.setOption(option);
        $(window).on('resize', () => {
            myChart.resize();
        })

        let callContextmenu = (() => {
            let menu = $(tpls.contextmenu).appendTo(document.body);
            $(window).on('click', (e) => {
                // if (!menu[0].contains(e.target)) {
                    menu.removeClass('show');
                // }
            })

            let menuHandler = {
                editGraph() {
                    let graph = new GraphEditView(tpls.graphEdit);
                    graph.render();
                }
            }

            menu.find('[xb-click]').each((index, x) => {
                x.attributes['xb-click'] && $(x).on('click', menuHandler[x.attributes['xb-click'].nodeValue]);
            })

            return (e, type) => {
                menu.css({
                    left: `${e.clientX}px`,
                    top: `${e.clientY}px`
                }).addClass('show');
                menu.children(`[itemtype="${type}"]`).show();
                menu.children(`[itemtype!="${type}"]`).hide();

                e.cancelBubble = true;
                e.preventDefault();
            }
        })()

        $(this.el).on('contextmenu', (e) => {
            callContextmenu(e, 99)
            e.preventDefault();
        })

        myChart.on('click', (params) => {
            let originalData = params.data._data;

            if (params.nodeType == 'node') {

            } else if (params.nodeType == 'edge') {

            }
        });

        myChart.on('contextmenu', function (params) {
            let originalEvent = params.event.event;
            let originalData = params.data._data;

            callContextmenu(params.event.event, params.dataType == 'edge' ? 0 : originalData.type)
        });

    }


    window.BusinessMap = BusinessMap;
})();