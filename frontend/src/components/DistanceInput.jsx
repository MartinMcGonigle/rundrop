const CHIPS = [
  { label: '3k', value: 3 },
  { label: '5k', value: 5 },
  { label: '10k', value: 10 },
  { label: '15k', value: 15 },
  { label: 'Half', value: 21.1 },
]

export default function DistanceInput({ distance, setDistance, disabled }) {
  function handleSlider(e) {
    setDistance(parseFloat(e.target.value))
  }

  function handleNumber(e) {
    const val = parseFloat(e.target.value)
    if (!isNaN(val)) setDistance(val)
  }

  function handleNumberBlur(e) {
    const val = parseFloat(e.target.value)
    if (isNaN(val) || val < 1) setDistance(1)
    else if (val > 50) setDistance(50)
  }

  return (
    <div className="distance-input">
      <label className="distance-label">Distance</label>
      <input
        type="range"
        className="distance-slider"
        min={1}
        max={50}
        step={0.5}
        value={distance}
        onChange={handleSlider}
        disabled={disabled}
      />
      <div className="distance-number-row">
        <input
          type="number"
          className="distance-number"
          min={1}
          max={50}
          step={0.5}
          value={distance}
          onChange={handleNumber}
          onBlur={handleNumberBlur}
          disabled={disabled}
        />
        <span className="distance-unit">km</span>
      </div>
      <div className="distance-chips">
        {CHIPS.map((chip) => (
          <button
            key={chip.value}
            className={`chip${distance === chip.value ? ' chip-active' : ''}`}
            onClick={() => setDistance(chip.value)}
            disabled={disabled}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  )
}
