import { useState } from 'react'
import MapView from './components/MapView'

function App() {
  const [startPoint, setStartPoint] = useState(null)

  return (
    <div id="app">
      <MapView
        startPoint={startPoint}
        onStartPointSet={setStartPoint}
        routeCoordinates={null}
      />
    </div>
  )
}

export default App
