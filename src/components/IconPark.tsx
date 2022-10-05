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
    <div {...props}>
      <iconpark-icon name={name}></iconpark-icon>
    </div>
  )
}
