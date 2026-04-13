export interface ConsentSizeProps {
  isAllowing: boolean;
  isDenying: boolean;
  onAllow: () => void;
  onDeny: () => void;
}
