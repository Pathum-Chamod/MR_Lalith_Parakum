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
    <div
      className={`transition-all duration-500 ease-in-out
        ${
          isExpanded
            ? // Expanded: fixed, centered, bigger width, etc.
              "fixed z-[1000] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] bg-white/10 p-8 flex flex-col items-center gap-4 rounded-xl border border-white/40 shadow-2xl"
            : // Collapsed: smaller width, positioned in flow
              "relative z-0 w-[300px] bg-white/10 p-6 flex flex-col items-center gap-4 rounded-xl border border-white/40 shadow-2xl"
        }
      `}
    >
      {/* Close Button (Only if expanded) */}
      {isExpanded && (
        <button
          onClick={onToggleExpand}
          className="absolute top-4 right-4 text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full z-[1100]"
        >
          ✕
        </button>
      )}

      {/* Navigation Buttons (Only if expanded, to go prev/next) */}
      {isExpanded && (
        <>
          {!isFirst && (
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full z-[1100]"
            >
              ←
            </button>
          )}

          {!isLast && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full z-[1100]"
            >
              →
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
          } transition-all duration-300`}
        />
      </div>

      {/* Title and Description */}
      <div className="w-full flex flex-col items-center gap-4">
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <p
          className={`text-gray-300 text-justify text-sm ${
            isExpanded ? "max-h-full" : "max-h-[3rem] overflow-hidden"
          } transition-all duration-300`}
        >
          {description}
        </p>

        {/* View More Button (Only if not expanded) */}
        {!isExpanded && (
          <Button onClick={onToggleExpand} variant="gradient_bg">
            View More
          </Button>
        )}
      </div>
    </div>
  );
};

export default AchievementCards;
