using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace XBZX.Tool.Api
{
    /// <summary>
    /// 业务大图节点
    /// </summary>
    [Table("businessplan_node")]
    public class BusinessPlanNodeEntity
    {
        /// <summary>
        /// 主键Id
        /// </summary>
        [Key]
        public long Id
        {
            get; set;
        }
        /// <summary>
        /// 节点名称
        /// </summary>
        public string Name
        {
            get; set;
        } = string.Empty;
        /// <summary>
        /// 业务对象Id
        /// </summary>
        public long RootId { get; set; }
        /// <summary>
        /// 节点类型
        /// </summary>
        public NodeTypes Type
        {
            get; set;

        } = NodeTypes.Object;

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateAt
        {
            get; set;
        }
        /// <summary>
        /// 排序
        /// </summary>
        public int Order
        {
            get; set;
        }
    }
}
