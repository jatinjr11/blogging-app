import React from "react";
import { motion } from "framer-motion";

function LoadingThreeDotsJumping() {
  const dotVariants = {
    jump: {
      y: -20,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      animate="jump"
      transition={{ staggerChildren: 0.2 }}
      className="loader-dots"
    >
      <motion.div className="dot" variants={dotVariants} />
      <motion.div className="dot" variants={dotVariants} />
      <motion.div className="dot" variants={dotVariants} />
      <style>{`
        .loader-dots {
          display: flex;
          gap: 10px;
          justify-content: center;
          align-items: center;
        }

        .dot {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background-color: #000000;
        }
      `}</style>
    </motion.div>
  );
}

export default LoadingThreeDotsJumping;
