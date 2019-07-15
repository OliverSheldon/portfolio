using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace PizzaTime.Models.Repositories
{
    public class PizzaRepository : IRepository<Pizza>
    {
        ApplicationDbContext context = new ApplicationDbContext();

        public List<Pizza> ToList()
        {
            return context.Pizza.ToList();
        }

        public List<string> ToPropertyList(string Property)
        {
            List<string> PizzaList; context.Pizza.ToList();
            PizzaList = RemoveDuplicates(GetPizzaProperties(GetWhere(null, null, true), Property));

            return PizzaList;
        }

        public dynamic GetWhere(string basePizza, string baseSize, bool InMenu)
        {
            if(basePizza == null && baseSize == null && InMenu == true)
            {
                var x = context.Pizza.Where(i => i.InMenu == true).ToList();
                if(x.Count > 1)
                {
                    return x;
                }
                else
                {
                    return x.First();
                }
            }
            var y = context.Pizza.Where(i => i.Name == basePizza && i.Size == baseSize && i.InMenu == true).ToList();
            if (y.Count > 1)
            {
                return y;
            }
            else
            {
                return y.First();
            }
        }

        public Pizza Find(int? id)
        {
            return context.Pizza.Find(id);
        }

        public void Add(Pizza entity)
        {
            context.Pizza.Add(entity);
        }

        public void Update(Pizza entity)
        {
            context.Entry(entity).State = EntityState.Modified;
        }

        public void Remove(Pizza entity)
        {
            context.Pizza.Remove(entity);
        }

        public void SaveChanges()
        {
            context.SaveChanges();
        }

        public void Dispose()
        {
            context.Dispose();
        }

        private List<string> GetPizzaProperties(List<Pizza> pizzas, string PropertyName)
        {
            List<string> PizzaProperties = new List<string>();
            foreach (var pizza in pizzas)
            {
                switch (PropertyName)
                {
                    case "Name":
                        PizzaProperties.Add(pizza.Name);
                        break;
                    case "Size":
                        PizzaProperties.Add(pizza.Size);
                        break;
                    case "Price":
                        PizzaProperties.Add(pizza.Price.ToString());
                        break;
                }
            }

            return PizzaProperties;
        }

        private List<string> RemoveDuplicates(List<string> Item)
        {
            List<string> NoDup = new List<string>();

            for (var i = 0; i < Item.Count; i++)
            {
                if (i > 0)
                {
                    if (!NoDup.Contains(Item[i]))
                    {
                        NoDup.Add(Item[i]);
                    }
                }
                else
                {
                    NoDup.Add(Item[i]);
                }
            }

            return NoDup;
        }

        public List<Pizza> GetUserBaskets(string v)
        {
            throw new NotImplementedException();
        }

        public void AddOrUpdate(Pizza entity)
        {
            throw new NotImplementedException();
        }
    }
}