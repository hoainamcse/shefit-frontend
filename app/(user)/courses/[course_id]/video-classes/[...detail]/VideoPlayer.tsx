"use client"

import { useEffect, useState } from "react"
import ReactPlayer from "react-player"
import { Button } from "@/components/ui/button"

// Define Exercise type locally based on how it's used
export interface Exercise {
  id: number
  name: string
  description: string
  url: string
  auto_replay_count: number
}

interface VideoPlayerProps {
  exerciseVideoList: Exercise[]
  exerciseIndex: number
  isCircuitMode?: boolean
  autoReplayListVideoCount?: number
  autoPlay?: boolean
}

const VideoPlayer = ({
  exerciseVideoList,
  exerciseIndex,
  isCircuitMode = false,
  autoReplayListVideoCount = 1,
  autoPlay = true,
}: VideoPlayerProps) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(exerciseIndex)
  const [replayCount, setReplayCount] = useState(1)
  const [circuitReplayCount, setCircuitReplayCount] = useState(1)
  const [playing, setPlaying] = useState(autoPlay)

  const exercise = exerciseVideoList[currentExerciseIndex]
  const maxReplay = isCircuitMode ? 1 : exercise?.auto_replay_count || 1
  const maxCircuitReplay = isCircuitMode ? autoReplayListVideoCount : 1

  const handleVideoEnded = () => {
    if (isCircuitMode) {
      if (currentExerciseIndex < exerciseVideoList.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1)
        setPlaying(false)
        setTimeout(() => setPlaying(true), 100)
      } else if (circuitReplayCount < maxCircuitReplay) {
        setCurrentExerciseIndex(0)
        setCircuitReplayCount((prev) => prev + 1)
        setPlaying(false)
        setTimeout(() => setPlaying(true), 100)
      } else {
        setPlaying(false)
      }
    } else {
      if (replayCount < maxReplay) {
        setReplayCount((prev) => prev + 1)
        setPlaying(false)
        setTimeout(() => setPlaying(true), 100)
      } else if (currentExerciseIndex < exerciseVideoList.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1)
        setReplayCount(1)
        setPlaying(false)
        setTimeout(() => setPlaying(true), 100)
      } else {
        setPlaying(false)
      }
    }
  }

  return (
    <div className="relative rounded-xl" tabIndex={0} aria-label={`Video player for ${exercise.name}`}>
      <Button
        className="absolute top-4 left-0 w-full h-[100px] max-lg:h-[45px] z-10 shadow-none"
        style={{ cursor: "auto", background: "transparent" }}
        onClick={(e) => e.stopPropagation()}
      ></Button>
      <ReactPlayer
        url={exercise.url}
        playing={playing}
        controls
        width="100%"
        height="calc(100vw*9/16)"
        style={{ maxHeight: 720 }}
        onEnded={handleVideoEnded}
        config={{
          file: {
            attributes: {
              tabIndex: 0,
              title: exercise.name,
            },
          },
        }}
      />
      <Button
        className="absolute bottom-6 right-12 w-[70px] h-[34px] max-lg:w-[70px] max-lg:h-[40px] z-10 shadow-none"
        style={{ cursor: "auto", background: "transparent" }}
        onClick={(e) => e.stopPropagation()}
      ></Button>
      <div className="text-center mt-2 text-xs text-gray-500">
        {isCircuitMode
          ? `Circuit round ${circuitReplayCount}/${maxCircuitReplay} - Exercise ${currentExerciseIndex + 1}/${
              exerciseVideoList.length
            }`
          : `Replay ${replayCount}/${maxReplay} - Exercise ${currentExerciseIndex + 1}/${exerciseVideoList.length}`}
      </div>
    </div>
  )
}

export default VideoPlayer
