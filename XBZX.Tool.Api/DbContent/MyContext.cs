using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XBZX.Tool.Api
{
    /// <summary>
    /// 构造的 DbContext
    /// </summary>
    public class MyContext : DbContext
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="options"></param>
        public MyContext(DbContextOptions<MyContext> options) : base(options)
        { }

        /// <summary>
        /// 浏览记录
        /// </summary>
        public DbSet<BrowseRecordsEntity> BrowseRecords { get; set; }
    }
}
