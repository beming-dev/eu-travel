"use client";
import styles from "./page.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Page({ params, searchParams }: any) {
  if (params.country == "Czeck Republic") params.country = "Czeck";
  const [imagePaths, setImagePaths] = useState([]);
  const [imgIdx, setImgIdx] = useState(1);

  useEffect(() => {
    axios
      .get("/api/image", { params: { country: params.country } })
      .then(({ data }) => setImagePaths(data.imagePaths));
  }, []);

  return (
    <div
      className={styles.main}
      style={{ backgroundImage: `url(/${imagePaths[0]})` }}
    >
      <Image
        src={`/${imagePaths[0]}`}
        alt="hello"
        fill
        style={{ objectFit: "cover", filter: "blur(10px)" }}
      ></Image>
      <div className={styles.imageBox}>
        <Image
          src={`/${imagePaths[0]}`}
          alt="hello"
          fill
          style={{ objectFit: "contain" }}
        ></Image>
      </div>
    </div>
  );
}
