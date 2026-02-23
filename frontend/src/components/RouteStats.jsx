function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.floor(totalMinutes % 60)
  const seconds = Math.round((totalMinutes % 1) * 60)
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export default function RouteStats({ distance, duration }) {
  const estMinutes = distance * 6  // ~6:00/km pace
  const formattedTime = formatTime(estMinutes)

  return (
    <div className="route-stats">
      <div className="stat-row">
        <span className="stat-label">Distance</span>
        <span className="stat-value">{distance.toFixed(1)} km</span>
      </div>
      <div className="stat-row">
        <span className="stat-label">Est. time</span>
        <span className="stat-value">{formattedTime}</span>
      </div>
      <div className="stat-row">
        <span className="stat-label">Pace</span>
        <span className="stat-value">~6:00 /km</span>
      </div>
    </div>
  )
}
