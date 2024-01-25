"use client";

import {
  Annotation,
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const countries = [
    "Netherlands",
    "Germany",
    "Czech Republic",
    "Hungary",
    "Austria",
    "France",
  ];

  const router = useRouter();

  return (
    <main className={styles.main}>
      <ComposableMap>
        <ZoomableGroup center={[20, 50]} zoom={4}>
          <Geographies
            geography="/geojson.json"
            fill="#D6D6DA"
            stroke="#FFFFFF"
            strokeWidth={0.2}
          >
            {({ geographies }: any) =>
              geographies.map((geo: any) =>
                countries.includes(geo.properties.NAME) ? (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { outline: "none", fill: "black" },
                      hover: { outline: "none", fill: "blue" },
                      pressed: { outline: "none", fill: "black" },
                    }}
                    onClick={() => {
                      router.push(`/${geo.properties.NAME}`);
                    }}
                  />
                ) : (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      console.log(geo);
                    }}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#F53" },
                      pressed: { outline: "none", fill: "#E42" },
                    }}
                  />
                )
              )
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </main>
  );
}
