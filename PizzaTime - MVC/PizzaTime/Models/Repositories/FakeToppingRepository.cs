using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace PizzaTime.Models.Repositories
{
    public class FakeToppingRepository : IRepository<Topping>
    {
        ApplicationDbContext context = new ApplicationDbContext();

        List<Topping> Toppings = new List<Topping>();

        public FakeToppingRepository()
        {
            Toppings.Add(new Topping { ToppingId = 255, Name = "FakeCheeseS", Size = "Small", Price = 0.90 });
            Toppings.Add(new Topping { ToppingId = 256, Name = "FakeTomatoSauceS", Size = "Small", Price = 0.90 });
            Toppings.Add(new Topping { ToppingId = 257, Name = "FakeCheeseM", Size = "Medium", Price = 1.00 });
            Toppings.Add(new Topping { ToppingId = 258, Name = "FakeTomatoSauceM", Size = "Medium", Price = 1.00 });
            Toppings.Add(new Topping { ToppingId = 259, Name = "FakeCheeseL", Size = "Large", Price = 1.10 });
            Toppings.Add(new Topping { ToppingId = 260, Name = "FakeTomatoSauceL", Size = "Large", Price = 1.10 });

            Toppings.Add( new Topping { ToppingId = 261, Name = "FakeBaconS", Size = "Small", Price = 0.90 });
            Toppings.Add( new Topping { ToppingId = 262, Name = "FakeChickenS", Size = "Small", Price = 0.90 });
            Toppings.Add( new Topping { ToppingId = 263, Name = "FakeBaconM", Size = "Medium", Price = 1.00 });
            Toppings.Add( new Topping { ToppingId = 264, Name = "FakeChickenM", Size = "Medium", Price = 1.00 });
            Toppings.Add( new Topping { ToppingId = 265, Name = "FakeBaconL", Size = "Large", Price = 1.10 });
            Toppings.Add( new Topping { ToppingId = 266, Name = "FakeChickenL", Size = "Large", Price = 1.10 });
        }
        

        public List<Topping> ToList()
        {
            return Toppings.ToList();
        }

        public List<string> ToPropertyList(string Property)
        {
            List<string> ToppingList; Toppings.ToList();
            ToppingList = RemoveDuplicates(GetToppingProperties(Toppings.ToList(), Property));

            return ToppingList;
        }

        public dynamic GetWhere(string toppingName, string toppingSize, bool IsExtra)
        {
            if (toppingName == null && toppingSize == null && IsExtra == false)
            {
                var x = Toppings.Where(i => i.IsExtra == false).ToList();
                if (x.Count > 1)
                {
                    return x;
                }
                else
                {
                    return x.First();
                }
            }

            var y = Toppings.Where(i => i.Name == toppingName && i.Size == toppingSize && i.IsExtra == false).ToList();
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
            return Toppings.Find(t => t.ToppingId == id);
        }

        public void Add(Topping entity)
        {
            Toppings.Add(entity);
        }

        public void Update(Topping entity)
        {
        }

        public void Remove(Topping entity)
        {
            Toppings.Remove(entity);
        }

        public void SaveChanges()
        {
        }

        public void Dispose()
        {
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