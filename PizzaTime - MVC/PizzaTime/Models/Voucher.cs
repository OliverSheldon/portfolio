using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace PizzaTime.Models
{
    public class Voucher
    {
        [Key]
        public int VoucherId { get; set; }
        public string VoucherCode { get; set; }
        public string VoucherMessage { get; set; }

        public string Size { get; set; }
        public int Number { get; set; }
        public double Price { get; set; }
        public bool HighestPrice { get; set; }
        public int HighestPriceNum { get; set; }
        public string Delivery { get; set; }
        public string ValidDay { get; set;}
        public bool InMenu { get; set; }

        public bool IsValid { get; set; }
        public bool ConditionsMet { get; set; }

        public virtual List<Basket> Basket { get; set; }

        public void CheckValidVoucher(List<Voucher> Vouchers)
        {
            var today = DateTime.Today.DayOfWeek.ToString();

            foreach(Voucher voucher in Vouchers)
            {
                if(voucher.VoucherCode == VoucherCode)
                {
                    Size = voucher.Size;
                    Number = voucher.Number;
                    Price = voucher.Price;
                    HighestPrice = voucher.HighestPrice;
                    HighestPriceNum = voucher.HighestPriceNum;
                    Delivery = voucher.Delivery;
                    ValidDay = voucher.ValidDay;
                    if (ValidDay != null)
                    {
                        if(ValidDay == today)
                        {
                            IsValid = true;
                        }
                        IsValid = false;
                    }
                    else
                    {
                        IsValid = true;
                    }
                }
            }

            if (!IsValid)
            {
                VoucherMessage = "The voucherCode code you have entered is not valid. Please try again.";
            }
            else
            {
                VoucherMessage = "Voucher accepted: " + VoucherCode + " (subject to conditions being met)";
            }
        }
    }
}