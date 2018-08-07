using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace XBZX.Tool.Api
{

    /// <summary>
    /// 浏览记录
    /// </summary>
    [Table("browse_records")]
    public class BrowseRecordsEntity
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
        /// 访问的Url
        /// </summary>
        public string Url
        {
            get; set;
        }
        /// <summary>
        /// 访问者IP
        /// </summary>
        public string IP { get; set; }
        /// <summary>
        /// 访问时间
        /// </summary>
        public DateTime DateTime
        {
            get;
            set;
        } = DateTime.Now;
        /// <summary>
        /// 请求站点的描述
        /// </summary>
        public string UrlComment
        {
            get; set;
        } = string.Empty;
    }
}
