using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace XBZX.Tool.Api
{
    /// <summary>
    /// 批量创建业务节点
    /// </summary>
    public class BatchCreateBusinessPlanNode
    {
        /// <summary>
        /// 业务对象名称
        /// </summary>
        [Required, MaxLength(255)]
        public string Name
        {
            get; set;
        }
        /// <summary>
        /// 排序编号
        /// </summary>
        public int Order
        {
            get; set;
        }
        /// <summary>
        /// 孩子节点
        /// </summary>
        public List<ChildrenNode> List
        {
            get;set;
        }

    }
    /// <summary>
    /// 孩子节点
    /// </summary>
    public class ChildrenNode
    {
        /// <summary>
        /// 节点名称
        /// </summary>
        [Required, MaxLength(255)]
        public string Name
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
        /// <summary>
        /// 排序编号
        /// </summary>
        public int Order
        {
            get; set;
        }
    }
}
