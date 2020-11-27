// eslint-disable-next-line
export type Message = string | number | object;

interface Data<T = Message> {
  message: T;
  timestamp: number;
}

export default Data;
