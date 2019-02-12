using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace XBZX.Tool.Api
{
    /// <summary>
    /// 创建浏览记录Model
    /// </summary>
    public class CreateBusinessPlanNodeModel
    {
        /// <summary>
        /// 客户端访问IP
        /// </summary>
        [Required, MaxLength(255)]
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
        /// <summary>
        /// 排序编号
        /// </summary>
        public int Order
        {
            get; set;
        }
    }
}
