/**
 * @description 使用 requestAnimationFrame 实现高精度倒计时
 * @approach
 * 先明确输入输出，再按稳定步骤展开实现。
 * 优先使用清晰变量名、显式分支和可读循环，避免技巧式缩写。
 * @params
 * 请在函数签名中明确列出入参含义。
 * @return
 * * {JSX.Element} 倒计时组件
 */
import { useEffect, useRef, useState } from "react";

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;
const ONE_SECOND = 1000;
function CountDown({ totalSeconds = 60, onEnd, showMs = false }) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds * 1000);
  const timer = useRef(null);
  const lastTimestamp = useRef(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd?.();
      cancelAnimationFrame(timer.current);
      return;
    }

    const update = () => {
      const now = performance.now();
      if (!lastTimestamp.current) {
        lastTimestamp.current = now;
      }

      setTimeLeft((timeLeft) =>
        Math.max(0, timeLeft - (now - lastTimestamp.current)),
      );
      lastTimestamp.current = now;

      timer.current = requestAnimationFrame(update);
    };

    timer.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(timer.current);
    };
  }, [timeLeft, onEnd]);

  const format = (ms) => {
    const days = Math.floor(ms / ONE_DAY)
      .toString()
      .padStart(2, "0");
    const hours = Math.floor((ms % ONE_DAY) / ONE_HOUR)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((ms % ONE_HOUR) / ONE_MINUTE)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((ms % ONE_MINUTE) / ONE_SECOND)
      .toString()
      .padStart(2, "0");
    const milliseconds = Math.floor(ms % 1000)
      .toString()
      .padStart(3, "0");
    return showMs
      ? `${days} days, ${hours}:${minutes}:${seconds}:${milliseconds}`
      : `${days} days, ${hours}:${minutes}:${seconds}`;
  };

  return <div>{format(timeLeft)}</div>;
}

export default CountDown;
