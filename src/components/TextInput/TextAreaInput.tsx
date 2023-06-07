import { useRef } from 'react'
import './TextAreaInput.sass'

type TextAreaInputProps = {
  label: string
  value: string
  setValue: (text: string) => void
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ label, value, setValue }) => {
  const id = label.split(' ').join('') + Math.random().toString().slice(-2)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)
  const elem = useRef<HTMLTextAreaElement | null>(null)

  return (
    <div className="TextAreaInput" onClick={() => elem.current?.focus()}>
      <textarea id={id} onChange={handleChange} placeholder=" " ref={elem}>
        {value}
      </textarea>
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export default TextAreaInput
