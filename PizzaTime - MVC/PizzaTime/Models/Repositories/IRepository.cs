using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PizzaTime.Models.Repositories
{
    public interface IRepository<T> where T : class
    {
        List<T> ToList();
        List<string> ToPropertyList(string Property);
        dynamic GetWhere(string Name, string Size, bool InMenu);
        T Find(int? id);
        void Add(T entity);
        void Update(T entity);
        void Remove(T entity);
        void SaveChanges();
        void Dispose();
        List<T> GetUserBaskets(string v);
        void AddOrUpdate(T entity);
    }
}