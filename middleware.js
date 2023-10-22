import { NextResponse } from "next/server";

export function middleware(req) {
  const verifyRestaurantTokenAndId = req.cookies.get("restaurantTokenAndId");
  let url = req.url;
  const defaultRouteUrl = "http://localhost:3001";
  if (!verifyRestaurantTokenAndId && url.includes("/dashboard")) {
    return NextResponse.redirect(defaultRouteUrl);
  }
  if (
    verifyRestaurantTokenAndId &&
    (url === "http://localhost:3001/subscribe" ||
      url === "http://localhost:3001/")
  ) {
    return NextResponse.redirect(defaultRouteUrl + "/dashboard/products");
  }
}
