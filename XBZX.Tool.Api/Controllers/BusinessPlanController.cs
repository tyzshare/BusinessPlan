﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace XBZX.Tool.Api.Controllers
{
    /// <summary>
    /// 业务大图的api
    /// </summary>
    [Route("api/[controller]")]
    [EnableCors("AllowSameDomain")]
    public class BusinessPlanController : Controller
    {
        private MyContext Context;

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="_context"></param>
        public BusinessPlanController(MyContext _context)
        {
            Context = _context;
        }

        /// <summary>
        /// 业务大图数据查询
        /// </summary>
        /// <returns></returns>
        // GET: api/<controller>
        [HttpGet]
        public BusinessPlanModel Get()
        {
            BusinessPlanModel result = new BusinessPlanModel();
            result.Nodes = Context.BusinessPlanNodes.Select(o => new BusinessPlanNode { Id = o.Id, Name = o.Name, RootId = o.RootId, Type = o.Type }).ToList();
            result.Ships = Context.BusinessPlanRelationShips.Select(o => new BusinessPlanRelationShip { BeginId = o.BeginId, EndId = o.EndId }).ToList();
            return result;
        }

        /// <summary>
        /// 创建一个大图节点
        /// </summary>
        /// <param name="model">创建一个大图节点model</param>
        // POST api/<controller>
        [HttpPost]
        [Route("CreateBusinessPlanNode")]
        public async Task CreateBusinessPlanNode([FromBody]CreateBusinessPlanNodeModel model)
        {
            var entity = new BusinessPlanNodeEntity()
            {
                CreateAt = DateTime.Now,
                Name = model.Name,
                RootId = model.RootId,
                Type = model.Type,
                Order = model.Order
            };
            Context.BusinessPlanNodes.Add(entity);
            await Context.SaveChangesAsync();
        }
        /// <summary>
        /// 批量创建业务大图节点
        /// </summary>
        /// <param name="model">批量创建业务大图节点model</param>
        /// <returns></returns>
        [HttpPost]
        [Route("BatchCreateBusinessPlanNode")]
        public bool BatchCreateBusinessPlanNode([FromBody]List<BatchCreateBusinessPlanNode> model)
        {
            using (var transaction = Context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var item in model)
                    {
                        var entity = new BusinessPlanNodeEntity()
                        {
                            CreateAt = DateTime.Now,
                            Name = item.Name,
                            RootId = 0,
                            Type = NodeTypes.Object,
                            Order = item.Order
                        };
                        Context.BusinessPlanNodes.Add(entity);
                        Context.SaveChanges();
                        foreach (var children in item.List)
                        {
                            Context.BusinessPlanNodes.Add(new BusinessPlanNodeEntity()
                            {
                                CreateAt = DateTime.Now,
                                Name = children.Name,
                                Order = children.Order,
                                RootId = entity.Id,
                                Type = children.Type
                            });
                        }
                    }
                    Context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex;
                }
                return true;
            }
        }
        /// <summary>
        /// 创建一个大图节点关系
        /// </summary>
        /// <param name="model">创建一个大图节点关系model</param>
        // POST api/<controller>
        [HttpPost]
        [Route("CreateBusinessPlanRelationShip")]
        public async Task CreateBusinessPlanRelationShip([FromBody]CreateBusinessPlanRelationShipModel model)
        {
            Context.BusinessPlanRelationShips.Add(new BusinessPlanRelationShipEntity()
            {
                CreateAt = DateTime.Now,
                BeginId = model.BeginId,
                EndId = model.EndId
            });
            await Context.SaveChangesAsync();
        }
    }
}
