type Props = {
  value?: string
  type?: string
  styles?: any
  placeholder?: string
}

const Input: React.FC<Props> = (props) => (
  <input className="input" type={props.type || 'text'} placeholder={props.placeholder} value={props.value} />
)

export default Input
