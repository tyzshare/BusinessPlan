using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XBZX.Tool.Api
{
    /// <summary>
    /// 浏览记录
    /// </summary>
    public class BrowseRecordModel
    {
        /// <summary>
        /// 天
        /// </summary>
        public DateTime Date
        {
            get; set;
        }
        /// <summary>
        /// 访问次数
        /// </summary>
        public long Count
        {
            get; set;
        }
        /// <summary>
        /// 访问的Url站点
        /// </summary>
        public string SiteName
        {
            get;
            set;
        }
    }
}
