import { NextRequest, NextResponse } from 'next/server'
import { GrowthBook } from '@growthbook/growthbook'

const FEATURES_ENDPOINT = 'https://cdn.growthbook.io/api/features/key_prod_2f25842c078cfc63'

const COOKIE = 'visitor_id'

// Fetch features from GrowthBook API and cache in memory
let features = null;
let lastFetch = 0;
async function getFeatures() {
  if (Date.now() - lastFetch > 5000) {
    lastFetch = Date.now();
    const latest = fetch(FEATURES_ENDPOINT)
      .then(res => res.json())
      .then(json => features = json.features || features)
      .catch((e) => console.error("Error fetching features", e))
    // If this is the first time, wait for the initial fetch
    if(!features) await latest;
  }
  return features || {};
}

export async function middleware(req) {

  let visitor_id = req.cookies[COOKIE] || crypto.randomUUID()

  // Create a GrowthBook client instance
  const growthbook = new GrowthBook({
    attributes: { id: visitor_id },
    features: await getFeatures(),
    trackingCallback: (exp, res) => {
      console.log("In Experiment", exp.key, res.variationId);
    }
  });

  const pathname = req.nextUrl.pathname;
  const endUrl = /[^/]*$/.exec(pathname)[0];

  // Pick which page to render depending on a feature flag
  let res = NextResponse.next();
  
  if (growthbook.feature(endUrl).on) {
    const url = req.nextUrl.clone();
    const bucket = growthbook.getFeatureValue(endUrl, "default");
    if(bucket !== "default"){
      //adding locale because of NEXTJS issue
      url.pathname = `${url.locale}${url.pathname}/${bucket}`
      res = NextResponse.rewrite(url);
    }

    // Add the cookies if it's not there
    if (!req.cookies[COOKIE]) {
      res.cookie(COOKIE, visitor_id)
    }
  }
  return res
}