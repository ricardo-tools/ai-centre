import { Prototype } from '../../domain/Prototype';

export interface PrototypeCardData {
  prototype: Prototype;
}

export function usePrototypeCard(props: { prototype: Prototype }): PrototypeCardData {
  return { prototype: props.prototype };
}
