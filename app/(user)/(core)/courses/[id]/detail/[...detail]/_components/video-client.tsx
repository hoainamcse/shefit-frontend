'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MainButton } from '@/components/buttons/main-button'
import { Pause, Play, PlayCircle } from 'lucide-react'
import { getYouTubeThumbnail } from '@/lib/youtube'
import VideoPlayer from './video-player'
import { DayCircuit, CircuitExercise } from '@/models/course'
import Link from 'next/link'
import { BackIconBlack } from '@/components/icons/BackIconBlack'

function mapCircuitExerciseToExercise(exercise: CircuitExercise) {
  return {
    id: exercise.id || 0,
    name: exercise.circuit_exercise_title,
    description: exercise.circuit_exercise_description,
    url: exercise.youtube_url,
    auto_replay_count: 1,
  }
}

export function CircuitItem({ circuit, cIdx, course_id }: { circuit: DayCircuit; cIdx: number; course_id: number }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayPauseToggle = () => {
    setIsPlaying((prev) => !prev)
  }

  return (
    <div className="mb-16">
      <div className="flex lg:justify-center justify-normal lg:items-center mb-4 flex-col gap-3 lg:gap-10">
        <span className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl">
          Circuit {cIdx + 1}: {circuit.name}
        </span>
        <div className="text-[#737373] mb-2">{circuit.description}</div>
        <MainButton
          variant="ghost"
          className="rounded-full p-2 h-10 w-10 bg-[#13D8A7] text-white ml-3"
          icon={isPlaying ? Pause : Play}
          onClick={handlePlayPauseToggle}
          aria-label={isPlaying ? 'Pause circuit' : 'Play circuit'}
        />
      </div>

      {circuit.circuit_exercises.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {circuit.circuit_exercises.length > 0 && (
              <Dialog open={isPlaying} onOpenChange={(open) => !open && setIsPlaying(false)}>
                <DialogContent className="max-w-[1399px] max-h-[787px]">
                  <DialogHeader>
                    <DialogTitle>
                      <VideoPlayer
                        exerciseVideoList={circuit.circuit_exercises.map(mapCircuitExerciseToExercise)}
                        exerciseIndex={0}
                        isCircuitMode={true}
                        autoReplayListVideoCount={circuit.auto_replay_count}
                        autoPlay={true}
                      />
                    </DialogTitle>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
            {circuit.circuit_exercises.map((exercise: CircuitExercise, eIdx: number) => (
              <Dialog key={exercise.id}>
                <div className="text-lg">
                  {/* Desktop Layout */}
                  <div className="hidden md:block">
                    <DialogTrigger asChild>
                      <div className="relative group cursor-pointer mb-4">
                        <img
                          src={
                            getYouTubeThumbnail(exercise.youtube_url, 'sddefault') ||
                            'https://placehold.co/400?text=shefit.vn&font=Oswald'
                          }
                          alt={exercise.circuit_exercise_title}
                          className="aspect-[585/373] object-cover rounded-xl w-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle className="w-16 h-16 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </DialogTrigger>

                    <div className="flex justify-between">
                      <div>
                        <p className="font-bold text-wrap text-lg lg:text-xl">{exercise.circuit_exercise_title}</p>
                        <p className="text-[#737373] text-sm lg:text-lg text-wrap">
                          {exercise.circuit_exercise_description}
                        </p>
                      </div>
                      <div>
                        <Checkbox className="block w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="block md:hidden">
                    <div className="flex relative">
                      <DialogTrigger asChild>
                        <div className="relative group cursor-pointer w-1/3 flex-shrink-0">
                          <img
                            src={
                              getYouTubeThumbnail(exercise.youtube_url, 'sddefault') ||
                              'https://placehold.co/400?text=shefit.vn&font=Oswald'
                            }
                            alt={exercise.circuit_exercise_title}
                            className="aspect-square object-cover rounded-xl brightness-100 group-hover:brightness-110 transition-all duration-300"
                            width={300}
                            height={300}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle className="w-12 h-12 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </DialogTrigger>

                      <div className="flex-1 pl-3 flex flex-col">
                        <p className="font-bold text-sm lg:text-lg">{exercise.circuit_exercise_title}</p>
                        <p className="text-[#737373] text-xs lg:text-sm">{exercise.circuit_exercise_description}</p>
                      </div>

                      <div className="absolute top-0 right-0">
                        <Checkbox className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogContent className="max-w-[1399px] max-h-[787px] p-6 max-lg:p-1">
                  <DialogHeader>
                    <DialogTitle>
                      <VideoPlayer
                        exerciseVideoList={[mapCircuitExerciseToExercise(exercise)]}
                        exerciseIndex={0}
                        isCircuitMode={false}
                        autoPlay={false}
                      />
                    </DialogTitle>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function VideoClient({ circuits }: { circuits: any }) {
  return (
    <div className="flex flex-col gap-10 lg:mt-10 mt-2 px-4">
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5"></div>
        {circuits.data.map((circuit: DayCircuit, cIdx: number) => (
          <CircuitItem key={circuit.id} circuit={circuit} cIdx={cIdx} course_id={circuits.course_id} />
        ))}
      </div>
    </div>
  )
}
