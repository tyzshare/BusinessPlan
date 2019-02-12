using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XBZX.Tool.Api
{
    /// <summary>
    /// 业务大图模型
    /// </summary>
    public class BusinessPlanModel
    {
        /// <summary>
        /// 业务大图节点
        /// </summary>
        public List<BusinessPlanNode> Nodes { get; set; }
        /// <summary>
        /// 业务大图关系
        /// </summary>
        public List<BusinessPlanRelationShip> Ships { get; set; }
    }
    /// <summary>
    /// 业务大图节点
    /// </summary>
    public class BusinessPlanNode
    {
        /// <summary>
        /// 大图节点
        /// </summary>
        public long Id
        {
            get; set;
        }
        /// <summary>
        /// 名称
        /// </summary>
        public string Name
        {
            get; set;
        }
        /// <summary>
        /// 所属业务对象Id
        /// </summary>
        public long RootId
        {
            get; set;
        }
        /// <summary>
        /// 节点类型
        /// </summary>
        public NodeTypes Type
        {
            get; set;
        }
    }
    /// <summary>
    /// 业务大图关系
    /// </summary>
    public class BusinessPlanRelationShip
    {
        /// <summary>
        /// 开始节点
        /// </summary>
        public long BeginId
        {
            get; set;
        }
        /// <summary>
        /// 截止节点
        /// </summary>
        public long EndId { get; set; }
    }
}
