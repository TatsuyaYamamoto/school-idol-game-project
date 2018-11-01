export type Message = string | number | object;

interface Data {
  message: Message;
  timestamp: number;
}

export default Data;
