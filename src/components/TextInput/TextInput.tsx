import './TextInput.sass'

type TextInputProps = {
  type?: string
  label: string
  value: string
  setValue: (text: string) => void
  disabled?: boolean
  error?: string
}

const TextInput: React.FC<TextInputProps> = ({ type = 'text', label, value, setValue, disabled = false, error }) => {
  const id = label.split(' ').join('') + Math.random().toString().slice(-2)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
  return (
    <div className={`TextInput ${error ? 'invalid' : ''}`}>
      <input type={type} id={id} value={value} onChange={handleChange} placeholder=" " disabled={disabled} />
      <label htmlFor={id}>{label}</label>
      {error && <div className="error">{error}</div>}
    </div>
  )
}

export default TextInput
