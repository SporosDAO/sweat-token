type Props = {
  name?: string
  value?: string
  type?: string
  styles?: any
  onChange?: any
  placeholder?: string
}

const Input: React.FC<Props> = (props) => (
  <input
    className="input"
    name={props.name}
    type={props.type || 'text'}
    value={props.value}
    placeholder={props.placeholder}
    onChange={props.onChange}
  />
)

export default Input
