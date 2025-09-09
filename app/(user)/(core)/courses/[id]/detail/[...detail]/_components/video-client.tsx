'use client'

import type { DayCircuit, CircuitExercise } from '@/models/course'

import { useState, useEffect } from 'react'
import { Play, PlayCircle } from 'lucide-react'

import { Checkbox } from '@/components/ui/checkbox'
import { MainButton } from '@/components/buttons/main-button'
import { DialogVideoPlayer } from '@/components/dialogs/dialog-video-player'
import { getYouTubeThumbnail } from '@/lib/youtube'

export function VideoClient({ data: circuits }: { data: DayCircuit[] }) {
  const [title, setTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState<string[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [checkedExercises, setCheckedExercises] = useState<Record<string, boolean>>({})

  // Initialize all exercises as unchecked by default
  useEffect(() => {
    // More efficient approach using reduce
    const initialCheckedState = circuits.reduce<Record<string, boolean>>((acc, circuit) => {
      circuit.circuit_exercises.forEach((exercise) => {
        if (exercise.id) {
          acc[exercise.id.toString()] = false
        }
      })
      return acc
    }, {})

    setCheckedExercises(initialCheckedState)
  }, [circuits])

  const handlePlayCircuit = (circuit: DayCircuit) => {
    // Get valid exercises with non-empty YouTube URLs
    const validExercises = circuit.circuit_exercises.filter((exercise) => exercise.id && exercise.youtube_url)

    // Get exercises that are checked or all if none are checked
    const selectedExercises = validExercises.filter((exercise) => checkedExercises[exercise.id!.toString()])

    // If none are checked, use all valid exercises
    const exercisesToPlay = selectedExercises.length > 0 ? selectedExercises : validExercises

    // Extract the YouTube URLs
    const videosToPlay = exercisesToPlay.map((exercise) => exercise.youtube_url)

    // Avoid processing empty circuits
    if (videosToPlay.length === 0) return

    // Set the title with dynamic information
    setTitle(`${circuit.name} (${videosToPlay.length} động tác, thực hiện ${circuit.auto_replay_count} vòng)`)

    // Create playlist by repeating videos according to auto_replay_count (ensure it's at least 1)
    const replayCount = Math.max(1, circuit.auto_replay_count || 1)

    // More efficient way to create repeated array
    const replayedVideos = Array.from({ length: replayCount }, () => videosToPlay).flat()

    setVideoUrl(replayedVideos)
    setOpenDialog(true)
  }

  const handlePlayExercise = (exercise: CircuitExercise) => {
    setTitle(`${exercise.circuit_exercise_title} (thực hiện ${exercise.no} lần)`)
    setVideoUrl(Array(exercise.no).fill(exercise.youtube_url))
    setOpenDialog(true)
  }

  const handleCheckboxChange = (exerciseId: string, isChecked: boolean) => {
    setCheckedExercises((prev) => ({
      ...prev,
      [exerciseId]: isChecked,
    }))
  }

  return (
    <>
      <div className="flex flex-col gap-10 lg:mt-10 mt-2 px-4">
        <div className="mb-20">
          {circuits.map((circuit, index) => (
            <div className="mb-16" key={circuit.id}>
              <div className="flex lg:justify-center justify-normal lg:items-center mb-4 flex-col gap-3 lg:gap-10">
                <span className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl">
                  Circuit {index + 1}: {circuit.name}
                </span>
                <div className="text-[#737373] mb-2">{circuit.description}</div>
                <MainButton
                  variant="ghost"
                  className="rounded-full p-2 h-10 w-10 bg-[#13D8A7] text-white ml-3"
                  icon={Play}
                  onClick={() => handlePlayCircuit(circuit)}
                  // aria-label={isPlaying ? 'Pause circuit' : 'Play circuit'}
                />
              </div>

              {circuit.circuit_exercises.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {circuit.circuit_exercises.map((exercise) => (
                    <div className="text-lg" key={exercise.id}>
                      {/* Desktop Layout */}
                      <div className="hidden md:block">
                        <div
                          className="relative group cursor-pointer mb-4"
                          onClick={() => handlePlayExercise(exercise)}
                        >
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

                        <div className="flex justify-between">
                          <div>
                            <p className="font-bold text-wrap text-lg lg:text-xl">{exercise.circuit_exercise_title}</p>
                            <p className="text-[#737373] text-sm lg:text-lg text-wrap">
                              {exercise.circuit_exercise_description}
                            </p>
                          </div>
                          <div>
                            <Checkbox
                              className="block w-8 h-8"
                              checked={exercise.id ? checkedExercises[exercise.id.toString()] : false}
                              onCheckedChange={(checked) =>
                                exercise.id && handleCheckboxChange(exercise.id.toString(), checked === true)
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="block md:hidden">
                        <div className="flex relative">
                          <div
                            className="relative group cursor-pointer w-1/3 flex-shrink-0"
                            onClick={() => handlePlayExercise(exercise)}
                          >
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

                          <div className="flex-1 pl-3 flex flex-col">
                            <p className="font-bold text-sm lg:text-lg">{exercise.circuit_exercise_title}</p>
                            <p className="text-[#737373] text-xs lg:text-sm">{exercise.circuit_exercise_description}</p>
                          </div>

                          <div className="absolute top-0 right-0">
                            <Checkbox
                              className="w-6 h-6"
                              checked={exercise.id ? checkedExercises[exercise.id.toString()] : false}
                              onCheckedChange={(checked) =>
                                exercise.id && handleCheckboxChange(exercise.id.toString(), checked === true)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <DialogVideoPlayer title={title} videoUrl={videoUrl} open={openDialog} onOpenChange={setOpenDialog} />
    </>
  )
}
