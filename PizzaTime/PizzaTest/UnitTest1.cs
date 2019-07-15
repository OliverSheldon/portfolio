using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using PizzaTime.Controllers;
using PizzaTime.Models.Repositories;
using PizzaTime.Models;

namespace PizzaTest
{
    [TestClass]
    public class UnitTest1
    {
        private OrderController OC;
        private FakePizzaRepository PR = new FakePizzaRepository();
        private FakeToppingRepository TR = new FakeToppingRepository();
        private FakeBasketRepository BR = new FakeBasketRepository();
        private FakeVoucherRepository VR = new FakeVoucherRepository();

        //Base Toppings
        private Topping fakeTopping1;
        private Topping fakeTopping2;
        private Topping fakeTopping3;
        private Topping fakeTopping4;
        private Topping fakeTopping5;
        private Topping fakeTopping6;

        //Extra Toppings
        private Topping fakeTopping7;
        private Topping fakeTopping8;
        private Topping fakeTopping9;
        private Topping fakeTopping10;
        private Topping fakeTopping11;
        private Topping fakeTopping12;

        private Pizza fakePizza1;
        private Pizza fakePizza2;
        private Pizza fakePizza3;
        private Pizza fakePizza4;
        private Pizza fakePizza5;
        private Pizza fakePizza6;

        [TestInitialize]
        public void Setup()
        {
            OC = new OrderController(PR, TR, BR, VR);

            fakeTopping1 = new Topping { ToppingId = 255, Name = "FakeCheeseS", Size = "Small", Price = 0.90 };
            fakeTopping2 = new Topping { ToppingId = 256, Name = "FakeTomatoSauceS", Size = "Small", Price = 0.90 };
            fakeTopping3 = new Topping { ToppingId = 257, Name = "FakeCheeseM", Size = "Medium", Price = 1.00 };
            fakeTopping4 = new Topping { ToppingId = 258, Name = "FakeTomatoSauceM", Size = "Medium", Price = 1.00 };
            fakeTopping5 = new Topping { ToppingId = 259, Name = "FakeCheeseL", Size = "Large", Price = 1.10 };
            fakeTopping6 = new Topping { ToppingId = 260, Name = "FakeTomatoSauceL", Size = "Large", Price = 1.10 };

            fakeTopping7 = new Topping { ToppingId = 261, Name = "FakeBaconS", Size = "Small", Price = 0.90 };
            fakeTopping8 = new Topping { ToppingId = 262, Name = "FakeChickenS", Size = "Small", Price = 0.90 };
            fakeTopping9 = new Topping { ToppingId = 263, Name = "FakeBaconM", Size = "Medium", Price = 1.00 };
            fakeTopping10 = new Topping { ToppingId = 264, Name = "FakeChickenM", Size = "Medium", Price = 1.00 };
            fakeTopping11 = new Topping { ToppingId = 265, Name = "FakeBaconL", Size = "Large", Price = 1.10 };
            fakeTopping12 = new Topping { ToppingId = 266, Name = "FakeChickenL", Size = "Large", Price = 1.10 };

            fakePizza1 = new Pizza { PizzaId = 255, Name = "FakePizza1", Size = "Small", Price = 8.00, InMenu = true, Toppings = new List<Topping> { fakeTopping1, fakeTopping2 } };
            fakePizza2 = new Pizza { PizzaId = 256, Name = "FakePizza2", Size = "Small", Price = 8.00, InMenu = true, Toppings = new List<Topping> { fakeTopping1, fakeTopping2 } };
            fakePizza3 = new Pizza { PizzaId = 257, Name = "FakePizza3", Size = "Medium", Price = 9.00, InMenu = true, Toppings = new List<Topping> { fakeTopping3, fakeTopping4 } };
            fakePizza4 = new Pizza { PizzaId = 258, Name = "FakePizza4", Size = "Medium", Price = 9.00, InMenu = true, Toppings = new List<Topping> { fakeTopping3, fakeTopping4 } };
            fakePizza5 = new Pizza { PizzaId = 259, Name = "FakePizza5", Size = "Large", Price = 10.00, InMenu = true, Toppings = new List<Topping> { fakeTopping5, fakeTopping6 } };
            fakePizza6 = new Pizza { PizzaId = 260, Name = "FakePizza6", Size = "Large", Price = 10.00, InMenu = true, Toppings = new List<Topping> { fakeTopping5, fakeTopping6 } };
        }

        [TestMethod]
        public void TestGetPizzaNames()
        {
            List<string> expected = new List<string> { "FakePizza1", "FakePizza2", "FakePizza3", "FakePizza4", "FakePizza5", "FakePizza6" };
            var actual = PR.ToPropertyList("Name");
            CollectionAssert.AreEqual(expected, actual);
        }

        [TestMethod]
        public void TestGetPizzaSizes()
        {
            List<string> expected = new List<string> { "Small", "Medium", "Large" };
            var actual = PR.ToPropertyList("Size");
            CollectionAssert.AreEqual(expected, actual);
        }

        [TestMethod]
        public void TestGetToppingNames()
        {
            List<string> expected = new List<string> {
                "FakeCheeseS",
                "FakeTomatoSauceS",
                "FakeCheeseM",
                "FakeTomatoSauceM",
                "FakeCheeseL",
                "FakeTomatoSauceL",
                "FakeBaconS",
                "FakeChickenS",
                "FakeBaconM",
                "FakeChickenM",
                "FakeBaconL",
                "FakeChickenL"
            };
            var actual = TR.ToPropertyList("Name");
            CollectionAssert.AreEqual(expected, actual);
        }

        [TestMethod]
        public void TestGetBasePizza_Small()
        {
            int expected = fakePizza1.PizzaId;
            int actual = OC.GetBase("FakePizza1", "Small").PizzaId;
            Assert.AreEqual(expected, actual);
        }

        [TestMethod]
        public void TestGetBasePizza_Medium()
        {
            int expected = fakePizza3.PizzaId;
            int actual = OC.GetBase("FakePizza3", "Medium").PizzaId;
            Assert.AreEqual(expected, actual);
        }

        [TestMethod]
        public void TestGetBasePizza_Large()
        {
            int expected = fakePizza5.PizzaId;
            int actual = OC.GetBase("FakePizza5", "Large").PizzaId;
            Assert.AreEqual(expected, actual);
        }

        [TestMethod]
        public void TestGetPizzaToppings()
        {
            List<string> toppings = new List<string>() { "FakeBaconS", "FakeChickenS" };
            fakeTopping7.IsExtra = true;
            fakeTopping8.IsExtra = true;
            List<int> expected = new List<int>() { 
                fakeTopping1.ToppingId,
                fakeTopping2.ToppingId,
                fakeTopping7.ToppingId,
                fakeTopping8.ToppingId
                };
            List<int> actual = new List<int>();
            foreach (var i in OC.GetToppings(toppings, fakePizza1))
            {
                actual.Add(i.ToppingId);
            }
            CollectionAssert.AreEqual(expected, actual);
            fakeTopping7.IsExtra = false;
            fakeTopping8.IsExtra = false;
        }

        [TestMethod]
        public void TestGetPizzaTotalCostNoToppings()
        {
            fakePizza1.CalculateTotalCost();
            Assert.AreEqual(8, fakePizza1.GetTotalCost());
        }

        [TestMethod]
        public void TestGetPizzaTotalCostWithToppings()
        {
            List<string> toppings = new List<string>() { "FakeBaconS", "FakeChickenS" };
            fakePizza1.Toppings = OC.GetToppings(toppings, fakePizza1);
            fakePizza1.CalculateTotalCost();
            Assert.AreEqual(9.80, fakePizza1.GetTotalCost());
        }

        [TestMethod]
        public void TestGetBasketCostNoVoucher()
        {
            Basket basket = new Basket();
            basket.AddToBasket(fakePizza1);
            basket.AddToBasket(fakePizza2);
            basket.SetBasketCost();
            Assert.AreEqual(16, basket.GetTotalCost());
        }

        [TestMethod]
        public void TestValidVoucherCode()
        {
            string voucherCode = "2MEDIUMCOLL";
            Voucher voucher = new Voucher();
            voucher.VoucherCode = voucherCode;
            voucher.CheckValidVoucher(VR.GetWhere(voucherCode, null, true));
            Assert.AreEqual(true, voucher.IsValid);
        }

        [TestMethod]
        public void TestInvalidVoucherCode()
        {
            string voucherCode = "NotARealVoucherCode";
            Voucher voucher = new Voucher();
            voucher.VoucherCode = voucherCode;
            voucher.CheckValidVoucher(VR.GetWhere(voucherCode, null, true));
            Assert.AreEqual(false, voucher.IsValid);
        }

        [TestMethod]
        public void TestValidDayVoucher()
        {
            //var today = DateTime.Today.DayOfWeek.ToString();
            string today = "Friday";
            string voucherCode = "FAMFRIDAYCOLL";
            Voucher voucher = new Voucher();
            voucher.VoucherCode = voucherCode;
            voucher.CheckValidVoucher(VR.GetWhere(voucherCode, null, true));
            Assert.AreEqual(today, voucher.ValidDay);
        }

        [TestMethod]
        public void TestInvalidDayVoucher()
        {
            // var today = DateTime.Today.DayOfWeek.ToString();
            string today = "Monday";
            string voucherCode = "FAMFRIDAYCOLL";
            Voucher voucher = new Voucher();
            voucher.VoucherCode = voucherCode;
            voucher.CheckValidVoucher(VR.GetWhere(voucherCode, null, true));
            Assert.AreNotEqual(today, voucher.ValidDay);
        }

        [TestMethod]
        public void TestGetBasketCostWithVoucher()
        {
            Basket basket = new Basket();
            basket.AddToBasket(fakePizza1);
            basket.AddToBasket(fakePizza2);
            basket.SetBasketCost();
            string voucherCode = "2SMALLCOLL";
            Voucher voucher = new Voucher();
            voucher.VoucherCode = voucherCode;
            voucher.CheckValidVoucher(VR.GetWhere(voucherCode, null, true));
            basket.Voucher = voucher;
            basket.Delivery = "Collection";
            basket.CheckVoucherConditions();
            Assert.AreEqual(12, basket.GetTotalCost());
        }
    }
}
