import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet'

const pulsingIcon = L.divIcon({
  className: 'pulsing-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

function MapClickHandler({ onStartPointSet }) {
  useMapEvents({
    click(e) {
      onStartPointSet({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

function AutoFitBounds({ coordinates }) {
  const map = useMap()

  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      const latLngBounds = L.latLngBounds(coordinates)
      map.fitBounds(latLngBounds, { padding: [50, 50] })
    }
  }, [coordinates, map])

  return null
}

function LocationButton({ onStartPointSet }) {
  const map = useMap()
  const controlRef = useRef(null)

  useEffect(() => {
    const LocationControl = L.Control.extend({
      onAdd() {
        const container = L.DomUtil.create('div', 'location-button')
        container.innerHTML = '\u2316'
        container.title = 'Use my location'

        L.DomEvent.disableClickPropagation(container)

        L.DomEvent.on(container, 'click', () => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude: lat, longitude: lng } = position.coords
              onStartPointSet({ lat, lng })
              map.setView([lat, lng], 15)
            },
            () => {
              alert('Could not get your location. Please allow location access or click the map.')
            }
          )
        })

        return container
      },
    })

    const control = new LocationControl({ position: 'topright' })
    map.addControl(control)
    controlRef.current = control

    return () => {
      map.removeControl(control)
    }
  }, [map, onStartPointSet])

  return null
}

export default function MapView({ startPoint, onStartPointSet, routeCoordinates }) {
  return (
    <MapContainer center={[55.133, -6.677]} zoom={14} className="map-container" zoomControl={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapClickHandler onStartPointSet={onStartPointSet} />
      {startPoint && <Marker position={[startPoint.lat, startPoint.lng]} icon={pulsingIcon} />}
      {routeCoordinates && <Polyline positions={routeCoordinates} color="#e8772e" weight={4} opacity={0.8} />}
      {routeCoordinates && <AutoFitBounds coordinates={routeCoordinates} />}
      <LocationButton onStartPointSet={onStartPointSet} />
    </MapContainer>
  )
}
