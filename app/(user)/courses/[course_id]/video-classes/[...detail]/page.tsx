"use client"

import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { CloseIcon } from "@/components/icons/CloseIcon"
import { Button } from "@/components/ui/button"
import { getCircuits } from "@/network/server/circuits"
import { getWeeks } from "@/network/server/weeks"
import { getDays } from "@/network/server/days"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { notFound } from "next/navigation"
import VideoPlayer from "./VideoPlayer"
import { MainButton } from "@/components/buttons/main-button"
import { Pause, Play, ChevronDown, ChevronUp, PlayCircle } from "lucide-react"
import { useState } from "react"

// Exercise type
export type Exercise = {
  id: string
  name: string
  description: string
  auto_replay_count: number
  url: string
}

// Circuit type
export type Circuit = {
  circuit_id: string
  name: string
  description: string
  auto_replay_count: number
  exercises: Exercise[]
}

const week1Day1Circuits: Circuit[] = [
  {
    circuit_id: "circuit-1",
    name: "Sức bền & linh hoạt",
    description: "Tăng cường sức bền và linh hoạt.",
    auto_replay_count: 3,
    exercises: [
      {
        id: "c2-ex1",
        name: "Side Plank",
        description: "Giữ side plank mỗi bên 30 giây.",
        auto_replay_count: 2,
        url: "https://www.shutterstock.com/shutterstock/videos/3576937989/preview/stock-footage-question-mark-abstract-background-in-colors-and-patterns-for-ask-a-stupid-question-day.webm",
      },
      {
        id: "c2-ex2",
        name: "Jump Rope",
        description: "Nhảy dây trong 1 phút.",
        auto_replay_count: 3,
        url: "https://www.shutterstock.com/shutterstock/videos/3517554481/preview/stock-footage-jakarta-indonesia-june-th-a-man-is-stupid-because-he-fixes-things-on-his-motorbike.webm",
      },
      {
        id: "c2-ex3",
        name: "Reverse Lunge",
        description: "Thực hiện 12 lần reverse lunge mỗi chân.",
        auto_replay_count: 1,
        url: "https://www.shutterstock.com/shutterstock/videos/1091241639/preview/stock-footage-father-with-son-on-shoulders-walks-on-observation-deck-overlooking-sea-man-with-backpack-and.webm",
      },
    ],
  },
  {
    circuit_id: "circuit-2",
    name: "Kiểm soát cơ thể",
    description: "Tập trung vào sức mạnh và kiểm soát cơ thể.",
    auto_replay_count: 3,
    exercises: [
      {
        id: "c3-ex1",
        name: "Wall Sit",
        description: "Giữ tư thế wall sit trong 1 phút.",
        auto_replay_count: 2,
        url: "https://www.youtube.com/shorts/tLZjL-dMH_g?feature=share",
      },
      {
        id: "c3-ex2",
        name: "Plank Shoulder Tap",
        description: "Thực hiện plank và chạm vai 20 lần.",
        auto_replay_count: 3,
        url: "https://youtu.be/bXlQ3Mw4uGc",
      },
      {
        id: "c3-ex3",
        name: "Single Leg Deadlift",
        description: "Thực hiện 10 lần single leg deadlift mỗi chân.",
        auto_replay_count: 1,
        url: "https://youtu.be/sQ22pm-xvrE",
      },
      {
        id: "c3-ex4",
        name: "Inchworm",
        description: "Thực hiện 12 lần inchworm.",
        auto_replay_count: 3,
        url: "https://youtu.be/0x5mf8BUJZY",
      },
      {
        id: "c3-ex5",
        name: "V-Up",
        description: "Thực hiện 15 lần V-Up.",
        auto_replay_count: 1,
        url: "https://youtu.be/PA0-3WDu49E",
      },
    ],
  },
  {
    circuit_id: "circuit-3",
    name: "Khởi động toàn thân",
    description: "Khởi động và tập luyện toàn thân với 12 bài tập mẫu.",
    auto_replay_count: 2,
    exercises: [
      {
        id: "1",
        name: "Warm-up Exercises",
        description:
          "Thực hiện 30s với nhịp điệu vừa phải. Khởi động các nhóm cơ trước khi tập nặng. Chú ý giữ đúng tư thế.",
        auto_replay_count: 3,
        url: "https://videos.pexels.com/video-files/5211959/5211959-uhd_2560_1440_25fps.mp4",
      },
      {
        id: "2",
        name: "Push-up Fundamentals",
        description: "Thực hiện 15 cái chậm và đúng kỹ thuật. Giữ lưng thẳng, hạ người xuống từ từ và đẩy mạnh lên.",
        auto_replay_count: 3,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      },
      {
        id: "3",
        name: "Squat Technique",
        description:
          "Thực hiện 12 cái với tư thế đúng. Hạ thấp người như ngồi trên ghế, đảm bảo đầu gối không vượt quá ngón chân.",
        auto_replay_count: 2,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      },
      {
        id: "4",
        name: "Core Strength Workout",
        description:
          "Thực hiện 30s plank giữ cơ thể thẳng. Tập trung vào việc giữ bụng và lưng thẳng, không để hông chạm đất.",
        auto_replay_count: 1,
        url: "https://videos.pexels.com/video-files/5212274/5212274-uhd_2560_1440_25fps.mp4",
      },
      {
        id: "5",
        name: "Cardio Jumpstart",
        description: "Thực hiện 40s với cường độ cao. Nhảy tại chỗ và nâng cao đầu gối luân phiên, giữ nhịp tim cao.",
        auto_replay_count: 1,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      },
      {
        id: "6",
        name: "Shoulder Press",
        description:
          "Thực hiện 10 cái mỗi tay với tạ nhẹ. Nâng tạ lên cao quá đầu và hạ xuống từ từ, kiểm soát chuyển động.",
        auto_replay_count: 1,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      },
      {
        id: "7",
        name: "Lunges Form Guide",
        description: "Thực hiện 8 cái mỗi chân. Bước một chân về phía trước và hạ người xuống, giữ lưng thẳng.",
        auto_replay_count: 1,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      },
      {
        id: "8",
        name: "HIIT Training",
        description:
          "Thực hiện 30s burpees nhanh. Bắt đầu đứng, xuống tư thế chống đẩy, nhảy chân về phía trước rồi nhảy lên.",
        auto_replay_count: 1,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      },
      {
        id: "9",
        name: "Arm Workout",
        description:
          "Thực hiện 12 cái curl tay với tạ. Cố định khuỷu tay và nâng tạ lên bằng cơ bắp tay, không dùng đà.",
        auto_replay_count: 1,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      },
      {
        id: "10",
        name: "Ab Workout",
        description: "Thực hiện 20 cái sit-up. Nằm ngửa, co đầu gối, hai tay sau gáy và nâng phần thân trên lên.",
        auto_replay_count: 1,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      },
      {
        id: "11",
        name: "Back Strength",
        description: "Thực hiện 15 cái superman. Nằm sấp và nâng đồng thới tay và chân lên khỏi mặt đất, giữ 2 giây.",
        auto_replay_count: 1,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
      },
      {
        id: "12",
        name: "Cool Down Stretching",
        description: "Thực hiện 60s các động tác giãn cơ. Thư giãn và hít thở sâu để hạ nhịp tim và phục hồi cơ bắp.",
        auto_replay_count: 1,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      },
    ],
  },
]

export default async function Video({ params }: { params: Promise<{ course_id: string; detail: string[] }> }) {
  // const { course_id, detail } = await params
  // console.log('detail', detail)
  // // First get the weeks to find the correct week
  // const weeks = await getWeeks(course_id)
  // const currentWeek = weeks.data.find((week) => week.id.toString() === detail[0])

  // if (!currentWeek) {
  //   throw new Error('Week not found')
  // }

  // // Get days for the current week
  // const days = await getDays(course_id, currentWeek.id.toString())
  // const currentDay = days.data[0] // Get first day or implement logic to get specific day

  // if (!currentDay) {
  //   throw new Error('Day not found')
  // }

  // // Now get circuits with proper week_id and day_id
  // const courses = await getCircuits(course_id, currentWeek.id.toString(), currentDay.id.toString())

  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="mb-20">
        {/* <div className="flex flex-col justify-center text-center gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">{courses.data[0].name}</div>
          <p className="text-[#737373] text-xl">{courses.data[0].description}</p>
        </div> */}
        {week1Day1Circuits.map((circuit, cIdx) => {
          return <CircuitItem key={circuit.circuit_id} circuit={circuit} cIdx={cIdx} />
        })}
      </div>
    </div>
  )
}

function CircuitItem({ circuit, cIdx }: { circuit: Circuit; cIdx: number }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  const handlePlayPauseToggle = () => {
    setIsPlaying((prev) => !prev)
  }

  const handleExpandToggle = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <div className="mb-16">
      <div className="flex items-center mb-1">
        <button
          onClick={handleExpandToggle}
          className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse circuit" : "Expand circuit"}
        >
          <span className="font-bold text-2xl mr-3">
            Circuit {cIdx + 1}: {circuit.name}
          </span>
          {isExpanded ? <ChevronDown /> : <ChevronUp />}
        </button>
        <MainButton
          variant="ghost"
          className="rounded-full p-2 h-10 w-10 bg-button text-white ml-3"
          icon={isPlaying ? Pause : Play}
          onClick={handlePlayPauseToggle}
          aria-label={isPlaying ? "Pause circuit" : "Play circuit"}
        />
      </div>

      {isExpanded && (
        <>
          <div className="text-[#737373] mb-4">{circuit.description}</div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {isPlaying && (
              <Dialog open={isPlaying} onOpenChange={(open) => !open && setIsPlaying(false)}>
                <DialogContent className="max-w-[1399px] max-h-[787px]">
                  <DialogHeader>
                    <DialogTitle>
                      <VideoPlayer
                        exerciseVideoList={circuit.exercises}
                        exerciseIndex={0}
                        isCircuitMode={true}
                        autoReplayListVideoCount={circuit.auto_replay_count}
                      />
                    </DialogTitle>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
            {circuit.exercises.map((exercise, eIdx) => (
              <Dialog key={exercise.id}>
                <DialogTrigger asChild>
                  <div className="text-xl cursor-pointer" tabIndex={0} aria-label={`Open exercise ${exercise.name}`}>
                    <div className="hidden md:block">
                      <div className="relative group cursor-pointer">
                        <img src="/temp/VideoCard.jpg" alt="" className="aspect-[5/3] object-cover rounded-xl mb-4" />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle className="w-16 h-16 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="w-3/4">
                          <p className="font-bold">{exercise.name}</p>
                          <p className="text-[#737373]">{exercise.description}</p>
                        </div>
                        <Checkbox className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="block md:hidden">
                      <div className="flex relative">
                        <div className="relative group cursor-pointer w-1/3 flex-shrink-0">
                          <img
                            src="/temp/VideoCard.jpg"
                            alt=""
                            className="aspect-square object-cover rounded-xl"
                            width={300}
                            height={300}
                          />
                          <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                        </div>

                        <div className="flex-1 pl-3 flex flex-col">
                          <p className="font-bold">{exercise.name}</p>
                          <p className="text-[#737373] text-sm">{exercise.description}</p>
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
                      <VideoPlayer exerciseVideoList={circuit.exercises} exerciseIndex={eIdx} isCircuitMode={false} />
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
