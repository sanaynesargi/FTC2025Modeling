'use client'

import { 
  VStack, 
  HStack, 
  Text, 
  Box,
  Button
} from '@chakra-ui/react'
import { SimulationParameters } from '@/lib/physics'

interface PhysicsControlsProps {
  parameters: SimulationParameters
  onParameterChange: (newParams: SimulationParameters) => void
  exitConditions?: { V_b: number; omega_b: number }
}

export default function PhysicsControls({
  parameters,
  onParameterChange,
  exitConditions
}: PhysicsControlsProps) {
  
  const updateParameter = (key: keyof SimulationParameters, value: number) => {
    onParameterChange({
      ...parameters,
      [key]: value
    })
  }

  // Convert wheel angular velocity to RPM for display
  const wheelRPM = (parameters.omega_w0 * 60) / (2 * Math.PI)

  return (
    <VStack spacing={6} align="stretch">
      {/* Wheel Speed Control */}
      <Box>
        <Text mb={2} fontWeight="semibold" color="blue.300">
          Wheel Speed
        </Text>
        <VStack spacing={3}>
          <Text fontSize="sm" color="gray.400">
            {wheelRPM.toFixed(0)} RPM ({parameters.omega_w0.toFixed(0)} rad/s)
          </Text>
          <input
            type="range"
            min={100}
            max={1000}
            step={10}
            value={parameters.omega_w0}
            onChange={(e) => updateParameter('omega_w0', parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#4A5568',
              borderRadius: '4px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <input
            type="number"
            min={100}
            max={1000}
            step={10}
            value={parameters.omega_w0}
            onChange={(e) => updateParameter('omega_w0', parseFloat(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#2D3748',
              border: '1px solid #4A5568',
              borderRadius: '4px',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </VStack>
      </Box>

      {/* Launch Angle Control */}
      <Box>
        <Text mb={2} fontWeight="semibold" color="blue.300">
          Launch Angle
        </Text>
        <VStack spacing={3}>
          <Text fontSize="sm" color="gray.400">
            {parameters.launch_angle_deg.toFixed(1)}°
          </Text>
          <input
            type="range"
            min={0}
            max={90}
            step={0.5}
            value={parameters.launch_angle_deg}
            onChange={(e) => updateParameter('launch_angle_deg', parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#4A5568',
              borderRadius: '4px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <input
            type="number"
            min={0}
            max={90}
            step={0.5}
            value={parameters.launch_angle_deg}
            onChange={(e) => updateParameter('launch_angle_deg', parseFloat(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#2D3748',
              border: '1px solid #4A5568',
              borderRadius: '4px',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </VStack>
      </Box>

      {/* Initial Height Control */}
      <Box>
        <Text mb={2} fontWeight="semibold" color="blue.300">
          Initial Height
        </Text>
        <VStack spacing={3}>
          <Text fontSize="sm" color="gray.400">
            {parameters.initial_height.toFixed(2)} m
          </Text>
          <input
            type="range"
            min={0.1}
            max={3.0}
            step={0.01}
            value={parameters.initial_height}
            onChange={(e) => updateParameter('initial_height', parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#4A5568',
              borderRadius: '4px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <input
            type="number"
            min={0.1}
            max={3.0}
            step={0.01}
            value={parameters.initial_height}
            onChange={(e) => updateParameter('initial_height', parseFloat(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#2D3748',
              border: '1px solid #4A5568',
              borderRadius: '4px',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </VStack>
      </Box>

      {/* Wheel Mass Control */}
      <Box>
        <Text mb={2} fontWeight="semibold" color="blue.300">
          Wheel Mass
        </Text>
        <VStack spacing={3}>
          <Text fontSize="sm" color="gray.400">
            {(parameters.wheel_mass || 0.106).toFixed(3)} kg
          </Text>
          <input
            type="range"
            min={0.05}
            max={0.3}
            step={0.001}
            value={parameters.wheel_mass || 0.106}
            onChange={(e) => updateParameter('wheel_mass', parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#4A5568',
              borderRadius: '4px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <input
            type="number"
            min={0.05}
            max={0.3}
            step={0.001}
            value={parameters.wheel_mass || 0.106}
            onChange={(e) => updateParameter('wheel_mass', parseFloat(e.target.value) || 0.106)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#2D3748',
              border: '1px solid #4A5568',
              borderRadius: '4px',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </VStack>
      </Box>

      {/* Calculated Exit Conditions */}
      {exitConditions && (
        <Box p={4} bg="gray.800" borderRadius="md" border="1px" borderColor="gray.700">
          <Text mb={3} fontWeight="semibold" color="purple.300">
            Calculated Exit Conditions
          </Text>
          <VStack spacing={2} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.400">Exit Velocity:</Text>
              <Text fontSize="sm" color="white" fontWeight="semibold">
                {exitConditions.V_b.toFixed(2)} m/s
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.400">Ball Spin:</Text>
              <Text fontSize="sm" color="white" fontWeight="semibold">
                {exitConditions.omega_b.toFixed(0)} rad/s ({((exitConditions.omega_b * 60) / (2 * Math.PI)).toFixed(0)} RPM)
              </Text>
            </HStack>
          </VStack>
        </Box>
      )}

      {/* Preset Buttons */}
      <Box>
        <Text mb={3} fontWeight="semibold" color="blue.300">
          Quick Presets
        </Text>
        <HStack spacing={2} wrap="wrap">
          <Button 
            size="sm"
            colorScheme="teal"
            variant="solid"
            onClick={() => onParameterChange({
              omega_w0: 628,
              launch_angle_deg: 45,
              initial_height: 0.17272,
              wheel_mass: 0.106
            })}
          >
            Default FTC
          </Button>
          <Button 
            size="sm"
            colorScheme="teal"
            variant="solid"
            onClick={() => onParameterChange({
              omega_w0: 400,
              launch_angle_deg: 30,
              initial_height: 1.0,
              wheel_mass: 0.106
            })}
          >
            Low Power
          </Button>
          <Button 
            size="sm"
            colorScheme="teal"
            variant="solid"
            onClick={() => onParameterChange({
              omega_w0: 800,
              launch_angle_deg: 60,
              initial_height: 2.0,
              wheel_mass: 0.106
            })}
          >
            High Arc
          </Button>
        </HStack>
      </Box>
    </VStack>
  )
}
