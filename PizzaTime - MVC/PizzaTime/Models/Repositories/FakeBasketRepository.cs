using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace PizzaTime.Models.Repositories
{
    public class FakeBasketRepository : IRepository<Basket>
    {
        ApplicationDbContext context = new ApplicationDbContext();

        List<Pizza> Pizzas = new List<Pizza>();
        public List<Basket> Baskets = new List<Basket>();

        public FakeBasketRepository()
        {
            var fakeTopping1 = new Topping { ToppingId = 255, Name = "FakeCheeseS", Size = "Small", Price = 0.90 };
            var fakeTopping2 = new Topping { ToppingId = 256, Name = "FakeTomatoSauceS", Size = "Small", Price = 0.90 };
            Pizzas.Add(new Pizza { PizzaId = 255, Name = "FakePizza1", Size = "Small", Price = 8.00, InMenu = true, Toppings = new List<Topping> { fakeTopping1, fakeTopping2 } });
            Pizzas.Add(new Pizza { PizzaId = 256, Name = "FakePizza2", Size = "Small", Price = 8.00, InMenu = true, Toppings = new List<Topping> { fakeTopping1, fakeTopping2 } });

            Baskets.Add(new Basket {
                BasketId = 255,
                Delivery = "collection",
                OrderCompleted = false, Pizzas = Pizzas
            });
        }

        public List<Basket> ToList()
        {
            return Baskets.ToList();
        }

        public List<Basket> GetUserBaskets(string Id)
        {
            return Baskets.Where(b => b.Id == Id).ToList();
        }

        public Basket Find(int? id)
        {
            return Baskets.Find(b => b.BasketId == id);
        }

        public void Add(Basket entity)
        {
            Baskets.Add(entity);
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
            context.Entry(entity).State = EntityState.Modified;
        }

        public void Remove(Basket entity)
        {
            Baskets.Remove(entity);
        }

        public void SaveChanges()
        {
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