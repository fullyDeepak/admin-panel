type LoadingCircleProps = {
  size: 'medium' | 'large';
  circleColor: string;
};

export default function LoadingCircle({
  circleColor,
  size,
}: LoadingCircleProps) {
  const width = size === 'large' ? 'loading-lg' : 'loading-md';
  const color = `bg-${circleColor}-500`;
  return <div className={`loading loading-spinner ${width} ${color}`}></div>;
}
