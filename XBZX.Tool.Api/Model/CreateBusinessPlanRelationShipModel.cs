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
    public class CreateBusinessPlanRelationShipModel
    {
        /// <summary>
        /// 开始节点Id
        /// </summary>
        public long BeginId
        {
            get; set;
        }
        /// <summary>
        /// 截止节点Id
        /// </summary>
        public long EndId
        {
            get; set;
        }
    }
}
