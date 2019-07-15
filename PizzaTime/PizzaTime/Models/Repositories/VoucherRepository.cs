using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace PizzaTime.Models.Repositories
{
    public class VoucherRepository : IRepository<Voucher>
    {
        ApplicationDbContext context = new ApplicationDbContext();

        public List<Voucher> ToList()
        {
            return context.Voucher.ToList();
        }

        public dynamic GetWhere(string VoucherName, string VoucherSize, bool InMenu)
        {
            if (VoucherName != null && InMenu != false)
            {
                var x = context.Voucher.Where(i => i.InMenu == true && i.VoucherCode == VoucherName).ToList();
                return x;
            }
            return new List<Voucher>();
        }

        public Voucher Find(int? id)
        {
            return context.Voucher.Find(id);
        }

        public void Add(Voucher entity)
        {
            context.Voucher.Add(entity);
        }

        public void Update(Voucher entity)
        {
            context.Entry(entity).State = EntityState.Modified;
        }

        public void Remove(Voucher entity)
        {
            context.Voucher.Remove(entity);
        }

        public void SaveChanges()
        {
            context.SaveChanges();
        }

        public void Dispose()
        {
            context.Dispose();
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

        public List<string> ToPropertyList(string Property)
        {
            throw new NotImplementedException();
        }

        public List<Voucher> GetUserBaskets(string v)
        {
            throw new NotImplementedException();
        }

        public void AddOrUpdate(Voucher entity)
        {
            throw new NotImplementedException();
        }
    }
}