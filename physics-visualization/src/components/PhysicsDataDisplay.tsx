'use client'

import { 
  VStack, 
  HStack, 
  Text, 
  Box,
  Badge
} from '@chakra-ui/react'
import { TrajectoryPoint } from '@/lib/physics'

interface PhysicsDataDisplayProps {
  currentPoint?: TrajectoryPoint
  trajectory: TrajectoryPoint[]
  isAnimating: boolean
}

export default function PhysicsDataDisplay({
  currentPoint,
  trajectory,
  isAnimating
}: PhysicsDataDisplayProps) {
  
  // Calculate trajectory statistics
  const maxRange = trajectory.length > 0 ? Math.max(...trajectory.map(p => p.x)) : 0
  const maxHeight = trajectory.length > 0 ? Math.max(...trajectory.map(p => p.y)) : 0
  const flightTime = trajectory.length > 0 ? trajectory[trajectory.length - 1].t : 0
  const maxSpeed = trajectory.length > 0 ? Math.max(...trajectory.map(p => p.V_mag)) : 0

  // Current point data (use last point if not animating)
  const displayPoint = currentPoint || (trajectory.length > 0 ? trajectory[trajectory.length - 1] : null)

  return (
    <VStack spacing={6} align="stretch">
      {/* Current State */}
      <Box>
        <HStack justify="space-between" mb={3}>
          <Text fontWeight="semibold" color="purple.300">
            Current State
          </Text>
          <Badge colorScheme={isAnimating ? 'green' : 'gray'} variant="solid">
            {isAnimating ? 'Animating' : 'Static'}
          </Badge>
        </HStack>
        
        {displayPoint ? (
          <VStack spacing={3}>
            {/* Position */}
            <Box p={3} bg="gray.800" borderRadius="md" width="full">
              <Text fontSize="sm" fontWeight="semibold" color="cyan.300" mb={2}>Position</Text>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">X (horizontal):</Text>
                <Text fontSize="sm" color="white" fontWeight="semibold">{displayPoint.x.toFixed(2)} m</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">Y (vertical):</Text>
                <Text fontSize="sm" color="white" fontWeight="semibold">{displayPoint.y.toFixed(2)} m</Text>
              </HStack>
            </Box>

            {/* Velocity */}
            <Box p={3} bg="gray.800" borderRadius="md" width="full">
              <Text fontSize="sm" fontWeight="semibold" color="yellow.300" mb={2}>Velocity</Text>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">Vx (horizontal):</Text>
                <Text fontSize="sm" color="white" fontWeight="semibold">{displayPoint.Vx.toFixed(2)} m/s</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">Vy (vertical):</Text>
                <Text fontSize="sm" color="white" fontWeight="semibold">{displayPoint.Vy.toFixed(2)} m/s</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">Speed:</Text>
                <Text fontSize="sm" color="yellow.300" fontWeight="semibold">{displayPoint.V_mag.toFixed(2)} m/s</Text>
              </HStack>
            </Box>

            {/* Forces */}
            <Box p={3} bg="gray.800" borderRadius="md" width="full">
              <Text fontSize="sm" fontWeight="semibold" color="red.300" mb={2}>Forces</Text>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">Drag Force:</Text>
                <Text fontSize="sm" color="red.300" fontWeight="semibold">{displayPoint.drag_force.toFixed(3)} N</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">Magnus Force:</Text>
                <Text fontSize="sm" color="blue.300" fontWeight="semibold">{displayPoint.magnus_force.toFixed(3)} N</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">Flight Time:</Text>
                <Text fontSize="sm" color="white" fontWeight="semibold">{displayPoint.t.toFixed(2)} s</Text>
              </HStack>
            </Box>
          </VStack>
        ) : (
          <Text color="gray.500" textAlign="center" py={4}>
            No trajectory data available
          </Text>
        )}
      </Box>

      {/* Trajectory Summary */}
      {trajectory.length > 0 && (
        <Box p={4} bg="gray.800" borderRadius="md" border="1px" borderColor="gray.700">
          <Text mb={3} fontWeight="semibold" color="cyan.300">
            Trajectory Summary
          </Text>
          <VStack spacing={2}>
            <HStack justify="space-between" width="full">
              <Text fontSize="sm" color="gray.400">Maximum Range:</Text>
              <Text fontSize="sm" color="cyan.300" fontWeight="semibold">{maxRange.toFixed(2)} m</Text>
            </HStack>
            <HStack justify="space-between" width="full">
              <Text fontSize="sm" color="gray.400">Maximum Height:</Text>
              <Text fontSize="sm" color="cyan.300" fontWeight="semibold">{maxHeight.toFixed(2)} m</Text>
            </HStack>
            <HStack justify="space-between" width="full">
              <Text fontSize="sm" color="gray.400">Flight Time:</Text>
              <Text fontSize="sm" color="cyan.300" fontWeight="semibold">{flightTime.toFixed(2)} s</Text>
            </HStack>
            <HStack justify="space-between" width="full">
              <Text fontSize="sm" color="gray.400">Max Speed:</Text>
              <Text fontSize="sm" color="cyan.300" fontWeight="semibold">{maxSpeed.toFixed(2)} m/s</Text>
            </HStack>
          </VStack>
        </Box>
      )}

      {/* Physics Effects Explanation */}
      <Box p={4} bg="gray.800" borderRadius="md" border="1px" borderColor="gray.700">
        <Text mb={3} fontWeight="semibold" color="green.300">
          Physics Effects
        </Text>
        <VStack spacing={2} align="stretch" fontSize="sm">
          <HStack>
            <Box w={3} h={3} bg="red.400" borderRadius="full" />
            <Text color="gray.300">
              <Text as="span" color="red.300" fontWeight="semibold">Drag Force:</Text> 
              {' '}Opposes motion, proportional to velocity²
            </Text>
          </HStack>
          <HStack>
            <Box w={3} h={3} bg="blue.400" borderRadius="full" />
            <Text color="gray.300">
              <Text as="span" color="blue.300" fontWeight="semibold">Magnus Force:</Text>
              {' '}Due to ball spin, causes curve in trajectory
            </Text>
          </HStack>
          <HStack>
            <Box w={3} h={3} bg="yellow.400" borderRadius="full" />
            <Text color="gray.300">
              <Text as="span" color="yellow.300" fontWeight="semibold">Gravity:</Text>
              {' '}Constant downward acceleration (9.81 m/s²)
            </Text>
          </HStack>
        </VStack>
      </Box>

      {/* Visualization Legend */}
      <Box p={3} bg="gray.800" borderRadius="md">
        <Text mb={2} fontWeight="semibold" color="gray.300" fontSize="sm">
          Visualization Legend
        </Text>
        <VStack spacing={1} align="stretch" fontSize="xs">
          <HStack>
            <Box w={2} h={2} bg="green.400" borderRadius="full" />
            <Text color="gray.400">Launch Point</Text>
          </HStack>
          <HStack>
            <Box w={2} h={2} bg="blue.400" borderRadius="full" />
            <Text color="gray.400">Trajectory Path</Text>
          </HStack>
          <HStack>
            <Box w={2} h={2} bg="orange.400" borderRadius="full" />
            <Text color="gray.400">Current Ball Position</Text>
          </HStack>
          <HStack>
            <Box w={2} h={2} bg="red.400" borderRadius="full" />
            <Text color="gray.400">Impact Point & Velocity Vector</Text>
          </HStack>
          <HStack>
            <Box w={8} h={1} bg="yellow.400" />
            <Text color="gray.400">FTC Basket Heights</Text>
          </HStack>
          <HStack>
            <Box w={8} h={1} bg="yellow.600" />
            <Text color="gray.400">Ground Line</Text>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  )
}
