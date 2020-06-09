export interface IPin {
  pin: number;
  description: string;
  status: number;
  disabled: number;
  start0: number;
  start1: number;
  duration0: number;
  duration1: number;
  result?: string;
}

export class Pin implements IPin {
  pin: number;
  description: string;
  status: number;
  disabled: number;
  start0: number;
  start1: number;
  duration0: number;
  duration1: number;
  result: string;
  constructor(data: IPin = null) {
    let retorno = null;
    if (data) {
      retorno = Object.assign(this, data);
      retorno.start0 = (retorno.start0 * 1000);
      retorno.start1 = (retorno.start1 * 1000);
    } else {
      retorno = Object.assign(this, {
        pin: -1,
        description: "",
        status: -1,
        disabled: -1,
        start0: 0,
        start1: 0,
        duration0: 0,
        duration1: 0,
        result: null
      });
    }
    return retorno;
  }
}
