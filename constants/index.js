const NAV_LINKS = [
    { title: "New Arrivals", href: "/new-arrivals" },
    { title: "Collections", href: "/collections" },
    { title: "Men", href: "/men" },
    { title: "Women", href: "/women" },
    { title: "Accessories", href: "/accessories" },
];

const SECONDARY_LINKS = [
    { title: "About Us", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Track Order", href: "/orders" },
    { title: "My Account", href: "/account" },
];

const FOOTER_LINKS = [
    {
        title: "Shop",
        links: [
            { name: "New Arrivals", href: "/shop/new" },
            { name: "Best Sellers", href: "/shop/best-sellers" },
            { name: "Accessories", href: "/shop/accessories" },
            { name: "Collections", href: "/collections" },
        ]
    },
    {
        title: "Support",
        links: [
            { name: "Order Status", href: "/orders" },
            { name: "Shipping & Returns", href: "/shipping" },
            { name: "FAQ", href: "/faq" },
            { name: "Contact Us", href: "/contact" },
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Cookie Policy", href: "/cookies" },
        ]
    }
];

export { NAV_LINKS, SECONDARY_LINKS, FOOTER_LINKS };