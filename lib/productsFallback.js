const DEMO_PRODUCTS = [
    {
        _id: "demo-1",
        slug: "aurora-oversized-hoodie",
        name: "Aurora Oversized Hoodie",
        description: "Heavyweight fleece hoodie with a relaxed streetwear fit and brushed interior.",
        price: 2499,
        discountPrice: 2199,
        images: ["/demo-products/hoodie.svg"],
        category: "Hoodies",
        idealFor: "unisex",
        type: "top-wear",
        brand: "Urban Veins",
        tags: ["New", "Winter", "Best Seller"],
        variants: [
            { color: "Black", size: "S", stock: 6 },
            { color: "Black", size: "M", stock: 8 },
            { color: "Olive", size: "L", stock: 4 },
        ],
        averageRating: 4.7,
        numReviews: 18,
        isActive: true,
        isFeatured: true,
        createdAt: new Date("2026-01-08T10:00:00.000Z"),
        updatedAt: new Date("2026-01-08T10:00:00.000Z"),
    },
    {
        _id: "demo-2",
        slug: "midnight-layered-tee",
        name: "Midnight Layered Tee",
        description: "Soft cotton jersey tee designed for layering with a clean boxy silhouette.",
        price: 1199,
        images: ["/demo-products/tee.svg"],
        category: "Tees",
        idealFor: "men",
        type: "top-wear",
        brand: "Urban Veins",
        tags: ["Core", "Minimal"],
        variants: [
            { color: "Charcoal", size: "M", stock: 10 },
            { color: "Charcoal", size: "L", stock: 7 },
            { color: "Stone", size: "XL", stock: 3 },
        ],
        averageRating: 4.4,
        numReviews: 9,
        isActive: true,
        isFeatured: false,
        createdAt: new Date("2026-02-12T10:00:00.000Z"),
        updatedAt: new Date("2026-02-12T10:00:00.000Z"),
    },
    {
        _id: "demo-3",
        slug: "tundra-tech-jacket",
        name: "Tundra Tech Jacket",
        description: "Weather-ready shell jacket with matte finish, zip pockets, and a roomy hood.",
        price: 3999,
        images: ["/demo-products/jacket.svg"],
        category: "Jackets",
        idealFor: "unisex",
        type: "outerwear",
        brand: "Urban Veins",
        tags: ["Outerwear", "Cold Weather"],
        variants: [
            { color: "Graphite", size: "M", stock: 5 },
            { color: "Graphite", size: "L", stock: 4 },
            { color: "Sand", size: "XL", stock: 2 },
        ],
        averageRating: 4.8,
        numReviews: 24,
        isActive: true,
        isFeatured: true,
        createdAt: new Date("2026-03-03T10:00:00.000Z"),
        updatedAt: new Date("2026-03-03T10:00:00.000Z"),
    },
    {
        _id: "demo-4",
        slug: "drift-cargo-pants",
        name: "Drift Cargo Pants",
        description: "Relaxed cargo pants with adjustable waist, utility pockets, and tapered ankle.",
        price: 2299,
        images: ["/demo-products/pants.svg"],
        category: "Bottoms",
        idealFor: "women",
        type: "bottom-wear",
        brand: "Urban Veins",
        tags: ["Utility", "Everyday"],
        variants: [
            { color: "Khaki", size: "28", stock: 6 },
            { color: "Khaki", size: "30", stock: 5 },
            { color: "Black", size: "32", stock: 4 },
        ],
        averageRating: 4.2,
        numReviews: 12,
        isActive: true,
        isFeatured: false,
        createdAt: new Date("2026-02-20T10:00:00.000Z"),
        updatedAt: new Date("2026-02-20T10:00:00.000Z"),
    },
];

function normalize(value) {
    return String(value ?? "").trim().toLowerCase();
}

function matchesSearch(product, search) {
    if (!search) return true;

    const query = normalize(search);
    const haystack = [
        product.name,
        product.description,
        product.category,
        product.type,
        product.brand,
        ...(product.tags || []),
    ]
        .map(normalize)
        .join(" ");

    return haystack.includes(query);
}

export function getDemoProducts() {
    return DEMO_PRODUCTS.map((product) => ({ ...product }));
}

export function filterProducts(products, filters = {}) {
    const { search, category, idealFor, type, featured, sort } = filters;

    let list = products.filter((product) => product.isActive !== false);

    if (search) {
        list = list.filter((product) => matchesSearch(product, search));
    }

    if (category && normalize(category) !== "all") {
        const categoryValue = normalize(category);
        list = list.filter((product) => normalize(product.category) === categoryValue);
    }

    if (idealFor && normalize(idealFor) !== "all") {
        const idealForValue = normalize(idealFor);
        list = list.filter((product) => normalize(product.idealFor) === idealForValue);
    }

    if (type && normalize(type) !== "all") {
        const typeValue = normalize(type);
        list = list.filter((product) => normalize(product.type) === typeValue);
    }

    if (featured === true || featured === "true") {
        list = list.filter((product) => product.isFeatured);
    }

    if (sort === "price-asc") {
        list.sort((left, right) => left.price - right.price);
    } else if (sort === "price-desc") {
        list.sort((left, right) => right.price - left.price);
    } else {
        list.sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0));
    }

    return list;
}

export function findDemoProductBySlug(slug) {
    return DEMO_PRODUCTS.find((product) => product.slug === slug) || null;
}
