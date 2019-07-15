using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace PizzaTime.Models.Repositories
{
    public class ToppingRepository : IRepository<Topping>
    {
        ApplicationDbContext context = new ApplicationDbContext();

        public List<Topping> ToList()
        {
            return context.Topping.ToList();
        }

        public List<string> ToPropertyList(string Property)
        {
            List<string> ToppingList; context.Topping.ToList();
            ToppingList = RemoveDuplicates(GetToppingProperties(context.Topping.ToList(), Property));

            return ToppingList;
        }

        public dynamic GetWhere(string toppingName, string toppingSize, bool IsExtra)
        {
            if (toppingName == null && toppingSize == null && IsExtra == false)
            {
                var x = context.Topping.Where(i => i.IsExtra == false).ToList();
                if (x.Count > 1)
                {
                    return x;
                }
                else
                {
                    return x.First();
                }
            }
            var y = context.Topping.Where(i => i.Name == toppingName && i.Size == toppingSize && i.IsExtra == false).ToList();
            if (y.Count > 1)
            {
                return y;
            }
            else
            {
                return y.First();
            }
        }

        public Topping Find(int? id)
        {
            return context.Topping.Find(id);
        }

        public void Add(Topping entity)
        {
            context.Topping.Add(entity);
        }

        public void Update(Topping entity)
        {
            context.Entry(entity).State = EntityState.Modified;
        }

        public void Remove(Topping entity)
        {
            context.Topping.Remove(entity);
        }

        public void SaveChanges()
        {
            context.SaveChanges();
        }

        public void Dispose()
        {
            context.Dispose();
        }

        private List<string> GetToppingProperties(List<Topping> toppings, string PropertyName)
        {
            List<string> ToppingProperties = new List<string>();
            foreach (var topping in toppings)
            {
                switch (PropertyName)
                {
                    case "Name":
                        ToppingProperties.Add(topping.Name);
                        break;
                    case "Size":
                        ToppingProperties.Add(topping.Size);
                        break;
                    case "Price":
                        ToppingProperties.Add(topping.Price.ToString());
                        break;
                }
            }

            return ToppingProperties;
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

        public List<Topping> GetUserBaskets(string v)
        {
            throw new NotImplementedException();
        }

        public void AddOrUpdate(Topping entity)
        {
            throw new NotImplementedException();
        }
    }
}