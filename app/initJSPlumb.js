function InitJSPlumb() {
    this.jsp = jsPlumb.getInstance({
        //锚点位置；对任何没有声明描点的Endpoint设置锚点，用于source及target节点
        Anchor: ["Right", "Left"], 
        Anchors: ["Right", "Left"],  //连线的source和target Anchor
        ConnectionsDetachable: false, //连线是否可用鼠标分离
        ConnectionOverlays: [  //连线的叠加组件，如箭头、标签
            ["Arrow", {  //箭头参数设置
                location: 1,
                visible: true,
                width: 11,
                length: 11,
                id: "ARROW",
                events: {
                    click: function () {
                    }
                }
            }],
            ["Label", {  //标签参数设置
                location: 0.1,
                id: "label",
                cssClass: "aLabel", //hover时label的样式名
                events: {
                    tap: function () {
                    }
                },
                visible: true
            }]
        ],
        Connector: "Bezier", //连线的类型，流程图(Flowchart)、贝塞尔曲线等
        //父级元素id；假如页面元素所在上层不同，最外层父级一定要设置
        Container: "module", 
        //如果请求不存在的Anchor、Endpoint或Connector，是否抛异常
        DoNotThrowErrors: false, 
        //通过jsPlumb.draggable拖拽元素时的默认参数设置
        DragOptions: {cursor: 'pointer', zIndex: 2000}, 
        DropOptions: {}, //target Endpoint放置时的默认参数设置
        Endpoint: "Dot", //端点（锚点）的样式声明
         //用jsPlumb.connect创建连接时，source端点和target端点的样式设置
        Endpoints: [null, null],
        EndpointOverlays: [], //端点的叠加物
        //端点的默认样式
        EndpointStyle: {fill: 'transparent', stroke: '#1565C0', radius: 4, 
            strokeWidth: 1}, 
        EndpointStyles: [null, null], //连线的source和target端点的样式
        //端点hover时的样式
        EndpointHoverStyle: {fill: '#1565C0', stroke: '#1565C0', radius: 4, 
            strokeWidth: 1}, 
        //连线的source和target端点hover时的样式
        EndpointHoverStyles: [null, null],
        //连线hover时的样式
        HoverPaintStyle: {stroke: '#1565C0', strokeWidth: 3}, 
        LabelStyle: {color: "black"}, //标签的默认样式，用css写法。
        LogEnabled: false, //是否开启jsPlumb内部日志
        Overlays: [], //连线和端点的叠加物
        MaxConnections: 10, //端点支持的最大连接数
        //连线样式
        PaintStyle: {stroke: '#1565C0', strokeWidth: 1, joinstyle: 'round'},
        ReattachConnections: true, //是否重新连接使用鼠标分离的线?
        RenderMode: "svg", //默认渲染模式
        Scope: "jsPlumb_DefaultScope", //范围，具有相同scope的点才可连接
        reattach: true,
    })
    this.jsp.bind('beforeDrop', this.jspBeforeDrop)
}

InitJSPlumb.prototype.initNodes = function(node, position) {
    this.jsp.setSuspendDrawing(true);
    if (position === "left") {
        DynamicAnchors.map(anchor => this.rjsp.addEndpoint(node, anEndpoint, {anchor: "Right"}));
    } else {
        DynamicAnchors_Right.map(anchor => this.rjsp.addEndpoint(node, anEndpoint, {anchor: "Left"}));
    }
    this.rjsp.setSuspendDrawing(false, true);
}

InitJSPlumb.prototype.initEdges = function(edges) {
    this.rjsp.setSuspendDrawing(true);
    edges.map(edge => {
        this.jsp.connect(edge, Common);
    })
    this.jsp.setSuspendDrawing(false, true);
}