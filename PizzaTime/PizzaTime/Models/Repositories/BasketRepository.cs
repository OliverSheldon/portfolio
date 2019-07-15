using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace PizzaTime.Models.Repositories
{
    public class BasketRepository : IRepository<Basket>
    {
        ApplicationDbContext context = new ApplicationDbContext();

        public List<Basket> ToList()
        {
            return context.Basket.ToList();
        }

        public List<Basket> GetUserBaskets(string Id)
        {
            return context.Basket.Where(b => b.Id == Id).ToList();
        }

        public Basket Find(int? id)
        {
            return context.Basket.Find(id);
        }

        public void Add(Basket entity)
        {
            context.Basket.Add(entity);
        }

        public void AddOrUpdate(Basket entity)
        {
            if(Find(entity.BasketId) != null)
            {
                Update(entity);
            }
            else
            {
                Add(entity);
            }
        }

        public void Update(Basket entity)
        {
            context.Basket.Remove(context.Basket.Find(entity.BasketId));
            context.Basket.Add(entity);
            //var old = context.Basket.Find(entity.BasketId);
            //context.Entry(old).State = EntityState.Modified;
            //context.SaveChanges();
        }

        public void Remove(Basket entity)
        {
            context.Basket.Remove(entity);
        }

        public void SaveChanges()
        {
            context.SaveChanges();
        }

        public void Dispose()
        {
            context.Dispose();
        }

        public List<string> ToPropertyList(string Property)
        {
            throw new NotImplementedException();
        }

        public dynamic GetWhere(string Name, string Size, bool InMenu)
        {
            throw new NotImplementedException();
        }
    }
}