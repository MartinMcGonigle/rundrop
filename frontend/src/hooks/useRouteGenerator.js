import { useState, useEffect } from 'react'

export default function useRouteGenerator() {
  const [startPoint, setStartPoint] = useState(null)     // { lat, lng } | null
  const [distance, setDistance] = useState(5)              // km (number)
  const [routeData, setRouteData] = useState(null)         // { coordinates, distance, duration } | null
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)                 // string | null

  // Reset route when start point changes
  useEffect(() => {
    setRouteData(null)
    setError(null)
  }, [startPoint])

  async function generateRoute() {
    if (!startPoint) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/generate?lat=${startPoint.lat}&lng=${startPoint.lng}&distance=${distance}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to generate route')
      }
      const data = await res.json()
      setRouteData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function downloadGPX() {
    if (!routeData) return
    try {
      const res = await fetch('/api/export-gpx-from-coords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coordinates: routeData.coordinates }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'rundrop-route.gpx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to download GPX file')
    }
  }

  function regenerate() {
    generateRoute()
  }

  return {
    startPoint, setStartPoint,
    distance, setDistance,
    routeData, loading, error,
    generateRoute, downloadGPX, regenerate,
  }
}
