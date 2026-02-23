import useRouteGenerator from './hooks/useRouteGenerator'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'

function App() {
  const {
    startPoint, setStartPoint,
    distance, setDistance,
    routeData, loading, error,
    generateRoute, downloadGPX, regenerate,
  } = useRouteGenerator()

  return (
    <div id="app" className="app-layout">
      <MapView
        startPoint={startPoint}
        onStartPointSet={setStartPoint}
        routeCoordinates={routeData?.coordinates ?? null}
      />
      <Sidebar
        startPoint={startPoint}
        distance={distance}
        setDistance={setDistance}
        routeData={routeData}
        loading={loading}
        error={error}
        generateRoute={generateRoute}
        downloadGPX={downloadGPX}
        regenerate={regenerate}
      />
    </div>
  )
}

export default App
