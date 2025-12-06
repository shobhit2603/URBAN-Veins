import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/dbConnect";
import Product from "@/models/Product";

// GET /api/products/:slug
export async function GET(req) {
  try {
    await dbConnect();

    // 🔍 Extract slug from URL path: /api/products/<slug>
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean); // remove empty ""
    const slug = segments[segments.length - 1]; // last part is slug

    // console.log("🔍 slug from URL:", slug);

    if (!slug) {
      return NextResponse.json({ message: "Missing slug" }, { status: 400 });
    }

    // Case-sensitive first (your slugs look clean), can switch to regex if needed
    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json(
        { message: "Product Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("❌ Server Error in [slug] route:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
