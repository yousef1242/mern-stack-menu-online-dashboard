import { NextResponse } from "next/server";

export function middleware(req) {
  const verifyRestaurantTokenAndId = req.cookies.get("restaurantTokenAndId");
  let url = req.url;
  const defaultRouteUrl = "https://menuonlinedashboard.vercel.app";
  if (!verifyRestaurantTokenAndId && url.includes("/dashboard")) {
    return NextResponse.redirect(defaultRouteUrl);
  }
  if (
    verifyRestaurantTokenAndId &&
    (url === "https://menuonlinedashboard.vercel.app/subscribe" ||
      url === "https://menuonlinedashboard.vercel.app/")
  ) {
    return NextResponse.redirect(defaultRouteUrl + "/dashboard/products");
  }
}
