import React from "react";
import NotVerified from "./user/NotVerified";
import TopRatedMovies from "./user/TopRatedMovies";
import TopRatedWebSeries from "./user/TopRatedWebSeries";
import Container from "./Container";
import TopRatedTVSeries from "./user/TopRatedTVSeries";
import HeroSlidShow from "./user/HeroSlidShow";

export default function Home() {
  return (
    <div className="dark:bg-primary bg-white min-h-screen">
      <Container className=" px-2 xl:p-0">
        <NotVerified />
        {/* Slider */}
        {/* Most Rated Movies */}
        <HeroSlidShow />
        <div className="space-y-3 py-8"></div>
        <TopRatedMovies />
        <div className="space-y-3 py-5"></div>
        <TopRatedWebSeries />
        <div className="space-y-3 py-5"></div>
        <TopRatedTVSeries/>
      </Container>
    </div>
  );
}
