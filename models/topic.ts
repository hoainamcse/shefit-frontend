type Topic = {
  id: number;
  name: string;
}

type TopicPayload = Omit<Topic, 'id'>

export type { Topic, TopicPayload }
