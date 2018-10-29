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
    public class CreateBrowseRecordModel
    {
        /// <summary>
        /// 客户端访问IP
        /// </summary>
        [Required, MaxLength(255)]
        public string IP
        {
            get; set;
        }
        /// <summary>
        /// 访问的Url
        /// </summary>
        [Required, MaxLength(1000)]
        public string Url
        {
            get; set;
        }
        /// <summary>
        /// 访问的Url站点的描述
        /// </summary>
        [Required, MaxLength(255)]
        public string UrlComment
        {
            get;
            set;
        }
    }
}
