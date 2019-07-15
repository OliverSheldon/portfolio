using PizzaTime.Models;
using PizzaTime.Models.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Newtonsoft.Json;
using System.Dynamic;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System.Web;
using Microsoft.AspNet.Identity;

namespace PizzaTime.Controllers
{
    [RoutePrefix("api/v1")]
    public class OrderController : ApiController
    {

        private IRepository<Pizza> PizzaRepository = new PizzaRepository();
        private IRepository<Topping> ToppingRepository = new ToppingRepository();
        private IRepository<Basket> BasketRepository = new BasketRepository();
        private IRepository<Voucher> VoucherRepository = new VoucherRepository();

        public OrderController(IRepository<Pizza> pizzaRepository, IRepository<Topping> toppingRepository, IRepository<Basket> basketRepository, IRepository<Voucher> voucherRepository)
        {
            this.PizzaRepository = pizzaRepository;
            this.ToppingRepository = toppingRepository;
            this.BasketRepository = basketRepository;
            this.VoucherRepository = voucherRepository;
        }

        public OrderController()
        {

        }


        // GET: Order
        [HttpGet]
        [Route("Order/Menu")]
        public IHttpActionResult GetMenu()
        {
            // Build Form

            var pizzaList = PizzaRepository.ToPropertyList("Name");
            var sizeList = PizzaRepository.ToPropertyList("Size");
            var toppingList = ToppingRepository.ToPropertyList("Name");

            Dictionary<string, object> menuJson = new Dictionary<string, object>() {
                ["Name"] = pizzaList,
                ["Size"] = sizeList,
                ["Toppings"] = toppingList
            };

            return Ok(menuJson);
        }

        [HttpPost]
        [Route("Order/Basket/Add")]
        public IHttpActionResult PostPizza(Dictionary<string,object> json)
        {
            Pizza pizza = new Pizza();
            Basket basket = new Basket();
            Voucher voucher = new Voucher();

            foreach (KeyValuePair<string, object> item in json)
            {
                switch (item.Key)
                {
                    case "Basket":
                        basket = JsonConvert.DeserializeObject<Basket>(item.Value.ToString());
                        break;
                    case "Pizza":
                        var p = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.Value.ToString());
                        string Name = "";
                        string Size = "";
                        foreach (KeyValuePair<string, object> keyVal in p)
                        {
                            switch (keyVal.Key)
                            {
                                case "Name":
                                    Name = keyVal.Value.ToString();
                                    break;
                                case "Size":
                                    Size = keyVal.Value.ToString();
                                    break;
                            }
                        }
                        pizza = GetBase(Name, Size);
                        
                        break;
                    case "Toppings":
                        var toppings = JsonConvert.DeserializeObject<List<string>>(item.Value.ToString());
                        pizza.Toppings = GetToppings(toppings, pizza);
                        break;
                    case "VoucherCode":
                        var VoucherCode = item.Value.ToString();

                        voucher.VoucherCode = VoucherCode;
                        voucher.CheckValidVoucher(VoucherRepository.GetWhere(VoucherCode, null, true));
                        if (voucher.IsValid)
                        {

                            if (basket.Voucher == null)
                            {
                                basket.Voucher = voucher;
                            }
                            else
                            {
                                Voucher currentVoucher = basket.Voucher;
                                if (currentVoucher.VoucherCode != VoucherCode)
                                {
                                    basket.Voucher = voucher;
                                }
                            }
                        }
                        break;
                }
            }

            pizza.InMenu = false;
            pizza.CalculateTotalCost();
            basket.AddToBasket(pizza);
            basket.SetBasketCost();
            double totalCost =  basket.GetTotalCost();

            Dictionary<string, object> basketJson = new Dictionary<string, object>()
            {
                ["Basket"] = basket,
                ["TotalCost"] = totalCost,
            };
            return Ok(basketJson);
        }

        [Authorize]
        [Route("Order/Checkout")]
        [HttpPost,HttpPut]
        public IHttpActionResult PostBasket(Dictionary<string, object> json)
        {
            //Delivery: Collection/Delivery
            //Action: Order/Save
            Basket basket = new Basket();
            var confirmation = "";
            double OldCost = 0;
            double TotalCost = 0;
            double Saving = 0;

            foreach (KeyValuePair<string, object> item in json)
            {
                switch (item.Key)
                {
                    case "Basket":
                        basket = JsonConvert.DeserializeObject<Basket>(item.Value.ToString());
                        basket.SetBasketCost();
                        
                        break;
                    case "Delivery":
                        basket.Delivery = item.Value.ToString();
                        if (basket.Voucher != null)
                        {
                            OldCost = basket.GetTotalCost();
                            basket.Voucher.CheckValidVoucher(VoucherRepository.GetWhere(basket.Voucher.VoucherCode, null, true));
                            basket.CheckVoucherConditions();
                            if (basket.Voucher.ConditionsMet == true)
                            {
                                var newCost = basket.GetTotalCost();
                                TotalCost = newCost;
                                Saving = OldCost - newCost;
                            }
                        }
                        else
                        {
                            OldCost = basket.GetTotalCost();
                            TotalCost = OldCost;
                        }
                        break;
                    case "Action":
                        var action = item.Value.ToString();
                        if (basket.Voucher.ConditionsMet == true)
                        {
                            switch (action)
                            {
                                case "Order":
                                    confirmation = "Your order has been recieved!";
                                    basket.OrderCompleted = true;
                                    break;
                                case "Save":
                                    confirmation = "Your order has been Saved for later.";
                                    basket.OrderCompleted = false;

                                    break;
                            }
                            basket.Id = HttpContext.Current.User.Identity.GetUserId();
                            BasketRepository.AddOrUpdate(basket);
                            BasketRepository.SaveChanges();
                        }
                        else
                        {
                            confirmation = "Please change or remove your voucher to continue";
                        }
                        break;
                }
            }

            Dictionary<string, object> basketJson = new Dictionary<string, object>()
            {
                ["Basket"] = basket,
                ["OldCost"] = OldCost,
                ["TotalCost"] = TotalCost,
                ["Saving"] = Saving,
                ["Confirmation"] = confirmation
            };
            return Ok(basketJson);
        }

        [Authorize]
        [Route("User/Order/{basketId?}")]
        public IHttpActionResult GetOrders(int? basketId = null)
        {
            List<Basket> Baskets = new List<Basket>();
            if (basketId != null && BasketRepository.Find(basketId).Id == HttpContext.Current.User.Identity.GetUserId())
            {
                Baskets.Add(BasketRepository.Find(basketId));
                Basket basket = Baskets[0];
                basket.SetBasketCost();
                Dictionary<string, object> basketJson = new Dictionary<string, object>()
                {
                    ["Basket"] = basket
                };
                return Ok(basketJson);
            }
            else
            {
                Baskets = BasketRepository.GetUserBaskets(HttpContext.Current.User.Identity.GetUserId());
                List<Basket> Complete = new List<Basket>();
                List<Basket> InComplete = new List<Basket>();
                foreach (Basket basket in Baskets)
                {
                    basket.SetBasketCost();
                    if (basket.OrderCompleted) { Complete.Add(basket); }
                    else { InComplete.Add(basket); }
                }
                Dictionary<string, object> basketJson = new Dictionary<string, object>()
                {
                    ["Complete"] = Complete,
                    ["InComplete"] = InComplete,
                };
                return Ok(basketJson);
            }
        }

        public Pizza GetBase(string basePizza, string baseSize)
        {
            return PizzaRepository.GetWhere(basePizza, baseSize, true);
        }


        public List<Topping> GetToppings(List<string> toppings, Pizza Pizza)
        {
            List<Topping> t = new List<Topping>();
            foreach (Topping o in Pizza.Toppings)
            {
                t.Add(o);
            }
            if (toppings != null)
            {
                foreach (var topping in toppings)
                {
                    var x = ToppingRepository.GetWhere(topping, Pizza.Size, false);
                    foreach (var y in Pizza.Toppings)
                    {
                        if (y.Name == x.Name) { x.IsDuplicate = true; }
                    }
                    x.IsExtra = true;
                    t.Add(x);
                }
            }
            return t;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                PizzaRepository.Dispose();
                ToppingRepository.Dispose();
                BasketRepository.Dispose();
                VoucherRepository.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
