'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Button, 
  Card, 
  Badge,
  Grid,
  GridItem,
  Separator
} from '@chakra-ui/react'
import { FTCPhysicsSimulation, SimulationParameters, TrajectoryPoint } from '@/lib/physics'
import TrajectoryCanvas from '@/components/TrajectoryCanvas'
import PhysicsControls from '@/components/PhysicsControls'
import PhysicsDataDisplay from '@/components/PhysicsDataDisplay'

export default function Home() {
  // Physics simulation state
  const [simulation] = useState(() => new FTCPhysicsSimulation())
  const [parameters, setParameters] = useState<SimulationParameters>({
    omega_w0: 628,  // From Python code - 628 rad/s ≈ 6000 RPM
    launch_angle_deg: 45,
    initial_height: 0.17272  // From Python code
  })
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentPoint, setCurrentPoint] = useState<TrajectoryPoint | undefined>()
  const [isMaximized, setIsMaximized] = useState(false)

  // Calculate exit conditions whenever parameters change
  const exitConditions = useMemo(() => {
    return simulation.calculateExitConditions(parameters.omega_w0)
  }, [simulation, parameters.omega_w0])

  // Recalculate trajectory when parameters change
  useEffect(() => {
    const newTrajectory = simulation.simulateTrajectory(parameters)
    setTrajectory(newTrajectory)
    setCurrentPoint(undefined)
    setIsAnimating(false)
  }, [simulation, parameters])

  const handleStartAnimation = () => {
    setIsAnimating(true)
    setCurrentPoint(trajectory[0])
  }

  const handleStopAnimation = () => {
    setIsAnimating(false)
  }

  const handleReset = () => {
    setIsAnimating(false)
    setCurrentPoint(undefined)
  }

  const handleAnimationFrame = (index: number, point: TrajectoryPoint) => {
    setCurrentPoint(point)
    // Auto-stop animation when we reach the end of trajectory
    if (index >= trajectory.length - 1) {
      setIsAnimating(false)
    }
  }

  return (
    <Box bg="gray.900" minH="100vh" color="white">
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" mb={4} color="blue.300">
              FTC Ball Physics Simulation
            </Heading>
            <Text fontSize="lg" color="gray.300">
              Interactive visualization of FTC artifact ball trajectory with Magnus effect and drag
            </Text>
          </Box>

          <Separator />

          {/* Main Content Grid */}
          <Grid templateColumns={isMaximized ? '1fr' : { base: '1fr', xl: '2fr 1fr 1fr' }} gap={6}>
            {/* Visualization Area */}
            <GridItem>
              <Card.Root bg="gray.800" borderColor="gray.700">
                <Card.Body>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Heading size="md" color="blue.300">Ball Trajectory</Heading>
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="gray"
                          onClick={() => setIsMaximized(!isMaximized)}
                          title={isMaximized ? 'Minimize View' : 'Maximize View'}
                        >
                          {isMaximized ? '🗗' : '🗖'}
                        </Button>
                        <Badge 
                          colorScheme={trajectory.length > 0 ? 'green' : 'gray'}
                          variant="solid"
                        >
                          {trajectory.length > 0 ? 'Ready' : 'No Data'}
                        </Badge>
                      </HStack>
                    </HStack>
                    
                    <Box display="flex" justifyContent="center">
                      <TrajectoryCanvas 
                        trajectory={trajectory}
                        isAnimating={isAnimating}
                        onAnimationFrame={handleAnimationFrame}
                      />
                    </Box>
                    
                    <HStack spacing={3} justify="center">
                      <Button 
                        colorScheme="teal" 
                        variant="solid"
                        size="md"
                        onClick={handleStartAnimation}
                        isDisabled={trajectory.length === 0 || isAnimating}
                      >
                        {isAnimating ? 'Animating...' : 'Start Animation'}
                      </Button>
                      
                      <Button 
                        colorScheme="teal" 
                        variant="solid"
                        size="md"
                        onClick={handleStopAnimation}
                        isDisabled={!isAnimating}
                      >
                        Stop
                      </Button>
                      
                      <Button 
                        colorScheme="teal" 
                        variant="solid"
                        size="md"
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </GridItem>

            {/* Controls Panel - Hidden when maximized */}
            {!isMaximized && (
              <GridItem>
                <Card.Root bg="gray.800" borderColor="gray.700">
                  <Card.Body>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md" color="blue.300">Simulation Controls</Heading>
                      
                      <PhysicsControls 
                        parameters={parameters}
                        onParameterChange={setParameters}
                        exitConditions={exitConditions}
                      />
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </GridItem>
            )}

            {/* Data Display Panel - Hidden when maximized */}
            {!isMaximized && (
              <GridItem>
                <Card.Root bg="gray.800" borderColor="gray.700">
                  <Card.Body>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md" color="blue.300">Physics Data</Heading>
                      
                      <PhysicsDataDisplay 
                        currentPoint={currentPoint}
                        trajectory={trajectory}
                        isAnimating={isAnimating}
                      />
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </GridItem>
            )}
          </Grid>

        </VStack>
      </Container>
    </Box>
  );
}
