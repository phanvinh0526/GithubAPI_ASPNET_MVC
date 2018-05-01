using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Github_API_with_ASP.NET_MVC.Controllers
{
    public class UserController : Controller
    {
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult viewUser()
        {
            return View(GetUser());
        }

        IEnumerable<UserController> GetUser()
        {
            throw new NotImplementedException();
        }
    }
}