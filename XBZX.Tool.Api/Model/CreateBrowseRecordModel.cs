using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XBZX.Tool.Api
{
    /// <summary>
    /// 创建浏览记录Model
    /// </summary>
    public class CreateBrowseRecordModel
    {
        /// <summary>
        /// 访问的Url
        /// </summary>
        public string Url
        {
            get; set;
        }
        /// <summary>
        /// 访问的Url站点的描述
        /// </summary>
        public string UrlComment
        {
            get;
            set;
        }
    }
}
