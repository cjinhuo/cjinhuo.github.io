export enum NameTypes {
  Light = 'light',
  Dark = 'dark',
  github = 'github',
}
interface PropsType extends React.HTMLAttributes<any> {
  name: NameTypes
}
export default function IconPark({ name, ...props }: PropsType) {
  return (
    <div style={{ width: '20px', height: '20px' }} {...props}>
      <iconpark-icon style={{ fontSize: '20px', verticalAlign: 'middle', transition: 'color 0.1s' }} name={name}></iconpark-icon>
    </div>
  )
}
