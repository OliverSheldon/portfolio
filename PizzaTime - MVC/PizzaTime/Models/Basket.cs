using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace PizzaTime.Models
{
    public class Basket
    {
        [Key]
        public int BasketId { get; set; }

        public virtual List<Pizza> Pizzas { get; set; }

        public virtual Voucher Voucher { get; set; }

        protected double TotalCost { get; set; }

        public string Delivery { get; set; }
        public bool OrderCompleted { get; set; }

        [ForeignKey("User")]
        public string Id { get; set; }
        public virtual ApplicationUser User { get; set; }

        public void AddToBasket(Pizza pizza)
        {
            if (Pizzas == null)
            {
                List<Pizza> p = new List<Pizza>();
                p.Add(pizza);
                Pizzas = p;
            }
            else
            {
                Pizzas.Add(pizza);
            }
            SetBasketCost();
        }

        public void SetBasketCost()
        {
            if (Pizzas != null)
            {
                TotalCost = 0;
                foreach (var pizza in Pizzas)
                {
                    pizza.CalculateTotalCost();
                    TotalCost = TotalCost + pizza.GetTotalCost();
                }
                
            }
        }

        public double GetTotalCost()
        {
            return TotalCost;
        }

        public void CheckVoucherConditions()
        {
            if (Voucher.IsValid && (Delivery == Voucher.Delivery || EitherOption(Delivery, Voucher.Delivery) == true))
            {
                List<Pizza> VoucherPizzas = new List<Pizza>();
                foreach (Pizza pizza in Pizzas)
                {
                    if (VoucherPizzas.Count == Voucher.Number){ break; }

                    if (pizza.Size == Voucher.Size || EitherOption(pizza.Size,Voucher.Size) == true)
                    {
                        VoucherPizzas.Add(pizza);
                    }
                }
                if (VoucherPizzas.Count == Voucher.Number)
                {
                    Voucher.ConditionsMet = true;
                    if (Voucher.HighestPrice)
                    {
                        double MinusTotalCost = 0;
                        VoucherPizzas = VoucherPizzas.OrderBy(i => i.Price).ToList();
                        int y = VoucherPizzas.Count() - Voucher.HighestPriceNum;
                        for (var x = 0; x < y; x++)
                        {
                            MinusTotalCost = MinusTotalCost + VoucherPizzas[x].Price;
                        }
                        TotalCost = TotalCost - MinusTotalCost;
                    }
                    else
                    {
                        double MinusTotalCost = 0;
                        foreach (Pizza p in VoucherPizzas)
                        {
                            MinusTotalCost = MinusTotalCost + p.Price;
                        }
                        TotalCost = TotalCost - MinusTotalCost + Voucher.Price;
                    }
                }
            }
            else
            {
                Voucher.ConditionsMet = false;
            }
            
            if (Voucher.ConditionsMet)
            {
                Voucher.VoucherMessage = "Your order meets the Voucher requirements and the discount has been applied.";
            }
            else
            {
                Voucher.VoucherMessage = "Your current order does not meet the reqirements for the Voucher" + Voucher.VoucherCode +". No discount has been applied.";
            }
        }

        private bool EitherOption(string UserOption, string VoucherOption)
        {
            char[] c = "/".ToCharArray();
            List<string> VoucherOptions = VoucherOption.Split(c).ToList();
            foreach(var V in VoucherOptions) { if(V == UserOption) { return true; } }
            return false;
        }
    }
}