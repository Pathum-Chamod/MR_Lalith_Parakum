import Image from "next/image";
import { Button } from "./ui/button";

const AchievementCards = ({
  title,
  description,
  imageUrl,
  isExpanded,
  onToggleExpand,
  onNext,
  onPrev,
  isFirst,
  isLast,
}) => {
  return (
    <>
      <style jsx>{`
        @keyframes glow {
          0% {
            text-shadow: 0 0 4px rgba(255, 255, 255, 0.6),
              0 0 8px rgba(255, 255, 255, 0.4);
          }
          50% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
              0 0 20px rgba(255, 255, 255, 0.6);
          }
          100% {
            text-shadow: 0 0 4px rgba(255, 255, 255, 0.6),
              0 0 8px rgba(255, 255, 255, 0.4);
          }
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .glowing {
          animation: glow 1.5s infinite ease-in-out;
        }

        .rotating {
          animation: rotate 1.2s linear infinite;
        }
      `}</style>

      <div
        className={`transition-all duration-1000 ease-in-out
      ${
        isExpanded
          ? // Expanded: fixed, centered, with tint overlay
            "fixed z-[1000] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] bg-gradient-to-b from-white/30 to-white/10 p-8 flex flex-col items-center gap-4 rounded-xl border border-white/40 shadow-2xl backdrop-blur-md"
          : // Collapsed: smaller width, positioned in flow
            "relative z-0 w-[300px] h-[410px] bg-white/10 p-6 flex flex-col items-center gap-4 rounded-xl border border-white/40 shadow-2xl"
      }
      `}
      >
        {/* Close Button (Only if expanded) */}
        {isExpanded && (
          <button
            onClick={onToggleExpand}
            className="absolute top-4 right-4 z-[1100] text-white text-3xl font-bold transition-transform duration-300 ease-in-out hover:scale-110 group"
          >
            <span className="relative glowing hover:text-red-500">✕</span>
          </button>
        )}

        {/* Navigation Buttons (Only if expanded, to go prev/next) */}
        {isExpanded && (
          <>
            {!isFirst && (
              <button
                onClick={onPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-[1100] text-white text-3xl font-bold transition-transform duration-300 ease-in-out hover:scale-110 group"
              >
                <span className="relative glowing hover:text-white-500">←</span>
              </button>
            )}

            {!isLast && (
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-[1100] text-white text-3xl font-bold transition-transform duration-300 ease-in-out hover:scale-110 group"
              >
                <span className="relative glowing hover:text-white-500">→</span>
              </button>
            )}
          </>
        )}

        {/* Image */}
        <div className="w-full flex flex-col items-center justify-center">
          <Image
            src={imageUrl || "/placeholder-image.png"}
            alt={title}
            width={isExpanded ? 800 : 300}
            height={isExpanded ? 400 : 200}
            className={`w-full object-cover rounded-lg shadow-md ${
              isExpanded ? "h-[400px]" : "h-[200px]"
            } transition-all duration-1000`}
          />
        </div>

        {/* Title and Description */}
        <div className="w-full flex flex-col items-center gap-4">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <div
            className={`relative overflow-hidden ${
              isExpanded ? "max-h-full" : "max-h-[4rem]"
            } w-full h-[80px]`} // Fixed height for uniform layout
          >
            <p
              className={`text-gray-300 text-justify text-sm ${
                !isExpanded ? "line-clamp-3" : "whitespace-normal"
              }`}
            >
              {description}
            </p>
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t to-transparent"></div>
            )}
          </div>

          {/* View More Button (Only if not expanded) */}
          {!isExpanded && (
            <div className="mt-4"> {/* Added margin to align buttons */}
              <Button onClick={onToggleExpand} variant="gradient_bg">
                View More
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AchievementCards;
