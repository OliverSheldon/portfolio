using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace PizzaTime.Models
{
    public class Pizza
    {
        [Key]
        public int PizzaId { get; set; }

        public string Name { get; set; }
        public string Size { get; set; }
        public double Price { get; set; }
        public bool InMenu { get; set; }
        public virtual List<Topping> Toppings { get; set; }

        protected double TotalCost;

        [JsonIgnore]
        public virtual List<Basket> Basket { get; set; }

        public void CalculateTotalCost()
        {
            TotalCost = Price;
            if (Toppings != null)
            {
                foreach (var topping in Toppings)
                {
                    if (topping.IsExtra)
                    {
                        TotalCost = TotalCost + topping.Price;
                    }
                }
            }
        }

        public double GetTotalCost()
        {
            return TotalCost;
        }
    }
}