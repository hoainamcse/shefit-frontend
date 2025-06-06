'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MainButton } from '@/components/buttons/main-button'
import { Pause, Play, PlayCircle } from 'lucide-react'
import { getYoutubeThumbnail } from '@/lib/youtube'
import VideoPlayer from './VideoPlayer'
import { Circuit, CircuitExercise } from '@/models/circuits'

function mapCircuitExerciseToExercise(exercise: CircuitExercise) {
  return {
    id: exercise.id.toString(),
    name: exercise.circuit_exercise_title,
    description: exercise.circuit_exercise_description,
    url: exercise.youtube_url,
    auto_replay_count: 1,
  }
}

export function CircuitItem({ circuit, cIdx }: { circuit: Circuit; cIdx: number }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayPauseToggle = () => {
    setIsPlaying((prev) => !prev)
  }

  return (
    <div className="mb-16">
      <div className="flex justify-center items-center mb-1 flex-col gap-10">
        <span className="font-bold font-[family-name:var(--font-coiny)] text-ring text-2xl xl:text-[40px]">
          Circuit {cIdx + 1}: {circuit.name}
        </span>
        <MainButton
          variant="ghost"
          className="rounded-full p-2 h-10 w-10 bg-[#13D8A7] text-white ml-3"
          icon={isPlaying ? Pause : Play}
          onClick={handlePlayPauseToggle}
          aria-label={isPlaying ? 'Pause circuit' : 'Play circuit'}
        />
        <div className="text-[#737373] mb-4">{circuit.description}</div>
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
                      />
                    </DialogTitle>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
            {circuit.circuit_exercises.map((exercise: CircuitExercise, eIdx: number) => (
              <Dialog key={exercise.id}>
                <DialogTrigger asChild>
                  <div
                    className="text-xl cursor-pointer"
                    tabIndex={0}
                    aria-label={`Open exercise ${exercise.circuit_exercise_title}`}
                  >
                    <div className="hidden md:block">
                      <div className="relative group cursor-pointer">
                        <img
                          src={getYoutubeThumbnail(exercise.youtube_url)}
                          alt=""
                          className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                        />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle className="w-16 h-16 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="w-3/4">
                          <p className="font-bold">{exercise.circuit_exercise_title}</p>
                          <p className="text-[#737373]">{exercise.circuit_exercise_description}</p>
                        </div>
                        <Checkbox className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="block md:hidden">
                      <div className="flex relative">
                        <div className="relative group cursor-pointer w-1/3 flex-shrink-0">
                          <img
                            src={getYoutubeThumbnail(exercise.youtube_url)}
                            alt=""
                            className="aspect-square object-cover rounded-xl"
                            width={300}
                            height={300}
                          />
                          <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                        </div>

                        <div className="flex-1 pl-3 flex flex-col">
                          <p className="font-bold">{exercise.circuit_exercise_title}</p>
                          <p className="text-[#737373] text-sm">{exercise.circuit_exercise_description}</p>
                        </div>

                        <div className="absolute top-0 right-0">
                          <Checkbox className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-[1399px] max-h-[787px] p-6 max-lg:p-1">
                  <DialogHeader>
                    <DialogTitle>
                      <VideoPlayer
                        exerciseVideoList={circuit.circuit_exercises.map(mapCircuitExerciseToExercise)}
                        exerciseIndex={eIdx}
                        isCircuitMode={false}
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

export function VideoClientComponent({ circuits }: { circuits: any }) {
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-20"></div>
        {circuits.data.map((circuit: Circuit, cIdx: number) => (
          <CircuitItem key={circuit.id} circuit={circuit} cIdx={cIdx} />
        ))}
      </div>
    </div>
  )
}
