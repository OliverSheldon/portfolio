using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using PizzaTime.Models;
using PizzaTime.Models.Repositories;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PizzaTime.Controllers
{
    public class OrderController : Controller
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
        public ActionResult Menu()
        {
            // Build Form

            ViewBag.pizzaList = PizzaRepository.ToPropertyList("Name");
            ViewBag.sizeList = PizzaRepository.ToPropertyList("Size");
            ViewBag.toppingList = ToppingRepository.ToPropertyList("Name");
            return View();
        }

        [HttpPost]
        public ActionResult Menu(string basePizza, string baseSize, List<string> Toppings, string voucherCode)
        {
            ViewBag.pizzaList = PizzaRepository.ToPropertyList("Name");
            ViewBag.sizeList = PizzaRepository.ToPropertyList("Size");
            ViewBag.toppingList = ToppingRepository.ToPropertyList("Name");

            Basket basket = GetSessionBasket();
            Voucher Voucher = new Voucher();

            if (voucherCode != null)
            {
                Voucher.VoucherCode = voucherCode;
                Voucher.CheckValidVoucher(VoucherRepository.GetWhere(voucherCode, null, true));
                if (Voucher.IsValid)
                {

                    if (basket.Voucher == null)
                    {
                        basket.Voucher = Voucher;
                    }
                    else
                    {
                        Voucher currentVoucher = basket.Voucher;
                        if (currentVoucher.VoucherCode != voucherCode)
                        {
                            basket.Voucher = Voucher;
                        }
                    }
                }
                SetSessionBasket(basket);
            }
            else if (basket.Voucher != null)
            {
                Voucher = basket.Voucher;
            }
            ViewBag.VoucherMessage = Voucher.VoucherMessage;
            if (basePizza != null && baseSize != null)
            {
                Pizza pizza = GetBase(basePizza, baseSize);
                pizza.InMenu = false;
                pizza.Toppings = GetToppings(Toppings, pizza);
                pizza.CalculateTotalCost();
                basket.AddToBasket(pizza);
                SetSessionBasket(basket);
                ViewBag.Basket = basket;
                ViewBag.TotalCost = basket.GetTotalCost();
            }
            return View();
        }

        [Authorize]
        [AcceptVerbs(HttpVerbs.Get | HttpVerbs.Post)]
        public ActionResult Basket(string Collection, string Delivery, string Order, string Save, int? BasketId)
        {
            Basket basket;
            if(BasketId > 0)
            {
                SetSessionBasket(BasketRepository.Find(BasketId));
                basket = GetSessionBasket();
                basket.BasketId = (int)BasketId;
            }
            else
            {
                basket = GetSessionBasket();
            }
            
            basket.SetBasketCost();
            if (basket != null)
            {
                ViewBag.BasketHasItems = true;
            }
            else
            {
                ViewBag.BasketHasItems = false;
            }
            basket.Id = User.Identity.GetUserId();
            ViewBag.DeliveryMethod = false;
            if (Collection != null || Delivery != null || basket.Delivery != null)
            {
                ViewBag.DeliveryMethod = true;
                if (Collection != null)
                {
                    basket.Delivery = "Collection";
                }
                else if (Delivery != null)
                {
                    basket.Delivery = "Delivery";
                }

                if (basket.Voucher != null)
                {
                    var oldCost = basket.GetTotalCost();
                    basket.Voucher.CheckValidVoucher(VoucherRepository.GetWhere(basket.Voucher.VoucherCode, null, true))
;                   basket.CheckVoucherConditions();
                    ViewBag.VoucherCode = basket.Voucher.VoucherCode;
                    ViewBag.VoucherMessage = basket.Voucher.VoucherMessage;
                    if (basket.Voucher.ConditionsMet == true)
                    {
                        var newCost = basket.GetTotalCost();
                        ViewBag.OldCost = oldCost;
                        ViewBag.TotalCost = newCost;
                        ViewBag.Saving = oldCost - newCost;
                    }
                    else
                    {
                        return View(basket);
                    }
                } 
            }
            if (Order != null)
            {
                ViewBag.Confirmation = "Your order has been recieved!";
                basket.OrderCompleted = true;
                BasketRepository.AddOrUpdate(basket);
                BasketRepository.SaveChanges();
            }
            else if (Save != null)
            {
                ViewBag.Confirmation = "Your order has been Saved for later.";
                basket.OrderCompleted = false;
                BasketRepository.AddOrUpdate(basket);
                BasketRepository.SaveChanges();
            }
            ViewBag.TotalCost = basket.GetTotalCost();
            return View(basket);
        }

        [Authorize]
        public ViewResult MyOrders()
        {
            List<Basket> Baskets = BasketRepository.GetUserBaskets(User.Identity.GetUserId());
            List<Basket> Complete = new List<Basket>();
            List<Basket> InComplete = new List<Basket>();
            foreach (Basket basket in Baskets)
            {
                basket.SetBasketCost();
                if (basket.OrderCompleted){Complete.Add(basket);}
                else{InComplete.Add(basket);}
            }
            ViewBag.Incomplete = InComplete;
            ViewBag.Complete = Complete;
            return View();
        }

        public Pizza GetBase(string basePizza, string baseSize)
        {
            return PizzaRepository.GetWhere(basePizza, baseSize, true);
        }

        public List<Topping> GetToppings(List<string> toppings, Pizza Pizza)
        {
            List<Topping> t = new List<Topping>();
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

        public Basket GetSessionBasket()
        {
            if (Session["basket"] != null)
            {
                return (Basket)Session["basket"];   
            }
            else
            {
                return new Basket();
            }
        }

        public void SetSessionBasket(Basket basket)
        {
            Session["basket"] = basket;
        }
    }
}