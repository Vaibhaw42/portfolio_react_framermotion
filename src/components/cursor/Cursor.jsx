import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./cursor.scss";

const Cursor = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target?.closest?.("[data-cursor='hover']");
      setHover(Boolean(el));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div
      className={`cursor${hover ? " is-hover" : ""}`}
      style={{ x: springX, y: springY }}
      aria-hidden="true"
    />
  );
};

export default Cursor;
