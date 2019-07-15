using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace PizzaTime.Models.Repositories
{
    public class FakePizzaRepository : IRepository<Pizza>
    {
        List<Pizza> Pizzas = new List<Pizza>();

        public FakePizzaRepository()
        {
            var fakeTopping1 = new Topping { ToppingId = 255, Name = "FakeCheeseS", Size = "Small", Price = 0.90 };
            var fakeTopping2 = new Topping { ToppingId = 256, Name = "FakeTomatoSauceS", Size = "Small", Price = 0.90 };
            var fakeTopping3 = new Topping { ToppingId = 257, Name = "FakeCheeseM", Size = "Medium", Price = 1.00 };
            var fakeTopping4 = new Topping { ToppingId = 258, Name = "FakeTomatoSauceM", Size = "Medium", Price = 1.00 };
            var fakeTopping5 = new Topping { ToppingId = 259, Name = "FakeCheeseL", Size = "Large", Price = 1.10 };
            var fakeTopping6 = new Topping { ToppingId = 260, Name = "FakeTomatoSauceL", Size = "Large", Price = 1.10 };

            Pizzas.Add(new Pizza { PizzaId = 255, Name = "FakePizza1", Size = "Small", Price = 8.00, InMenu = true, Toppings = new List<Topping> { fakeTopping1, fakeTopping2 } });
            Pizzas.Add(new Pizza { PizzaId = 256, Name = "FakePizza2", Size = "Small", Price = 8.00, InMenu = true, Toppings = new List<Topping> { fakeTopping1, fakeTopping2 } });
            Pizzas.Add(new Pizza { PizzaId = 257, Name = "FakePizza3", Size = "Medium", Price = 9.00, InMenu = true, Toppings = new List<Topping> { fakeTopping3, fakeTopping4 } });
            Pizzas.Add(new Pizza { PizzaId = 258, Name = "FakePizza4", Size = "Medium", Price = 9.00, InMenu = true, Toppings = new List<Topping> { fakeTopping3, fakeTopping4 } });
            Pizzas.Add(new Pizza { PizzaId = 259, Name = "FakePizza5", Size = "Large", Price = 10.00, InMenu = true, Toppings = new List<Topping> { fakeTopping5, fakeTopping6 } });
            Pizzas.Add(new Pizza { PizzaId = 260, Name = "FakePizza6", Size = "Large", Price = 10.00, InMenu = true, Toppings = new List<Topping> { fakeTopping5, fakeTopping6 } });
        }

        public List<Pizza> ToList()
        {
            return Pizzas.ToList();
        }

        public List<string> ToPropertyList(string Property)
        {
            List<string> PizzaList; Pizzas.ToList();
            PizzaList = RemoveDuplicates(GetPizzaProperties(GetWhere(null, null, true), Property));

            return PizzaList;
        }

        public dynamic GetWhere(string basePizza, string baseSize, bool InMenu)
        {
            if(basePizza == null && baseSize == null && InMenu == true)
            {
                var x = Pizzas.Where(i => i.InMenu == true).ToList();
                if(x.Count > 1)
                {
                    return x;
                }
                else
                {
                    return x.First();
                }
            }
            var y = Pizzas.Where(i => i.Name == basePizza && i.Size == baseSize && i.InMenu == true).ToList();
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
            return Pizzas.Find(p => p.PizzaId == id);
        }

        public void Add(Pizza entity)
        {
            Pizzas.Add(entity);
        }

        public void Update(Pizza entity)
        {
        }

        public void Remove(Pizza entity)
        {
            Pizzas.Remove(entity);
        }

        public void SaveChanges()
        {
        }

        public void Dispose()
        {
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