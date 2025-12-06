import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/dbConnect";
import Product from "@/models/Product";
import { productSeedData } from "@/data/productsSeed";

export async function POST() {
  try {
    await dbConnect();

    let inserted = 0;

    for (const item of productSeedData) {
      const exists = await Product.findOne({ slug: item.slug });
      if (!exists) {
        await Product.create(item);
        inserted++;
      }
    }

    return NextResponse.json({ success: true, inserted });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
