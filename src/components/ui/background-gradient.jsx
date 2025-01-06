/**
 * BackgroundGradient Component
 * 
 * This component creates an animated background gradient using Framer Motion.
 * It wraps around the children components, providing a dynamic, darker backdrop.
 */
const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0% 50%",
    },
    animate: {
      // The array of positions will animate from 0% -> 100% -> 0%
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    },
  };

  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      {/* First Gradient Layer */}
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 10, 
                repeat: Infinity,
                repeatType: "loop",
              }
            : undefined
        }
        style={{
          // Adjust backgroundSize if you want the animation to move slower/faster
          backgroundSize: animate ? "200% 200%" : undefined,
        }}
        className={cn(
          // Slightly reduce the opacity for a more subtle effect
          "absolute inset-0 rounded-3xl z-[1] opacity-50 group-hover:opacity-70 blur-xl transition duration-500",
          // D A R K E R   G R A D I E N T   E X A M P L E
          "bg-gradient-to-r from-gray-700 via-gray-800 to-black"
        )}
      />
      
      {/* Second Gradient Layer */}
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 10,
                repeat: Infinity,
                repeatType: "loop",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "200% 200%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] will-change-transform",
          // Another subtle dark gradient
          "bg-gradient-to-r from-black via-gray-900 to-gray-800"
        )}
      />

      {/* Content Wrapper */}
      <div className={cn("relative z-10", className)}>
        {children}
      </div>
    </div>
  );
};
