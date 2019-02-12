using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace XBZX.Tool.Api
{
    public enum NodeTypes
    {
        /// <summary>
        /// 业务对象
        /// </summary>
        [Description("业务对象")]
        Object = 1,
        /// <summary>
        /// 属性
        /// </summary>
        [Description("属性")]
        Prop = 2,
        /// <summary>
        /// 行为
        /// </summary>
        [Description("行为")]
        Action = 3,
    }
}
