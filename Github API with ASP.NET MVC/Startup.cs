using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Github_API_with_ASP.NET_MVC.Startup))]
namespace Github_API_with_ASP.NET_MVC
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
