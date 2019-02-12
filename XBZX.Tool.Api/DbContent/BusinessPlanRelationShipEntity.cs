using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace XBZX.Tool.Api
{
    /// <summary>
    /// 业务大图关系
    /// </summary>
    [Table("businessplan_relationship")]
    public class BusinessPlanRelationShipEntity
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
        /// 开始节点
        /// </summary>
        public long BeginId
        {
            get; set;
        }
        /// <summary>
        /// 截止节点
        /// </summary>
        public long EndId
        {
            get; set;
        }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateAt
        {
            get;set;
        }
    }
}
