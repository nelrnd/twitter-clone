import './TextInput.sass'

type TextInputProps = {
  type?: string
  label: string
  value: string
  setValue: (text: string) => void
  disabled?: boolean
}

const TextInput: React.FC<TextInputProps> = ({ type = 'text', label, value, setValue, disabled = false }) => {
  const id = label.split(' ').join('') + Math.random().toString().slice(-2)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
  return (
    <div className="TextInput">
      <input type={type} id={id} value={value} onChange={handleChange} placeholder=" " disabled={disabled} />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export default TextInput
