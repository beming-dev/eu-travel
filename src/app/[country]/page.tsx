"use client";
import styles from "./page.module.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import throttle from "lodash/throttle";
import * as _ from "lodash";

export default function Page({ params, searchParams }: any) {
  if (params.country == "Czech Republic") params.country = "Czeck";
  const [imagePaths, setImagePaths] = useState([]);
  const [spinCnt, setSpinCnt] = useState(0);
  const touchStartY = useRef(null);

  useEffect(() => {}, [spinCnt]);

  const handleWheelEvent = throttle((event: any) => {
    const deltaY = event.deltaY;
    console.log(deltaY);
    if (deltaY > 0) {
      setSpinCnt((imgId) => imgId - 1);
    } else if (deltaY < 0) {
      setSpinCnt((imgId) => imgId + 1);
    }
    // window.removeEventListener("wheel", handleWheelEvent);
    window.addEventListener("wheel", handleWheelEvent, { once: true });
  }, 500);

  const handleTouchStart = (event: any) => {
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: any) => {
    if (!touchStartY.current) return;

    const touchEndY = event.touches[0].clientY;
    const swipeDistance = touchEndY - touchStartY.current;

    if (swipeDistance > 50) {
      setSpinCnt(spinCnt + 1);
    } else if (swipeDistance < -50) {
      setSpinCnt(spinCnt - 1);
    }

    touchStartY.current = null;
  };

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("wheel", handleWheelEvent, { once: true });

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("wheel", handleWheelEvent);
    };
  }, []);

  const getImageIdx = (idx: number) => {
    if (imagePaths.length == 0) return 0;

    const numberOfImages = imagePaths.length;
    const imageDistance = idx - 3;

    const spinNum = Math.floor((imageDistance + spinCnt) / 6);
    let a;
    if (spinNum < 0) {
      a = idx - 6 * (spinNum + 1);
    } else {
      a = idx - 6 * spinNum;
    }
    // console.log(21, getClassIdx(idx + spinCnt), a, spinCnt, spinNum);
    return (a + numberOfImages) % numberOfImages;
  };

  const getClassIdx = (idx: number) => {
    const numberOfCarousel = 6;
    if (idx >= 0) return idx % numberOfCarousel;
    else
      return (numberOfCarousel + (idx % numberOfCarousel)) % numberOfCarousel;
  };

  const getBgImgIdx = () => {
    const a = getImageIdx(
      _.range(6)
        .filter((idx) => getClassIdx(idx + spinCnt) == 0)
        .at(0) || 0
    );
    console.log(a);
    return a;
  };

  useEffect(() => {
    axios
      .get("/api/image", { params: { country: params.country } })
      .then(({ data }) => setImagePaths(data.imagePaths));
  }, []);

  // `url(/${
  //   getImageIdx[_.range(6).find((idx) => getClassIdx(idx + spinCnt) == 0)]
  // })`
  return (
    <div className="main">
      <Image
        src={`/${imagePaths[getBgImgIdx()]}`}
        alt="hello"
        fill
        style={{ objectFit: "cover", filter: "blur(10px)" }}
      ></Image>
      <div className="image-carousel">
        {Array.from({ length: 6 }, (_, idx) => (
          <div
            className={`image-box image-box-${getClassIdx(idx + spinCnt)}`}
            key={idx}
          >
            <Image
              src={`/${imagePaths[getImageIdx(idx)]}`}
              alt="hello"
              fill
              style={{
                objectFit: "contain",
              }}
            ></Image>
          </div>
        ))}
      </div>
      <style jsx>{`
        .main {
          display: flex;
          flex-direction: center;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100vh;
          background-color: white;
          overflow: hidden;
          position: relative;
        }
        .image-carousel {
          width: 100vw;
          height: 100vh;
          position: relative;
          top: 0;
          left: -50%;

          .image-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            height: 400px;
            transition-duration: 0.5s;
          }

          .image-box-0 {
            z-index: 10;
            top: 50%;
            left: 100%;
          }
          .image-box-1 {
            z-index: 9;
            top: 20%;
            left: 75%;
          }
          .image-box-2 {
            top: 20%;
            left: 25%;
          }
          .image-box-3 {
            top: 50%;
            left: 0%;
          }
          .image-box-4 {
            top: 75%;
            left: 25%;
          }
          .image-box-5 {
            z-index: 9;
            top: 75%;
            left: 75%;
          }
        }

        @media (max-width: 576px) {
          .image-carousel {
            .image-box {
              width: 150px;
              height: 150px;
            }

            .image-box-0 {
              z-index: 10;
              top: 47.5%;
              left: 100%;
            }
          }
        }
      `}</style>
    </div>
  );
}
