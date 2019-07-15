using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace PizzaTime.Models
{
    public class Topping
    {
        [Key]
        public int ToppingId { get; set; }

        public string Name { get; set; }

        public string Size { get; set; }

        public double Price { get; set; }

        public bool IsExtra { get; set; }

        public bool IsDuplicate { get; set; }

        [JsonIgnore]
        public virtual List<Pizza> Pizza { get; set;}
    }
}