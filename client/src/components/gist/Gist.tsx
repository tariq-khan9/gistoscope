import React, { useState } from "react";
import { GistType } from "../../services/types";
import Version from "./Version";
import BoxWithShadows from "../others/BoxWithShadow";
import { sortGistsByTime } from "../../services/utils/sortGistsByTime";
import Navigation from "../others/Navigation";
import { useSwipeable } from "react-swipeable"; // Add this line at the top

type GistProps = {
  gists: GistType[]; // Define the expected type for the gists prop
};

const Gist: React.FC<GistProps> = ({ gists }) => {
  const sortedGists = sortGistsByTime(gists, "desc");
  console.log("sorted Gists in gist ", sortedGists);
  const [showChild, setShowChild] = useState(false);
  const [dragOffset, setDragOffset] = useState<number>(0); // Track drag offset for the current card
  const [isDragging, setIsDragging] = useState<boolean>(false); // Track if a card is being dragged
  const [gistCurrentIndex, setGistCurrentIndex] = useState<number>(0);
  const [versionCurrentIndex, setVersionCurrentIndex] = useState<number>(0);
  const [editCurrentIndex, setEditCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    setGistCurrentIndex((prevIndex) => (prevIndex + 1) % gists?.length);
    setVersionCurrentIndex(0);
    setEditCurrentIndex(0);
  };

  const handlePrev = () => {
    setGistCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sortedGists.length - 1 : prevIndex - 1
    );
    setVersionCurrentIndex(0);
    setEditCurrentIndex(0);
  };

  const handleIndexChange = (newIndex: number) => {
    setGistCurrentIndex(newIndex);
  };

  // Add this block after the state declarations
  // const handleSwipe = useSwipeable({
  //   onSwipedLeft: () => handleNext(),
  //   onSwipedRight: () => handlePrev(),
  //   trackMouse: true, // Enable mouse dragging
  // });

  const handleSwipe = useSwipeable({
    onSwiping: (event) => {
      setIsDragging(true); // Set dragging state to true
      setDragOffset(event.deltaX); // Update drag offset in real-time
    },
    onSwiped: (event) => {
      setIsDragging(false); // Reset dragging state
      if (event.deltaX > 100) {
        handlePrev(); // Swipe right
      } else if (event.deltaX < -100) {
        handleNext(); // Swipe left
      }
      setDragOffset(0); // Reset drag offset
    },
    trackMouse: true, // Enable mouse dragging
  });

  if (!gists || gists.length === 0) {
    return <div>No Gists available.</div>;
  }

  return (
    <div className="flex w-full flex-col ">
      <BoxWithShadows
        visible={gists.length > 1}
        boxBorder="border-amber-500"
        colorShades={["bg-amber-300", "bg-amber-200", "bg-amber-100"]}
      >
        <div
          className="w-full p-3 flex flex-row justify-between px-8 rounded-lg bg-amber-300" // Add background color here
          style={{
            transform: `translateX(${dragOffset}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease-in-out",
            opacity: isDragging ? 0.8 : 1,
            boxShadow: isDragging ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
          }}
          {...handleSwipe}
        >
          <div className="">
            <h1 className="text-[14px] sm:text-[16px] lg:text-[18px] font-roboto uppercase">
              {sortedGists[gistCurrentIndex]?.title}
            </h1>
          </div>

          <div className="post-arrow-buttons flex flex-row items-center justify-center space-x-2">
            {sortedGists && sortedGists[gistCurrentIndex].gists.length > 0 && (
              <button
                className={`border border-gray-600 hover:bg-sky-800 hover:text-white rounded-full px-[16px] h-5 text-[10px]`}
                onClick={() => setShowChild(!showChild)}
              >
                {showChild ? "Hide Reply" : "Show Reply"}
              </button>
            )}

            <Navigation
              currentIndex={gistCurrentIndex}
              totalItems={sortedGists.length}
              onChangeIndex={handleIndexChange}
              handlePrev={handlePrev}
              handleNext={handleNext}
            />
          </div>
        </div>
      </BoxWithShadows>

      <BoxWithShadows
        visible={sortedGists[gistCurrentIndex].versions.length > 1}
        boxBorder="border-amber-300"
        colorShades={["bg-amber-200", "bg-amber-100", "bg-amber-50"]}
      >
        {sortedGists[gistCurrentIndex].versions && (
          <Version
            versions={sortedGists[gistCurrentIndex].versions}
            editCurrentIndex={editCurrentIndex}
            setEditCurrentIndex={setEditCurrentIndex}
            versionCurrentIndex={versionCurrentIndex}
            setVersionCurrentIndex={setVersionCurrentIndex}
            gistCurrentIndex={gistCurrentIndex}
            gistLength={sortedGists.length}
          />
        )}
      </BoxWithShadows>

      <div className={`${showChild ? "flex w-full" : "hidden"}`}>
        {sortedGists[gistCurrentIndex].gists &&
          sortedGists[gistCurrentIndex].gists.length > 0 && (
            <Gist gists={sortedGists[gistCurrentIndex].gists} />
          )}
      </div>
    </div>
  );
};

export default Gist;
