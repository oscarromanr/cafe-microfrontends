import { Header } from "../components/HeaderComponent/header.js";
import { Banner } from "../components/BannerComponent/banner.js";
import { Footer } from "../components/FooterComponent/footer.js";
import { Content } from "../components/ContentComponent/content.js";
import { FeaturedProduct } from "../components/FeaturedComponent/featuredProduct.js";

window.customElements.define('header-info', Header);
window.customElements.define('banner-info', Banner);
window.customElements.define('footer-info', Footer);
window.customElements.define('content-info', Content);
window.customElements.define('featured-info', FeaturedProduct);