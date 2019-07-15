using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace PizzaTime.Models.Repositories
{
    public class FakeVoucherRepository : IRepository<Voucher>
    {
        List<Voucher> Vouchers = new List<Voucher>();

        
        public FakeVoucherRepository()
        {
            Vouchers.Add(new Voucher { VoucherId = 255, VoucherCode = "2FOR1TUE", Size = "Medium/Large", Number = 2, Price = 0, HighestPrice = true, HighestPriceNum = 1, Delivery = "Collection/Delivery", ValidDay = "Tuesday", InMenu = true });
            Vouchers.Add(new Voucher { VoucherId = 256, VoucherCode = "3FOR2THUR", Size = "Medium", Number = 3, Price = 0, HighestPrice = true, HighestPriceNum = 2, Delivery = "Collection/Delivery", ValidDay = "Thursday", InMenu = true });
            Vouchers.Add(new Voucher { VoucherId = 257, VoucherCode = "FAMFRIDAYCOLL", Size = "Medium", Number = 4, Price = 30, HighestPrice = false, HighestPriceNum = 0, Delivery = "Collection", ValidDay = "Friday", InMenu = true });
            Vouchers.Add(new Voucher { VoucherId = 258, VoucherCode = "2LARGECOLL", Size = "Large", Number = 2, Price = 25, HighestPrice = false, HighestPriceNum = 0, Delivery = "Collection", ValidDay = null, InMenu = true });
            Vouchers.Add(new Voucher { VoucherId = 259, VoucherCode = "2MEDIUMCOLL", Size = "Medium", Number = 2, Price = 18, HighestPrice = false, HighestPriceNum = 0, Delivery = "Collection", ValidDay = null, InMenu = true });
            Vouchers.Add(new Voucher { VoucherId = 260, VoucherCode = "2SMALLCOLL", Size = "Small", Number = 2, Price = 12, HighestPrice = false, HighestPriceNum = 0, Delivery = "Collection", ValidDay = null, InMenu = true });
        }

        public List<Voucher> ToList()
        {
            return Vouchers.ToList();
        }

        public dynamic GetWhere(string VoucherName, string VoucherSize, bool InMenu)
        {
            if (VoucherName != null && InMenu != false)
            {
                var x = Vouchers.Where(i => i.InMenu == true && i.VoucherCode == VoucherName).ToList();
                return x;
            }
            return new List<Voucher>();
        }

        public Voucher Find(int? id)
        {
            return Vouchers.Find(v => v.VoucherId == id);
        }

        public void Add(Voucher entity)
        {
            Vouchers.Add(entity);
        }

        public void Update(Voucher entity)
        {
        }

        public void Remove(Voucher entity)
        {
            Vouchers.Remove(entity);
        }

        public void SaveChanges()
        {
        }

        public void Dispose()
        {
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