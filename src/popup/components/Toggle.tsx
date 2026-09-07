type ToggleProps = {
  id: string
  label: string
  checked?: boolean
  onChange: (checked: boolean) => void
}

const Toggle = ({ id, label, checked = false, onChange }: ToggleProps) => (
  <label
    htmlFor={id}
    className="flex items-center gap-2.5 cursor-pointer select-none"
  >
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="sr-only peer"
    />
    <span
      className="
        relative w-8 h-[18px] rounded-full bg-[#d2d7df] transition-colors
        peer-checked:bg-[#6807ff]
        peer-focus-visible:ring-2 peer-focus-visible:ring-[#6807ff] peer-focus-visible:ring-offset-1
        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
        after:w-[14px] after:h-[14px] after:rounded-full after:bg-white
        after:shadow-sm after:transition-transform
        peer-checked:after:translate-x-[14px]
      "
    />
    <span className="text-[11px] text-[#1b1f27]">{label}</span>
  </label>
)

export default Toggle
