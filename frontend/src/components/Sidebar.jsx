import DistanceInput from './DistanceInput'
import RouteStats from './RouteStats'

export default function Sidebar({
  startPoint, distance, setDistance,
  routeData, loading, error,
  generateRoute, downloadGPX, regenerate,
}) {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">rundrop</h1>
      <DistanceInput distance={distance} setDistance={setDistance} disabled={loading} />
      <button
        className="btn btn-primary"
        onClick={generateRoute}
        disabled={!startPoint || loading}
      >
        {loading && <span className="spinner" />}
        {loading ? 'Generating...' : 'Generate Route'}
      </button>
      {error && <p className="error-message">{error}</p>}
      {routeData && (
        <RouteStats distance={routeData.distance} duration={routeData.duration} />
      )}
      {routeData && (
        <div className="sidebar-actions">
          <button className="btn btn-secondary" onClick={downloadGPX}>
            Download GPX
          </button>
          <button className="btn btn-secondary" onClick={regenerate}>
            Regenerate
          </button>
        </div>
      )}
      {!startPoint && <p className="hint">Click the map to set a start point</p>}
    </aside>
  )
}
