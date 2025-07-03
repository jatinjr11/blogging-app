import React from "react";
import { motion } from "framer-motion";

function LoadingThreeDotsJumping() {
  const dotVariants = {
    jump: {
      y: -30,
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      animate="jump"
      transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
      className="loader-container"
    >
      <motion.div className="dot" variants={dotVariants} />
      <motion.div className="dot" variants={dotVariants} />
      <motion.div className="dot" variants={dotVariants} />
      <style>
        {`
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
          }

          .dot {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #4ade80; /* green */
            will-change: transform;
          }
        `}
      </style>
    </motion.div>
  );
}

export default LoadingThreeDotsJumping;
