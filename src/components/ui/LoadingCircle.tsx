import { cn } from '@/lib/utils';

type LoadingCircleProps = {
  size: 'medium' | 'large';
  circleColor?: string;
  tailwindClass?: string;
};

export default function LoadingCircle({
  circleColor,
  size,
  tailwindClass,
}: LoadingCircleProps) {
  const width = size === 'large' ? 'loading-lg' : 'loading-md';
  const color = `bg-${circleColor}-500`;
  return (
    <div
      className={cn(`loading loading-spinner ${width} ${color}`, tailwindClass)}
    ></div>
  );
}
