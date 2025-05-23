export enum NameTypes {
  Light = 'light',
  Dark = 'dark',
  Github = 'github',
  Resume = 'resume',
  WeChat = 'wechat',
  Email = 'email',
  Skill = 'skill',
  WorkExperience = 'work-experience',
  PersonalProfile = 'personal-profile',
}
interface PropsType extends React.HTMLAttributes<any> {
  name: NameTypes
}
export default function IconPark({ name, ...props }: PropsType) {
  return (
    <div style={{ width: '20px', height: '20px' }} {...props}>
      <iconpark-icon
        style={{ fontSize: '20px', verticalAlign: 'middle', transition: 'color 0.02s' }}
        name={name}></iconpark-icon>
    </div>
  )
}
