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
export default function IconPark({ name, className, ...props }: PropsType) {
  return (
    <div className={`w-5 h-5 flex items-center justify-center ${className || ''}`} {...props}>
      <iconpark-icon
        style={{ fontSize: '20px', transition: 'color 0.02s' }}
        name={name}
      />
    </div>
  )
}
