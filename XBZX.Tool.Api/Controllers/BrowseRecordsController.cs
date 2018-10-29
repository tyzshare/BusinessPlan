using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace XBZX.Tool.Api.Controllers
{
    /// <summary>
    /// 浏览记录的api
    /// </summary>
    [Route("api/[controller]")]
    [EnableCors("AllowSameDomain")]
    public class BrowseRecordsController : Controller
    {
        private MyContext Context;

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="_context"></param>
        public BrowseRecordsController(MyContext _context)
        {
            Context = _context;
        }

        /// <summary>
        /// 简单查询
        /// </summary>
        /// <returns></returns>
        // GET: api/<controller>
        [HttpGet]
        public List<BrowseRecordModel> Get()
        {
            var result = Context.BrowseRecords.GroupBy(p => new { p.DateTime.Date, p.UrlComment })
                .Select(o => new BrowseRecordModel { Date = o.Key.Date, Count = o.Count(), SiteName = o.Key.UrlComment }).ToList();
            return result;
        }

        /// <summary>
        /// 创建一条浏览记录
        /// </summary>
        /// <param name="model">创建一条浏览记录model</param>
        // POST api/<controller>
        [HttpPost]
        [Route("CreateBrowseRecord")]
        public async Task CreateBrowseRecord([FromBody]CreateBrowseRecordModel model)
        {
            string userHostAddress = HttpContext.Request.Host.Host;
            if (string.IsNullOrEmpty(userHostAddress))
            {
                userHostAddress = "127.0.0.1";
            }
            Context.BrowseRecords.Add(new BrowseRecordsEntity()
            {
                Url = model.Url,
                IP = userHostAddress,
                UrlComment = model.UrlComment
            });
            await Context.SaveChangesAsync();
        }
    }
}
