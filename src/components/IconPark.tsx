export enum NameTypes {
  sun = 'sun',
  moon = 'moon',
  github = 'github',
}
interface PropsType extends React.HTMLAttributes<any> {
  name: NameTypes
}
export default function IconPark({ name, ...props }: PropsType) {
  return (
    <div style={{ width: '20px', height: '20px' }} {...props}>
      <iconpark-icon style={{ fontSize: '20px', verticalAlign: 'middle' }} name={name}></iconpark-icon>
    </div>
  )
}
