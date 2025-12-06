// app/api/products/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/dbConnect";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    // filters received from frontend
    const category = searchParams.get("category");
    const idealFor = searchParams.get("idealFor");
    const type = searchParams.get("type");
    const sort = searchParams.get("sort");
    const search = searchParams.get("search");

    let query = {};

    // filtering
    if (category && category !== "All") query.category = category.toLowerCase();
    if (idealFor && idealFor !== "All") query.idealFor = idealFor.toLowerCase();
    if (type && type !== "All") query.type = type.toLowerCase();

    // search text (full-text index already added)
    if (search) {
      query.$text = { $search: search };
    }

    // sorting logic
    let sortOptions = {};
    if (sort === "price-low-high") sortOptions.price = 1;
    if (sort === "price-high-low") sortOptions.price = -1;
    if (sort === "relevant") sortOptions.createdAt = -1; // latest products first

    const products = await Product.find(query).sort(sortOptions);

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Server Problem Occurred" }, { status: 500 });
  }
}
