import { Header } from "../components/HeaderComponent/header.js";
import { Banner } from "../components/BannerComponent/banner.js";
import { Footer } from "../components/FooterComponent/footer.js";
import { Content } from "../components/ContentComponent/content.js";
import { FeaturedProduct } from "../components/FeaturedComponent/featuredProduct.js";
import { Productos } from "../components/ProductosComponent/productos.js";
import { Login } from "../components/LoginComponent/login.js";
import { AdminHeader } from "../components/AdminHeaderComponent/admin-header.js";
import { Register } from "../components/RegisterComponent/register.js";
import { Contact } from "../components/ContactComponent/contact.js";
import { LoginAdmin} from "../components/LoginAdminComponent/login-admin.js";

window.customElements.define('header-info', Header);
window.customElements.define('banner-info', Banner);
window.customElements.define('footer-info', Footer);
window.customElements.define('content-info', Content);
window.customElements.define('featured-info', FeaturedProduct);
window.customElements.define('catalogo-info', Productos);
window.customElements.define('admin-header-info', AdminHeader);
window.customElements.define('login-user', Login);
window.customElements.define('register-user', Register);
window.customElements.define('contact-info', Contact);
window.customElements.define('login-admin', LoginAdmin);

